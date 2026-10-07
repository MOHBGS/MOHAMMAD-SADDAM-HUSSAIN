import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export const StoryTray: React.FC = () => {
  const {
    stories,
    currentUser,
    setIsStoryViewerOpen,
    setActiveStoryIndex,
    setIsCreatePostModalOpen,
  } = useApp();

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setIsStoryViewerOpen(true);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-pink-100/80 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Campus Stories
        </h3>
        <button
          onClick={() => handleOpenStory(0)}
          className="text-xs font-semibold text-pink-600 hover:text-pink-700"
        >
          Watch All
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
        {/* Your Story button */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div className="relative">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border-2 border-dashed border-pink-300 group-hover:border-pink-500 transition-colors flex items-center justify-center">
              <img
                src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt="Your story"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center ring-2 ring-white shadow-sm hover:scale-110 transition-transform"
              title="Add to story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-[11px] font-semibold text-slate-700 mt-2 truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {/* Stories from other students */}
        {stories.map((story, idx) => {
          return (
            <div
              key={story.id}
              onClick={() => handleOpenStory(idx)}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-pink-500 via-rose-400 to-purple-600'
                    : 'bg-slate-200'
                }`}
              >
                <div className="w-full h-full rounded-full p-0.5 bg-white">
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-700 mt-2 truncate w-16 text-center group-hover:text-pink-600">
                {story.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
