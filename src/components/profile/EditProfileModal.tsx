import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Camera,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Plus,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { COURSES, CURRENT_YEARS, INTEREST_TAGS } from '../../data/mockData';
import { validateImageFile, uploadProfilePhoto, formatFileSize } from '../../utils/storage';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { currentUser, users, colleges, updateUserProfile } = useApp();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [joiningYear, setJoiningYear] = useState<number>(2024);
  const [currentYear, setCurrentYear] = useState('');
  const [crushStatus, setCrushStatus] = useState<any>('Available');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Photo states
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Validation & Saving states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setFullName(currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setCollegeId(currentUser.collegeId || 'du');
      setCollegeName(currentUser.collegeName || 'Delhi University');
      setCourse(currentUser.course || COURSES[0]);
      setJoiningYear(currentUser.joiningYear || 2024);
      setCurrentYear(currentUser.currentYear || '1st Year');
      setCrushStatus(currentUser.isCrushStatus || 'Available');
      setInterests(currentUser.interests ? [...currentUser.interests] : []);
      setPhotoPreview(currentUser.profilePhoto || '');
      setSelectedPhotoFile(null);
      setIsPhotoRemoved(false);
      setPhotoError(null);
      setUploadProgress(null);
      setErrors({});
      setSuccessMessage(null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  // Handle Photo Selection via real browser file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate using storage utility
    const validation = validateImageFile(file, 10 * 1024 * 1024);
    if (!validation.valid) {
      setPhotoError(validation.error || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedPhotoFile(file);
    setIsPhotoRemoved(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPhotoPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoFile(null);
    setIsPhotoRemoved(true);
    setPhotoError(null);
    // Reset to friendly default monogram / avatar
    setPhotoPreview(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Student')}&background=f43f5e&color=fff&size=400`
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleInterest = (tag: string) => {
    if (interests.includes(tag)) {
      setInterests((prev) => prev.filter((i) => i !== tag));
    } else {
      if (interests.length >= 8) return;
      setInterests((prev) => [...prev, tag]);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = customInterestInput.trim();
    if (!tag) return;
    if (!interests.includes(tag) && interests.length < 8) {
      setInterests((prev) => [...prev, tag]);
    }
    setCustomInterestInput('');
  };

  const handleCollegeChange = (id: string) => {
    setCollegeId(id);
    const matched = colleges.find((c) => c.id === id);
    if (matched) {
      setCollegeName(matched.name);
    }
  };

  // Field Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters.';
    }

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      errs.username = 'Username is required.';
    } else if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername)) {
      errs.username = 'Username must be 3-24 characters, containing only letters, numbers, and underscores.';
    } else {
      // Check uniqueness against other users
      const conflict = users.some(
        (u) => u.id !== currentUser.id && u.username.toLowerCase() === cleanUsername
      );
      if (conflict) {
        errs.username = 'This username is already taken. Please pick another one.';
      }
    }

    if (bio.length > 250) {
      errs.bio = 'Campus Bio cannot exceed 250 characters.';
    }

    if (!collegeId) {
      errs.college = 'Please select a valid college or university.';
    }

    if (!course.trim()) {
      errs.course = 'Please select your academic course.';
    }

    if (!joiningYear || joiningYear < 2015 || joiningYear > 2026) {
      errs.joiningYear = 'Please specify a valid joining year (2015 - 2026).';
    }

    if (!currentYear) {
      errs.currentYear = 'Please specify your current college year.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setPhotoError(null);

    try {
      let finalPhotoUrl = photoPreview;

      // 1. Upload new image if selected
      if (selectedPhotoFile) {
        setUploadProgress(10);
        const uploadResult = await uploadProfilePhoto(
          selectedPhotoFile,
          currentUser.id,
          (progress) => setUploadProgress(progress)
        );
        finalPhotoUrl = uploadResult.url;
      } else if (isPhotoRemoved) {
        finalPhotoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=f43f5e&color=fff&size=400`;
      }

      // 2. Update user profile database record
      updateUserProfile({
        fullName: fullName.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        collegeId,
        collegeName,
        course,
        joiningYear,
        currentYear,
        isCrushStatus: crushStatus,
        interests,
        profilePhoto: finalPhotoUrl,
      });

      // 3. Trigger feedback and close
      setSuccessMessage('Profile updated successfully');
      if (onSuccessToast) {
        onSuccessToast('Profile updated successfully');
      }

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsSaving(false);
      setUploadProgress(null);
      setPhotoError(err?.message || 'Failed to update profile photo. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-pink-50/60 to-purple-50/40 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>Edit My Profile</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your campus profile information and student credentials
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {successMessage && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Section 1: Profile Photo */}
          <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Profile Photo
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Accepts JPG, PNG, or WebP up to 10 MB. Updates your student avatar everywhere.
                </p>
              </div>
              {selectedPhotoFile && (
                <span className="text-[10px] font-semibold text-pink-600 bg-pink-100/80 px-2.5 py-1 rounded-full">
                  New file ready ({formatFileSize(selectedPhotoFile.size)})
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group flex-shrink-0">
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
                {uploadProgress !== null && (
                  <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-[10px] font-bold mt-1">{uploadProgress}%</span>
                  </div>
                )}
              </div>

              {/* Photo Actions */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-photo-input"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                    className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isSaving || isPhotoRemoved}
                    className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Remove Photo</span>
                  </button>
                </div>

                {photoError && (
                  <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1.5 mt-1 justify-center sm:justify-start">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{photoError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Personal Identity */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="e.g. Ananya Sharma"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white border rounded-xl outline-none transition-all ${
                    errors.fullName ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-pink-500'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
                    }}
                    placeholder="ananya_sharma"
                    className={`w-full pl-7 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white border rounded-xl outline-none transition-all ${
                      errors.username ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-pink-500'
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.username}</p>
                )}
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Campus Email Address
                </label>
                <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border border-sky-100">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Identity (Read-only)
                </span>
              </div>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 text-slate-500 rounded-xl outline-none cursor-not-allowed select-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Collegiate credentials are authentication-locked for campus student safety.
              </p>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Campus Bio</label>
                <span className={`text-[10px] font-semibold ${bio.length > 250 ? 'text-rose-500' : 'text-slate-400'}`}>
                  {bio.length} / 250
                </span>
              </div>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  if (errors.bio) setErrors((prev) => ({ ...prev, bio: '' }));
                }}
                rows={3}
                placeholder="Share your college journey, hostel vibes, campus passions, or what makes you smile..."
                className={`w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white border rounded-xl outline-none transition-all resize-none ${
                  errors.bio ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-pink-500'
                }`}
              />
              {errors.bio && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.bio}</p>
              )}
            </div>
          </div>

          {/* Section 3: College Academic Details */}
          <div className="p-4 sm:p-5 bg-pink-50/30 rounded-2xl border border-pink-100/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Academic &amp; Campus Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / University <span className="text-rose-500">*</span>
                </label>
                <select
                  value={collegeId}
                  onChange={(e) => handleCollegeChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                >
                  {colleges.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name} ({col.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course / Major <span className="text-rose-500">*</span>
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Joining Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Year of Joining
                </label>
                <select
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} {yr === 2026 ? '(Incoming Fresher)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Year */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Year of Study
                </label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                >
                  {CURRENT_YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Crush Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Campus Crush Status
              </label>
              <select
                value={crushStatus}
                onChange={(e) => setCrushStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
              >
                <option value="Available">Available &bull; Looking to meet new friends</option>
                <option value="Ask me">Ask me &bull; Keep it mysterious</option>
                <option value="Focusing on Studies">Focusing on Studies &bull; Career mode</option>
                <option value="Taken">Taken &bull; Campus sweetheart</option>
              </select>
            </div>
          </div>

          {/* Section 4: Interests */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Campus Interests &amp; Hobbies
                </label>
                <span className="text-[11px] font-semibold text-pink-600">
                  {interests.length} / 8 selected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Helps other college students connect with you through mutual vibes
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleInterest(tag)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-2xs shadow-pink-500/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <span className="mr-1">&check;</span>}
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom interest tag input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customInterestInput}
                onChange={(e) => setCustomInterestInput(e.target.value)}
                placeholder="Add custom interest tag..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-pink-500"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                disabled={!customInterestInput.trim() || interests.length >= 8}
                className="px-3 py-1.5 text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md shadow-pink-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
