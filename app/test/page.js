// components/TranslationPage.js

"use client";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { useState, useEffect, useRef } from 'react';
import languageCodesData from '../data/language-codes.json';
import supportedLanguagesData from '../data/supported-languages.json';

const languageCodes = languageCodesData;
const supportedLanguages = supportedLanguagesData;

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyBJ3h_osEPJQHssS_3_IjmVjEAtfLR9RCg";

const TranslationPage = () => {
  const recognitionRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [voices, setVoices] = useState([]);
  const [sourceLanguage, setSourceLanguage] = useState('ta-IN'); // Default source: Tamil (India)
  const [error, setError] = useState(null);
  const [data, setData] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const availableLanguages = supportedLanguages.sort((a, b) => a.label.localeCompare(b.label));
  const activeVoice = voices.find(({ lang }) => lang.startsWith(sourceLanguage.split('-')[0]));

  useEffect(() => {
    const synth = window.speechSynthesis;
    let voicesList = synth.getVoices();
    
    if (voicesList.length > 0) {
      setVoices(voicesList);
      return;
    }
    if ('onvoiceschanged' in synth) {
      synth.onvoiceschanged = () => {
        voicesList = synth.getVoices();
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
      await handleTranslation(transcript);
    };

    recognitionRef.current.start();
  };

  const speak = (text) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (activeVoice) {
      utterance.voice = activeVoice;
    } else {
      console.warn(`No voice available for language: ${sourceLanguage}. Using default voice.`);
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleTranslation = async (textToTranslate) => {
    if (!textToTranslate) return;

    try {
      // Step 1: Translate spoken text to English
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textToTranslate,
          targetLanguage: 'en' // Always translate to English
        })
      });

      const results = await response.json();
      if (response.ok) {
        const englishText = results.text;
        setTranslation(englishText);
        // speak(englishText); // Speak the English translation
        setError(null);

        // Step 2: Run AI chat with the translated text
        runChat(englishText);
      } else {
        console.error('Translation error:', results.error);
        setError(results.error || 'Translation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error translating text:', error);
      setError('An error occurred during translation.');
    }
  };

  const runChat = async (prompt) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        { role: "user", parts: [{ text: "HELLO" }] },
        { role: "model", parts: [{ text: "Hello there! How can I assist you today?" }] },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    setData(response.text());

    // Step 3: Translate AI response back to the source language
    translateAIResponse(response.text());
  };

  const translateAIResponse = async (aiText) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: aiText,
          targetLanguage: sourceLanguage.split('-')[0] // Translate back to the user's source language
        })
      });

      const results = await response.json();
      if (response.ok) {
        setTranslatedText(results.text);
        speak(results.text); // Speak the final translated output
      } else {
        console.error('Translation error for AI response:', results.error);
      }
    } catch (error) {
      console.error('Error translating AI response:', error);
    }
  };

  return (
    <main className="flex flex-col items-center p-24">
      <div className="mt-12 px-4">
        <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
          <div className="bg-zinc-800 p-4">
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
              {/* Source Language Selection */}
              <div>
                <label className="block text-zinc-500 text-[.6rem] uppercase font-bold mb-1">Source Language</label>
                <select
                  className="w-full text-[.7rem] rounded-sm border-zinc-300 px-2 py-1 pr-7"
                  name="sourceLanguage"
                  value={sourceLanguage}
                  onChange={(event) => setSourceLanguage(event.target.value)}
                >
                  {availableLanguages.map(({ lang, label }) => (
                    <option key={lang} value={lang}>{label} ({lang})</option>
                  ))}
                </select>
              </div>

              {/* Record Button */}
              <p className="sm:col-span-2">
                <button
                  className={`w-full h-full uppercase font-semibold text-sm ${isActive ? 'text-white bg-red-500' : 'text-zinc-400 bg-zinc-900'} py-3 rounded-sm`}
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
          <p className="mb-4"><strong>Spoken Text:</strong> {text}</p>
        </div>

        {translatedText && (
          <div>
            <h1 className="mt-32">Final AI Output</h1>
            <div dangerouslySetInnerHTML={{ __html: translatedText }} />
          </div>
        )}
      </div>
    </main>
  );
};

export default TranslationPage;
