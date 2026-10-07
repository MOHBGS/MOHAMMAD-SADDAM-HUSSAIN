import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Search,
  Home,
  Heart,
  Bell,
  MessageCircle,
  PlusSquare,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setViewingUserId,
    searchQuery,
    setSearchQuery,
    setIsCreatePostModalOpen,
    notifications,
    conversations,
  } = useApp();

  const unreadNotificationsCount = notifications.filter((n) => !n.readStatus).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('explore');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-pink-100/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Mobile Logo */}
        <div className="lg:hidden flex-shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
          <Logo size="sm" showText={false} />
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl relative"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for people, posts, or colleges..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-pink-300 rounded-2xl outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Create Button (Mobile/Tablet) */}
          <button
            type="button"
            onClick={() => setIsCreatePostModalOpen(true)}
            className="lg:hidden p-2 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors"
            title="Create Post"
          >
            <PlusSquare className="w-5 h-5" />
          </button>

          {/* Quick Home */}
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`hidden sm:flex p-2 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-pink-50 text-pink-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Home Feed"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Messages */}
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`relative p-2 rounded-xl transition-colors ${
              activeTab === 'messages'
                ? 'bg-pink-50 text-pink-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Messages"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`relative p-2 rounded-xl transition-colors ${
              activeTab === 'notifications'
                ? 'bg-pink-50 text-pink-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white" />
            )}
          </button>

          {/* Profile Avatar */}
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setViewingUserId(null);
                setActiveTab('profile');
              }}
              className={`p-0.5 rounded-full ring-2 transition-all ml-1 ${
                activeTab === 'profile'
                  ? 'ring-pink-500'
                  : 'ring-transparent hover:ring-pink-300'
              }`}
              title="My Profile"
            >
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
