const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Next.js default ports
  credentials: true
}));

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

function transcribePython(audioPath, language = 'en') {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'python', 'transcribe.py');
    const args = [pythonScript, audioPath];
    
    if (language) {
      args.push(language);
    }

    const pythonProcess = spawn('python', args);
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(outputData.trim());
          resolve(result);
        } catch (err) {
          reject(new Error('Failed to parse Python output: ' + outputData));
        }
      } else {
        reject(new Error(`Python process failed: ${errorData}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error cleaning up file:', err);
  }
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No audio file provided'
      });
    }

    filePath = req.file.path;
    const language = req.body.language || 'en';
    
    console.log(`Processing: ${req.file.originalname} (${language})`);
    
    const startTime = Date.now();
    const result = await transcribePython(filePath, language);
    const processingTime = (Date.now() - startTime) / 1000;

    res.json({
      success: true,
      data: {
        transcription: result.transcription,
        language: language,
        originalFilename: req.file.originalname,
        fileSize: req.file.size,
        processingTime: processingTime
      }
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (filePath) {
      setTimeout(() => cleanupFile(filePath), 1000);
    }
  }
});

app.post('/api/transcribe/batch', upload.array('audio', 10), async (req, res) => {
  const filePaths = [];
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No audio files provided'
      });
    }

    const languages = req.body.languages ? 
      (Array.isArray(req.body.languages) ? req.body.languages : [req.body.languages]) : 
      [];
    
    const results = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const language = languages[i] || 'en';
      filePaths.push(file.path);
      
      try {
        const result = await transcribePython(file.path, language);
        results.push({
          filename: file.originalname,
          success: true,
          transcription: result.transcription,
          language: language
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
          success: false,
          error: error.message
        });
      }
    }

    const successful = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      summary: {
        total: req.files.length,
        successful: successful,
        failed: req.files.length - successful
      },
      results: results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    setTimeout(() => {
      filePaths.forEach(cleanupFile);
    }, 1000);
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'Audio Transcription Backend',
    version: '1.0.0',
    status: 'healthy',
    supportedFormats: ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac'],
    maxFileSize: '50MB'
  });
});

app.get('/api/languages', (req, res) => {
  res.json({
    success: true,
    languages: {
      'en': 'English',
      'hi': 'Hindi', 
      'mr': 'Marathi',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'ru': 'Russian',
      'pt': 'Portuguese'
    }
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Audio Transcription Backend running on port ${PORT}`);
  console.log(`📡 Ready to accept requests from Next.js frontend`);
});