import React, { useState, useRef, useEffect } from 'react';

const ChatPage = () => {
    const [inputText, setInputText] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState([]);
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);

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
                    const audioUrl = URL.createObjectURL(audioBlob);
                    setAudioData((prevAudioData) => [...prevAudioData, { url: audioUrl, isUser: true }]);
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    useEffect(() => {
        if (audioData.length > 0) {
            const latestAudio = audioData[audioData.length - 1];
            if (audioRef.current) {
                audioRef.current.src = latestAudio.url;
            }
        }
    }, [audioData]);

    return (
        <div className="container mx-auto mt-8 p-4">
            <h1 className="text-3xl font-bold mb-4">Voice Note Chatbot</h1>
            <div className="h-96 overflow-y-scroll border border-gray-300 p-4">
                {audioData.map((audio, index) => (
                    <div key={index} className={`mb-2 ${audio.isUser ? 'text-right' : 'text-left'}`}>
                        <audio controls src={audio.url} className=''/>
                    </div>
                ))}
            </div>
            <div className="flex items-center mt-4">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border p-2 rounded-l-md"
                />
                <div className='space-x-6'>
                    <button className='bg-amber-500 p-2 rounded-md' onClick={startRecording} disabled={isRecording}>
                        {isRecording ? 'Recording...' : 'Start Recording'}
                    </button>
                    <button className='bg-red-500 text-white p-2 rounded-md' onClick={stopRecording} disabled={!isRecording}>
                        Stop Recording
                    </button>
                    <button className="bg-blue-500 text-white p-2 rounded-r-md">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
