import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  X,
} from 'lucide-react';

export const ReelsPage: React.FC = () => {
  const { reels, likeReel, saveReel, viewUserProfile } = useApp();
  const [activeCategory, setActiveCategory] = useState<'For You' | 'Following' | 'Campus'>('For You');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [likePop, setLikePop] = useState(false);
  const [commentsMap, setCommentsMap] = useState<Record<string, { id: string; user: string; text: string; time: string }[]>>({
    r1: [
      { id: '1', user: 'Riya Singh', text: 'DU North Campus during golden hour is pure nostalgia ❤️', time: '1h ago' },
      { id: '2', user: 'Arjun Mehta', text: 'Cinematic color grading looks amazing! 📸', time: '3h ago' },
    ],
    r2: [
      { id: '3', user: 'Aditya Raj', text: 'Which chords are you using for the bridge? 🔥', time: '2h ago' },
    ],
  });

  const filteredReels = reels.filter((r) => {
    if (activeCategory === 'For You') return true;
    return r.category === activeCategory;
  });

  const currentReel = filteredReels[currentIndex] || reels[0];

  const handleNextReel = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleLike = () => {
    if (currentReel) {
      if (!currentReel.isLiked) {
        setLikePop(true);
        setTimeout(() => setLikePop(false), 900);
      }
      likeReel(currentReel.id);
    }
  };

  const handleDoubleTap = () => {
    if (currentReel && !currentReel.isLiked) {
      likeReel(currentReel.id);
    }
    setLikePop(true);
    setTimeout(() => setLikePop(false), 900);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentReel) return;

    setCommentsMap((prev) => ({
      ...prev,
      [currentReel.id]: [
        ...(prev[currentReel.id] || []),
        { id: `c_${Date.now()}`, user: 'Ananya Sharma', text: newComment.trim(), time: 'Just now' },
      ],
    }));
    setNewComment('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] pb-20 lg:pb-8 select-none">
      {/* Category Tabs: For You | Following | Campus */}
      <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm mb-4 z-20">
        {(['For You', 'Following', 'Campus'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveCategory(tab);
              setCurrentIndex(0);
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeCategory === tab
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Reel Container */}
      <div className="relative w-full max-w-[370px] sm:max-w-[400px] h-[78vh] sm:h-[82vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
        {/* Looping video / media */}
        <div
          onDoubleClick={handleDoubleTap}
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative w-full h-full cursor-pointer overflow-hidden"
        >
          <video
            src={currentReel?.videoUrl}
            poster={currentReel?.thumbnailUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90 pointer-events-none" />

          {/* Double Tap Heart Pop */}
          {likePop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <Heart className="w-28 h-28 fill-pink-500 text-pink-500 drop-shadow-2xl" />
            </div>
          )}

          {/* Play/Pause overlay flash */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-slate-950/30">
              <div className="w-16 h-16 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md">
                <Play className="w-8 h-8 ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Top Controls: Sound toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/80 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Left: Creator details, caption, college, hashtags */}
        <div className="absolute bottom-4 left-4 right-16 z-20 text-white space-y-2 pointer-events-auto">
          {/* Creator Profile */}
          <div
            onClick={() => currentReel && viewUserProfile(currentReel.userId)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src={currentReel?.userAvatar}
              alt={currentReel?.userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500 flex-shrink-0"
            />
            <div>
              <div className="text-xs font-bold flex items-center gap-1 group-hover:text-pink-300 transition-colors">
                <span>@{currentReel?.userUsername}</span>
                <span className="w-3 h-3 rounded-full bg-sky-500 text-white text-[8px] flex items-center justify-center font-bold">
                  ✓
                </span>
              </div>
              <div className="text-[10px] text-pink-200">
                {currentReel?.userCollege}
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="text-xs font-normal text-slate-100 line-clamp-2 leading-relaxed drop-shadow-md">
            {currentReel?.caption}
          </p>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1 text-[11px] font-semibold text-pink-300">
            {currentReel?.hashtags.map((h, i) => (
              <span key={i}>{h}</span>
            ))}
          </div>

          {/* Audio track ticker */}
          <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-1">
            <Music2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span className="truncate">{currentReel?.audioTitle}</span>
          </div>
        </div>

        {/* Right Vertical Action Bar (Like, Comment, Share, Bookmark, Audio Disc) */}
        <div className="absolute bottom-6 right-3 z-20 flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                currentReel?.isLiked
                  ? 'bg-pink-500 text-white scale-110 shadow-lg shadow-pink-500/40'
                  : 'bg-slate-900/60 backdrop-blur-md text-white hover:bg-slate-900/80'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  currentReel?.isLiked ? 'fill-white' : 'group-hover:scale-110 transition-transform'
                }`}
              />
            </div>
            <span className="text-[10px] font-bold">
              {currentReel?.likesCount}
            </span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setShowCommentsModal(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center hover:bg-slate-900/80 transition-colors">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold">
              {currentReel?.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center hover:bg-slate-900/80 transition-colors">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold">Share</span>
          </button>

          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={() => currentReel && saveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                currentReel?.isSaved
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${currentReel?.isSaved ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] font-bold">Save</span>
          </button>

          {/* Spinning Vinyl Disc */}
          <div className="w-9 h-9 rounded-full border-2 border-white/60 bg-slate-900 overflow-hidden animate-spin flex items-center justify-center shadow-lg">
            <img
              src={currentReel?.userAvatar}
              alt="Track thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Vertical Up / Down Navigation Controls */}
        <div className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 flex-col gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevReel}
            className={`p-3 rounded-2xl bg-white shadow-md border border-slate-200 transition-all ${
              currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-pink-50 text-slate-800 hover:text-pink-600'
            }`}
            title="Previous reel"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            type="button"
            disabled={currentIndex === filteredReels.length - 1}
            onClick={handleNextReel}
            className={`p-3 rounded-2xl bg-white shadow-md border border-slate-200 transition-all ${
              currentIndex === filteredReels.length - 1
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-pink-50 text-slate-800 hover:text-pink-600'
            }`}
            title="Next reel"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Drawer / Modal */}
        {showCommentsModal && (
          <div className="absolute inset-x-0 bottom-0 max-h-[70%] bg-white rounded-t-3xl z-40 p-4 shadow-2xl flex flex-col text-slate-900 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Reel Comments ({commentsMap[currentReel?.id || '']?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => setShowCommentsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 max-h-52 no-scrollbar">
              {(commentsMap[currentReel?.id || ''] || []).map((c) => (
                <div key={c.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.user}</span>
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-slate-700">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 flex items-center gap-2 border-t border-slate-100">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Say something friendly..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
