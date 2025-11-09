'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaCheck, FaTrash, FaStar, FaBell } from 'react-icons/fa';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface TodoModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function TodoModule({ voiceEnabled, speak }: TodoModuleProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const motivationalQuotes = [
    "You're doing great! Keep going! 🌟",
    "Every task completed is a step forward! 💪",
    "Believe in yourself! You've got this! ✨",
    "Small progress is still progress! 🎯",
    "You're making excellent progress today! 🚀"
  ];

  useEffect(() => {
    const saved = localStorage.getItem('sahpathi-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('sahpathi-todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) {
      speak("Please enter a task");
      return;
    }

    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority,
      dueDate,
    };

    setTodos([todo, ...todos]);
    setNewTodo('');
    setDueDate('');
    setPriority('medium');

    if (voiceEnabled) {
      speak("Task added");
      // Haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    if (todo && !todo.completed) {
      const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
      if (voiceEnabled) {
        speak(`Task completed! ${quote}`);
      }
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
    if (voiceEnabled) speak("Task deleted");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-green-600 mb-6 flex items-center gap-3">
        ✅ ToDo Manager
      </h1>

      {/* Progress Bar */}
      <div className="accessible-card mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Today&apos;s Progress</span>
          <span className="text-lg font-bold text-green-600">
            {completedCount} / {totalCount} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress: ${completedCount} out of ${totalCount} tasks completed`}
          />
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="accessible-card mb-6">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Task Description</label>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
              aria-label="New task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                aria-label="Task priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Due Date (Optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                aria-label="Due date"
              />
            </div>
          </div>

          <button
            onClick={addTodo}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 text-lg font-medium"
            aria-label="Add task"
          >
            <FaPlus aria-hidden="true" /> Add Task
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {(['all', 'active', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              if (voiceEnabled) speak(`Showing ${f} tasks`);
            }}
            className={`flex-1 px-4 py-3 rounded-xl font-medium ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            aria-label={`Show ${f} tasks`}
            aria-pressed={filter === f}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Todos List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="accessible-card text-center text-gray-500 py-12">
            <p className="text-xl">
              {filter === 'completed' ? 'No completed tasks yet' :
               filter === 'active' ? 'No active tasks! Great job! 🎉' :
               'No tasks yet. Add your first task!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`accessible-card flex items-center gap-4 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-400'
                }`}
                aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                aria-pressed={todo.completed}
              >
                {todo.completed && <FaCheck className="text-white" aria-hidden="true" />}
              </button>

              <div className="flex-1">
                <p className={`text-lg ${todo.completed ? 'line-through' : ''}`}>
                  {todo.text}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getPriorityColor(todo.priority)}`}>
                    <FaStar className="inline mr-1" aria-hidden="true" />
                    {todo.priority} priority
                  </span>
                  {todo.dueDate && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <FaBell className="inline mr-1" aria-hidden="true" />
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 p-3 text-red-600 hover:bg-red-50 rounded-xl"
                aria-label={`Delete task: ${todo.text}`}
              >
                <FaTrash aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Motivational Banner */}
      {completedCount > 0 && (
        <div className="mt-6 accessible-card bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-6">
          <p className="text-2xl font-bold">
            {motivationalQuotes[completedCount % motivationalQuotes.length]}
          </p>
        </div>
      )}
    </div>
  );
}
