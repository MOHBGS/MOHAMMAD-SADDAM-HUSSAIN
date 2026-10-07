import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCreatePostModalOpen,
    currentUser,
    setViewingUserId,
    conversations,
  } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleNavClick = (tab: ActiveTab) => {
    if (tab === 'profile') {
      setViewingUserId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-pink-100 py-1.5 px-3 flex items-center justify-around shadow-lg shadow-pink-900/10">
      {/* 1. Home */}
      <button
        type="button"
        onClick={() => handleNavClick('home')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Home</span>
      </button>

      {/* 2. Explore */}
      <button
        type="button"
        onClick={() => handleNavClick('explore')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'explore' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Explore</span>
      </button>

      {/* 3. Create (+) */}
      <button
        type="button"
        onClick={() => setIsCreatePostModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-4 cursor-pointer"
        title="Create Post"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transform active:scale-95 transition-transform">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-[10px] font-bold text-pink-600 mt-1">Post</span>
      </button>

      {/* 4. Messages (replaced Reels) */}
      <button
        type="button"
        onClick={() => handleNavClick('messages')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors relative cursor-pointer ${
          activeTab === 'messages' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Chat</span>
      </button>

      {/* 5. Profile */}
      <button
        type="button"
        onClick={() => handleNavClick('profile')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
          activeTab === 'profile' ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        {currentUser ? (
          <img
            src={currentUser.profilePhoto}
            alt="Profile"
            className={`w-5 h-5 rounded-full object-cover ring-2 ${
              activeTab === 'profile' ? 'ring-pink-500' : 'ring-transparent'
            }`}
          />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] font-semibold mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
