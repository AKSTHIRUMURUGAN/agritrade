// components/Translator.js

"use client";

import { useState, useEffect, useRef } from 'react';

// Import language and country codes
import languageCodesData from '../data/language-codes.json';
import countryCodesData from '../data/country-codes.json';
import supportedLanguagesData from '../data/supported-languages.json';

const languageCodes = languageCodesData;
const countryCodes = countryCodesData;
const supportedLanguages = supportedLanguagesData;

const Translator = () => {
  const recognitionRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [voices, setVoices] = useState([]);

  const [sourceLanguage, setSourceLanguage] = useState('ta-IN'); // Default source: Tamil (India)
  const [targetLanguage, setTargetLanguage] = useState('en-US'); // Default target: English (US)

  const [error, setError] = useState(null);

  // Use supported languages instead of deriving from voices
  const availableLanguages = supportedLanguages.sort((a, b) => a.label.localeCompare(b.label));

  const activeLanguage = availableLanguages.find(({ lang }) => sourceLanguage === lang);
  
  useEffect(() => {
    console.log('Available Languages:', availableLanguages);
  }, [availableLanguages]);

  // Filter voices based on target language
  const availableVoices = voices.filter(({ lang }) => lang.startsWith(targetLanguage.split('-')[0]));
  const activeVoice =
    availableVoices.find(({ name }) => name.toLowerCase().includes('google')) ||
    availableVoices.find(({ name }) => name.toLowerCase().includes('luciana')) ||
    (availableVoices.length > 0 ? availableVoices[0] : null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    let voicesList = synth.getVoices();
    console.log('Voices available:', voicesList);

    if (voicesList.length > 0) {
      setVoices(voicesList);
      return;
    }
    if ('onvoiceschanged' in synth) {
      synth.onvoiceschanged = () => {
        voicesList = synth.getVoices();
        console.log('Voices changed:', voicesList);
        setVoices(voicesList);
      };
    }
  }, []);

  const handleOnRecord = () => {
    if (isActive) {
      recognitionRef.current.stop();
      setIsActive(false);
      return;
    }

    speak(' '); // Initialize speech synthesis

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition API');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = sourceLanguage;

    recognitionRef.current.onstart = () => {
      setIsActive(true);
    };

    recognitionRef.current.onend = () => {
      setIsActive(false);
    };

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: transcript,
            targetLanguage: targetLanguage.split('-')[0] // e.g., 'en' from 'en-US'
          })
        });

        const results = await response.json();

        if (response.ok) {
          setTranslation(results.text);
          speak(results.text);
          setError(null);
        } else {
          console.error('Translation error:', results.error);
          setError(results.error || 'Translation failed. Please try again.');
        }
      } catch (error) {
        console.error('Error translating text:', error);
        setError('An error occurred during translation.');
      }
    };

    recognitionRef.current.start();
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    if (activeVoice) {
      utterance.voice = activeVoice;
    } else {
      console.warn(`No voice available for language: ${targetLanguage}. Using default voice.`);
      // Optionally, notify the user
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mt-12 px-4">
      <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
    



        {/* Controls */}
        <div className="bg-zinc-800 p-4">
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
            {/* Source Language Selection */}
            <div>
              <label className="block text-zinc-500 text-[.6rem] uppercase font-bold mb-1">
                Source Language
              </label>
              <select
                className="w-full text-[.7rem] rounded-sm border-zinc-300 px-2 py-1 pr-7"
                name="sourceLanguage"
                value={sourceLanguage}
                onChange={(event) => setSourceLanguage(event.target.value)}
              >
                {availableLanguages.map(({ lang, label }) => (
                  <option key={lang} value={lang}>
                    {label} ({lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Language Selection */}
            <div>
              <label className="block text-zinc-500 text-[.6rem] uppercase font-bold mb-1">
                Target Language
              </label>
              <select
                className="w-full text-[.7rem] rounded-sm border-zinc-300 px-2 py-1 pr-7"
                name="targetLanguage"
                value={targetLanguage}
                onChange={(event) => setTargetLanguage(event.target.value)}
              >
                {availableLanguages.map(({ lang, label }) => (
                  <option key={lang} value={lang}>
                    {label} ({lang})
                  </option>
                ))}
              </select>
            </div>

            {/* Record Button */}
            <p className="sm:col-span-2">
              <button
                className={`w-full h-full uppercase font-semibold text-sm ${
                  isActive
                    ? 'text-white bg-red-500'
                    : 'text-zinc-400 bg-zinc-900'
                } py-3 rounded-sm`}
                onClick={handleOnRecord}
              >
                {isActive ? 'Stop' : 'Record'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Display Error */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Results */}
      <div className="max-w-lg mx-auto mt-12">
        <p className="mb-4">
          <strong>Spoken Text:</strong> {text}
        </p>
        <p>
          <strong>Translation:</strong> {translation}
        </p>
      </div>
    </div>
  );
};

export default Translator;
