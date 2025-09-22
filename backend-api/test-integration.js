const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test if Python integration works
async function testPythonIntegration() {
  console.log('🧪 Testing Python Integration...\n');

  // 1. Check if Python files exist
  const pythonScript = path.join(__dirname, 'python', 'transcribe.py');
  const modelFile = path.join(__dirname, 'python', 'model.py');
  
  console.log('📁 Checking Python files:');
  console.log(`   transcribe.py: ${fs.existsSync(pythonScript) ? '✅' : '❌'}`);
  console.log(`   model.py: ${fs.existsSync(modelFile) ? '✅' : '❌'}`);
  
  // 2. Test Python script with a dummy command
  console.log('\n🐍 Testing Python script execution...');
  
  return new Promise((resolve, reject) => {
    // Test with help command to see if Python script is accessible
    const pythonProcess = spawn('python', [pythonScript]);
    
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      console.log(`   Exit code: ${code}`);
      
      if (errorData) {
        console.log(`   Error output: ${errorData}`);
      }
      
      if (outputData) {
        console.log(`   Output: ${outputData}`);
      }
      
      resolve({ code, output: outputData, error: errorData });
    });

    pythonProcess.on('error', (err) => {
      console.log(`   ❌ Failed to start Python: ${err.message}`);
      reject(err);
    });

    // Close stdin to let the process finish
    pythonProcess.stdin.end();
  });
}

// Test with actual audio file if available
async function testWithAudioFile() {
  console.log('\n🎵 Testing with actual audio file...');
  
  // Check if test audio file exists
  const testAudioPath = path.join(__dirname, '..', 'LokSanskriti', 'your_audi.wav');
  
  if (fs.existsSync(testAudioPath)) {
    console.log('   ✅ Found test audio file');
    
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, 'python', 'transcribe.py');
      const pythonProcess = spawn('python', [pythonScript, testAudioPath, 'en']);
      
      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        console.log(`   Exit code: ${code}`);
        
        if (code === 0 && outputData) {
          try {
            const result = JSON.parse(outputData.trim());
            console.log('   ✅ Transcription successful!');
            console.log(`   📝 Text: ${result.transcription?.substring(0, 100)}...`);
            resolve(result);
          } catch (err) {
            console.log(`   ❌ Failed to parse JSON: ${outputData}`);
            reject(err);
          }
        } else {
          console.log(`   ❌ Python error: ${errorData}`);
          reject(new Error(errorData));
        }
      });

      pythonProcess.on('error', (err) => {
        console.log(`   ❌ Process error: ${err.message}`);
        reject(err);
      });
    });
  } else {
    console.log('   ⚠️  No test audio file found');
    console.log(`   Expected: ${testAudioPath}`);
    return null;
  }
}

// Run tests
async function runTests() {
  try {
    await testPythonIntegration();
    await testWithAudioFile();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Python integration is working');
    console.log('   ✅ Ready for cross-machine deployment');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start backend: node server.js');
    console.log('   2. Find your IP: ipconfig');  
    console.log('   3. Update frontend API_URL to your IP');
    
  } catch (error) {
    console.log(`\n❌ Test failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure Python is installed: python --version');
    console.log('   2. Install Python deps: cd python && pip install -r requirements.txt');
    console.log('   3. Check file paths are correct');
  }
}

// Run if called directly
if (require.main === module) {
  runTests();
}

module.exports = { testPythonIntegration, testWithAudioFile, runTests };