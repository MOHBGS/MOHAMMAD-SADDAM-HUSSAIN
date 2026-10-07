import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Home,
  Compass,
  MessageCircle,
  Bell,
  GraduationCap,
  User,
  Bookmark,
  Settings,
  PlusSquare,
  Calendar,
  Users,
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    setIsCreatePostModalOpen,
    setViewingUserId,
    conversations,
    notifications,
  } = useApp();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.readStatus).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'my-college', label: 'My College', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" />, badge: unreadMessagesCount },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadNotificationsCount },
    { id: 'events', label: 'Campus Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'groups', label: 'Communities', icon: <Users className="w-5 h-5" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const { setShowLanding } = useApp();

  const handleNavClick = (id: ActiveTab) => {

    if (id === 'profile') {
      setViewingUserId(null); // view current user's profile
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-pink-100/70 p-4 justify-between z-30 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="cursor-pointer px-3 py-2"
        >
          <Logo size="md" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/5 text-pink-600 shadow-sm shadow-pink-500/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? 'text-pink-600' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Quick link to Landing Page */}
          <button
            type="button"
            onClick={() => setShowLanding(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-pink-600/90 hover:text-pink-700 hover:bg-pink-50/60 transition-all mt-2"
          >
            <span>Landing Page Preview</span>
            <span>&rarr;</span>
          </button>
        </nav>

      </div>

      {/* Action button + User Card Footer */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        {/* Create Post Button */}
        <button
          type="button"
          onClick={() => setIsCreatePostModalOpen(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-98"
        >
          <PlusSquare className="w-4 h-4" />
          <span>Create Post</span>
        </button>

        {/* Current User Quick Bar */}
        {currentUser && (
          <div className="p-2 rounded-2xl bg-slate-50 hover:bg-pink-50/50 transition-colors flex items-center justify-between">
            <div
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
            >
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-pink-200 flex-shrink-0"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  @{currentUser.username}
                </div>
              </div>
            </div>

            <div
              onClick={() => handleNavClick('settings')}
              title="Settings"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
