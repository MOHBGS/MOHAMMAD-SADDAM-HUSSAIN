import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  X,
  Lock,
  Search,
  Upload,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  Mail,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { COURSES, YEARS_OF_JOINING, CURRENT_YEARS } from '../../data/mockData';

export const SignUpModal: React.FC = () => {
  const {
    isSignUpModalOpen,
    setIsSignUpModalOpen,
    setIsLoginModalOpen,
    registerUser,
    colleges,
  } = useApp();

  // Multi-step signup flow: 'form' -> 'otp'
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // College selector
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('du');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  // Academic info
  const [course, setCourse] = useState(COURSES[0]);
  const [joiningYear, setJoiningYear] = useState(2024);
  const [currentYear, setCurrentYear] = useState(CURRENT_YEARS[1]); // 2nd year

  // Optional fields
  const [gender, setGender] = useState<'female' | 'male' | 'non-binary' | 'prefer-not-to-say'>('female');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP Verification state
  const [generatedOtp, setGeneratedOtp] = useState('742918');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  if (!isSignUpModalOpen) return null;

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.city.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const selectedCollegeObj = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return 'Password must contain at least one special character';
    return '';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';

    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!selectedCollegeId) newErrors.college = 'Please choose your college or university';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Generate random 6-digit OTP code for email verification
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp(['', '', '', '', '', '']);
    setOtpError('');
    setResendTimer(30);
    setStep('otp');
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const val = value.slice(-1); // take last character if typed
    const updated = [...enteredOtp];
    updated[index] = val;
    setEnteredOtp(updated);
    setOtpError('');

    // Auto-advance to next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !enteredOtp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    setEnteredOtp(generatedOtp.split(''));
    setOtpError('');
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setOtpError('');
  };

  const handleVerifyOtpAndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const fullEnteredOtp = enteredOtp.join('');

    if (fullEnteredOtp.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (fullEnteredOtp !== generatedOtp) {
      setOtpError('Invalid OTP code. Please enter the code sent to your email.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setStep('form');
      registerUser({
        fullName,
        email,
        collegeId: selectedCollegeObj.id,
        collegeName: selectedCollegeObj.name,
        course,
        joiningYear: Number(joiningYear),
        currentYear,
        gender,
        dateOfBirth,
        bio: bio || 'Campus enthusiast excited to make friends!',
        profilePhoto,
      });
    }, 600);
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-pink-100 my-8 overflow-hidden transform transition-all max-h-[90vh] flex flex-col animate-fade-in">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsSignUpModalOpen(false);
            setStep('form');
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-b from-pink-50/70 to-transparent pt-7 pb-3 px-6 sm:px-8 text-center flex flex-col items-center flex-shrink-0">
          <Logo size="md" showText={false} />
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            {step === 'form' ? 'Create Your Account' : 'Verify Email OTP'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 'form'
              ? 'Join your college community today & unlock verified campus social life'
              : `Enter the 6-digit verification code sent to ${email}`}
          </p>
        </div>

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <div className="p-6 sm:p-8 pt-2 overflow-y-auto flex-1">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                    required
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-0.5">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                    required
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                      className="w-full pl-3.5 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[11px] text-rose-500 mt-0.5">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-pink-500 rounded-xl outline-none"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 mt-0.5">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Searchable College Dropdown */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University Name *
                </label>
                <div
                  onClick={() => setShowCollegeDropdown(!showCollegeDropdown)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/60 cursor-pointer border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <span className="font-medium text-slate-800">
                    {selectedCollegeObj.name} &middot; {selectedCollegeObj.city}
                  </span>
                  <Search className="w-4 h-4 text-slate-400" />
                </div>

                {showCollegeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-pink-200 shadow-xl rounded-2xl z-30 p-2 max-h-60 overflow-y-auto">
                    <input
                      type="text"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      placeholder="Search campus by name or city..."
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg mb-2 outline-none"
                      autoFocus
                    />
                    <div className="space-y-1">
                      {filteredColleges.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedCollegeId(c.id);
                            setShowCollegeDropdown(false);
                          }}
                          className={`px-3 py-2 text-xs rounded-xl cursor-pointer flex items-center justify-between ${
                            selectedCollegeId === c.id
                              ? 'bg-pink-50 text-pink-700 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-[11px] text-slate-400">{c.location}</div>
                          </div>
                          {selectedCollegeId === c.id && (
                            <span className="text-pink-600 font-bold text-xs">Selected</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Course, Year of Joining, Current Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course *
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Year of Joining *
                  </label>
                  <select
                    value={joiningYear}
                    onChange={(e) => setJoiningYear(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {YEARS_OF_JOINING.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Year *
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    {CURRENT_YEARS.map((cy) => (
                      <option key={cy} value={cy}>
                        {cy}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender & DOB (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Profile Photo selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose Profile Photo <span className="text-slate-400 font-normal">(Pick avatar or upload)</span>
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={profilePhoto}
                    alt="Avatar"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-500 shadow-sm"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    {sampleAvatars.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfilePhoto(av)}
                        className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform ${
                          profilePhoto === av ? 'border-pink-500 scale-105 ring-2 ring-pink-200' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="Option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bio <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What excites you on campus? Interests, canteen hangout spots, societies..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              {/* Security notice */}
              <div className="bg-pink-50/50 p-2.5 rounded-xl border border-pink-100 flex items-start gap-2 text-[11px] text-pink-700">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-pink-500 mt-0.5" />
                <span>
                  We will send a one-time verification OTP to your college or personal email to confirm your account.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
              >
                <span>Get Email Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Social signup / Login toggle */}
            <div className="pt-4 text-center text-xs text-slate-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUpModalOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="font-bold text-pink-600 hover:text-pink-700"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Email OTP Verification Step */}
        {step === 'otp' && (
          <div className="p-6 sm:p-8 pt-2 overflow-y-auto flex-1 space-y-5 animate-fade-in">
            {/* Simulated Live Inbox Banner */}
            <div
              onClick={handleAutoFillDemoOtp}
              className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 cursor-pointer hover:border-pink-400 transition-colors flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5 text-xs text-slate-700">
                <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Incoming Verification OTP</span>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-semibold">
                      Demo Code
                    </span>
                  </div>
                  <div className="text-[11px] text-pink-600 font-mono font-bold tracking-wider">
                    {generatedOtp}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-pink-600 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-pink-100">
                Click to Auto-fill
              </span>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-pink-500" />
                  <span>Code sent to: <strong className="text-slate-900">{email}</strong></span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter the 6-digit verification code below to verify your student email.
                </p>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {enteredOtp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-2xl border outline-none transition-all ${
                      digit
                        ? 'border-pink-500 bg-pink-50/50 text-slate-900 ring-2 ring-pink-100'
                        : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-pink-400 focus:bg-white'
                    }`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {otpError && (
                <div className="text-center text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-semibold">
                  {otpError}
                </div>
              )}

              {/* Resend and timer */}
              <div className="flex items-center justify-center gap-2 text-xs">
                {resendTimer > 0 ? (
                  <span className="text-slate-400">
                    Resend code in <strong className="text-pink-600">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isVerifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP &amp; Create Account</span>
                  </>
                )}
              </button>

              {/* Edit Details Button */}
              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit email or registration details</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

