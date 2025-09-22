#!/bin/bash

echo "🚀 Setting up Audio Transcription Backend..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Setup Python environment
echo "🐍 Setting up Python dependencies..."
cd python
pip install -r requirements.txt
cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend: npm run dev"  
echo "2. Backend will run on: http://localhost:3001"
echo "3. Test with: curl http://localhost:3001/api/health"
echo ""
echo "📡 API Endpoints:"
echo "- POST /api/transcribe (single file)"
echo "- POST /api/transcribe/batch (multiple files)"  
echo "- GET /api/health (health check)"
echo "- GET /api/languages (supported languages)"