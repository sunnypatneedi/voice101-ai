#!/bin/bash

# Navigate to the sim-studio directory
cd sim-studio

# Install dependencies and build
npm install
npm run build

# Create the output directory in the public folder
cd ..
OUTPUT_DIR="public/sim-studio"
mkdir -p $OUTPUT_DIR

# Copy the built files to the public directory
cp -r sim-studio/dist/* $OUTPUT_DIR/

echo "✅ Simulator Studio built and copied to $OUTPUT_DIR"
