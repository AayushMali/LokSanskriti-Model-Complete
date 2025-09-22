// Next.js API Integration Examples

// 1. React Hook for Audio Transcription
import { useState } from 'react';

export const useAudioTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const transcribeAudio = async (audioFile, language = 'en') => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    try {
      const response = await fetch('http://localhost:3001/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const transcribeBatch = async (audioFiles, languages = []) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    audioFiles.forEach((file) => {
      formData.append('audio', file);
    });
    
    languages.forEach((lang) => {
      formData.append('languages', lang);
    });

    try {
      const response = await fetch('http://localhost:3001/api/transcribe/batch', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { transcribeAudio, transcribeBatch, isLoading, error };
};

// 2. Audio Upload Component
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const AudioUploader = ({ onTranscriptionComplete }) => {
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const { transcribeAudio, isLoading, error } = useAudioTranscription();

  const onDrop = useCallback(async (acceptedFiles) => {
    const audioFile = acceptedFiles[0];
    
    try {
      const result = await transcribeAudio(audioFile, selectedLanguage);
      setTranscription(result.transcription);
      onTranscriptionComplete?.(result);
    } catch (err) {
      console.error('Transcription failed:', err);
    }
  }, [selectedLanguage, transcribeAudio, onTranscriptionComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  return (
    <div className="audio-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the audio file here...</p>
        ) : (
          <p>Drag & drop an audio file here, or click to select</p>
        )}
      </div>

      <div className="language-selector">
        <label htmlFor="language">Language:</label>
        <select 
          id="language"
          value={selectedLanguage} 
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={isLoading}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      {isLoading && (
        <div className="loading">
          <p>🎵 Transcribing audio... Please wait.</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>❌ Error: {error}</p>
        </div>
      )}

      {transcription && (
        <div className="result">
          <h3>📝 Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

// 3. Next.js API Route (pages/api/transcribe.js)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Forward request to Express backend
    const formData = new FormData();
    // Add file and other form data here
    
    const backendResponse = await fetch('http://localhost:3001/api/transcribe', {
      method: 'POST',
      body: formData
    });

    const result = await backendResponse.json();
    res.status(backendResponse.status).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 4. Complete Page Component (pages/transcription.js)
import { useState } from 'react';
import { AudioUploader } from '../components/AudioUploader';

export default function TranscriptionPage() {
  const [results, setResults] = useState([]);

  const handleTranscriptionComplete = (result) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      filename: result.originalFilename,
      transcription: result.transcription,
      language: result.language,
      processingTime: result.processingTime,
      timestamp: new Date().toLocaleString()
    }]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎵 Audio Transcription</h1>
      
      <AudioUploader onTranscriptionComplete={handleTranscriptionComplete} />
      
      {results.length > 0 && (
        <div className="results mt-8">
          <h2 className="text-2xl font-semibold mb-4">📋 Results</h2>
          {results.map((result) => (
            <div key={result.id} className="result-card border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{result.filename}</h3>
                <span className="text-sm text-gray-500">{result.timestamp}</span>
              </div>
              <p className="mb-2">{result.transcription}</p>
              <div className="text-sm text-gray-600">
                Language: {result.language} | Processing: {result.processingTime}s
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. Tailwind CSS Classes for styling
const styles = `
.dropzone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors;
}

.dropzone.active {
  @apply border-blue-500 bg-blue-50;
}

.dropzone:hover {
  @apply border-gray-400 bg-gray-50;
}

.language-selector {
  @apply mt-4 flex items-center gap-2;
}

.language-selector select {
  @apply border rounded px-3 py-1;
}

.loading {
  @apply mt-4 p-4 bg-blue-50 border border-blue-200 rounded;
}

.error {
  @apply mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700;
}

.result {
  @apply mt-4 p-4 bg-green-50 border border-green-200 rounded;
}

.result-card {
  @apply bg-white shadow-sm;
}
`;

// 6. Package.json dependencies for Next.js
const nextjsDependencies = {
  "dependencies": {
    "next": "^13.5.0",
    "react": "^18.2.0", 
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.29"
  }
};

export { nextjsDependencies, styles };