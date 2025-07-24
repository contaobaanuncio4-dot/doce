#!/bin/bash

echo "Building for Netlify..."

# Build client
echo "Building client..."
npm run build

# Copy redirects file to the publish directory
echo "Copying redirects..."
cp _redirects dist/public/_redirects

echo "Build complete! Ready for Netlify deployment."