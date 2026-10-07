import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Sparkles, Check, Plus, Search, ChevronRight } from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const { groups, toggleGroupMembership } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Coding & Tech',
    'Arts & Photography',
    'Music & Dance',
    'Debate & Literature',
    'Entrepreneurship',
  ];

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 lg:pb-8 space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-md shadow-purple-500/20">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
            Student Societies &amp; Clubs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Campus Communities
          </h2>
          <p className="text-xs sm:text-sm text-pink-100">
            Join student-led societies, attend weekend workshops, find jam partners, and build projects together.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus clubs and societies..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-pink-100 rounded-2xl outline-none shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 bg-white rounded-2xl border border-pink-100">
          {categories.slice(0, 4).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === c
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-3xl border border-pink-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-2xl flex items-center justify-center flex-shrink-0">
                    {group.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {group.name}
                    </h3>
                    <div className="text-[11px] text-pink-600 font-semibold">
                      {group.category}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleGroupMembership(group.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    group.isMember
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white shadow-sm shadow-pink-500/20'
                  }`}
                >
                  {group.isMember ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Member</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Join Club</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <span className="font-semibold text-slate-700">
                  {group.memberCount} student members
                </span>
              </div>
              <div className="text-[11px]">Led by {group.leaderName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
