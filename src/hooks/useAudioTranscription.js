import { useState } from 'react';

export const useAudioTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update this URL to your backend server IP
  const API_URL = 'http://localhost:3001';

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
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  };

  return { transcribeAudio, checkBackendHealth, isLoading, error };
};