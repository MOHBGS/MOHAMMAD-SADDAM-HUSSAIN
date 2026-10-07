import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Image,
  Camera,
  Upload,
  MapPin,
  BarChart3,
  Sparkles,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { CameraCaptureModal } from './CameraCaptureModal';

export const CreatePostModal: React.FC = () => {
  const {
    isCreatePostModalOpen,
    setIsCreatePostModalOpen,
    currentUser,
    createPost,
  } = useApp();

  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Campus Life' | 'Crush Confession' | 'Academic' | 'Fest & Events' | 'Memes' | 'Question'>('Campus Life');

  // Camera modal state
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Poll state
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  if (!isCreatePostModalOpen) return null;

  const sampleImages = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1000&auto=format&fit=crop&q=80',
  ];

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (idx: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== idx));
    }
  };

  const handlePollOptionChange = (idx: number, val: string) => {
    const updated = [...pollOptions];
    updated[idx] = val;
    setPollOptions(updated);
  };

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMediaUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoCaptured = (capturedUrl: string) => {
    setMediaUrl(capturedUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl.trim() && !hasPoll) return;

    createPost({
      content: content.trim(),
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType: mediaUrl ? 'image' : undefined,
      location: location.trim() || undefined,
      category,
      poll:
        hasPoll && pollQuestion.trim()
          ? {
              question: pollQuestion.trim(),
              options: pollOptions.filter((opt) => opt.trim().length > 0),
            }
          : undefined,
    });

    // Reset
    setContent('');
    setMediaUrl('');
    setLocation('');
    setHasPoll(false);
    setIsCreatePostModalOpen(false);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pink-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            <h3 className="text-base font-bold text-slate-900">
              Create Campus Post
            </h3>
          </div>
          <button
            onClick={() => setIsCreatePostModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* User badge */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.profilePhoto}
              alt="Avatar"
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-100"
            />
            <div>
              <div className="text-xs font-bold text-slate-900">
                {currentUser?.fullName}
              </div>
              <div className="text-[11px] text-slate-500">
                Posting to {currentUser?.collegeName}
              </div>
            </div>
          </div>

          {/* Text input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what's happening on campus, confessions, fest hype, or questions..."
              rows={4}
              className="w-full text-sm placeholder:text-slate-400 border-none outline-none resize-none focus:ring-0"
              autoFocus
            />
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'Campus Life',
                  'Crush Confession',
                  'Fest & Events',
                  'Academic',
                  'Memes',
                  'Question',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                    category === cat
                      ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'Crush Confession' ? '💌 ' + cat : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Photo Attachment Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Campus Photo
              </label>
              {mediaUrl && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Photo attached</span>
                </span>
              )}
            </div>

            {/* Hidden device file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDeviceUpload}
              className="hidden"
            />

            {/* If photo is already attached / captured */}
            {mediaUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-pink-200 bg-slate-900 shadow-sm group">
                <div className="aspect-[16/10] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={mediaUrl}
                    alt="Attached preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlay action bar on top of image preview */}
                <div className="p-3 bg-white border-t border-pink-100 flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-700 truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate">Ready to share</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraModalOpen(true)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors flex items-center gap-1"
                      title="Retake photo using camera"
                    >
                      <Camera className="w-3.5 h-3.5 text-pink-500" />
                      <span>Retake</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      title="Upload a different photo from device"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Change</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaUrl('')}
                      className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove attached photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Photo Options: Take Photo or Upload From Device */
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Option 1: Take Photo via Camera */}
                  <button
                    type="button"
                    onClick={() => setIsCameraModalOpen(true)}
                    className="p-3.5 rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50/80 via-white to-purple-50/40 hover:from-pink-100 hover:to-white text-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-sm shadow-pink-500/20 group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      Take Photo
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Use live webcam
                    </span>
                  </button>

                  {/* Option 2: Upload from Device */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-800 transition-all flex flex-col items-center justify-center gap-1.5 shadow-2xs group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      Upload from Device
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Pick gallery image
                    </span>
                  </button>
                </div>

                {/* Campus Gallery Presets carousel */}
                <div className="pt-1 space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">
                    Or select from campus moments:
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                    {sampleImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMediaUrl(img)}
                        className="w-13 h-13 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 hover:border-pink-500 opacity-75 hover:opacity-100 transition-all"
                      >
                        <img src={img} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Location field */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Campus Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. North Campus Lawns, Canteen, Tech Lab"
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Poll Builder Toggle */}
          <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <BarChart3 className="w-4 h-4 text-pink-600" />
                <span>Create Campus Poll</span>
              </div>
              <button
                type="button"
                onClick={() => setHasPoll(!hasPoll)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                  hasPoll ? 'bg-pink-100 text-pink-700' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {hasPoll ? 'Active' : '+ Add Poll'}
              </button>
            </div>

            {hasPoll && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a campus poll question..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl outline-none font-medium"
                />

                <div className="space-y-1.5">
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none"
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePollOption(idx)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {pollOptions.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add option</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-md shadow-pink-500/25 transition-all"
            >
              Post to College Crush
            </button>
          </div>
        </form>
      </div>

      {/* Real Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onPhotoAccepted={handlePhotoCaptured}
      />
    </div>
  );
};

