import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AudioUploader from './components/AudioUploader';
import TranscriptionHistory from './components/TranscriptionHistory';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const handleTranscriptionComplete = (result) => {
    const newTranscription = {
      id: Date.now(),
      filename: result.originalFilename || 'Unknown file',
      transcription: result.transcription,
      language: result.language,
      processingTime: result.processingTime,
      timestamp: new Date().toISOString(),
      fileSize: result.fileSize
    };
    
    setTranscriptions(prev => [newTranscription, ...prev]);
    setActiveTab('history');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-950 dark:to-dark-900">
        <Header />
        
        <main className="relative">
          {activeTab === 'upload' && (
            <>
              <Hero />
              <AudioUploader onTranscriptionComplete={handleTranscriptionComplete} />
            </>
          )}
          
          {activeTab === 'history' && (
            <div className="pt-20">
              <TranscriptionHistory 
                transcriptions={transcriptions}
                onBackToUpload={() => setActiveTab('upload')}
              />
            </div>
          )}
        </main>

        <Footer />

        {/* Navigation Tabs */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass-effect rounded-2xl p-2 shadow-2xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'upload'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                  activeTab === 'history'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
                }`}
              >
                History
                {transcriptions.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {transcriptions.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;