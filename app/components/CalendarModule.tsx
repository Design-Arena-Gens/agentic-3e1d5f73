'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaBell, FaEdit } from 'react-icons/fa';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'holiday' | 'assignment' | 'event';
  description: string;
}

interface CalendarModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function CalendarModule({ voiceEnabled, speak }: CalendarModuleProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    type: 'event' as 'exam' | 'holiday' | 'assignment' | 'event',
    description: ''
  });

  const gujaratiHolidays = [
    { title: 'Uttarayan', date: '2025-01-14', type: 'holiday' as const, description: 'Kite Festival' },
    { title: 'Republic Day', date: '2025-01-26', type: 'holiday' as const, description: 'National Holiday' },
    { title: 'Holi', date: '2025-03-14', type: 'holiday' as const, description: 'Festival of Colors' },
    { title: 'Ram Navami', date: '2025-04-06', type: 'holiday' as const, description: 'Hindu Festival' },
    { title: 'Janmashtami', date: '2025-08-16', type: 'holiday' as const, description: 'Krishna Birthday' },
    { title: 'Navratri', date: '2025-09-25', type: 'holiday' as const, description: '9 Nights Festival' },
    { title: 'Diwali', date: '2025-10-20', type: 'holiday' as const, description: 'Festival of Lights' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('sahpathi-events');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      setEvents(gujaratiHolidays.map(h => ({ ...h, id: Date.now().toString() + Math.random() })));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('sahpathi-events', JSON.stringify(events));
    }
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date);
  };

  const handleAddEvent = () => {
    if (!formData.title || !formData.date) {
      speak("Please fill required fields");
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      ...formData
    };

    setEvents([...events, newEvent]);
    setFormData({ title: '', date: '', type: 'event', description: '' });
    setIsAdding(false);

    if (voiceEnabled) speak("Event added");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    if (voiceEnabled) speak("Event deleted");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-500';
      case 'holiday': return 'bg-green-500';
      case 'assignment': return 'bg-yellow-500';
      case 'event': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(selectedDate);
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 md:p-4" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateString);
      const isToday = dateString === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={day}
          onClick={() => {
            if (voiceEnabled && dayEvents.length > 0) {
              speak(`${day} ${monthNames[month]}. ${dayEvents.length} events`);
            }
          }}
          className={`p-2 md:p-4 border-2 rounded-xl hover:bg-indigo-50 transition-colors ${
            isToday ? 'border-indigo-500 bg-indigo-100 font-bold' : 'border-gray-200'
          }`}
          aria-label={`${monthNames[month]} ${day}, ${year}. ${dayEvents.length} events.`}
        >
          <div className="text-lg md:text-xl font-semibold mb-1">{day}</div>
          <div className="flex flex-wrap gap-1 justify-center">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`w-2 h-2 rounded-full ${getTypeColor(event.type)}`}
                title={event.title}
                aria-hidden="true"
              />
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-600">+{dayEvents.length - 3}</div>
            )}
          </div>
        </button>
      );
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
              if (voiceEnabled) speak(`${monthNames[newDate.getMonth()]}`);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            aria-label="Previous month"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
              if (voiceEnabled) speak(`${monthNames[newDate.getMonth()]}`);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            aria-label="Next month"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-bold text-gray-700 p-2">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-purple-600 mb-6 flex items-center gap-3">
        📅 Calendar
      </h1>

      {/* View Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setViewMode('month');
            if (voiceEnabled) speak("Month view");
          }}
          className={`flex-1 px-6 py-3 rounded-xl font-medium ${
            viewMode === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          aria-label="Month view"
          aria-pressed={viewMode === 'month'}
        >
          Month View
        </button>
        <button
          onClick={() => {
            setViewMode('list');
            if (voiceEnabled) speak("List view");
          }}
          className={`flex-1 px-6 py-3 rounded-xl font-medium ${
            viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
        >
          List View
        </button>
        <button
          onClick={() => {
            setIsAdding(true);
            if (voiceEnabled) speak("Add event");
          }}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2"
          aria-label="Add new event"
        >
          <FaPlus aria-hidden="true" /> Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {isAdding && (
        <div className="accessible-card mb-6">
          <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                aria-label="Event title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  aria-label="Event date"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
                  aria-label="Event type"
                >
                  <option value="event">Event</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="holiday">Holiday</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl h-24"
                aria-label="Event description"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddEvent}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                aria-label="Save event"
              >
                Save Event
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ title: '', date: '', type: 'event', description: '' });
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

      {/* Calendar or List View */}
      {viewMode === 'month' ? (
        <div className="accessible-card">
          {renderCalendar()}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="accessible-card text-center text-gray-500 py-12">
              <p className="text-xl">No upcoming events</p>
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="accessible-card">
                <div className="flex items-start gap-4">
                  <div className={`w-4 h-4 rounded-full ${getTypeColor(event.type)} mt-1 flex-shrink-0`}
                       aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaBell aria-hidden="true" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-gray-700">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl flex-shrink-0"
                    aria-label={`Delete event: ${event.title}`}
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Legend */}
      <div className="accessible-card mt-6">
        <h3 className="font-bold mb-3">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" aria-hidden="true" />
            <span>Exam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" aria-hidden="true" />
            <span>Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500" aria-hidden="true" />
            <span>Assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" aria-hidden="true" />
            <span>Event</span>
          </div>
        </div>
      </div>
    </div>
  );
}
