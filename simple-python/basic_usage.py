
from model import transcribe_audio

audio_file = "your_audi.wav"

print("Transcribing audio...")
result = transcribe_audio(audio_file, language="en")
print(f"Text: {result}")