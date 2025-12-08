#!/bin/bash

# DRIS1 Startup Script
# Simple, reliable startup for DRIS1 frontend + backend

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 DRIS1 Startup"
echo "================="

# 1. Clean any stuck processes
echo "Cleaning old processes..."
pkill -f "node server/index.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# 2. Verify HM6 binary exists
if [ ! -f "../centropic-core/bin/hm6" ]; then
    echo "❌ ERROR: HM6 binary not found at centropic-core/bin/hm6"
    echo "Run: cd centropic-core && go build -o bin/hm6 cmd/hm6/main.go"
    exit 1
fi

echo "✅ HM6 binary verified ($(ls -lh ../centropic-core/bin/hm6 | awk '{print $5}'))"

# 2.5 Verify .env exists
if [ ! -f "../centropic-core/.env" ]; then
    echo "❌ ERROR: .env file not found at centropic-core/.env"
    echo "HM6 needs API keys to function"
    exit 1
fi

echo "✅ .env file found"

# 3. Start backend
echo "Starting backend on port 3001..."
node server/index.js > /tmp/dris1-backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to bind
sleep 3

# Verify backend is up
if ! lsof -i:3001 -P 2>/dev/null | grep -q LISTEN; then
    echo "❌ Backend failed to start. Check logs:"
    tail -20 /tmp/dris1-backend.log
    exit 1
fi

echo "✅ Backend running on http://localhost:3001"

# 4. Start frontend
echo "Starting frontend on port 3000..."
npm run dev > /tmp/dris1-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to bind
sleep 3

# Verify frontend is up
if ! lsof -i:3000 -P 2>/dev/null | grep -q LISTEN; then
    echo "❌ Frontend failed to start. Check logs:"
    tail -20 /tmp/dris1-frontend.log
    exit 1
fi

echo "✅ Frontend running on http://localhost:3000"
echo ""
echo "🎉 DRIS1 is ready!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/dris1-backend.log"
echo "   Frontend: tail -f /tmp/dris1-frontend.log"
echo ""
echo "🛑 To stop:"
echo "   pkill -f 'node server/index.js'"
echo "   pkill -f 'npm run dev'"
