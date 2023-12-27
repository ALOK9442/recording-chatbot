import { faMicrophone, faMicrophoneAltSlash, faPaperPlane, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';

const ChatPage = () => {
    const [inputText, setInputText] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState([]);
    const [currentSender, setCurrentSender] = useState('chat');
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

    const toggleRecording = () => {
        if (!isRecording) {
            startRecording();
            setCurrentSender('user');
        } else {
            stopRecording();
            setCurrentSender('chat');
        }
    };

    const handleMessage = () => {
        setChatMessages((prevChatMessages) => [...prevChatMessages, { text: inputText, isUser: true }]);
        setInputText('');
    }

    useEffect(() => {
        if (audioData.length > 0) {
            const latestAudio = audioData[audioData.length - 1];
            if (audioRef.current) {
                audioRef.current.src = latestAudio.url;
            }
        }
    }, [audioData]);

    return (
        <div className="container mx-auto mt-8 p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Voice Note Chatbot</h1>
            <div className="h-96 overflow-y-scroll border border-gray-300 p-4 w-80">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        <p>{message.text}</p>
                    </div>
                ))}
                {audioData.map((audio, index) => (
                    <div key={index} className={`ml-36 ${audio.isUser ? 'text-right' : 'text-left'}`}>
                        <audio controls src={audio.url} className='w-40' />
                    </div>
                ))}
                {audioData.map((audio, index) => (
                    <div key={index} className={`mb-2 ${audio.isUser ? 'text-right' : 'text-left'}`}>
                        <audio controls src={audio.url} className='w-40' />
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-6 w-80">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border p-2 rounded-l-md"
                />
                <div className='space-x-6'>
                    <button className={`bg-amber-500 p-2 rounded-md ${isRecording ? 'bg-red-500' : ''}`} onClick={toggleRecording}>
                        {isRecording ? <FontAwesomeIcon icon={faStop} /> : <FontAwesomeIcon icon={faMicrophone} />}
                    </button>
                    <button className="bg-blue-500 text-white p-2 rounded-md">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;