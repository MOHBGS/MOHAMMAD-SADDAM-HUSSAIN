import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Calendar,
  Sparkles,
  CheckCheck,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    viewUserProfile,
    setActiveTab,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows' | 'events'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'likes') return n.type === 'like';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow' || n.type === 'crush_match';
    if (filter === 'events') return n.type === 'event';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-sky-500" />;
      case 'crush_match':
        return <Sparkles className="w-4 h-4 text-rose-500" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-pink-500" />;
    }
  };

  const handleNotificationClick = (n: any) => {
    markNotificationRead(n.id);
    if (n.type === 'follow' || n.type === 'crush_match') {
      viewUserProfile(n.sourceUser.id);
    } else if (n.type === 'event') {
      setActiveTab('events');
    } else {
      setActiveTab('home');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-pink-500" />
            <span>Campus Activity</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates from your classmates and college clubs
          </p>
        </div>

        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="px-3.5 py-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All' },
          { id: 'likes', label: 'Likes' },
          { id: 'comments', label: 'Comments' },
          { id: 'follows', label: 'Followers & Matches' },
          { id: 'events', label: 'Events' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <div className="text-3xl">🔕</div>
            <p className="text-sm font-semibold text-slate-700">No notifications here</p>
            <p className="text-xs">You are all caught up on campus updates!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !item.readStatus
                  ? 'bg-pink-50/40 hover:bg-pink-50/70'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={item.sourceUser.avatar}
                  alt={item.sourceUser.name}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-sm">
                  {getIcon(item.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="leading-snug text-slate-700">
                  <strong className="text-slate-900 font-bold mr-1">
                    {item.sourceUser.name}
                  </strong>
                  <span>{item.text}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span>{item.sourceUser.college}</span>
                  <span>&middot;</span>
                  <span>{item.timeAgo}</span>
                </div>
              </div>

              {!item.readStatus && (
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500 flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
