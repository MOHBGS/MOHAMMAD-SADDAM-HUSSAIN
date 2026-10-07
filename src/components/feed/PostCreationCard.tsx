import React from 'react';
import { useApp } from '../../context/AppContext';
import { Image, Camera, Calendar, MapPin, BarChart3, Sparkles } from 'lucide-react';

export const PostCreationCard: React.FC = () => {
  const { currentUser, setIsCreatePostModalOpen } = useApp();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-100/80 shadow-sm space-y-3.5">
      <div className="flex items-center gap-3">
        <img
          src={
            currentUser?.profilePhoto ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
          }
          alt={currentUser?.fullName || 'User'}
          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-100 flex-shrink-0"
        />

        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex-1 text-left px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-colors flex items-center justify-between"
        >
          <span>What&apos;s on your campus mind?</span>
          <Sparkles className="w-4 h-4 text-pink-400" />
        </button>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between sm:justify-start sm:gap-4 text-xs text-slate-600">
        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors"
        >
          <Camera className="w-4 h-4 text-pink-500" />
          <span className="font-semibold text-[11px] sm:text-xs">Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
        >
          <Image className="w-4 h-4 text-rose-500" />
          <span className="font-semibold text-[11px] sm:text-xs">Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 text-slate-600 hover:text-purple-600 transition-colors"
        >
          <Calendar className="w-4 h-4 text-purple-500" />
          <span className="font-semibold text-[11px] sm:text-xs">Event</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-[11px] sm:text-xs">Location</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-[11px] sm:text-xs">Poll</span>
        </button>
      </div>
    </div>
  );
};

