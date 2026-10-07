import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  Sparkles,
  CheckCircle,
  Star,
  Clock,
  Plus,
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, toggleEventInterest, toggleEventJoin } = useApp();
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Fest', 'Hackathon', 'Party', 'Cultural'];

  const filteredEvents = events.filter((ev) => {
    if (filter === 'All') return true;
    return ev.category === filter;
  });

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-pink-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            College Calendars &amp; Fests
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Upcoming Campus Events
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 max-w-lg">
            Discover cultural nights, hackathons, freshers parties, and competitions happening across campuses.
          </p>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'All Events' : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              <img
                src={ev.posterUrl}
                alt={ev.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {ev.category}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[11px] font-medium text-pink-200 block">
                  {ev.collegeName}
                </span>
                <h3 className="text-base font-extrabold truncate">{ev.title}</h3>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ev.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    <span>{ev.eventDate} &middot; {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>Organized by {ev.organizer}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Interested & Join */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleEventInterest(ev.id)}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                    ev.isInterested
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${ev.isInterested ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>Interested ({ev.interestedCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleEventJoin(ev.id)}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    ev.isJoined
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white shadow-sm shadow-pink-500/20'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{ev.isJoined ? 'Joined ✓' : `Join (${ev.joinedCount})`}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
