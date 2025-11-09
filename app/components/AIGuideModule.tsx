'use client';

import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaBook, FaHeart } from 'react-icons/fa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface AIGuideModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function AIGuideModule({ voiceEnabled, speak }: AIGuideModuleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studyTips = [
    "Use the Pomodoro Technique: Study for 25 minutes, then take a 5-minute break.",
    "Create mind maps to visualize connections between concepts.",
    "Teach what you learn to someone else - it helps you understand better!",
    "Take regular breaks and stay hydrated while studying.",
    "Use flashcards for memorization - repetition is key!",
    "Study in a quiet, well-lit environment free from distractions.",
    "Break down large topics into smaller, manageable chunks.",
    "Practice active recall by testing yourself regularly.",
  ];

  const emotionalSupport = [
    "You're doing great! Remember, progress is progress no matter how small. 💪",
    "It's okay to feel overwhelmed sometimes. Take a deep breath and tackle one thing at a time. 🌟",
    "You're capable of amazing things! Believe in yourself. ✨",
    "Every expert was once a beginner. Keep learning and growing! 🌱",
    "Your effort matters more than perfection. Keep going! 🎯",
    "Remember to be kind to yourself. You're doing your best! 💖",
  ];

  const quickActions = [
    { icon: FaBook, label: "Study Tips", prompt: "Give me a study tip" },
    { icon: FaHeart, label: "Need Support", prompt: "I need some encouragement" },
    { icon: FaLightbulb, label: "Explain Topic", prompt: "Can you explain [topic] in simple terms?" },
  ];

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm your AI Study Guide. I'm here to help you with study tips, explain concepts, and provide emotional support. How can I assist you today? 😊",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([welcomeMessage]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('sahpathi-chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('sahpathi-chat', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Study tips
    if (lowerMessage.includes('study') || lowerMessage.includes('tip') || lowerMessage.includes('learn')) {
      return studyTips[Math.floor(Math.random() * studyTips.length)];
    }

    // Emotional support
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') ||
        lowerMessage.includes('overwhelm') || lowerMessage.includes('difficult') ||
        lowerMessage.includes('hard') || lowerMessage.includes('encourage') ||
        lowerMessage.includes('sad') || lowerMessage.includes('help')) {
      return emotionalSupport[Math.floor(Math.random() * emotionalSupport.length)];
    }

    // Math help
    if (lowerMessage.includes('math') || lowerMessage.includes('calculation')) {
      return "For math problems, try breaking them down step by step:\n\n1. Read the problem carefully\n2. Identify what you know and what you need to find\n3. Choose the right formula or method\n4. Solve step by step\n5. Check your answer\n\nWould you like to try a specific problem together?";
    }

    // Science help
    if (lowerMessage.includes('science') || lowerMessage.includes('experiment')) {
      return "Science is all about observation and curiosity! Here are some tips:\n\n• Always ask 'why' and 'how'\n• Use diagrams to visualize concepts\n• Connect new concepts to real-life examples\n• Practice explaining concepts in your own words\n\nWhat science topic would you like to explore?";
    }

    // Time management
    if (lowerMessage.includes('time') || lowerMessage.includes('schedule') || lowerMessage.includes('manage')) {
      return "Time management is crucial! Try these strategies:\n\n✓ Use a daily planner or calendar\n✓ Prioritize tasks by importance\n✓ Set realistic goals\n✓ Avoid multitasking\n✓ Take regular breaks\n\nWould you like help creating a study schedule?";
    }

    // Memory techniques
    if (lowerMessage.includes('memory') || lowerMessage.includes('remember') || lowerMessage.includes('forget')) {
      return "Here are effective memory techniques:\n\n🧠 Mnemonics - Create acronyms or phrases\n🔄 Spaced repetition - Review regularly\n🖼️ Visual associations - Link info to images\n📝 Write it down - Engages different senses\n🗣️ Teach others - Reinforces learning\n\nWhich technique would you like to try?";
    }

    // Exam preparation
    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('prepare')) {
      return "Exam preparation checklist:\n\n📚 Review all materials 1-2 weeks before\n✍️ Practice with past papers\n👥 Study with friends for discussion\n💤 Get good sleep before the exam\n🍎 Eat a healthy breakfast\n⏰ Arrive early to reduce stress\n\nYou've got this! What subject is your exam?";
    }

    // Reading comprehension
    if (lowerMessage.includes('read') || lowerMessage.includes('book') || lowerMessage.includes('comprehension')) {
      return "Improve reading comprehension:\n\n1. Preview the text (headings, images)\n2. Ask questions before reading\n3. Highlight key points\n4. Take notes in margins\n5. Summarize each section\n6. Review and reflect\n\nReading actively helps you understand and remember better!";
    }

    // Motivation
    if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('give up')) {
      return "Remember why you started! 🌟\n\n• Every challenge makes you stronger\n• Mistakes are learning opportunities\n• Your future self will thank you\n• Compare yourself to yesterday, not others\n• Celebrate small wins\n\nYou're capable of more than you think! What's one small thing you can do today?";
    }

    // Concentration
    if (lowerMessage.includes('focus') || lowerMessage.includes('concentrat') || lowerMessage.includes('distract')) {
      return "Boost your concentration:\n\n🔕 Turn off notifications\n🎵 Try background music (instrumental)\n🪴 Keep your study space organized\n⏲️ Use timers (Pomodoro technique)\n🧘 Take mindful breaks\n💧 Stay hydrated\n\nWhat usually distracts you the most?";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! Could you tell me more about what you'd like to know?",
      "I'd be happy to help! Can you provide more details about your question?",
      "Great question! What specific aspect would you like me to focus on?",
      "I'm here to support you! Would you like study tips, concept explanations, or encouragement?",
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    if (voiceEnabled) {
      speak("Processing your message");
    }

    // Simulate AI thinking time
    setTimeout(() => {
      const responseText = generateResponse(textToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (voiceEnabled) {
        speak(responseText);
      }
    }, 1000 + Math.random() * 1000);
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "Chat cleared! How can I help you? 😊",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem('sahpathi-chat');
    if (voiceEnabled) speak("Chat cleared");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        🤖 AI Study Guide
      </h1>

      {/* Controls */}
      <div className="accessible-card mb-4 flex flex-wrap gap-4 items-center justify-between">
        <button
          onClick={() => {
            setSimplifiedMode(!simplifiedMode);
            if (voiceEnabled) speak(simplifiedMode ? "Normal mode" : "Simplified mode");
          }}
          className={`px-4 py-2 rounded-xl font-medium ${
            simplifiedMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          aria-label="Toggle simplified mode"
          aria-pressed={simplifiedMode}
        >
          {simplifiedMode ? '🧠 Simplified Mode' : '🎓 Normal Mode'}
        </button>

        <button
          onClick={clearChat}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
          aria-label="Clear chat history"
        >
          Clear Chat
        </button>
      </div>

      {/* Quick Actions */}
      <div className="accessible-card mb-4">
        <h2 className="font-bold mb-3">Quick Actions:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleSend(action.prompt)}
              className="p-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl flex items-center gap-3 transition-colors"
              aria-label={action.label}
            >
              <action.icon className="text-2xl text-indigo-600" aria-hidden="true" />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="accessible-card h-[500px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender === 'ai' ? 'bg-indigo-600' : 'bg-green-600'
              }`}
              aria-hidden="true">
                {message.sender === 'ai' ? (
                  <FaRobot className="text-white text-xl" />
                ) : (
                  <FaUser className="text-white text-xl" />
                )}
              </div>

              <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'items-end' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'ai'
                    ? 'bg-indigo-100 text-gray-900'
                    : 'bg-green-600 text-white'
                } ${simplifiedMode ? 'dyslexic-text text-lg' : ''}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <FaRobot className="text-white text-xl" aria-hidden="true" />
              </div>
              <div className="bg-indigo-100 px-4 py-3 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t-2 border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl"
              aria-label="Type your message"
            />
            <button
              onClick={() => handleSend()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2"
              aria-label="Send message"
            >
              <FaPaperPlane aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-4 accessible-card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <p className="text-sm">
          💡 <strong>Tip:</strong> This AI Guide provides helpful suggestions and encouragement.
          For complex homework problems, always verify answers with your teacher or textbook!
        </p>
      </div>
    </div>
  );
}
