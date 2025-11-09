'use client';

import { useState, useEffect } from 'react';
import {
  FaBook, FaCheckSquare, FaCalendarAlt, FaBookOpen,
  FaRobot, FaMapMarkerAlt, FaMicrophone, FaTextHeight,
  FaVolumeUp, FaUniversalAccess
} from 'react-icons/fa';
import NotesModule from './components/NotesModule';
import TodoModule from './components/TodoModule';
import CalendarModule from './components/CalendarModule';
import FlipDiaryModule from './components/FlipDiaryModule';
import AIGuideModule from './components/AIGuideModule';
import NearbyExplorerModule from './components/NearbyExplorerModule';

type ModuleName = 'notes' | 'todo' | 'calendar' | 'diary' | 'ai' | 'nearby' | null;

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleName>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(16);

  useEffect(() => {
    if (voiceEnabled) {
      speak("Welcome to Sahpathi App. Your accessible learning companion.");
    }
  }, [voiceEnabled]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleModuleClick = (module: ModuleName, moduleName: string) => {
    setActiveModule(module);
    if (voiceEnabled) {
      speak(`Opening ${moduleName}`);
    }
  };

  const modules = [
    { id: 'notes' as ModuleName, name: 'Notes', icon: FaBook, color: 'bg-blue-500', description: 'Organize by subject' },
    { id: 'todo' as ModuleName, name: 'ToDo', icon: FaCheckSquare, color: 'bg-green-500', description: 'Task manager' },
    { id: 'calendar' as ModuleName, name: 'Calendar', icon: FaCalendarAlt, color: 'bg-purple-500', description: 'Events & exams' },
    { id: 'diary' as ModuleName, name: 'FlipDiary', icon: FaBookOpen, color: 'bg-pink-500', description: 'Emotional journal' },
    { id: 'ai' as ModuleName, name: 'AI Guide', icon: FaRobot, color: 'bg-indigo-500', description: 'Study assistant' },
    { id: 'nearby' as ModuleName, name: 'Nearby Explorer', icon: FaMapMarkerAlt, color: 'bg-teal-500', description: 'Discover places' },
  ];

  if (activeModule) {
    return (
      <div className={`${dyslexicFont ? 'dyslexic-text' : ''} ${highContrast ? 'contrast-150' : ''}`}
           style={{ fontSize: `${textSize}px` }}>
        <div className="min-h-screen p-4">
          <button
            onClick={() => {
              setActiveModule(null);
              if (voiceEnabled) speak("Returning to home");
            }}
            className="mb-4 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 text-lg"
            aria-label="Go back to home"
          >
            ← Back
          </button>
          {activeModule === 'notes' && <NotesModule voiceEnabled={voiceEnabled} speak={speak} />}
          {activeModule === 'todo' && <TodoModule voiceEnabled={voiceEnabled} speak={speak} />}
          {activeModule === 'calendar' && <CalendarModule voiceEnabled={voiceEnabled} speak={speak} />}
          {activeModule === 'diary' && <FlipDiaryModule voiceEnabled={voiceEnabled} speak={speak} />}
          {activeModule === 'ai' && <AIGuideModule voiceEnabled={voiceEnabled} speak={speak} />}
          {activeModule === 'nearby' && <NearbyExplorerModule voiceEnabled={voiceEnabled} speak={speak} />}
        </div>
      </div>
    );
  }

  return (
    <div className={`${dyslexicFont ? 'dyslexic-text' : ''} ${highContrast ? 'contrast-150' : ''}`}
         style={{ fontSize: `${textSize}px` }}>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-600 mb-3 flex items-center justify-center gap-3">
            <FaUniversalAccess className="text-4xl" aria-hidden="true" />
            SahpathiApp
          </h1>
          <p className="text-xl text-gray-600">Your Accessible Learning Companion</p>
        </div>

        {/* Accessibility Controls */}
        <div className="accessible-card mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaUniversalAccess aria-hidden="true" />
            Accessibility Settings
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                speak(voiceEnabled ? "Voice disabled" : "Voice enabled");
              }}
              className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${
                voiceEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              aria-label={`Voice control ${voiceEnabled ? 'enabled' : 'disabled'}`}
              aria-pressed={voiceEnabled}
            >
              <FaVolumeUp aria-hidden="true" />
              Voice Control
            </button>

            <button
              onClick={() => {
                setDyslexicFont(!dyslexicFont);
                if (voiceEnabled) speak(dyslexicFont ? "Regular font" : "Dyslexic friendly font");
              }}
              className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${
                dyslexicFont ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              aria-label={`Dyslexic font ${dyslexicFont ? 'enabled' : 'disabled'}`}
              aria-pressed={dyslexicFont}
            >
              <FaTextHeight aria-hidden="true" />
              Dyslexic Font
            </button>

            <button
              onClick={() => {
                setHighContrast(!highContrast);
                if (voiceEnabled) speak(highContrast ? "Normal contrast" : "High contrast");
              }}
              className={`px-6 py-3 rounded-full font-medium ${
                highContrast ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
              }`}
              aria-label={`High contrast ${highContrast ? 'enabled' : 'disabled'}`}
              aria-pressed={highContrast}
            >
              High Contrast
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newSize = Math.max(12, textSize - 2);
                  setTextSize(newSize);
                  if (voiceEnabled) speak("Text smaller");
                }}
                className="px-4 py-3 bg-gray-200 text-gray-800 rounded-full font-bold"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <span className="text-sm" aria-live="polite">Text Size</span>
              <button
                onClick={() => {
                  const newSize = Math.min(24, textSize + 2);
                  setTextSize(newSize);
                  if (voiceEnabled) speak("Text larger");
                }}
                className="px-4 py-3 bg-gray-200 text-gray-800 rounded-full font-bold"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module.id, module.name)}
              className="accessible-card text-left hover:scale-105 transition-transform"
              aria-label={`Open ${module.name}: ${module.description}`}
            >
              <div className={`${module.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4`}>
                <module.icon className="text-3xl text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{module.name}</h3>
              <p className="text-gray-600">{module.description}</p>
            </button>
          ))}
        </div>

        {/* Features Banner */}
        <div className="mt-12 accessible-card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-2xl font-bold mb-4">♿ Divyang-Friendly Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-lg">
            <li className="flex items-start gap-2">
              <span aria-hidden="true">✓</span>
              <span>Voice-controlled access for mobility-impaired users</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">✓</span>
              <span>Screen reader and zoom tools for visually impaired</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">✓</span>
              <span>Gesture-based interfaces for hearing-impaired</span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">✓</span>
              <span>Dyslexia-friendly fonts and layouts</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
