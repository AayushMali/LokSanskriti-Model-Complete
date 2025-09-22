# 🌐 Cross-Machine Setup Guide

## ✅ **Python Integration Confirmed Working!**

Your backend successfully:
- ✅ Finds Python scripts in `python/` directory  
- ✅ Spawns Python processes locally
- ✅ Receives JSON responses from Python
- ✅ Transcribes audio files correctly

## 🔧 **Setup for Different Laptops:**

### **Laptop 1: Backend (This laptop)**
```bash
# 1. Start the backend
cd AudioTranscription-Backend
node server.js

# 2. Find your IP address
ipconfig
# Look for: IPv4 Address . . . : 192.168.1.XXX
```

### **Laptop 2: Frontend (Your Next.js laptop)**
```javascript
// In your Next.js app, update the API URL:
const API_BASE_URL = 'http://192.168.1.XXX:3001';  // Replace XXX with backend IP

// Example usage:
const uploadAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  formData.append('language', 'en');

  const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.data.transcription;
};
```

## 🔥 **Live Test:**

### **Start Backend:**
```bash
node server.js
# Output: 🚀 Audio Transcription Backend running on port 3001
```

### **Test from Frontend Laptop:**
```bash
# Replace 192.168.1.XXX with your backend IP
curl -X GET "http://192.168.1.XXX:3001/api/health"
```

### **Expected Response:**
```json
{
  "success": true,
  "service": "Audio Transcription Backend",
  "status": "healthy",
  "supportedFormats": [".wav", ".mp3", ".flac", ".m4a", ".ogg", ".aac"]
}
```

## 🚀 **How Requests Flow:**

```
[Next.js Laptop] --HTTP--> [Express Server] --spawn--> [Python Script] --JSON--> [Response]
     (Port 3000)                (Port 3001)              (Local process)         (Back to Next.js)
```

### **Detailed Flow:**
1. **Next.js uploads audio** → Express server (different laptop)
2. **Express saves file** → Local `uploads/` directory  
3. **Express spawns Python** → `python transcribe.py uploads/file.wav en`
4. **Python processes locally** → Uses Whisper model (same machine as Express)
5. **Python returns JSON** → `{"transcription": "text here"}`
6. **Express sends response** → Back to Next.js laptop over network

## 🔒 **Network Requirements:**

### **Same WiFi/Network:**
- Both laptops must be on same network
- No additional setup needed

### **Firewall (Windows):**
```powershell
# Allow Node.js through Windows Firewall
netsh advfirewall firewall add rule name="Node.js Backend" dir=in action=allow protocol=TCP localport=3001
```

### **Router Settings:**
- Most home routers allow internal communication by default
- Corporate networks might block - use same subnet

## 🎯 **Why This Works:**

✅ **Local Python Processing**: Heavy Whisper model runs on backend laptop only  
✅ **Network Efficiency**: Only audio file upload + text response over network  
✅ **No Python on Frontend**: Next.js laptop doesn't need Python/Whisper installed  
✅ **Scalable**: Multiple frontend clients can use same backend  
✅ **Familiar Stack**: Express.js + standard HTTP APIs  

## 🚨 **Common Issues & Fixes:**

### **"Connection Refused"**
- Check if backend is running: `node server.js`
- Verify IP address: `ipconfig`
- Test locally first: `curl localhost:3001/api/health`

### **"CORS Error"**
- Already configured in server.js for cross-origin requests
- If issues persist, add your frontend laptop IP to CORS origins

### **"Python Not Found"**  
- Python must be installed on **backend laptop only**
- Test: `python --version` on backend laptop
- Install deps: `pip install -r python/requirements.txt`

Your setup is ready! 🎉