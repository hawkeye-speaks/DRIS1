#!/bin/bash
# Prepare DRIS1 for production deployment

echo "🚀 DRIS1 Production Deployment Preparation"
echo "=========================================="

# Step 1: Copy HM6 binary
echo "📦 Step 1: Copying HM6 binary..."
mkdir -p bin
cp ../centropic-core/bin/hm6 ./bin/hm6 2>/dev/null && echo "✅ HM6 binary copied" || echo "⚠️  Could not copy HM6 binary - ensure it exists at ../centropic-core/bin/hm6"
chmod +x ./bin/hm6 2>/dev/null

# Step 2: Copy configuration files
echo "⚙️  Step 2: Copying configuration..."
mkdir -p config
cp -r ../centropic-core/config/* ./config/ 2>/dev/null && echo "✅ Config copied" || echo "⚠️  No config files found"

# Step 3: Create storage directory
echo "💾 Step 3: Creating storage directory..."
mkdir -p storage
echo "✅ Storage directory created"

# Step 4: Install dependencies
echo "📚 Step 4: Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Step 5: Build frontend
echo "🔨 Step 5: Building frontend..."
npm run build
echo "✅ Frontend built"

# Step 6: Test backend locally
echo "🧪 Step 6: Testing backend..."
echo "Starting backend on port 3001..."
echo "Press Ctrl+C to stop"
node server/index.js
