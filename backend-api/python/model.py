# Load model directly
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq
import torch
import librosa
import numpy as np

# Load the Whisper model and processor
processor = AutoProcessor.from_pretrained("openai/whisper-base")
model = AutoModelForSpeechSeq2Seq.from_pretrained("openai/whisper-base")

def transcribe_audio(audio_path, language=None):
    """
    Transcribe audio file to text using Whisper model
    
    Args:
        audio_path (str): Path to the audio file
        language (str, optional): Language code (e.g., 'en', 'hi', 'mr'). If None, auto-detect
    
    Returns:
        str: Transcribed text
    """
    try:
        # Load audio file (Whisper expects 16kHz sampling rate)
        audio_array, sampling_rate = librosa.load(audio_path, sr=16000)
        
        # Process the audio
        inputs = processor(
            audio_array, 
            sampling_rate=16000, 
            return_tensors="pt"
        )
        
        # Set generation parameters
        generate_kwargs = {}
        if language:
            # Force specific language
            generate_kwargs["language"] = language
        
        # Generate transcription
        with torch.no_grad():
            generated_ids = model.generate(
                inputs["input_features"], 
                max_length=448,  # Maximum sequence length
                **generate_kwargs
            )
        
        # Decode the generated tokens to text
        transcription = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        return transcription.strip()
    
    except Exception as e:
        return f"Error during transcription: {str(e)}"

def transcribe_audio_from_array(audio_array, sampling_rate=16000, language=None):
    """
    Transcribe audio from numpy array
    
    Args:
        audio_array (np.ndarray): Audio data as numpy array
        sampling_rate (int): Sampling rate of the audio
        language (str, optional): Language code
    
    Returns:
        str: Transcribed text
    """
    try:
        # Resample if needed
        if sampling_rate != 16000:
            audio_array = librosa.resample(audio_array, orig_sr=sampling_rate, target_sr=16000)
        
        # Process the audio
        inputs = processor(
            audio_array, 
            sampling_rate=16000, 
            return_tensors="pt"
        )
        
        # Set generation parameters
        generate_kwargs = {}
        if language:
            generate_kwargs["language"] = language
        
        # Generate transcription
        with torch.no_grad():
            generated_ids = model.generate(
                inputs["input_features"], 
                max_length=448,
                **generate_kwargs
            )
        
        # Decode to text
        transcription = processor.batch_decode(
            generated_ids, 
            skip_special_tokens=True
        )[0]
        
        return transcription.strip()
    
    except Exception as e:
        return f"Error during transcription: {str(e)}"

# Example usage
if __name__ == "__main__":
    # Example 1: Transcribe from file path
    audio_file = "path/to/your/audio.wav"  # Replace with your audio file path
    
    # Auto-detect language
    result = transcribe_audio(audio_file)
    print(f"Transcription: {result}")
    
    # Force specific language (useful for better accuracy)
    # For Hindi: language='hi'
    # For Marathi: language='mr'  
    # For English: language='en'
    result_hindi = transcribe_audio(audio_file, language='hi')
    print(f"Hindi Transcription: {result_hindi}")
    
    # Example 2: Real-time audio recording (requires pyaudio)
    # Uncomment below code if you want real-time recording
    """
    import pyaudio
    import wave
    
    def record_and_transcribe(duration=5, language=None):
        # Record audio
        chunk = 1024
        format = pyaudio.paInt16
        channels = 1
        rate = 16000
        
        p = pyaudio.PyAudio()
        
        print(f"Recording for {duration} seconds...")
        stream = p.open(format=format, channels=channels, rate=rate, 
                       input=True, frames_per_buffer=chunk)
        
        frames = []
        for _ in range(0, int(rate / chunk * duration)):
            data = stream.read(chunk)
            frames.append(data)
        
        stream.stop_stream()
        stream.close()
        p.terminate()
        
        # Convert to numpy array
        audio_data = b''.join(frames)
        audio_array = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
        
        # Transcribe
        return transcribe_audio_from_array(audio_array, rate, language)
    
    # Record and transcribe
    live_result = record_and_transcribe(duration=5, language='en')
    print(f"Live Transcription: {live_result}")
    """