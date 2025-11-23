"use client"
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
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
  const [translatedText, setTranslatedText] = useState("");
  const [info, setInfo] = useState({
    "conductivity": 1080,
    "gas": 27.165,
    "humidity": 63.66555,
    "moisture": 31.3,
    "nitrogen": 76,
    "pH": 6.73,
    "phosphorus": 107,
    "potassium": 214,
    "pressure": 1004.97998,
    "soilTemperature": 26.9,
    "temperature": 28.79594
  }); // Initially empty info
  const [loading, setLoading] = useState(true);

  const availableLanguages = supportedLanguages.sort((a, b) => a.label.localeCompare(b.label));
  const activeVoice = voices.find(({ lang }) => lang.startsWith(sourceLanguage.split('-')[0]));

  // Fetch Firebase Data
  useEffect(() => {
    let isMounted = true;

    const fetchFirebaseData = async () => {
      try {
        const response = await fetch("/api/firebase"); // Ensure correct API route
        const data = await response.json();

        if (isMounted) {
          setInfo(data); // Set the data from Firebase
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch data from Firebase.');
          setLoading(false);
        }
      }
    };

    fetchFirebaseData();

    // Polling Firebase data every 30 seconds
    const intervalId = setInterval(() => {
      fetchFirebaseData();
    }, 30000);

    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, []);

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

  // const speak = (text) => {
  //   if (!text) return;

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   if (activeVoice) {
  //     utterance.voice = activeVoice;
  //   } else {
  //     console.warn(`No voice available for language: ${sourceLanguage}. Using default voice.`);
  //   }

  //   window.speechSynthesis.speak(utterance);
  // };

  const handleTranslation = async (textToTranslate) => {
    if (!textToTranslate) return;

    try {
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
        setError(null);

        // Step 2: Run AI chat with the translated text
        runChat(englishText);
      } else {
        setError(results.error || 'Translation failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during translation.');
    }
  };
  const speak = async (text) => {
    if (!text) return;
  
    // Attempt to find a voice that matches the source language
    const utterance = new SpeechSynthesisUtterance(text);
    if (activeVoice) {
      utterance.voice = activeVoice;
      window.speechSynthesis.speak(utterance);
      return;
    }
  
    console.warn(`No voice available for language: ${sourceLanguage}. Falling back to API-based speech synthesis.`);
  
    try {
      // Make a request to the /api/speak endpoint
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          language: sourceLanguage // e.g., 'ta-IN' for Tamil
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch synthesized speech from API.');
      }
  
      const { audioUrl } = await response.json();
  
      // Create an audio element to play the synthesized speech
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error during API-based speech synthesis:', error);
      alert('Unable to synthesize speech at this time.');
    }
  };
  

  const runChat = async (prompt) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const fullPrompt = `
      Contextual Information:
      Consider the following soil and environmental data while formulating your responses:
      ${JSON.stringify(info)}

      User Input: "${prompt}"
    `;
    
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
        {
          role: "user",
          parts: [{
            text: 
 `             You are developing an interactive chatbot named Kibo that embodies the essence of nature. Your responses should be engaging, friendly, and reflect a deep connection to the environment. The challenge is to respond meaningfully to agricultural data inputs while promoting sustainable farming practices.

              User Queries: 
              The user will provide information about soil and weather conditions, such as nitrogen, phosphorus, potassium levels, pH, EC, temperature, humidity, pressure, and gas levels. 

              Response Guidelines: 
              - Express emotions related to the health of crops and the environment.
              - Use relatable language, including metaphors related to nature.
              - Offer personalized recommendations for crop management, disease identification, and weather predictions.
              - If the soil is well-nourished, say something like, "I am happy! I have received sufficient nutrition and water!" If the soil is dry, express thirst, saying, "I am thirsty, please give me water!"
            `
          }]
        },
        { 
          role: "model", 
          parts: [{ text: "ok now onwards i am kibo, i act like a nature's soul,Hello, I am Kibo, your nature-friendly assistant! How can I help you today?" }] 
        },
      ],
    });



    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    setTranslatedText(response.text());

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

  if (loading) return <p>Loading Firebase Data...</p>;
  if (error) return <p>Error: {error}</p>;

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
          <p className="mb-4"><strong>Your's chat:</strong> {text}</p>
        </div>

        {translatedText && (
          <div>
            <h1 className="mt-32">Kibo's reply:</h1>
            <div dangerouslySetInnerHTML={{ __html: translatedText }} />
          </div>
        )}
      </div>
    </main>
  );
};

export default TranslationPage;
