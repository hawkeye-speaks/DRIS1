# HM6 Frontend

React + Vite frontend for the HM6 Multi-Agent Orchestrator with Vercel Edge deployment.

## Features

- 🚀 Real-time WebSocket streaming of HM6 processing stages
- 🎨 Custom-built UI with Styled Components
- 📊 Live progress visualization (3 paths × 5 stages)
- 🔄 Automatic foundation rotation display
- 💾 Session history and synthesis download
- 🔒 Secure vault - API keys never exposed to client

## Stack

- **Frontend**: React 18 + Vite + JavaScript
- **State**: Zustand
- **Styling**: Styled Components (custom-built, no UI framework)
- **Real-time**: WebSockets (Vercel native support)
- **Deployment**: Vercel Edge Functions

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create `.env.local` for development:

```env
VITE_API_URL=http://localhost:3001
```

## Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Set up secrets:
```bash
vercel secrets add openrouter-deepseek sk-or-v1-YOUR-KEY-HERE
vercel secrets add openrouter-gpt4 sk-or-v1-YOUR-KEY-HERE
vercel secrets add openrouter-claude sk-or-v1-YOUR-KEY-HERE
vercel secrets add xai-key xai-YOUR-KEY-HERE
```

3. Deploy:
```bash
vercel --prod
```

## Project Structure

```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main app component
├── store/
│   └── useHM6Store.js      # Zustand state management
├── components/
│   ├── QueryInput.jsx      # Query form
│   ├── ProgressStream.jsx  # Real-time stage updates
│   ├── SynthesisDisplay.jsx # Final HM6 output
│   └── FoundationIndicator.jsx # Active foundation display
└── styles/
    └── GlobalStyles.js     # Global CSS-in-JS

api/
├── query.js                # POST /api/query - Start HM6
├── stream.js               # GET /api/stream/:id - WebSocket
└── sessions.js             # GET /api/sessions - History
```

## Security

- ✅ API keys stored in Vercel environment variables
- ✅ Backend executes HM6 CLI with full access to secrets
- ✅ Frontend receives only sanitized responses
- ✅ No sensitive metadata exposed to client
- ✅ WebSocket connections scoped to session ID

## Architecture

```
Browser
  ↓ POST /api/query
Vercel Edge Function
  ↓ spawn
HM6 CLI (with API keys)
  ↓ WebSocket updates
Browser (live progress)
  ↓ Final synthesis
Browser (display)
```

## License

MIT
