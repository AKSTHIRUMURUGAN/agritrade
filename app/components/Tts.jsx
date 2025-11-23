// controls/t2s.js

'use client';

import React, { useState } from 'react';// Ensure the path is correct

const TextToSpeech = ({ text, languageCode = 'ta-IN' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlay = async () => {
        if (!text) {
            setError('No text provided.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, languageCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to synthesize speech.');
            }

            const { audioContent } = data;

            if (!audioContent) {
                throw new Error('No audio content received.');
            }

            // Convert Base64 to Blob
            const audioBlob = base64ToBlob(audioContent, 'audio/mp3');

            // Create a URL for the Blob
            const url = URL.createObjectURL(audioBlob);

            // Create an Audio instance and play
            const audio = new Audio(url);
            audio.play();

            // Optionally, revoke the object URL after playback ends to free memory
            audio.onended = () => {
                URL.revokeObjectURL(url);
            };
        } catch (err) {
            console.error('Error in TextToSpeech:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to convert Base64 to Blob
    const base64ToBlob = (base64, type) => {
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return new Blob([buffer], { type });
    };

    return (
        <div className="text-to-speech-container">
            <button onClick={handlePlay} disabled={isLoading} className="play-button">
                {isLoading ? 'Loading...' : 'Play'}
            </button>
            {error && <p className="error-message">Error: {error}</p>}
        </div>
    );
};

export default TextToSpeech;
