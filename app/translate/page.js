// pages/index.js

'use client';

import React from 'react';
import Link from 'next/link';
import TextToSpeech from '../components/Tts';
import './Home.css'; // Optional: If you have specific styles

export default function Home() {
    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <img
                className="bg"
                src="/computer.png" // Ensure this image exists in the public folder
                alt="Background"
                style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
            />
            {/* Navigation Buttons */}
            <Link href="/">
                <button id="home" className="ti" aria-label="Home" />
            </Link>
            <Link href="/about">
                <button id="about" className="ti" aria-label="About" />
            </Link>
            <Link href="/contact">
                <button id="contact" className="ti" aria-label="Contact" />
            </Link>
            <Link href="/curriculum">
                <button id="curriculumt" className="bi" aria-label="Curriculum" />
            </Link>
            <Link href="/computervp">
                <button id="computervp" className="bi" aria-label="Computer VP" />
            </Link>

            {/* Text-to-Speech Section */}
            <div
                id="ts"
                className="absolute grid grid-cols-3 gap-11"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
                <TextToSpeech text="டெஸ்க்டாப்" />
                <TextToSpeech text="கீபோர்டு" />
                <TextToSpeech text="சிடி/டிவிடி இயக்கி" />
                <TextToSpeech text="மவுஸ்" />
                <TextToSpeech text="பிரிண்டர்" />
                <TextToSpeech text="சிடி/டிவிடி" />
            </div>
        </div>
    );
}
