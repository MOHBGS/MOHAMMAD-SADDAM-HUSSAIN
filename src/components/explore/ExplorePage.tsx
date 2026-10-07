import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Heart,
  UserPlus,
  UserCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { PostCard } from '../feed/PostCard';

export const ExplorePage: React.FC = () => {
  const {
    users,
    posts,
    colleges,
    groups,
    searchQuery,
    setSearchQuery,
    currentUser,
    followingUserIds,
    toggleFollowUser,
    viewUserProfile,
    setActiveTab,
  } = useApp();

  const [activeExploreTab, setActiveExploreTab] = useState<
    'all' | 'people' | 'trending' | 'colleges' | 'communities'
  >('all');

  const query = searchQuery.toLowerCase().trim();

  // Filtered people
  const matchedUsers = users.filter((u) => {
    if (u.id === currentUser?.id) return false;
    if (!query) return true;
    return (
      u.fullName.toLowerCase().includes(query) ||
      u.collegeName.toLowerCase().includes(query) ||
      u.course.toLowerCase().includes(query) ||
      u.interests.some((i) => i.toLowerCase().includes(query))
    );
  });

  // Filtered colleges
  const matchedColleges = colleges.filter((c) => {
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.state.toLowerCase().includes(query)
    );
  });

  // Filtered posts / hashtags
  const matchedPosts = posts.filter((p) => {
    if (!query) return true;
    return (
      p.content.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.userCollege.toLowerCase().includes(query)
    );
  });

  // Filtered communities
  const matchedGroups = groups.filter((g) => {
    if (!query) return true;
    return (
      g.name.toLowerCase().includes(query) ||
      g.category.toLowerCase().includes(query) ||
      g.description.toLowerCase().includes(query)
    );
  });

  const trendingHashtags = [
    { tag: '#CampusFest2026', count: '1.2k posts', label: 'Fest season kicks off' },
    { tag: '#CollegeCrushStories', count: '980 posts', label: 'Secret admirer notes' },
    { tag: '#StudyTogether', count: '650 posts', label: 'Exam revision groups' },
    { tag: '#HostelLifeHacks', count: '480 posts', label: 'Hostel memes & tips' },
    { tag: '#PlacementGrind', count: '390 posts', label: 'Tech & consulting prep' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full pb-20 lg:pb-8 animate-fade-in">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-pink-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Campus Social Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Find Your College People &amp; Vibes
          </h2>
          <p className="text-xs sm:text-sm text-pink-100">
            Search across university students, trending hashtags, campus fests, and student clubs.
          </p>
        </div>
      </div>

      {/* Explore Navigation Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Discovery' },
          { id: 'people', label: 'Students & People' },
          { id: 'trending', label: 'Trending Posts' },
          { id: 'colleges', label: 'Colleges' },
          { id: 'communities', label: 'Clubs & Communities' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveExploreTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeExploreTab === tab.id
                ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. People Section */}
      {(activeExploreTab === 'all' || activeExploreTab === 'people') && (
        <section className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-600" />
              <h3 className="text-base font-bold text-slate-900">
                Recommended Students &amp; Classmates
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Matched by course &amp; interests
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedUsers.slice(0, 6).map((student) => {
              const isFollowing = followingUserIds.includes(student.id);
              return (
                <div
                  key={student.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-pink-200 transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => viewUserProfile(student.id)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <img
                      src={student.profilePhoto}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors flex items-center gap-1 truncate">
                        <span>{student.fullName}</span>
                        {student.isVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {student.collegeName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {student.course} &middot; {student.currentYear}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFollowUser(student.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 flex-shrink-0 ${
                      isFollowing
                        ? 'bg-slate-200 text-slate-700'
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
        </section>
      )}

      {/* 2. Trending Hashtags & Campus Buzz */}
      {(activeExploreTab === 'all' || activeExploreTab === 'trending') && (
        <section className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                Trending Campus Topics
              </h3>
            </div>
            <span className="text-xs text-slate-400">Live conversations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trendingHashtags.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSearchQuery(item.tag)}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/50 border border-pink-100 hover:border-pink-300 cursor-pointer transition-all"
              >
                <div className="text-xs font-bold text-slate-900">
                  {item.tag}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.label}
                </div>
                <div className="text-[10px] font-semibold text-pink-600 mt-2">
                  {item.count}
                </div>
              </div>
            ))}
          </div>

          {/* Trending Posts */}
          <div className="pt-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Campus Posts
            </h4>
            <div className="space-y-4">
              {matchedPosts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Colleges Directory */}
      {(activeExploreTab === 'all' || activeExploreTab === 'colleges') && (
        <section className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-pink-600" />
              <h3 className="text-base font-bold text-slate-900">
                Colleges &amp; Universities
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedColleges.map((college) => (
              <div
                key={college.id}
                onClick={() => setActiveTab('my-college')}
                className="cursor-pointer group rounded-2xl overflow-hidden border border-slate-200 hover:border-pink-300 bg-white shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-32 relative overflow-hidden bg-slate-200">
                  <img
                    src={college.coverImage}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-white">
                    <span className="text-[10px] font-medium text-pink-200 block">
                      {college.city}, {college.state}
                    </span>
                    <h4 className="text-xs font-bold truncate max-w-[200px]">
                      {college.name}
                    </h4>
                  </div>
                </div>
                <div className="p-3 text-xs text-slate-600 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {college.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-semibold text-pink-600">
                    <span>{college.studentCount.toLocaleString()}+ students</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      View Hub &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Campus Communities */}
      {(activeExploreTab === 'all' || activeExploreTab === 'communities') && (
        <section className="bg-white rounded-3xl p-5 border border-pink-100/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                Campus Clubs &amp; Societies
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('groups')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700"
            >
              See all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => setActiveTab('groups')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-pink-300 bg-white hover:bg-pink-50/20 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {group.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {group.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {group.category}
                  </div>
                  <div className="text-[10px] font-semibold text-pink-600 mt-0.5">
                    {group.memberCount} members
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
