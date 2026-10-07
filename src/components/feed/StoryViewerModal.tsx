import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ChevronLeft, ChevronRight, Send, Heart } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    isStoryViewerOpen,
    setIsStoryViewerOpen,
    activeStoryIndex,
    setActiveStoryIndex,
    sendMessage,
    conversations,
  } = useApp();

  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [flyingReaction, setFlyingReaction] = useState<string | null>(null);

  const activeStory = stories[activeStoryIndex];

  // Auto-advance progress bar
  useEffect(() => {
    if (!isStoryViewerOpen || !activeStory) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isStoryViewerOpen, activeStoryIndex]);

  if (!isStoryViewerOpen || !activeStory) return null;

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setIsStoryViewerOpen(false);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  const handleReaction = (emoji: string) => {
    setFlyingReaction(emoji);
    setTimeout(() => setFlyingReaction(null), 1200);

    // Send reaction to user if matching conversation exists
    const conv = conversations.find((c) => c.participant.fullName === activeStory.userName);
    if (conv) {
      sendMessage(conv.id, `Reacted ${emoji} to your story!`);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const conv = conversations.find((c) => c.participant.fullName === activeStory.userName);
    if (conv) {
      sendMessage(conv.id, `Replied to story: ${replyText.trim()}`);
    }
    setReplyText('');
    handleReaction('❤️');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in">
      {/* Close button */}
      <button
        onClick={() => setIsStoryViewerOpen(false)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-md transition-colors z-30"
        title="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      {activeStoryIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden sm:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-md transition-colors z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {activeStoryIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden sm:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 backdrop-blur-md transition-colors z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[85vh] sm:h-[88vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between">
        {/* Story background media */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeStory.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/70" />
        </div>

        {/* Top bar: Progress indicator & User Header */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Progress Bars for all stories */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100 rounded-full"
                  style={{
                    width:
                      i < activeStoryIndex
                        ? '100%'
                        : i === activeStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User details */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <img
                src={activeStory.userAvatar}
                alt={activeStory.userName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-500"
              />
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>{activeStory.userName}</span>
                  <span className="text-[10px] text-pink-300 font-normal">
                    &middot; {activeStory.createdAt}
                  </span>
                </div>
                <div className="text-[10px] text-slate-300">
                  {activeStory.userCollege}
                </div>
              </div>
            </div>

            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-slate-200 backdrop-blur-sm">
              {activeStory.expiresAt}
            </span>
          </div>
        </div>

        {/* Click zones for mobile next/prev */}
        <div className="relative z-10 flex-1 flex">
          <div
            className="w-1/2 h-full cursor-pointer"
            onClick={handlePrev}
          />
          <div
            className="w-1/2 h-full cursor-pointer"
            onClick={handleNext}
          />
        </div>

        {/* Flying reaction animation */}
        {flyingReaction && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <span className="text-6xl animate-bounce drop-shadow-lg">
              {flyingReaction}
            </span>
          </div>
        )}

        {/* Bottom bar: Caption, Emoji bar & Reply */}
        <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          {activeStory.caption && (
            <p className="text-xs sm:text-sm font-medium text-white px-1 leading-snug drop-shadow-md">
              {activeStory.caption}
            </p>
          )}

          {/* Quick emoji reactions */}
          <div className="flex items-center justify-around py-1">
            {['❤️', '🔥', '😍', '👏', '🥳'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleReaction(emoji)}
                className="text-xl sm:text-2xl p-1 hover:scale-125 transform transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Reply input */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${activeStory.userName.split(' ')[0]}...`}
              className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white/20 focus:bg-white/30 text-white placeholder:text-slate-300 rounded-full outline-none backdrop-blur-md border border-white/20"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
