import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    // Path to storage directory
    const storagePath = process.env.STORAGE_PATH || './storage'
    
    // Read all session directories
    const sessions = await readdir(storagePath)
    
    // Get session metadata
    const sessionList = await Promise.all(
      sessions.map(async (sessionId) => {
        try {
          const sessionFile = join(storagePath, sessionId, 'session.json')
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
    
    // Filter out null sessions and sort by date
    const validSessions = sessionList
      .filter(s => s !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.status(200).json(validSessions)
    
  } catch (error) {
    console.error('Sessions error:', error)
    res.status(500).json({ error: 'Failed to load sessions' })
  }
}
