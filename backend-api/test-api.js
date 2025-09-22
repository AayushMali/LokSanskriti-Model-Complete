// Test the backend API
const testAPI = async () => {
  const baseURL = 'http://localhost:3001';

  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseURL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);

    // Test languages endpoint  
    const languagesResponse = await fetch(`${baseURL}/api/languages`);
    const languagesData = await languagesResponse.json();
    console.log('✅ Languages:', languagesData);

    console.log('🎉 Backend is working perfectly!');
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('Make sure to start the backend with: node server.js');
  }
};

// For browser testing
if (typeof window !== 'undefined') {
  window.testAPI = testAPI;
  console.log('Run testAPI() in console to test the backend');
}

// For Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAPI };
}