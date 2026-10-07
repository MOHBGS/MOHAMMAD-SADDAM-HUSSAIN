import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Heart,
  Users,
  ShieldCheck,
  Sparkles,
  Compass,
  ArrowRight,
  GraduationCap,
  MessageCircle,
  Video,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setIsSignUpModalOpen,
    setIsLoginModalOpen,
    setShowLanding,
    setActiveTab,
    colleges,
  } = useApp();

  const [selectedCollegeTab, setSelectedCollegeTab] = useState(colleges[0]?.id || 'du');

  const handleExploreClick = () => {
    setShowLanding(false);
    setActiveTab('explore');
  };

  const handleJoinClick = () => {
    setIsSignUpModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Hero Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-pink-600 font-semibold transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleExploreClick}
              className="hover:text-pink-600 transition-colors"
            >
              Explore
            </button>
            <a href="#features" className="hover:text-pink-600 transition-colors">
              Features
            </a>
            <a href="#colleges" className="hover:text-pink-600 transition-colors">
              Colleges
            </a>
            <a href="#safety" className="hover:text-pink-600 transition-colors">
              Safety
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-pink-600 transition-colors rounded-xl hover:bg-pink-50/60"
            >
              Login
            </button>
            <button
              onClick={handleJoinClick}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-sm shadow-pink-500/25 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-950/90 via-slate-900 to-slate-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center">
        {/* Background Campus Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&auto=format&fit=crop&q=80"
            alt="College Campus"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-radial-at-t from-pink-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>India&apos;s #1 Collegiate Social Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Find Friends, Crushes & Your College Community{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 inline-block">
                ❤️
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              A safe, verified, and fun space for college students to connect,
              share campus moments, find study buddies, and make lifelong friends.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handleJoinClick}
                className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 rounded-xl shadow-lg shadow-pink-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleExploreClick}
                className="px-7 py-3.5 text-base font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm rounded-xl transition-all hover:text-white flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-pink-300" />
                <span>Explore Posts</span>
              </button>
            </div>

            {/* Quick social proof */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Student"
                />
              </div>
              <div>
                <span className="font-semibold text-white">50,000+</span> verified students active across 120+ campuses
              </div>
            </div>
          </div>

          {/* Right Column: Floating Student Photo Cards matching the storyboard */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Glow */}
            <div className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Polaroids / Angled Photo Cards */}
            <div className="relative w-full max-w-md h-[460px] flex items-center justify-center">
              {/* Card 1: Top Right - Ananya on campus */}
              <div className="absolute top-0 right-4 sm:right-6 w-48 sm:w-56 bg-white p-2.5 pb-4 rounded-2xl shadow-2xl shadow-pink-900/30 border border-white/60 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                    alt="Campus moment"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-pink-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                    <span>North Campus</span>
                  </div>
                </div>
                <div className="mt-2 text-center text-xs font-semibold text-slate-800">
                  Ananya S. · DU &apos;26
                </div>
              </div>

              {/* Card 2: Left bottom - College Friends */}
              <div className="absolute bottom-2 left-2 sm:left-4 w-44 sm:w-52 bg-white p-2.5 pb-4 rounded-2xl shadow-2xl shadow-pink-900/30 border border-white/60 transform -rotate-4 hover:rotate-0 transition-transform duration-300 z-10">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80"
                    alt="College squad"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Fest Vibez
                  </div>
                </div>
                <div className="mt-2 text-center text-xs font-semibold text-slate-800">
                  Canteen Hangout ☕
                </div>
              </div>

              {/* Card 3: Mini card top left - Library study buddy */}
              <div className="absolute top-12 left-0 sm:left-2 w-36 bg-white p-2 rounded-xl shadow-xl transform -rotate-6 hidden sm:block border border-white/40">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80"
                    alt="Library"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[10px] text-center font-medium text-slate-700 mt-1">
                  Study Date 📚
                </div>
              </div>

              {/* Tagline Card Floating in Center */}
              <div className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-pink-200 z-20 text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg">
                  ❤️
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Good Vibes. Same Campus.
                  </div>
                  <div className="text-[11px] font-medium text-pink-600">
                    Better People.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Indicators Strip Below Hero */}
        <div className="absolute bottom-0 inset-x-0 bg-white/10 backdrop-blur-md border-t border-white/10 py-4 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">Real College Community</h4>
                <p className="text-[11px] text-slate-300">Dedicated campus hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">Verified Students</h4>
                <p className="text-[11px] text-slate-300">Campus email & student IDs</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">Share Moments</h4>
                <p className="text-[11px] text-slate-300">Stories, photos &amp; confessions</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold">Find Like-Minded Friends</h4>
                <p className="text-[11px] text-slate-300">Matched by year & course</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Core Platform Highlights */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
              Why College Crush
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Built for How Modern Students Actually Connect
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Say goodbye to awkward cold DMs and generic social noise. College Crush brings
              your actual campus social life online in a safe, fun, and genuine environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-pink-50/60 to-white border border-pink-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-pink-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">My College Hub</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A private campus sanctuary with your college&apos;s live feed, upcoming fests,
                active clubs, student council announcements, and batch directory.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-purple-600/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Campus Moments &amp; Chat</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Share authentic campus stories, photos, and chat securely with fellow college students
                from your college and peer universities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-rose-50/60 to-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-5 shadow-sm shadow-rose-500/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Safe Campus DMs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct messaging with verified students, smart privacy toggles, mutual interests
                icebreakers, and strict anti-harassment safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive College Discovery Preview */}
      <section id="colleges" className="py-20 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-600">
                Campuses on College Crush
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                Explore Leading Universities
              </h2>
            </div>
            <button
              onClick={handleExploreClick}
              className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
            >
              <span>View all colleges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Colleges list preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {colleges.slice(0, 4).map((college) => (
              <div
                key={college.id}
                onClick={handleExploreClick}
                className="group cursor-pointer rounded-2xl bg-white overflow-hidden border border-slate-200 hover:border-pink-300 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative h-36 bg-slate-200 overflow-hidden">
                  <img
                    src={college.coverImage}
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-medium text-pink-200 block">
                      {college.city}
                    </span>
                    <h4 className="text-sm font-bold truncate max-w-[200px]">
                      {college.name}
                    </h4>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Users className="w-3.5 h-3.5 text-pink-500" />
                    <span>{college.studentCount.toLocaleString()}+ students</span>
                  </div>
                  <span className="text-pink-600 font-semibold group-hover:translate-x-1 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Safety & Trust */}
      <section id="safety" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-8 sm:p-12 border border-pink-100 flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-7/12 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-700">
                <Lock className="w-3.5 h-3.5" />
                <span>Student Safety First</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Your Campus Privacy is Completely in Your Hands
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We believe social connection should never compromise student safety.
                College Crush provides granular controls: private profiles, college-only visibility,
                message filters, and 24/7 instant reporting.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>College email & ID verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>No public phone numbers or addresses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Zero tolerance anti-bullying policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Customizable message request filters</span>
                </div>
              </div>
            </div>

            <div className="lg:w-5/12 w-full flex justify-center">
              <div className="bg-white p-6 rounded-2xl shadow-xl border border-pink-100 max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Verified Badge</h4>
                    <p className="text-xs text-slate-500">DU &middot; Student ID Verified</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  &ldquo;Having only verified university classmates makes finding new friends and project partners so much more comfortable!&rdquo;
                </p>
                <div className="text-[11px] text-slate-400 font-medium text-right">
                  &mdash; Sneha K., BITS Pilani &apos;26
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="py-16 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Discover Your College Community?
          </h2>
          <p className="text-pink-100 text-base max-w-xl mx-auto">
            Join thousands of students finding friends, building clubs, and creating memories today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={handleJoinClick}
              className="px-8 py-3.5 text-base font-bold text-pink-600 bg-white hover:bg-pink-50 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-8 py-3.5 text-base font-semibold text-white bg-pink-700/60 hover:bg-pink-700 border border-white/20 rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Logo size="md" whiteText />
            <p className="text-slate-400 leading-relaxed">
              The modern college community &amp; social discovery platform for students across India.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><button onClick={handleExploreClick} className="hover:text-pink-400">Campus Posts</button></li>
              <li><button onClick={() => { setShowLanding(false); setActiveTab('messages'); }} className="hover:text-pink-400">Campus Chat</button></li>
              <li><button onClick={() => { setShowLanding(false); setActiveTab('events'); }} className="hover:text-pink-400">College Fests</button></li>
              <li><button onClick={() => { setShowLanding(false); setActiveTab('groups'); }} className="hover:text-pink-400">Student Clubs</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Colleges</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-pink-400">Delhi University</span></li>
              <li><span className="hover:text-pink-400">IIT Bombay</span></li>
              <li><span className="hover:text-pink-400">BITS Pilani</span></li>
              <li><span className="hover:text-pink-400">IIT Delhi</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Safety &amp; Legal</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-pink-400">Community Guidelines</span></li>
              <li><span className="hover:text-pink-400">Student Safety Code</span></li>
              <li><span className="hover:text-pink-400">Privacy Policy</span></li>
              <li><span className="hover:text-pink-400">Report an Incident</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500">
          <div>&copy; 2026 College Crush. All rights reserved.</div>
          <div className="mt-2 sm:mt-0">Good Vibes · Same Campus · Better People ❤️</div>
        </div>
      </footer>
    </div>
  );
};
