import { connections } from './query.js'

export default function handler(req, res) {
  const { sessionId } = req.query
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID required' })
  }
  
  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  // Create a simple WebSocket-like interface for SSE
  const ws = {
    send: (data) => {
      res.write(`data: ${data}\n\n`)
    },
    readyState: 1,
    close: () => {
      res.end()
    }
  }
  
  // Register connection
  if (!connections.has(sessionId)) {
    connections.set(sessionId, [])
  }
  connections.get(sessionId).push(ws)
  
  // Send initial connection message
  ws.send(JSON.stringify({ type: 'connected', sessionId }))
  
  // Clean up on client disconnect
  req.on('close', () => {
    const sessionConnections = connections.get(sessionId) || []
    const index = sessionConnections.indexOf(ws)
    if (index > -1) {
      sessionConnections.splice(index, 1)
    }
    
    // Clean up empty sessions
    if (sessionConnections.length === 0) {
      connections.delete(sessionId)
    }
  })
}
