# 🎵 Audio Transcription Backend

**Node.js/Express backend that spawns Python processes for audio transcription using OpenAI Whisper.**

🚀 **Ready for production deployment with Next.js frontend integration!**

## 🚀 Quick Start

### 1. Setup
```bash
# Clone/navigate to backend directory
cd AudioTranscription-Backend

# Install dependencies
npm install

# Setup Python dependencies
cd python
pip install -r requirements.txt
cd ..
```

### 2. Start Backend
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Backend runs on:** `http://localhost:3001`

### 3. Test API
```bash
# Health check
curl http://localhost:3001/api/health

# Supported languages
curl http://localhost:3001/api/languages
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transcribe` | Single audio file transcription |
| `POST` | `/api/transcribe/batch` | Multiple files transcription |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/languages` | Supported languages |

## 📝 API Usage Examples

### Single File Upload
```javascript
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('language', 'en');

const response = await fetch('http://localhost:3001/api/transcribe', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.transcription);
```

### Response Format
```json
{
  "success": true,
  "data": {
    "transcription": "Your transcribed text here",
    "language": "en",
    "originalFilename": "audio.wav",
    "fileSize": 1048576,
    "processingTime": 3.45
  }
}
```

## 🔗 Next.js Integration

### Install Next.js Dependencies
```bash
npm install react-dropzone
```

### Use in Your Components
```jsx
import { useAudioTranscription } from '../hooks/useAudioTranscription';

function MyComponent() {
  const { transcribeAudio, isLoading } = useAudioTranscription();
  
  const handleFile = async (file) => {
    const result = await transcribeAudio(file, 'en');
    console.log(result.transcription);
  };
  
  return (
    <input 
      type="file" 
      accept="audio/*"
      onChange={(e) => handleFile(e.target.files[0])}
      disabled={isLoading}
    />
  );
}
```

## 📁 Project Structure

```
AudioTranscription-Backend/
├── server.js              # Express server
├── package.json           # Node dependencies
├── .env                   # Environment config
├── uploads/               # Temporary file storage
├── python/                # Python transcription scripts
│   ├── transcribe.py      # Main transcription script
│   ├── model.py          # Whisper model functions
│   └── requirements.txt   # Python dependencies
└── nextjs-integration.js  # Frontend examples
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
PORT=3001
PYTHON_PATH=python
MAX_FILE_SIZE=50MB
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Supported Audio Formats
- WAV, MP3, FLAC, M4A, OGG, AAC
- Maximum file size: 50MB

### Supported Languages
- English (en), Hindi (hi), Marathi (mr)
- Spanish (es), French (fr), German (de)
- And 90+ more languages supported by Whisper

## 🔧 Development

### Run with Auto-reload
```bash
npm run dev
```

### Test Python Script Directly
```bash
cd python
python transcribe.py "../uploads/test.wav" "en"
```

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 🚀 Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "audio-transcription"
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🔒 Security Features

- File type validation
- File size limits (50MB)
- CORS protection
- Automatic file cleanup
- Error handling & sanitization

## 📊 Performance

- **Processing Time**: ~2-5 seconds per minute of audio
- **Memory Usage**: ~500MB-1GB during processing
- **Concurrent Requests**: Handles multiple files simultaneously
- **File Cleanup**: Automatic temp file removal

## 🤝 Integration with Next.js Frontend

1. **Start this backend**: `npm run dev` (port 3001)
2. **Start Next.js frontend**: `npm run dev` (port 3000)  
3. **CORS is pre-configured** for localhost:3000
4. **Use provided React hooks** in `nextjs-integration.js`

Perfect for your NewsNudge project! 🎯