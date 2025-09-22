# 🎵 LokSanskriti: Complete Audio Transcription Solution

**A unified repository containing everything you need for audio transcription using OpenAI Whisper.**

## 🏗️ **Repository Structure**

```
LokSanskriti-Complete/
├── 📁 simple-python/          # Simple Python-only version
│   ├── model.py              # Core Whisper functions
│   ├── basic_usage.py        # Quick audio-to-text script
│   ├── requirements.txt      # Python dependencies
│   └── your_audi.wav        # Test audio file
│
├── 📁 backend-api/           # Production Node.js API
│   ├── server.js             # Express server
│   ├── package.json          # Node.js dependencies
│   ├── python/               # Python transcription scripts
│   ├── uploads/              # Temporary file storage
│   └── README.md            # Backend documentation
│
├── 📁 frontend-examples/     # Next.js integration
│   ├── nextjs-integration.js    # Complete React components
│   └── nextjs-simple-example.js # Simple usage examples
│
└── 📄 README.md             # This file
```

## 🚀 **Quick Start Options**

### Option 1: Simple Python Usage (Fastest)
```bash
cd simple-python
pip install -r requirements.txt
python basic_usage.py
```

### Option 2: Production API (Recommended)
```bash
cd backend-api
npm install
cd python && pip install -r requirements.txt
cd .. && node server.js
```

### Option 3: Full Stack (Backend + Frontend)
```bash
# Terminal 1: Start backend
cd backend-api && node server.js

# Terminal 2: Use in your Next.js project
# Copy components from frontend-examples/
```

## 🎯 **Use Cases**

| Scenario | Use This | Why |
|----------|----------|-----|
| **Quick testing** | `simple-python/` | No API, just Python |
| **Production app** | `backend-api/` | HTTP API, file uploads |
| **Next.js integration** | `frontend-examples/` | React components ready |

## 📡 **API Endpoints** (Backend API)

- `POST /api/transcribe` - Single file transcription
- `POST /api/transcribe/batch` - Multiple files
- `GET /api/health` - Health check
- `GET /api/languages` - Supported languages

## 🔧 **Configuration**

### Environment Variables (backend-api/.env)
```env
PORT=3001
PYTHON_PATH=python
MAX_FILE_SIZE=50MB
```

### Supported Languages
English (en), Hindi (hi), Marathi (mr), Spanish (es), French (fr), German (de), and 90+ more

## 🌐 **Cross-Machine Setup**

### Same Machine (Development)
```javascript
const API_URL = 'http://localhost:3001';
```

### Different Machines (Production)
```javascript
const API_URL = 'http://192.168.1.XXX:3001'; // Backend laptop IP
```

## 📦 **Installation**

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for cloning

### Quick Install
```bash
# Clone repository
git clone https://github.com/AayushMali/LokSanskriti-Complete.git
cd LokSanskriti-Complete

# Option A: Simple Python only
cd simple-python
pip install -r requirements.txt

# Option B: Full API setup
cd backend-api
npm install
cd python && pip install -r requirements.txt
```

## 🎵➡️📝 **How It Works**

1. **Audio Input**: Upload WAV, MP3, FLAC, M4A, OGG, AAC files
2. **Processing**: OpenAI Whisper model transcribes locally
3. **Output**: Clean text with language detection
4. **Integration**: Use via Python script or HTTP API

## 🚀 **Perfect For**

✅ **NewsNudge project** - Integrate audio transcription  
✅ **Meeting transcripts** - Convert recordings to text  
✅ **Content creation** - Audio to blog posts  
✅ **Language learning** - Transcribe pronunciation practice  
✅ **Accessibility** - Generate captions from audio  

## 📈 **Performance**

- **Speed**: ~2-5 seconds per minute of audio
- **Accuracy**: High quality with language specification
- **Languages**: 99+ supported by Whisper
- **File Size**: Up to 50MB per file

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

MIT License - Use freely in your projects!

---

**🎯 Everything you need for audio transcription in one unified repository!**