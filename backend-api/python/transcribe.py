#!/usr/bin/env python3
import sys
import json
from model import transcribe_audio

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Usage: python transcribe.py <audio_file> [language]"
        }))
        sys.exit(1)
    
    audio_file = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'en'
    
    try:
        transcription = transcribe_audio(audio_file, language)
        
        result = {
            "success": True,
            "transcription": transcription,
            "language": language,
            "audio_file": audio_file
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": str(e),
            "audio_file": audio_file
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()