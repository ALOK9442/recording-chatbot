import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
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

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);



  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
      {audioUrl && <audio controls ref={audioRef} />}
      <audio controls ref={audioRef} className=''/>
    </div>
  );
};

export default AudioRecorder;