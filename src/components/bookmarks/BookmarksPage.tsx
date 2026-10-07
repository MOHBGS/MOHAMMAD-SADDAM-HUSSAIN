import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, Sparkles } from 'lucide-react';
import { PostCard } from '../feed/PostCard';

export const BookmarksPage: React.FC = () => {
  const { bookmarks, posts } = useApp();
  const savedPosts = posts.filter((p) => bookmarks.includes(p.id));

  return (
    <div className="max-w-2xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-pink-100/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-pink-500 fill-pink-500" />
            <span>Saved Campus Posts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fest schedules, important notes, and campus moments you bookmarked
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-pink-50 text-pink-700 rounded-full">
          {savedPosts.length} Saved
        </span>
      </div>

      <div className="space-y-6">
        {savedPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-pink-100 text-slate-400 space-y-2">
            <Bookmark className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-700">No saved posts yet</h3>
            <p className="text-xs">
              Click the bookmark icon on any campus post to revisit it here anytime.
            </p>
          </div>
        ) : (
          savedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
};
