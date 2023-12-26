import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcription, setTranscription] = useState('');
  const audioRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioUrl(URL.createObjectURL(audioBlob));
        };

        mediaRecorder.start();
        setIsRecording(true);

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 5000);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
  
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
      };
  
      recognition.onend = () => {
        console.log('Speech recognition ended');
      };
  
      recognition.start();
    } else {
      console.error('SpeechRecognition API not supported in this browser');
    }
  };
  

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  return (
    <div>
      <h1>Audio Recording Chatbot</h1>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      <button onClick={handleSpeechRecognition} disabled={isRecording}>
        Transcribe Speech
      </button>
      {transcription && <p>Transcription: {transcription}</p>}
      {audioUrl && <audio controls ref={audioRef} />}
    </div>
  );
};

export default AudioRecorder;
