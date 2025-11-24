import express from 'express'
import { spawn } from 'child_process'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { readdir, readFile } from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Store WebSocket connections by session ID
const connections = new Map()

// API: Start HM6 query
app.post('/api/query', async (req, res) => {
  const { query } = req.body
  
  if (!query) {
    return res.status(400).json({ error: 'Query required' })
  }
  
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Start HM6 process
  startHM6(sessionId, query)
  
  res.json({ sessionId })
})

// API: Get sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const storagePath = path.join(__dirname, '../centropic-core/storage')
    const sessions = await readdir(storagePath)
    
    const sessionList = await Promise.all(
      sessions.map(async (sessionId) => {
        try {
          const sessionFile = path.join(storagePath, sessionId, 'session.json')
          const data = await readFile(sessionFile, 'utf-8')
          const session = JSON.parse(data)
          
          return {
            id: session.ID,
            query: session.UserQuery,
            foundation: session.FoundationNumber,
            foundationRole: session.FoundationRole,
            createdAt: session.CreatedAt,
            status: session.Status,
            tokensUsed: session.TokensUsed
          }
        } catch {
          return null
        }
      })
    )
    
    res.json(sessionList.filter(s => s !== null).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ))
  } catch (error) {
    console.error('Sessions error:', error)
    res.status(500).json({ error: 'Failed to load sessions' })
  }
})

function startHM6(sessionId, query) {
  const hm6Path = path.join(__dirname, '../centropic-core/bin/hm6')
  
  console.log(`Starting HM6 for session ${sessionId}`)
  console.log(`Query: ${query}`)
  
  const hm6 = spawn(hm6Path, ['-query', query], {
    cwd: path.join(__dirname, '../centropic-core'),
    env: process.env
  })
  
  let output = ''
  
  // Notify foundation
  broadcastToSession(sessionId, {
    type: 'foundation_info',
    foundation: null // Will be updated when we parse output
  })
  
  hm6.stdout.on('data', (data) => {
    const text = data.toString()
    output += text
    console.log(text)
    
    // Parse for foundation
    const foundationMatch = text.match(/Using foundation: (pA\d) \((\w+)\)/)
    if (foundationMatch) {
      broadcastToSession(sessionId, {
        type: 'foundation_info',
        foundation: parseInt(foundationMatch[1].replace('pA', ''))
      })
    }
    
    // Parse for stage start
    const stageMatch = text.match(/=== STAGE (pB\d) ===/)
    if (stageMatch) {
      // Detect path from context
      const pathMatch = output.match(/Path (\d)/)
      broadcastToSession(sessionId, {
        type: 'stage_start',
        path: pathMatch ? pathMatch[1] : '1',
        stage: stageMatch[1]
      })
    }
    
    // Parse for completion with tokens
    const completeMatch = text.match(/TokensUsed:\s*(\d+)/)
    const latencyMatch = text.match(/LatencyMS:\s*(\d+)/)
    if (completeMatch || latencyMatch) {
      broadcastToSession(sessionId, {
        type: 'stage_complete',
        path: '1',
        stage: 'pB1',
        tokens: completeMatch ? parseInt(completeMatch[1]) : 0,
        latency: latencyMatch ? parseInt(latencyMatch[1]) : 0
      })
    }
  })
  
  hm6.stderr.on('data', (data) => {
    console.error(`HM6 stderr: ${data}`)
  })
  
  hm6.on('close', (code) => {
    console.log(`HM6 process exited with code ${code}`)
    
    if (code === 0) {
      // Extract synthesis
      const synthesisMatch = output.match(/# HM6 SYNTHESIS:[\s\S]*$/)
      const synthesis = synthesisMatch ? synthesisMatch[0] : output
      
      broadcastToSession(sessionId, {
        type: 'synthesis_complete',
        synthesis,
        metadata: {
          sessionId,
          totalTokens: 0,
          processingTime: 0,
          foundation: 'pA1'
        }
      })
    } else {
      broadcastToSession(sessionId, {
        type: 'error',
        message: 'HM6 process failed'
      })
    }
  })
}

function broadcastToSession(sessionId, message) {
  const wsConnections = connections.get(sessionId) || []
  const messageStr = JSON.stringify(message)
  
  wsConnections.forEach(ws => {
    if (ws.readyState === 1) { // OPEN
      ws.send(messageStr)
    }
  })
}

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

// WebSocket server
const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const sessionId = url.pathname.split('/').pop()
  
  console.log(`WebSocket connected for session: ${sessionId}`)
  
  if (!connections.has(sessionId)) {
    connections.set(sessionId, [])
  }
  connections.get(sessionId).push(ws)
  
  ws.send(JSON.stringify({ type: 'connected', sessionId }))
  
  ws.on('close', () => {
    console.log(`WebSocket closed for session: ${sessionId}`)
    const sessionConnections = connections.get(sessionId) || []
    const index = sessionConnections.indexOf(ws)
    if (index > -1) {
      sessionConnections.splice(index, 1)
    }
    if (sessionConnections.length === 0) {
      connections.delete(sessionId)
    }
  })
})

console.log('Development backend ready!')
console.log('Make sure HM6 binary is at: ../centropic-core/bin/hm6')
