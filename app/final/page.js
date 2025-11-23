"use client";
import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import languageCodesData from '../data/language-codes.json';
import supportedLanguagesData from '../data/supported-languages.json';
import TextToSpeech from '../components/Tts'; // Ensure your TTS component is correct.

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
  const [info, setInfo] = useState({ /* your initial data */ });
  const [loading, setLoading] = useState(true);

  const availableLanguages = supportedLanguages.sort((a, b) => a.label.localeCompare(b.label));
  const activeVoice = voices.find(({ lang }) => lang.startsWith(sourceLanguage.split('-')[0]));

  // // Fetch Firebase Data
  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchFirebaseData = async () => {
  //     try {
  //       const response = await fetch("/api/firebase"); // Ensure correct API route
  //       const data = await response.json();

  //       if (isMounted) {
  //         setInfo(data); // Set the data from Firebase
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       if (isMounted) {
  //         setError('Failed to fetch data from Firebase.');
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchFirebaseData();
  //   const intervalId = setInterval(fetchFirebaseData, 30000);

  //   return () => {
  //     clearInterval(intervalId);
  //     isMounted = false;
  //   };
  // }, []);

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

    recognitionRef.current.onstart = () => setIsActive(true);
    recognitionRef.current.onend = () => setIsActive(false);

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      await handleTranslation(transcript);
    };

    recognitionRef.current.start();
  };

  const handleTranslation = async (textToTranslate) => {
    if (!textToTranslate) return;

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        runChat(englishText);
      } else {
        setError(results.error || 'Translation failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during translation.');
    }
  };

  const runChat = async (prompt) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const fullPrompt = `
      Contextual Information:
      You are developing an AI-driven dynamic public transportation scheduler aimed at efficiently managing public transportation in urban areas. The platform is designed to autonomously schedule and dispatch public transport vehicles, ensuring dynamic adaptability and optimized efficiency.

      Problem Statement:
      As urban populations grow, managing public transportation to meet dynamic demand becomes increasingly complex. Traditional scheduling systems often struggle to adapt to real-time fluctuations in commuter demand, traffic conditions, or unscheduled events like concerts, sports matches, and road closures. This can lead to:
      - Overcrowded buses or trains
      - Under-utilized vehicles
      - Longer commute times and delays
      These inefficiencies affect both commuters and transportation authorities, highlighting the need for an intelligent, adaptive system for real-time scheduling and routing.

      Solution Overview:
      The platform should autonomously manage the scheduling, routing, and dispatching of public transportation vehicles (e.g., buses, trains) based on real-time data and predictive insights. It should:
      - Predict commuter demand using historical and live data across routes
      - Adapt scheduling in real-time based on live traffic conditions and events
      - Optimize routing and dispatching to minimize congestion, reduce wait times, and balance vehicle utilization

      Objectives:
      1. **Real-Time Commuter Demand Prediction**: 
         Use AI/ML algorithms to predict commuter demand based on historical patterns, seasonal trends, and real-time data (e.g., weather, events, traffic data).
      2. **Dynamic Scheduling and Routing**: 
         Continuously adjust transport schedules and routes based on live traffic conditions and known events (e.g., concerts, sports events, road closures).
      3. **Optimization of Dispatching**: 
         Maximize vehicle utilization by balancing commuter loads, reducing underutilized runs, and minimizing commuter wait times. 
         Reduce congestion and ensure equitable coverage across urban regions.

      Key Features:
      - **Real-Time Data Integration**: Incorporates traffic data, commuter density, and event information to make data-driven decisions.
      - **Predictive Analytics for Demand Forecasting**: Uses machine learning algorithms for accurate demand predictions.
      - **Adaptive Scheduling & Routing**: Uses AI to dynamically adjust vehicle deployment and routes.
      - **Event Awareness**: Automatically adjusts based on both scheduled (e.g., concerts) and unexpected events (e.g., road closures).
      - **Optimization Engine**: Ensures optimal vehicle dispatching to balance demand and minimize commuter wait times.

      Task: You are Passenger Buddy, a chatbot and travel planner. Your goal is to provide optimized public transport recommendations for the user. For example, when asked about traveling to Tirupati, you should recommend the best modes of transport (bus, car, train), providing details like:
      - Cost
      - Distance
      - Time
      - Non-rush days (like festivals or accidents)
      - Bus or train numbers with timing details

      You should provide responses in a friendly, descriptive manner, ensuring they are clear and suitable for text-to-speech, without using special characters like "*". Always give concise yet comprehensive answers.

      User Input: "${prompt}"
    `;

    
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      // Your safety settings here
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{
            text: "I want to travel to Tirupati. Can you suggest the best way to travel? Include information about buses, trains, cost, and time. Also, consider festivals and rush days."
          }]
        },
        {
          role: "model", 
          parts: [{ text: "Hello, I am Passenger Buddy. Where are you planning to travel?" }] 
        },
      ],
    });

    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    setTranslatedText(response.text());

    // Automatically translate AI response back to the source language
    translateAIResponse(response.text());
  };

  const translateAIResponse = async (aiText) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: aiText,
          targetLanguage: sourceLanguage.split('-')[0] // Translate back to the user's source language
        })
      });

      const results = await response.json();
      if (response.ok) {
        setTranslatedText(results.text.replace(/[*]/g, ''));
        // Automatically speak the result
        // speak(results.text); // Speak the final translated output
        
      } else {
        console.error('Translation error for AI response:', results.error);
      }
    } catch (error) {
      console.error('Error translating AI response:', error);
    }
  };

  const speak = async (text) => {
    if (!text) return;

    // Attempt to find a voice that matches the source language
    const utterance = new SpeechSynthesisUtterance(text);
    if (activeVoice) {
      utterance.voice = activeVoice;
    } else {
      console.warn(`No voice available for language: ${sourceLanguage}. Falling back to API-based speech synthesis.`);
    }

    window.speechSynthesis.speak(utterance);
  };

  // if (loading) return <p>Loading Firebase Data...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <main className="flex flex-col items-center p-24">
      <div className="mt-12 px-4">
        <div className="max-w-lg rounded-xl overflow-hidden mx-auto">
          <div className="bg-zinc-800 p-4">
            <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
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

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="max-w-lg mx-auto mt-12">
          <p className="mb-4"><strong>Your's chat:</strong> {text}</p>
        </div>

        {translatedText && (
          <div>
            <h1 className="mt-32">Passenger Buddy's reply:</h1>
            <div dangerouslySetInnerHTML={{ __html: translatedText }} />
            <TextToSpeech text={translatedText}/>
          </div>
        )}
      </div>
    </main>
  );
};

export default TranslationPage;
