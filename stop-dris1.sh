#!/bin/bash

# DRIS1 Stop Script
# Clean shutdown of DRIS1 services

echo "🛑 Stopping DRIS1..."

pkill -f "node server/index.js" 2>/dev/null && echo "✅ Backend stopped" || echo "⚠️  Backend not running"
pkill -f "npm run dev" 2>/dev/null && echo "✅ Frontend stopped" || echo "⚠️  Frontend not running"
pkill -f "vite" 2>/dev/null || true

sleep 1

# Verify ports are free
if lsof -i:3000,3001 -P 2>/dev/null | grep -q LISTEN; then
    echo "⚠️  Warning: Some processes still holding ports"
    lsof -i:3000,3001 -P 2>/dev/null | grep LISTEN
else
    echo "✅ All ports freed"
fi

echo "Done."
