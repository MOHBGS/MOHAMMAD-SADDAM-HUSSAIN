import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Grid,
  Tag,
  Bookmark,
  Share2,
  MessageCircle,
  UserCheck,
  UserPlus,
  Edit3,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  X,
  LogOut,
  ShieldCheck,
  Lock,
  Settings,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { EditProfileModal } from './EditProfileModal';

export const UserProfilePage: React.FC = () => {
  const {
    currentUser,
    viewingUserId,
    users,
    posts,
    bookmarks,
    followingUserIds,
    toggleFollowUser,
    startChatWithUser,
    logout,
    setActiveTab: setActiveContextTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'tagged' | 'saved'>('posts');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedPostModal, setSelectedPostModal] = useState<any | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine user to display
  const profileUser = viewingUserId
    ? users.find((u) => u.id === viewingUserId) || currentUser
    : currentUser;

  if (!profileUser) return null;

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFollowing = followingUserIds.includes(profileUser.id);

  // Filter posts by this user
  const userPosts = posts.filter((p) => p.userId === profileUser.id);
  const savedPosts = posts.filter((p) => bookmarks.includes(p.id));

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLogoutConfirmOpen(false);
    } catch {
      setIsLogoutConfirmOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm overflow-hidden">
        {/* Cover Image */}
        <div className="h-44 sm:h-56 relative bg-slate-200 overflow-hidden">
          <img
            src={profileUser.coverPhoto || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-6 relative pt-4">
          {/* Avatar and Top Actions */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar */}
            <div className="relative inline-block">
              <img
                src={profileUser.profilePhoto}
                alt={profileUser.fullName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl shadow-slate-900/10 bg-white"
              />
              {profileUser.isVerified && (
                <span
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold ring-2 ring-white shadow-sm"
                  title="Verified College Student"
                >
                  ✓
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl shadow-md shadow-pink-500/20 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => toggleFollowUser(profileUser.id)}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-500/20 hover:from-pink-600'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => startChatWithUser(profileUser)}
                    className="px-4 py-2 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="Share profile link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name & Academic info */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profileUser.fullName}
                </h1>
                <span className="text-xs text-slate-500 font-semibold">
                  @{profileUser.username}
                </span>

                {profileUser.isCrushStatus && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                    <span>{profileUser.isCrushStatus}</span>
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-slate-600 flex items-center gap-2 flex-wrap mt-1">
                <span className="text-pink-600 font-bold">{profileUser.collegeName}</span>
                <span>&middot;</span>
                <span>{profileUser.course}</span>
                <span>&middot;</span>
                <span>{profileUser.currentYear} (Joined {profileUser.joiningYear})</span>
              </div>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed whitespace-pre-line">
                {profileUser.bio}
              </p>
            )}

            {/* Interests Chips */}
            {profileUser.interests && profileUser.interests.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {profileUser.interests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            )}

            {/* Numerical Stats */}
            <div className="flex items-center gap-8 pt-3 border-t border-slate-100 text-slate-900">
              <div>
                <span className="font-extrabold text-base sm:text-lg">
                  {userPosts.length}
                </span>{' '}
                <span className="text-xs text-slate-500">Posts</span>
              </div>

              <div>
                <span className="font-extrabold text-base sm:text-lg">
                  {profileUser.followersCount}
                </span>{' '}
                <span className="text-xs text-slate-500">Followers</span>
              </div>

              <div>
                <span className="font-extrabold text-base sm:text-lg">
                  {profileUser.followingCount}
                </span>{' '}
                <span className="text-xs text-slate-500">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <div className="flex items-center justify-center gap-2 border-b border-pink-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`px-5 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tagged')}
          className={`px-5 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tagged'
              ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Tagged</span>
        </button>

        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-2 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Grid Content */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-pink-100 text-slate-500">
              <p className="text-sm">No campus posts shared yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPostModal(post)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-2xs border border-pink-100/50"
                >
                  <img
                    src={post.mediaUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-white" />
                      {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      {post.commentsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="p-12 text-center bg-white rounded-3xl border border-pink-100 text-slate-500">
          <p className="text-sm">No tagged photos yet.</p>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPostModal(post)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
            >
              <img
                src={post.mediaUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'}
                alt="Post thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Account Settings & Logout Section at bottom of Profile */}
      {isOwnProfile && (
        <div className="mt-8 pt-6 border-t border-pink-100/80 space-y-6">
          {/* Settings & Security Hub Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pink-100/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pink-500" />
                  <span>Account &amp; Security</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage your college credentials, privacy settings, and active session.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[11px] font-semibold border border-pink-100">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                Logged In
              </span>
            </div>

            {/* Quick Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Edit Profile */}
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200/70 hover:border-pink-200 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-pink-500 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors flex items-center justify-between">
                    <span>Edit Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Update student bio, course, and crush status
                  </p>
                </div>
              </button>

              {/* 2. Privacy */}
              <button
                type="button"
                onClick={() => setActiveContextTab('settings')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200/70 hover:border-pink-200 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors flex items-center justify-between">
                    <span>Privacy</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {profileUser.isPrivate ? 'Private account active' : 'Public campus profile'} &bull; DM controls
                  </p>
                </div>
              </button>

              {/* 3. Security */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-left flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-sky-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Security</span>
                    <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md font-semibold">Verified</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Campus verification active &bull; {profileUser.email}
                  </p>
                </div>
              </div>

              {/* 4. Settings */}
              <button
                type="button"
                onClick={() => setActiveContextTab('settings')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200/70 hover:border-pink-200 transition-all text-left flex items-start gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center justify-between">
                    <span>Settings</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    Campus alerts, notifications &amp; safety preferences
                  </p>
                </div>
              </button>
            </div>

            {/* Separator and Log Out Section */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Account Session</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Signing out ends your session on this device. Your campus posts, messages, and profile will be safely preserved.
                </p>
              </div>

              {/* Clearly visible Log Out button */}
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-rose-600 bg-rose-50/90 hover:bg-rose-100 border border-rose-200 hover:border-rose-300 transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 flex-shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* College Crush Version Footer */}
          <div className="text-center py-3 text-slate-400 text-xs">
            <p className="font-semibold text-slate-500">College Crush</p>
            <p className="text-[11px] mt-0.5 text-slate-400">Version 2.4.0 &bull; Safe student community</p>
          </div>
        </div>
      )}

      {/* Dedicated Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccessToast={(msg) => {
          setToastMessage(msg);
          setTimeout(() => setToastMessage(null), 3500);
        }}
      />

      {/* Selected Post Modal Details */}
      {selectedPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
            <button
              onClick={() => setSelectedPostModal(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/60 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-[4/3] bg-slate-100">
              <img
                src={selectedPostModal.mediaUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedPostModal.userName}</span>
                <span className="text-slate-400">{selectedPostModal.createdAt}</span>
              </div>
              <p className="text-slate-700 text-sm">{selectedPostModal.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 p-6 sm:p-7 space-y-5 animate-scale-up">
            {/* Modal header with icon */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Log out of College Crush?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Account session for {currentUser?.fullName || 'student'}
                </p>
              </div>
            </div>

            {/* Confirmation description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to log out of your account?
            </p>

            {/* Reassurance note */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Your campus records are safe</p>
              <p className="text-[11px] leading-relaxed">
                Your posts, stories, reels, messages, and friend connections will not be deleted. You can sign back in anytime using your college credentials.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
