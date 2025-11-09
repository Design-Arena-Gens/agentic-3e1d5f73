'use client';

import { useState } from 'react';
import { FaTree, FaWater, FaUniversity, FaCoffee, FaBook, FaUtensils, FaWheelchair, FaMapMarkerAlt } from 'react-icons/fa';

interface Place {
  id: number;
  name: string;
  type: string;
  description: string;
  distance: string;
  wheelchairAccessible: boolean;
  rating: number;
  icon: any;
}

interface NearbyExplorerModuleProps {
  voiceEnabled: boolean;
  speak: (text: string) => void;
}

export default function NearbyExplorerModule({ voiceEnabled, speak }: NearbyExplorerModuleProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const places: Place[] = [
    {
      id: 1,
      name: "Sabarmati Riverfront",
      type: "park",
      description: "Beautiful riverside promenade with gardens and open spaces. Perfect for morning walks and evening relaxation.",
      distance: "2.5 km",
      wheelchairAccessible: true,
      rating: 4.5,
      icon: FaWater,
    },
    {
      id: 2,
      name: "Kankaria Lake",
      type: "lake",
      description: "Historic lake with walking path, children's park, and boat rides. Great for family outings.",
      distance: "3.8 km",
      wheelchairAccessible: true,
      rating: 4.6,
      icon: FaWater,
    },
    {
      id: 3,
      name: "Law Garden",
      type: "park",
      description: "Popular garden with food stalls and handicraft market in evenings. Peaceful during day.",
      distance: "1.5 km",
      wheelchairAccessible: true,
      rating: 4.3,
      icon: FaTree,
    },
    {
      id: 4,
      name: "Calico Museum",
      type: "museum",
      description: "Renowned textile museum showcasing Indian fabrics. Educational and culturally enriching.",
      distance: "4.2 km",
      wheelchairAccessible: false,
      rating: 4.7,
      icon: FaUniversity,
    },
    {
      id: 5,
      name: "Gujarat Science City",
      type: "museum",
      description: "Interactive science museum with planetarium and exhibitions. Great for students!",
      distance: "8.5 km",
      wheelchairAccessible: true,
      rating: 4.8,
      icon: FaUniversity,
    },
    {
      id: 6,
      name: "Vastrapur Lake",
      type: "lake",
      description: "Serene lake with walking track and garden. Popular spot for morning exercise.",
      distance: "5.1 km",
      wheelchairAccessible: true,
      rating: 4.4,
      icon: FaWater,
    },
    {
      id: 7,
      name: "Parimal Garden",
      type: "park",
      description: "Well-maintained garden with play area. Ideal for families and morning walks.",
      distance: "2.8 km",
      wheelchairAccessible: true,
      rating: 4.2,
      icon: FaTree,
    },
    {
      id: 8,
      name: "Shreyas Folk Museum",
      type: "museum",
      description: "Cultural museum displaying traditional Gujarati arts and crafts.",
      distance: "6.3 km",
      wheelchairAccessible: false,
      rating: 4.5,
      icon: FaUniversity,
    },
    {
      id: 9,
      name: "Victoria Garden",
      type: "park",
      description: "Historic garden with lush greenery. Peaceful retreat in the city.",
      distance: "3.2 km",
      wheelchairAccessible: true,
      rating: 4.1,
      icon: FaTree,
    },
    {
      id: 10,
      name: "Café Coffee Day - CG Road",
      type: "cafe",
      description: "Popular café for students. Good for study sessions and group meetings.",
      distance: "1.8 km",
      wheelchairAccessible: true,
      rating: 4.0,
      icon: FaCoffee,
    },
    {
      id: 11,
      name: "LD Institute Library",
      type: "library",
      description: "Extensive collection of books and quiet study spaces.",
      distance: "3.5 km",
      wheelchairAccessible: true,
      rating: 4.4,
      icon: FaBook,
    },
    {
      id: 12,
      name: "Manek Chowk",
      type: "restaurant",
      description: "Famous food market with variety of Gujarati street food. Open late night.",
      distance: "4.0 km",
      wheelchairAccessible: false,
      rating: 4.6,
      icon: FaUtensils,
    },
  ];

  const filters = [
    { id: 'all', label: 'All Places', icon: FaMapMarkerAlt },
    { id: 'park', label: 'Parks', icon: FaTree },
    { id: 'lake', label: 'Lakes', icon: FaWater },
    { id: 'museum', label: 'Museums', icon: FaUniversity },
    { id: 'cafe', label: 'Cafés', icon: FaCoffee },
    { id: 'library', label: 'Libraries', icon: FaBook },
    { id: 'restaurant', label: 'Restaurants', icon: FaUtensils },
  ];

  const filteredPlaces = places.filter(place => {
    const matchesType = selectedFilter === 'all' || place.type === selectedFilter;
    const matchesAccessibility = !accessibleOnly || place.wheelchairAccessible;
    return matchesType && matchesAccessibility;
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    const filterLabel = filters.find(f => f.id === filter)?.label || 'all places';
    if (voiceEnabled) speak(`Showing ${filterLabel}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-600 mb-6 flex items-center gap-3">
        📍 Nearby Explorer
      </h1>

      {/* Accessibility Toggle */}
      <div className="accessible-card mb-6">
        <button
          onClick={() => {
            setAccessibleOnly(!accessibleOnly);
            if (voiceEnabled) {
              speak(accessibleOnly ? "Showing all places" : "Showing wheelchair accessible places only");
            }
          }}
          className={`w-full md:w-auto px-6 py-3 rounded-xl font-medium flex items-center gap-2 justify-center ${
            accessibleOnly ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          aria-label={`Wheelchair accessible filter ${accessibleOnly ? 'enabled' : 'disabled'}`}
          aria-pressed={accessibleOnly}
        >
          <FaWheelchair className="text-xl" aria-hidden="true" />
          Wheelchair Accessible Only
        </button>
      </div>

      {/* Filters */}
      <div className="accessible-card mb-6">
        <h2 className="text-xl font-bold mb-4">What are you looking for?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedFilter === filter.id
                  ? 'bg-teal-600 text-white border-teal-600 scale-105'
                  : 'bg-white border-gray-300 hover:border-teal-400'
              }`}
              aria-label={`Filter by ${filter.label}`}
              aria-pressed={selectedFilter === filter.id}
            >
              <filter.icon className="text-2xl mx-auto mb-2" aria-hidden="true" />
              <div className="text-sm font-medium">{filter.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        <p className="text-lg">
          Found <strong>{filteredPlaces.length}</strong> {filteredPlaces.length === 1 ? 'place' : 'places'}
          {accessibleOnly && ' (wheelchair accessible)'}
        </p>
      </div>

      {/* Places Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="accessible-card text-center text-gray-500 py-20">
          <p className="text-2xl mb-2">No places found</p>
          <p className="text-lg">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlaces.map(place => (
            <div
              key={place.id}
              className="accessible-card hover:scale-102 transition-transform"
              role="article"
              aria-label={`${place.name}, ${place.distance} away, ${place.rating} stars${place.wheelchairAccessible ? ', wheelchair accessible' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center">
                  <place.icon className="text-2xl text-white" aria-hidden="true" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                    {place.wheelchairAccessible && (
                      <FaWheelchair
                        className="text-teal-600 text-xl flex-shrink-0 ml-2"
                        aria-label="Wheelchair accessible"
                        title="Wheelchair accessible"
                      />
                    )}
                  </div>

                  <p className="text-gray-700 mb-3 leading-relaxed">{place.description}</p>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                      📍 {place.distance}
                    </span>

                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-lg" aria-hidden="true">★</span>
                      <span className="font-medium">{place.rating}</span>
                      <span className="text-gray-500 text-sm">/5</span>
                    </div>

                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
                      {place.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekend Ideas Banner */}
      <div className="mt-8 accessible-card bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <h3 className="text-2xl font-bold mb-4">🌟 Weekend Outing Ideas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h4 className="font-bold text-lg mb-2">🌅 Morning Plan</h4>
            <p>Start with a walk at Sabarmati Riverfront, then visit Gujarat Science City for interactive learning!</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h4 className="font-bold text-lg mb-2">🌆 Evening Plan</h4>
            <p>Relax at Kankaria Lake with boat rides, followed by dinner at Law Garden food stalls.</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h4 className="font-bold text-lg mb-2">📚 Study Outing</h4>
            <p>Morning study session at LD Library, lunch break at a nearby café, then explore a museum.</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-xl p-4">
            <h4 className="font-bold text-lg mb-2">👨‍👩‍👧‍👦 Family Day</h4>
            <p>Spend the day at Kankaria Lake with family - gardens, children&apos;s park, and local food!</p>
          </div>
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="mt-6 accessible-card bg-blue-50 border-2 border-blue-300">
        <div className="flex gap-3 items-start">
          <FaWheelchair className="text-3xl text-blue-600 flex-shrink-0" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-lg mb-2">Accessibility Information</h3>
            <p className="text-gray-700">
              We&apos;ve marked wheelchair-accessible places with the ♿ icon. For the most current accessibility
              information, we recommend calling ahead to verify facilities meet your specific needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
