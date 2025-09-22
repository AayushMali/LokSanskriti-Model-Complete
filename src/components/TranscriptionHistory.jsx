import React, { useState } from 'react';
import { ArrowLeft, Download, Copy, Trash2, FileAudio, Clock, Languages, HardDrive, Search, Filter } from 'lucide-react';

const TranscriptionHistory = ({ transcriptions, onBackToUpload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTranscriptions = transcriptions
    .filter(item => {
      const matchesSearch = item.transcription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.filename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = filterLanguage === 'all' || item.language === filterLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'filename':
          return a.filename.localeCompare(b.filename);
        case 'language':
          return a.language.localeCompare(b.language);
        default:
          return 0;
      }
    });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const downloadTranscription = (transcription) => {
    const element = document.createElement('a');
    const file = new Blob([transcription.transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${transcription.filename}_transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getLanguageFlag = (code) => {
    const flags = {
      'en': '🇺🇸', 'hi': '🇮🇳', 'mr': '🇮🇳', 'es': '🇪🇸',
      'fr': '🇫🇷', 'de': '🇩🇪', 'zh': '🇨🇳', 'ja': '🇯🇵',
      'ko': '🇰🇷', 'ar': '🇸🇦', 'ru': '🇷🇺', 'pt': '🇵🇹'
    };
    return flags[code] || '🌐';
  };

  const uniqueLanguages = [...new Set(transcriptions.map(t => t.language))];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToUpload}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Transcription History</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {transcriptions.length} transcription{transcriptions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transcriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Languages</option>
                {uniqueLanguages.map(lang => (
                  <option key={lang} value={lang}>
                    {getLanguageFlag(lang)} {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="filename">By Filename</option>
              <option value="language">By Language</option>
            </select>
          </div>
        </div>

        {/* Transcriptions List */}
        {filteredTranscriptions.length === 0 ? (
          <div className="text-center py-16">
            <FileAudio className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {transcriptions.length === 0 ? 'No transcriptions yet' : 'No matching transcriptions'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {transcriptions.length === 0 
                ? 'Upload your first audio file to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {transcriptions.length === 0 && (
              <button
                onClick={onBackToUpload}
                className="btn-primary"
              >
                Upload Audio File
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTranscriptions.map((transcription) => (
              <div
                key={transcription.id}
                className="glass-effect rounded-2xl p-6 card-hover"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-xl">
                      <FileAudio className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{transcription.filename}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(transcription.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Languages className="h-4 w-4" />
                          <span>{getLanguageFlag(transcription.language)} {transcription.language.toUpperCase()}</span>
                        </div>
                        {transcription.fileSize && (
                          <div className="flex items-center space-x-1">
                            <HardDrive className="h-4 w-4" />
                            <span>{formatFileSize(transcription.fileSize)}</span>
                          </div>
                        )}
                        {transcription.processingTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{transcription.processingTime.toFixed(1)}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(transcription.transcription)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadTranscription(transcription)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                      title="Download transcription"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
                      title="Delete transcription"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Transcription Text */}
                <div className="bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {transcription.transcription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptionHistory;