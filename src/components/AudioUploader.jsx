import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, X, Play, Pause, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAudioTranscription } from '../hooks/useAudioTranscription';

const AudioUploader = ({ onTranscriptionComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  
  const { transcribeAudio, checkBackendHealth, isLoading, error } = useAudioTranscription();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
  ];

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      
      // Create audio element for preview
      const audioUrl = URL.createObjectURL(file);
      const audioElement = new Audio(audioUrl);
      setAudio(audioElement);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.m4a', '.ogg', '.aac']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false
  });

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    try {
      const result = await transcribeAudio(selectedFile, language);
      onTranscriptionComplete(result);
      setSelectedFile(null);
      setAudio(null);
    } catch (err) {
      console.error('Transcription failed:', err);
    }
  };

  const togglePlayback = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const removeFile = () => {
    if (audio) {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    }
    setSelectedFile(null);
    setAudio(null);
    setIsPlaying(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-4xl mx-auto">
        {/* Backend Status */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm ${
            backendStatus === 'online' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : backendStatus === 'offline'
              ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
          }`}>
            {backendStatus === 'online' && <CheckCircle className="h-4 w-4" />}
            {backendStatus === 'offline' && <AlertCircle className="h-4 w-4" />}
            {backendStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>
              Backend: {backendStatus === 'online' ? 'Connected' : backendStatus === 'offline' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4 text-center">
            Select Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                disabled={isLoading}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  language === lang.code
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-xs font-medium">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Area */}
        <div className="glass-effect rounded-3xl p-8 mb-8">
          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              
              <div className="mb-6">
                <Upload className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive ? 'Drop your audio file here' : 'Upload Audio File'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag & drop or click to select your audio file
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: WAV, MP3, FLAC, M4A, OGG, AAC
                  <br />
                  Maximum file size: 50MB
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                    <FileAudio className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedFile.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {audio && (
                    <button
                      onClick={togglePlayback}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={removeFile}
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleTranscribe}
            disabled={!selectedFile || isLoading || backendStatus !== 'online'}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Transcribing...</span>
              </>
            ) : (
              <>
                <FileAudio className="h-5 w-5" />
                <span>Start Transcription</span>
              </>
            )}
          </button>
          
          {selectedFile && (
            <button
              onClick={removeFile}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              Clear File
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-400 font-medium">Error:</span>
            </div>
            <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Backend Connection Help */}
        {backendStatus === 'offline' && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-700 dark:text-yellow-400 font-medium">Backend Disconnected</span>
            </div>
            <p className="text-yellow-600 dark:text-yellow-300 text-sm">
              Make sure your backend server is running on port 3001. 
              Check the console for connection details.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AudioUploader;