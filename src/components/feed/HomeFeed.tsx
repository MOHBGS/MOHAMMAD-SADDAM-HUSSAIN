import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoryTray } from './StoryTray';
import { PostCreationCard } from './PostCreationCard';
import { PostCard } from './PostCard';
import { Sparkles, MessageSquareHeart } from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const { posts, currentUser } = useApp();
  const [filter, setFilter] = useState<'all' | 'my-college' | 'confessions' | 'fests'>('all');

  const filteredPosts = posts.filter((post) => {
    if (filter === 'my-college') {
      return post.userCollege.toLowerCase().includes(currentUser?.collegeName.toLowerCase() || 'delhi');
    }
    if (filter === 'confessions') {
      return post.category === 'Crush Confession';
    }
    if (filter === 'fests') {
      return post.category === 'Fest & Events';
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full pb-20 lg:pb-8">
      {/* 1. Horizontal Stories Tray */}
      <StoryTray />

      {/* 2. Post Creation Card */}
      <PostCreationCard />

      {/* 3. Feed Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-pink-100 shadow-2xs overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          All Campuses
        </button>

        <button
          type="button"
          onClick={() => setFilter('my-college')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            filter === 'my-college'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          My College Only
        </button>

        <button
          type="button"
          onClick={() => setFilter('confessions')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
            filter === 'confessions'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Crush Confessions</span>
        </button>

        <button
          type="button"
          onClick={() => setFilter('fests')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1 ${
            filter === 'fests'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fests &amp; Events</span>
        </button>
      </div>

      {/* 4. Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-pink-100 space-y-2">
            <div className="text-3xl">🌸</div>
            <h4 className="text-sm font-bold text-slate-800">No posts in this filter yet</h4>
            <p className="text-xs text-slate-500">
              Be the first student to share a campus memory or confession!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
