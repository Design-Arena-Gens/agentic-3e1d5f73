'use client';

import { useState, useEffect } from 'react';
import { FaSmile, FaMeh, FaFrown, FaAngry, FaHeart, FaMicrophone, FaTrash } from 'react-icons/fa';

interface DiaryEntry {
  id: string;
  date: string;
  mood: string;
  content: string;
  emoji: string;
}

interface FlipDiaryModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function FlipDiaryModule({ voiceEnabled, speak }: FlipDiaryModuleProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isListening, setIsListening] = useState(false);

  const moods = [
    { name: 'Happy', emoji: '😊', icon: FaSmile, color: 'bg-yellow-400' },
    { name: 'Calm', emoji: '😌', icon: FaMeh, color: 'bg-blue-400' },
    { name: 'Sad', emoji: '😢', icon: FaFrown, color: 'bg-blue-600' },
    { name: 'Angry', emoji: '😠', icon: FaAngry, color: 'bg-red-500' },
    { name: 'Loved', emoji: '🥰', icon: FaHeart, color: 'bg-pink-500' },
    { name: 'Excited', emoji: '🤩', icon: FaSmile, color: 'bg-purple-500' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('sahpathi-diary');
    if (saved) {
      const loadedEntries = JSON.parse(saved);
      setEntries(loadedEntries);
      if (loadedEntries.length > 0) {
        setCurrentIndex(loadedEntries.length - 1);
      }
    }
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('sahpathi-diary', JSON.stringify(entries));
    }
  }, [entries]);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      speak("Voice input not supported");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      speak("Listening to your diary entry");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setNewEntry(prev => prev + ' ' + transcript);
    };

    recognition.onerror = () => {
      speak("Voice input error");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (isListening) {
        recognition.stop();
      }
    }, 30000);
  };

  const handleSave = () => {
    if (!newEntry.trim() || !selectedMood) {
      speak("Please select a mood and write something");
      return;
    }

    const mood = moods.find(m => m.name === selectedMood);
    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      mood: selectedMood,
      emoji: mood?.emoji || '😊',
      content: newEntry,
    };

    setEntries([...entries, entry]);
    setCurrentIndex(entries.length);
    setNewEntry('');
    setSelectedMood('');
    setIsWriting(false);

    if (voiceEnabled) speak("Diary entry saved");
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    if (currentIndex >= newEntries.length) {
      setCurrentIndex(Math.max(0, newEntries.length - 1));
    }
    if (voiceEnabled) speak("Entry deleted");
  };

  const flipNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (voiceEnabled) {
        const entry = entries[currentIndex + 1];
        speak(`Entry from ${entry.date}. Mood: ${entry.mood}`);
      }
    }
  };

  const flipPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (voiceEnabled) {
        const entry = entries[currentIndex - 1];
        speak(`Entry from ${entry.date}. Mood: ${entry.mood}`);
      }
    }
  };

  if (isWriting) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">📖 New Diary Entry</h1>

        <div className="accessible-card">
          <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {moods.map(mood => (
              <button
                key={mood.name}
                onClick={() => {
                  setSelectedMood(mood.name);
                  if (voiceEnabled) speak(`Feeling ${mood.name}`);
                }}
                className={`p-6 rounded-2xl border-4 transition-all ${
                  selectedMood === mood.name
                    ? `${mood.color} border-gray-900 scale-105`
                    : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                }`}
                aria-label={`Mood: ${mood.name}`}
                aria-pressed={selectedMood === mood.name}
              >
                <div className="text-5xl mb-2" aria-hidden="true">{mood.emoji}</div>
                <div className="font-bold text-lg">{mood.name}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-3 text-xl">Write your thoughts...</label>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Dear diary, today I..."
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl h-64 text-lg dyslexic-text"
              aria-label="Diary entry content"
            />
          </div>

          <button
            onClick={startVoiceInput}
            className={`w-full mb-4 px-6 py-4 rounded-2xl text-white flex items-center justify-center gap-3 text-lg font-medium ${
              isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            aria-label={isListening ? 'Listening...' : 'Start voice input'}
          >
            <FaMicrophone aria-hidden="true" />
            {isListening ? 'Listening... (Click to stop)' : 'Speak Your Entry'}
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-4 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 text-lg font-medium"
              aria-label="Save diary entry"
            >
              Save Entry
            </button>
            <button
              onClick={() => {
                setIsWriting(false);
                setNewEntry('');
                setSelectedMood('');
                if (voiceEnabled) speak("Cancelled");
              }}
              className="flex-1 px-6 py-4 bg-gray-300 text-gray-800 rounded-2xl hover:bg-gray-400 text-lg font-medium"
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-600 mb-6 flex items-center gap-3">
        📖 FlipDiary
      </h1>

      <button
        onClick={() => {
          setIsWriting(true);
          if (voiceEnabled) speak("Write new entry");
        }}
        className="w-full mb-6 px-6 py-4 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 flex items-center justify-center gap-2 text-lg font-medium"
        aria-label="Write new diary entry"
      >
        ✏️ Write New Entry
      </button>

      {entries.length === 0 ? (
        <div className="accessible-card text-center text-gray-500 py-20">
          <div className="text-6xl mb-4" aria-hidden="true">📔</div>
          <p className="text-2xl mb-4">Your diary is empty</p>
          <p className="text-lg">Start writing about your day and feelings!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Flip Book View */}
          <div className="accessible-card bg-gradient-to-br from-pink-50 to-purple-50 min-h-[500px] p-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={flipPrev}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                aria-label="Previous entry"
              >
                ← Previous
              </button>

              <div className="text-center">
                <div className="text-6xl mb-2" aria-hidden="true">{entries[currentIndex].emoji}</div>
                <div className="font-bold text-xl text-gray-700">
                  {entries[currentIndex].mood}
                </div>
                <div className="text-gray-500 mt-1">
                  Entry {currentIndex + 1} of {entries.length}
                </div>
              </div>

              <button
                onClick={flipNext}
                disabled={currentIndex === entries.length - 1}
                className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
                aria-label="Next entry"
              >
                Next →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-inner min-h-[300px]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-600">
                  {entries[currentIndex].date}
                </h3>
                <button
                  onClick={() => deleteEntry(entries[currentIndex].id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Delete this entry"
                >
                  <FaTrash aria-hidden="true" />
                </button>
              </div>
              <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap dyslexic-text">
                {entries[currentIndex].content}
              </p>
            </div>
          </div>

          {/* Timeline View */}
          <div className="mt-6 accessible-card">
            <h3 className="text-xl font-bold mb-4">All Entries</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {entries.map((entry, index) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    if (voiceEnabled) speak(`Entry from ${entry.date}`);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    currentIndex === index
                      ? 'border-pink-500 bg-pink-100 scale-105'
                      : 'border-gray-300 hover:border-pink-300'
                  }`}
                  aria-label={`View entry from ${entry.date}, mood: ${entry.mood}`}
                  aria-pressed={currentIndex === index}
                >
                  <div className="text-3xl mb-1" aria-hidden="true">{entry.emoji}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Statistics */}
          <div className="mt-6 accessible-card bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            <h3 className="text-xl font-bold mb-4">Mood Tracker</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map(mood => {
                const count = entries.filter(e => e.mood === mood.name).length;
                return count > 0 ? (
                  <div key={mood.name} className="flex items-center gap-3">
                    <div className="text-3xl" aria-hidden="true">{mood.emoji}</div>
                    <div>
                      <div className="font-bold">{mood.name}</div>
                      <div className="text-sm opacity-90">{count} times</div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
