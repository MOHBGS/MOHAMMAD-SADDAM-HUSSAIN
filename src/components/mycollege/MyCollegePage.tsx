import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  MapPin,
  Megaphone,
  UserPlus,
  UserCheck,
  Search,
} from 'lucide-react';
import { PostCard } from '../feed/PostCard';

export const MyCollegePage: React.FC = () => {
  const {
    currentUser,
    colleges,
    posts,
    users,
    events,
    groups,
    followingUserIds,
    toggleFollowUser,
    viewUserProfile,
  } = useApp();

  const [activeCollegeTab, setActiveCollegeTab] = useState<
    'feed' | 'students' | 'groups' | 'events' | 'announcements'
  >('feed');
  const [studentSearch, setStudentSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  // Active college info
  const userCollege =
    colleges.find((c) => c.id === currentUser?.collegeId) || colleges[0];

  // College-specific posts
  const collegePosts = posts.filter(
    (p) =>
      p.userCollege.toLowerCase().includes(userCollege.shortName.toLowerCase()) ||
      p.userCollege.toLowerCase().includes('delhi')
  );

  // College students
  const collegeStudents = users.filter((u) => {
    const matchesQuery =
      u.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      u.course.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesYear = yearFilter === 'All' || u.currentYear === yearFilter;
    return matchesQuery && matchesYear;
  });

  const collegeEvents = events.filter((e) => e.collegeId === userCollege.id || e.collegeId === 'du');
  const collegeGroups = groups.filter((g) => g.collegeId === userCollege.id || g.collegeId === 'du');

  const announcements = [
    {
      id: 'a1',
      title: 'Annual Cultural Fest "Tarang 2026" Registrations Open!',
      date: 'Today, 10:00 AM',
      author: 'Student Council Secretariat',
      content:
        'All department societies are invited to submit their team rosters for street play, debate, and battle of the bands. Early registration guarantees priority performance slots!',
      priority: 'high',
    },
    {
      id: 'a2',
      title: 'Extended Library Hours during Mid-Term Examinations',
      date: 'Yesterday, 4:30 PM',
      author: 'Central Library Administration',
      content:
        'The main reading halls and digital innovation labs will remain accessible until 2:00 AM starting next Monday. Canteen tea kiosks will operate late night.',
      priority: 'normal',
    },
    {
      id: 'a3',
      title: 'Inter-Collegiate Hackathon Cash Prize Announcement',
      date: 'Oct 05, 2026',
      author: 'DU Developers & AI Hub',
      content:
        'Top 3 winning teams in HackCampus will receive direct mentorship with venture incubators and ₹1,50,000 in seed grants. Free midnight snacks for all shortlisted hackers!',
      priority: 'normal',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      {/* College Banner Hero */}
      <div className="bg-white rounded-3xl border border-pink-100/80 shadow-sm overflow-hidden">
        <div className="h-44 sm:h-60 relative bg-slate-200">
          <img
            src={userCollege.coverImage}
            alt={userCollege.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 sm:right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-300 bg-pink-500/30 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  Your Campus Sanctuary
                </span>
                <span className="text-xs text-slate-300">
                  Est. {userCollege.established}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black truncate max-w-xl">
                {userCollege.name}
              </h1>
              <div className="text-xs text-slate-300 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  {userCollege.location}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1 font-semibold text-pink-200">
                  <Users className="w-3.5 h-3.5" />
                  {userCollege.studentCount.toLocaleString()}+ students
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-right self-start sm:self-auto">
              <div className="text-[10px] text-pink-200 font-semibold uppercase">
                Campus Status
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Semester &bull; Fest Week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-4 sm:px-6 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'feed', label: 'Campus Feed' },
            { id: 'students', label: `Classmates & Batch (${collegeStudents.length})` },
            { id: 'groups', label: `Clubs (${collegeGroups.length})` },
            { id: 'events', label: `Events (${collegeEvents.length})` },
            { id: 'announcements', label: `Announcements (${announcements.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCollegeTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all ${
                activeCollegeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Campus Feed */}
      {activeCollegeTab === 'feed' && (
        <div className="space-y-6">
          {collegePosts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-pink-100 text-slate-500">
              <p className="text-sm">No campus posts yet.</p>
            </div>
          ) : (
            collegePosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* Tab 2: Students & Classmates Directory */}
      {activeCollegeTab === 'students' && (
        <div className="space-y-4">
          {/* Search & filter bar */}
          <div className="p-4 bg-white rounded-3xl border border-pink-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search classmates by name or course (e.g. B.Tech, Psychology)..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500">Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {collegeStudents.map((student) => {
              const isFollowing = followingUserIds.includes(student.id);
              return (
                <div
                  key={student.id}
                  className="p-4 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 shadow-sm transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => viewUserProfile(student.id)}
                    className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                  >
                    <img
                      src={student.profilePhoto}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors flex items-center gap-1 truncate">
                        <span>{student.fullName}</span>
                        {student.isVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-pink-600 font-semibold truncate">
                        {student.course}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {student.currentYear} &middot; Joined {student.joiningYear}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFollowUser(student.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 flex-shrink-0 ${
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

      {/* Tab 3: Campus Groups */}
      {activeCollegeTab === 'groups' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collegeGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-3xl border border-pink-100 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-pink-50 rounded-2xl">{group.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {group.category} &middot; Led by {group.leaderName}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {group.description}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {group.memberCount} student members
                </span>
                <span className="font-bold text-pink-600">
                  {group.isMember ? 'Joined Society ✓' : 'Join Club +'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Campus Events */}
      {activeCollegeTab === 'events' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collegeEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="h-36 relative">
                <img
                  src={ev.posterUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {ev.category}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{ev.description}</p>
                <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                  <div>📅 {ev.eventDate} &middot; {ev.time}</div>
                  <div>📍 {ev.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Announcements */}
      {activeCollegeTab === 'announcements' && (
        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white rounded-3xl border border-pink-100 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{item.author}</span>
                </span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
