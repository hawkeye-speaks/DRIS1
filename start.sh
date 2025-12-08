#!/bin/bash
# Railway deployment script

# Copy HM6 binary to deployment location
mkdir -p ../centropic-core/bin
cp ../centropic-core/bin/hm6 ./bin/hm6 2>/dev/null || echo "HM6 binary will be needed"

# Start backend
node server/index.js
