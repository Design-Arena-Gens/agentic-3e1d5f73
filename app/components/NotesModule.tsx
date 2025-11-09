'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaMicrophone, FaTrash, FaEdit } from 'react-icons/fa';

interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  date: string;
}

interface NotesModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function NotesModule({ voiceEnabled, speak }: NotesModuleProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', subject: '', content: '' });
  const [isListening, setIsListening] = useState(false);

  const subjects = ['All', 'Math', 'Science', 'History', 'English', 'Gujarati', 'Computer'];

  useEffect(() => {
    const saved = localStorage.getItem('sahpathi-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('sahpathi-notes', JSON.stringify(notes));
    }
  }, [notes]);

  const startVoiceInput = (field: 'title' | 'content') => {
    if (!('webkitSpeechRecognition' in window)) {
      speak("Voice input not supported in this browser");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      speak(`Speak your ${field}`);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, [field]: transcript }));
      speak(`${field} recorded`);
    };

    recognition.onerror = () => {
      speak("Voice input error");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.content) {
      speak("Please fill all fields");
      return;
    }

    if (editingId) {
      setNotes(notes.map(note =>
        note.id === editingId
          ? { ...note, ...formData }
          : note
      ));
      speak("Note updated");
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toLocaleDateString(),
      };
      setNotes([newNote, ...notes]);
      speak("Note added");
    }

    setFormData({ title: '', subject: '', content: '' });
    setIsAdding(false);
  };

  const handleEdit = (note: Note) => {
    setFormData({ title: note.title, subject: note.subject, content: note.content });
    setEditingId(note.id);
    setIsAdding(true);
    if (voiceEnabled) speak("Editing note");
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (voiceEnabled) speak("Note deleted");
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6 flex items-center gap-3">
        📘 Notes
      </h1>

      {/* Search and Filter */}
      <div className="accessible-card mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl"
              aria-label="Search notes"
            />
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              if (voiceEnabled) speak("Add new note");
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center gap-2 justify-center"
            aria-label="Add new note"
          >
            <FaPlus aria-hidden="true" /> Add Note
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => {
                setSelectedSubject(subject);
                if (voiceEnabled) speak(`Filter by ${subject}`);
              }}
              className={`px-4 py-2 rounded-full font-medium ${
                selectedSubject === subject
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              aria-label={`Filter by ${subject}`}
              aria-pressed={selectedSubject === subject}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="accessible-card mb-6">
          <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Note' : 'New Note'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl"
                  aria-label="Note title"
                />
                <button
                  onClick={() => startVoiceInput('title')}
                  className={`px-4 py-3 rounded-xl ${isListening ? 'bg-red-500' : 'bg-indigo-600'} text-white`}
                  aria-label="Voice input for title"
                >
                  <FaMicrophone aria-hidden="true" />
                </button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                aria-label="Note subject"
              >
                <option value="">Select Subject</option>
                {subjects.filter(s => s !== 'All').map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Content</label>
              <div className="flex flex-col gap-2">
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl h-32"
                  aria-label="Note content"
                />
                <button
                  onClick={() => startVoiceInput('content')}
                  className={`self-end px-4 py-3 rounded-xl ${isListening ? 'bg-red-500' : 'bg-indigo-600'} text-white flex items-center gap-2`}
                  aria-label="Voice input for content"
                >
                  <FaMicrophone aria-hidden="true" /> {isListening ? 'Listening...' : 'Voice Input'}
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
                aria-label="Save note"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ title: '', subject: '', content: '' });
                  if (voiceEnabled) speak("Cancelled");
                }}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
                aria-label="Cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="accessible-card text-center text-gray-500 py-12">
            <p className="text-xl">No notes found. Create your first note!</p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="accessible-card">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{note.title}</h3>
                  <div className="flex gap-3 mt-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {note.subject}
                    </span>
                    <span className="text-gray-500 text-sm">{note.date}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl"
                    aria-label={`Edit ${note.title}`}
                  >
                    <FaEdit aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl"
                    aria-label={`Delete ${note.title}`}
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
