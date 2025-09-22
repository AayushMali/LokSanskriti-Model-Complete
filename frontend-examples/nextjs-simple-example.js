// 🎯 Simple Next.js Integration Example

// 1. Create this file: hooks/useAudioTranscription.js
import { useState } from 'react';

export const useAudioTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔧 CHANGE THIS IP TO YOUR BACKEND LAPTOP'S IP
  const API_URL = 'http://localhost:3001'; // Change to: http://192.168.1.XXX:3001

  const transcribeAudio = async (audioFile, language = 'en') => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', language);

    try {
      const response = await fetch(`${API_URL}/api/transcribe`, {
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
      console.error('Transcription failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { transcribeAudio, isLoading, error };
};

// 2. Create this component: components/AudioUpload.js
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAudioTranscription } from '../hooks/useAudioTranscription';

export const AudioUpload = () => {
  const [transcription, setTranscription] = useState('');
  const [language, setLanguage] = useState('en');
  const { transcribeAudio, isLoading, error } = useAudioTranscription();

  const onDrop = useCallback(async (acceptedFiles) => {
    const audioFile = acceptedFiles[0];
    console.log('Uploading file:', audioFile.name);
    
    try {
      const result = await transcribeAudio(audioFile, language);
      setTranscription(result.transcription);
      console.log('Transcription result:', result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  }, [transcribeAudio, language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎵 Audio Transcription</h1>
      
      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Language:</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-2"
          disabled={isLoading}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>🎵 Transcribing audio... Please wait.</p>
          </div>
        ) : isDragActive ? (
          <p>Drop the audio file here...</p>
        ) : (
          <div>
            <p>Drag & drop an audio file here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">
              Supported: WAV, MP3, FLAC, M4A, OGG, AAC (Max 50MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          ❌ Error: {error}
        </div>
      )}

      {/* Transcription Result */}
      {transcription && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold mb-2">📝 Transcription:</h3>
          <p className="text-gray-800">{transcription}</p>
        </div>
      )}
    </div>
  );
};

// 3. Use in your page: pages/transcribe.js
/*
import { AudioUpload } from '../components/AudioUpload';

export default function TranscribePage() {
  return (
    <div>
      <AudioUpload />
    </div>
  );
}
*/

// 4. Install required dependencies:
// npm install react-dropzone

// 5. Add to your Next.js project and update the API_URL in useAudioTranscription.js