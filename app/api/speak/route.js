// app/api/speak/route.js

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, languageCode = 'ta-IN' } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required.' }, { status: 400 });
        }

        const apikey = process.env.GOOGLE_TRANSLATE_API_KEY;
        if (!apikey) {
            return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
        }

        const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apikey}`;

        const payload = {
            audioConfig: {
                audioEncoding: 'MP3',
                pitch: 0,
                speakingRate: 1,
            },
            input: {
                text: text,
            },
            voice: {
                languageCode: languageCode,
                name: 'ta-IN-Wavenet-B', // Ensure this voice is supported by Google TTS
            },
        };

        const response = await axios.post(endpoint, payload);

        const audioContent = response.data.audioContent; // Base64 encoded audio

        if (!audioContent) {
            return NextResponse.json({ error: 'No audio content returned from TTS API.' }, { status: 500 });
        }

        return NextResponse.json({ audioContent });
    } catch (error) {
        console.error('Error in /api/speak:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Speech synthesis failed.' }, { status: 500 });
    }
}
