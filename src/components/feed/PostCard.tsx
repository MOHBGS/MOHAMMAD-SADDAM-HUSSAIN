import React, { useState } from 'react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Send,
  CheckCircle2,
  Flag,
  EyeOff,
  Copy,
} from 'lucide-react';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const {
    likePost,
    savePost,
    addComment,
    votePoll,
    viewUserProfile,
    reportContent,
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [likeHeartPop, setLikeHeartPop] = useState(false);

  const handleLikeClick = () => {
    if (!post.isLiked) {
      setLikeHeartPop(true);
      setTimeout(() => setLikeHeartPop(false), 900);
    }
    likePost(post.id);
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      likePost(post.id);
    }
    setLikeHeartPop(true);
    setTimeout(() => setLikeHeartPop(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleShareClick = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="bg-white rounded-3xl border border-pink-100/80 shadow-sm overflow-hidden transition-all hover:shadow-md/50 relative">
      {/* Post Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-start justify-between gap-3">
        <div
          onClick={() => viewUserProfile(post.userId)}
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
        >
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900 group-hover:text-pink-600 transition-colors truncate">
                {post.userName}
              </span>
              {post.userVerified && (
                <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold flex-shrink-0" title="Verified Student">
                  ✓
                </span>
              )}
              {post.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100/60 ml-auto sm:ml-1">
                  {post.category}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <span>{post.userCollege}</span>
              <span>&middot;</span>
              <span>{post.userCourse}</span>
              <span>&middot;</span>
              <span>{post.userYear}</span>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{post.createdAt}</span>
              {post.location && (
                <>
                  <span>&middot;</span>
                  <span className="flex items-center gap-0.5 text-slate-500">
                    <MapPin className="w-2.5 h-2.5 text-pink-500" />
                    <span>{post.location}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3-dot Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-pink-100 p-1.5 z-20 text-xs space-y-0.5 animate-fade-in">
              <button
                type="button"
                onClick={() => {
                  handleShareClick();
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-pink-50 text-slate-700 flex items-center gap-2 font-medium"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Post Link</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  savePost(post.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-pink-50 text-slate-700 flex items-center gap-2 font-medium"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.isSaved ? 'Remove Bookmark' : 'Save Post'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  reportContent('post', post.id, 'Inappropriate');
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Text Content */}
      {post.content && (
        <div className="px-4 sm:px-5 py-2 text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
          {post.content}
        </div>
      )}

      {/* Post Media (Image/Video) with Double Tap Support */}
      {post.mediaUrl && (
        <div
          onDoubleClick={handleDoubleTap}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-100 overflow-hidden cursor-pointer select-none"
        >
          <img
            src={post.mediaUrl}
            alt="Campus post media"
            className="w-full h-full object-cover"
          />

          {/* Double Tap Heart Pop */}
          {likeHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-ping">
              <Heart className="w-24 h-24 fill-pink-500 text-pink-500 drop-shadow-2xl" />
            </div>
          )}
        </div>
      )}

      {/* Poll Section if present */}
      {post.poll && (
        <div className="mx-4 sm:mx-5 my-3 p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/70 border border-pink-100 space-y-3">
          <div className="text-xs font-bold text-slate-900">
            📊 {post.poll.question}
          </div>
          <div className="space-y-2">
            {post.poll.options.map((opt) => {
              const total = post.poll?.totalVotes || 0;
              const percent = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
              const hasVotedThis = post.poll?.userVotedOptionId === opt.id;
              const hasVotedAny = Boolean(post.poll?.userVotedOptionId);

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={hasVotedAny}
                  onClick={() => votePoll(post.id, opt.id)}
                  className={`w-full relative overflow-hidden p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    hasVotedThis
                      ? 'border-pink-500 bg-pink-100/60 text-pink-800'
                      : 'border-slate-200 bg-white/80 hover:bg-white text-slate-700'
                  }`}
                >
                  {/* Progress background bar if voted */}
                  {hasVotedAny && (
                    <div
                      className="absolute inset-y-0 left-0 bg-pink-300/30 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      {hasVotedThis && <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />}
                      <span>{opt.text}</span>
                    </span>
                    {hasVotedAny && (
                      <span className="text-[11px] font-bold text-slate-600">
                        {percent}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-400 font-medium text-right">
            {post.poll.totalVotes} student votes
          </div>
        </div>
      )}

      {/* Social Action Bar (Original Layout) */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all group ${
              post.isLiked
                ? 'text-pink-600 bg-pink-50'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                post.isLiked ? 'fill-pink-500 text-pink-500' : 'text-slate-500'
              }`}
            />
            <span>Like {post.likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
          >
            <MessageCircle className="w-4 h-4 text-slate-500" />
            <span>Comments {post.commentsCount}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share</span>
            {copiedLink && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap shadow-md">
                Link copied!
              </span>
            )}
          </button>
        </div>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={() => savePost(post.id)}
          className={`p-2 rounded-xl transition-colors ${
            post.isSaved
              ? 'text-pink-600 bg-pink-50'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={post.isSaved ? 'Bookmarked' : 'Bookmark post'}
        >
          <Bookmark
            className={`w-4 h-4 ${post.isSaved ? 'fill-pink-500 text-pink-500' : ''}`}
          />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 sm:px-5 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100 space-y-3">
          {/* Comments List */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar pt-2">
            {post.comments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                No comments yet. Start the campus conversation!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.userAvatar}
                    alt={comment.userName}
                    className="w-7 h-7 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="bg-white p-2.5 rounded-2xl border border-slate-200/70 shadow-2xs flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900">
                        {comment.userName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-snug">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a friendly comment..."
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-pink-400 transition-colors"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};
