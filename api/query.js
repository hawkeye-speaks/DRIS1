import { spawn } from 'child_process'
import { clerkClient } from '@clerk/clerk-sdk-node'

// WebSocket connections store (in-memory for now, use Redis for production)
const connections = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const { query } = req.body
  const userId = req.auth?.userId
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized - Please sign in' })
  }
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' })
  }
  
  try {
    // Check user has sufficient credits
    const user = await clerkClient.users.getUser(userId)
    const credits = user.publicMetadata?.credits || 0
    
    if (credits < 1) {
      return res.status(402).json({ 
        error: 'Insufficient credits',
        credits: 0,
        needsPayment: true
      })
    }
    
    // Generate session ID
    const sessionId = generateSessionId()
    
    // Deduct credit BEFORE starting expensive HM6 process
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        credits: credits - 1,
        lastQuery: new Date().toISOString(),
        totalQueries: (user.publicMetadata?.totalQueries || 0) + 1
      }
    })
    
    // Start HM6 process in background
    startHM6Process(sessionId, query, userId)
    
    // Return session ID immediately
    res.status(200).json({ 
      sessionId,
      creditsRemaining: credits - 1
    })
    
  } catch (error) {
    console.error('Query error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function startHM6Process(sessionId, query, userId) {
  // Path to your HM6 binary (adjust based on your Vercel deployment)
  const hm6Path = process.env.HM6_BINARY_PATH || './bin/hm6'
  
  const hm6 = spawn(hm6Path, ['-query', query], {
    env: {
      ...process.env,
      // All your API keys from environment variables
      OPENROUTER_KEY_DEEPSEEK: process.env.OPENROUTER_KEY_DEEPSEEK,
      OPENROUTER_KEY_GPT4: process.env.OPENROUTER_KEY_GPT4,
      OPENROUTER_KEY_CLAUDE: process.env.OPENROUTER_KEY_CLAUDE,
      XAI_KEY: process.env.XAI_KEY,
      USER_ID: userId, // Track which user made the query
      SESSION_ID: sessionId
    }
  })
  
  let output = ''
  let currentStage = null
  let currentPath = null
  
  hm6.stdout.on('data', (data) => {
    const text = data.toString()
    output += text
    
    // Parse output for stage updates
    const stageMatch = text.match(/Path (\d) - Stage (pB\d)/)
    if (stageMatch) {
      currentPath = stageMatch[1]
      currentStage = stageMatch[2]
      
      // Broadcast to connected WebSocket clients
      broadcastToSession(sessionId, {
        type: 'stage_start',
        path: currentPath,
        stage: currentStage
      })
    }
    
    // Check for stage completion
    const completeMatch = text.match(/Completed Path (\d) - (pB\d): (\d+) tokens in (\d+)ms/)
    if (completeMatch) {
      broadcastToSession(sessionId, {
        type: 'stage_complete',
        path: completeMatch[1],
        stage: completeMatch[2],
        tokens: parseInt(completeMatch[3]),
        latency: parseInt(completeMatch[4])
      })
    }
  })
  
  hm6.stderr.on('data', (data) => {
    console.error(`HM6 Error: ${data}`)
  })
  
  hm6.on('close', (code) => {
    if (code === 0) {
      // Parse final synthesis from output
      const synthesis = extractSynthesis(output)
      const metadata = extractMetadata(output)
      
      broadcastToSession(sessionId, {
        type: 'synthesis_complete',
        synthesis,
        metadata
      })
    } else {
      broadcastToSession(sessionId, {
        type: 'error',
        message: 'HM6 process failed'
      })
    }
  })
}

function extractSynthesis(output) {
  // Extract the final synthesis from HM6 output
  const match = output.match(/=== HM6 SYNTHESIS ===([\s\S]*?)(?:===|$)/)
  return match ? match[1].trim() : output
}

function extractMetadata(output) {
  const metadata = {}
  
  const tokensMatch = output.match(/Total tokens: (\d+)/)
  if (tokensMatch) metadata.totalTokens = parseInt(tokensMatch[1])
  
  const timeMatch = output.match(/Processing time: ([\d.]+)s/)
  if (timeMatch) metadata.processingTime = parseFloat(timeMatch[1]) * 1000
  
  const foundationMatch = output.match(/Using foundation: (pA\d)/)
  if (foundationMatch) metadata.foundation = foundationMatch[1]
  
  return metadata
}

function broadcastToSession(sessionId, message) {
  const wsConnections = connections.get(sessionId) || []
  wsConnections.forEach(ws => {
    if (ws.readyState === 1) { // OPEN
      ws.send(JSON.stringify(message))
    }
  })
}

// Export for WebSocket handler
export { connections }
