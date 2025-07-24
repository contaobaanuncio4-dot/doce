#!/bin/bash

echo "Building for Netlify..."

# Build client
echo "Building client..."
npx vite build

# Create netlify functions directory
echo "Preparing Netlify functions..."
mkdir -p netlify/functions

# Functions are already created in the netlify/functions directory
echo "Netlify functions are ready!"

echo "Build complete! Ready for Netlify deployment."