import { create } from 'zustand'

export const useHM6Store = create((set, get) => ({
  // Query state
  currentQuery: '',
  isProcessing: false,
  sessionId: null,
  
  // Real-time updates
  currentStage: null,
  currentPath: null,
  stageUpdates: [],
  
  // Results
  synthesis: null,
  sessionMetadata: null,
  
  // Foundation selection
  selectedFoundation: 1,
  autoRotateFoundation: true,
  activeFoundation: null,
  
  // Session history
  sessions: [],
  
  // WebSocket connection
  ws: null,
  wsConnected: false,
  
  // Foundation actions
  setFoundation: (foundation) => set({ selectedFoundation: foundation }),
  toggleAutoRotate: () => set((state) => ({ autoRotateFoundation: !state.autoRotateFoundation })),
  
  // Actions
  setQuery: (query) => set({ currentQuery: query }),
  
  startQuery: async (query) => {
    const { selectedFoundation, autoRotateFoundation } = get()
    
    set({ 
      isProcessing: true, 
      currentQuery: query,
      stageUpdates: [],
      synthesis: null,
      currentStage: null,
      currentPath: null
    })
    
    // Auto-advance foundation if enabled
    if (autoRotateFoundation) {
      const nextFoundation = selectedFoundation >= 5 ? 1 : selectedFoundation + 1
      set({ selectedFoundation: nextFoundation })
    }
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          foundation: selectedFoundation
        })
      })
      
      const data = await response.json()
      
      if (data.sessionId) {
        set({ sessionId: data.sessionId })
        get().connectWebSocket(data.sessionId)
      }
    } catch (error) {
      console.error('Query failed:', error)
      set({ isProcessing: false })
    }
  },
  
  connectWebSocket: (sessionId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsHost = import.meta.env.VITE_BACKEND_URL?.replace('http://', '').replace('https://', '') || 'localhost:3001'
    const ws = new WebSocket(`${protocol}//${wsHost}/ws/${sessionId}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      set({ wsConnected: true })
    }
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      
      switch (update.type) {
        case 'stage_start':
          set({ 
            currentStage: update.stage,
            currentPath: update.path
          })
          break
          
        case 'stage_complete':
          set(state => ({
            stageUpdates: [...state.stageUpdates, {
              path: update.path,
              stage: update.stage,
              tokens: update.tokens,
              latency: update.latency,
              timestamp: new Date()
            }]
          }))
          break
          
        case 'foundation_info':
          set({ activeFoundation: update.foundation })
          break
          
        case 'synthesis_complete':
          set({ 
            synthesis: update.synthesis,
            sessionMetadata: update.metadata,
            isProcessing: false
          })
          get().ws?.close()
          break
          
        case 'error':
          console.error('HM6 Error:', update.message)
          set({ isProcessing: false })
          break
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      set({ wsConnected: false })
    }
    
    ws.onclose = () => {
      console.log('WebSocket closed')
      set({ wsConnected: false, ws: null })
    }
    
    set({ ws })
  },
  
  loadSessions: async () => {
    try {
      const response = await fetch('/api/sessions')
      const sessions = await response.json()
      set({ sessions })
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  },
  
  reset: () => set({
    currentQuery: '',
    isProcessing: false,
    sessionId: null,
    currentStage: null,
    currentPath: null,
    stageUpdates: [],
    synthesis: null,
    sessionMetadata: null,
    activeFoundation: null
  })
}))
