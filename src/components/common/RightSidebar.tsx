import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Users,
  UserPlus,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    currentUser,
    users,
    followingUserIds,
    toggleFollowUser,
    events,
    groups,
    setActiveTab,
    viewUserProfile,
    setSearchQuery,
  } = useApp();

  // Filter suggested users (not current user, preferentially not already followed or top peers)
  const suggestedUsers = users
    .filter((u) => u.id !== currentUser?.id)
    .slice(0, 3);

  const trendingTopics = [
    { tag: '#CampusFest2026', count: '1.2k posts', topic: 'Delhi University & Mood Indigo' },
    { tag: '#CollegeCrushStories', count: '980 posts', topic: 'Campus Confessions' },
    { tag: '#HackathonLife', count: '650 posts', topic: 'Coding & Tech' },
    { tag: '#CanteenAdda', count: '430 posts', topic: 'Food & Hangouts' },
  ];

  const upcomingEvent = events[0];

  return (
    <aside className="w-80 flex-shrink-0 hidden xl:flex flex-col gap-6 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
      {/* 1. Suggested For You */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Suggested for you</span>
          </h3>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700"
          >
            See all
          </button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => {
            const isFollowing = followingUserIds.includes(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => viewUserProfile(user.id)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={user.profilePhoto}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-100 group-hover:ring-pink-300 transition-all flex-shrink-0"
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                      <span>{user.fullName}</span>
                      {user.isVerified && (
                        <span className="w-3 h-3 rounded-full bg-sky-500 text-white text-[8px] flex items-center justify-center font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {user.collegeName} &middot; {user.currentYear}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollowUser(user.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 flex-shrink-0 ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Trending on Campus */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span>Trending on Campus</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {trendingTopics.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSearchQuery(item.tag);
                setActiveTab('explore');
              }}
              className="p-2.5 rounded-2xl hover:bg-pink-50/50 cursor-pointer transition-colors space-y-0.5"
            >
              <div className="text-[11px] text-slate-400 font-medium">
                {item.topic}
              </div>
              <div className="text-xs font-bold text-slate-900">
                {item.tag}
              </div>
              <div className="text-[10px] text-pink-600 font-semibold">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Upcoming Campus Event Highlight */}
      {upcomingEvent && (
        <div className="bg-gradient-to-br from-pink-50/70 via-rose-50/50 to-purple-50/70 rounded-3xl p-4 border border-pink-100/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Campus Spotlight</span>
            </h3>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700"
            >
              All Events
            </button>
          </div>

          <div
            onClick={() => setActiveTab('events')}
            className="cursor-pointer group rounded-2xl overflow-hidden bg-white border border-pink-100 shadow-sm"
          >
            <div className="h-24 relative overflow-hidden">
              <img
                src={upcomingEvent.posterUrl}
                alt={upcomingEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {upcomingEvent.category}
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {upcomingEvent.title}
              </h4>
              <p className="text-[10px] text-slate-500">
                {upcomingEvent.eventDate} &middot; {upcomingEvent.location}
              </p>
              <div className="text-[11px] font-semibold text-pink-600 pt-1 flex items-center justify-between">
                <span>{upcomingEvent.interestedCount} students interested</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Campus Communities Preview */}
      <div className="bg-white rounded-3xl p-4 border border-pink-100/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Popular Clubs</span>
          </h3>
          <button
            onClick={() => setActiveTab('groups')}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700"
          >
            Explore
          </button>
        </div>

        <div className="space-y-2">
          {groups.slice(0, 3).map((grp) => (
            <div
              key={grp.id}
              onClick={() => setActiveTab('groups')}
              className="p-2 rounded-2xl hover:bg-slate-50 cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg">{grp.icon}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {grp.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {grp.memberCount} members
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-[11px] text-slate-400 space-y-1 px-2 pb-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px]">
          <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('settings')}>Privacy</span>
          <span>&middot;</span>
          <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('settings')}>Safety</span>
          <span>&middot;</span>
          <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('events')}>Events</span>
          <span>&middot;</span>
          <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('groups')}>Clubs</span>
        </div>
        <div>&copy; 2026 College Crush &middot; Student Community</div>
      </div>
    </aside>
  );
};
