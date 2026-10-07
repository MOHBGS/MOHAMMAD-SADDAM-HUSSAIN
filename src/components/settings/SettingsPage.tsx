import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  UserX,
  Bell,
  Trash2,
  CheckCircle,
  AlertTriangle,
  LogOut,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile, logout } = useApp();

  const [isPrivate, setIsPrivate] = useState(currentUser?.isPrivate || false);
  const [whoCanMessage, setWhoCanMessage] = useState(
    currentUser?.whoCanMessage || 'everyone'
  );
  const [whoCanFollow, setWhoCanFollow] = useState(
    currentUser?.whoCanFollow || 'everyone'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      isPrivate,
      whoCanMessage,
      whoCanFollow,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-pink-500" />
            <span>Privacy &amp; Safety Controls</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Student safety is our top priority. Control your campus visibility and who can interact with you.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Your privacy and security preferences have been updated!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSavePrivacy} className="space-y-6">
        {/* Profile Visibility */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Profile Visibility</span>
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Private Account
              </div>
              <div className="text-[11px] text-slate-500">
                When your account is private, only students you approve can see your posts and stories.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:width-5 after:transition-all peer-checked:bg-pink-500" />
            </label>
          </div>

          {/* Who can message */}
          <div className="py-2 border-b border-slate-100 space-y-2">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Who Can Send You Direct Messages
              </div>
              <div className="text-[11px] text-slate-500">
                Filter incoming messages to prevent unwanted outreach.
              </div>
            </div>
            <select
              value={whoCanMessage}
              onChange={(e) => setWhoCanMessage(e.target.value as any)}
              className="w-full sm:w-80 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
            >
              <option value="everyone">Everyone (All students)</option>
              <option value="verified_only">Only Verified College Students</option>
              <option value="following_only">Only Students You Follow</option>
            </select>
          </div>

          {/* Who can follow */}
          <div className="py-2 space-y-2">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Follow Requests
              </div>
              <div className="text-[11px] text-slate-500">
                Choose whether new followers need explicit confirmation from you.
              </div>
            </div>
            <select
              value={whoCanFollow}
              onChange={(e) => setWhoCanFollow(e.target.value as any)}
              className="w-full sm:w-80 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
            >
              <option value="everyone">Instant Follow (Public)</option>
              <option value="approval_required">Manual Approval Required</option>
            </select>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Collegiate Student Verification
            </h3>
          </div>

          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
              ✓
            </span>
            <div className="text-xs text-sky-900">
              <div className="font-bold">Verified Student Identity Active</div>
              <p className="text-[11px] text-sky-700 mt-0.5">
                Your account is confirmed with <strong>{currentUser?.collegeName}</strong>. You have full access to campus fests, student directories, and verified badge styling.
              </p>
            </div>
          </div>
        </div>

        {/* Community Safety Guidelines & Anti-Harassment */}
        <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              College Crush Safety Code
            </h3>
          </div>

          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4 leading-relaxed">
            <li>Never share private hostel room numbers or phone numbers publicly on the feed.</li>
            <li>Zero tolerance for ragging, bullying, impersonation, or harassment.</li>
            <li>Report suspicious accounts or unverified posts instantly with the 3-dot menu.</li>
          </ul>
        </div>

        {/* Save button and Logout */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 rounded-xl shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            Save Privacy Settings
          </button>
        </div>
      </form>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-pink-100 p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Log out of College Crush?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Account session for {currentUser?.fullName}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to log out of your account?
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Your campus data remains safe</p>
              <p className="text-[11px] leading-relaxed">
                Your posts, stories, reels, messages, and friend connections will not be deleted. You can sign back in anytime.
              </p>
            </div>

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
