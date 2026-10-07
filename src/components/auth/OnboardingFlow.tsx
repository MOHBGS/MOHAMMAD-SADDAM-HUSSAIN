import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { INTEREST_TAGS, COURSES, YEARS_OF_JOINING } from '../../data/mockData';

export const OnboardingFlow: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    currentUser,
    updateUserProfile,
    colleges,
    users,
    followingUserIds,
    toggleFollowUser,
    setShowLanding,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState(1);

  // Step 1 state
  const [collegeId, setCollegeId] = useState(currentUser?.collegeId || 'du');
  const [course, setCourse] = useState(currentUser?.course || COURSES[0]);
  const [joiningYear, setJoiningYear] = useState(currentUser?.joiningYear || 2024);

  // Step 2 state
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentUser?.interests || ['Campus Life', 'Photography', 'Coding & Hackathons']
  );

  if (!isOnboardingOpen) return null;

  const handleInterestToggle = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      const selectedCol = colleges.find((c) => c.id === collegeId);
      updateUserProfile({
        collegeId,
        collegeName: selectedCol?.name || 'Delhi University',
        course,
        joiningYear: Number(joiningYear),
      });
      setStep(2);
    } else if (step === 2) {
      updateUserProfile({
        bio,
        interests: selectedInterests,
      });
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setIsOnboardingOpen(false);
      setShowLanding(false);
      setActiveTab('home');
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Recommended people based on college & interests
  const recommendedStudents = users
    .filter((u) => u.id !== currentUser?.id)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 px-6 py-4 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full">
              {step} / 4
            </span>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: Tell Us About Your College */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                  Step 1
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Tell Us About Your College
                </h3>
                <p className="text-xs text-slate-500">
                  This helps us connect you with your batchmates and campus clubs.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    College / University
                  </label>
                  <select
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course / Major
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Year of Joining
                  </label>
                  <select
                    value={joiningYear}
                    onChange={(e) => setJoiningYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {YEARS_OF_JOINING.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                {/* College snapshot */}
                <div className="p-3 bg-pink-50/70 rounded-2xl border border-pink-100 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-pink-500 text-white font-black text-xl flex items-center justify-center flex-shrink-0">
                    🎓
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">
                      {colleges.find((c) => c.id === collegeId)?.name}
                    </div>
                    <div className="text-slate-500">
                      {colleges.find((c) => c.id === collegeId)?.studentCount.toLocaleString()}+ students active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Tell Us About You */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                  Step 2
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Tell Us About You
                </h3>
                <p className="text-xs text-slate-500">
                  Pick your campus interests to personalize your feed and recommendations.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Campus Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="E.g. Computer Science nerd, evening cafe lover, always up for campus photography walks!"
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Your Interests ({selectedInterests.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_TAGS.map((tag) => {
                      const isSelected = selectedInterests.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleInterestToggle(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{tag}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Find Your People */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                  Step 3
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Find Your People
                </h3>
                <p className="text-xs text-slate-500">
                  Here are recommended classmates from your campus to kick off your network!
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {recommendedStudents.map((student) => {
                  const isFollowing = followingUserIds.includes(student.id);
                  return (
                    <div
                      key={student.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-pink-50/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.profilePhoto}
                          alt={student.fullName}
                          className="w-11 h-11 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            <span>{student.fullName}</span>
                            {student.isVerified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {student.collegeName} &middot; {student.currentYear}
                          </div>
                          <div className="text-[10px] text-pink-600 truncate max-w-[200px]">
                            {student.interests.slice(0, 2).join(' · ')}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFollowUser(student.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 ${
                          isFollowing
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-pink-500 hover:bg-pink-600 text-white shadow-sm shadow-pink-500/20'
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: You're Ready ❤️ */}
          {step === 4 && (
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-4xl shadow-xl shadow-pink-500/25 animate-pulse-subtle">
                ❤️
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">
                  Ready to go!
                </span>
                <h3 className="text-3xl font-black text-slate-900">
                  Welcome to College Crush
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your campus profile is all set! Connect with friends, share your day,
                  and discover what is happening around your college right now.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 text-left text-xs text-slate-700 space-y-2 max-w-sm mx-auto">
                <div className="font-bold text-pink-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Pro-Tips for New Students:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Check out the <strong>My College</strong> tab for campus events &amp; clubs</li>
                  <li>Watch and create short campus clips on <strong>Crush Reels</strong></li>
                  <li>Join college societies to meet seniors and peers</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Next Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full sm:w-auto px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
          >
            <span>{step === 4 ? 'Start Exploring' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
