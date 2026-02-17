
import React from 'react';
import { UserProfile, CareerPath } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  careerPaths: CareerPath[];
  onExplore: () => void;
  onEditProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, careerPaths, onExplore, onEditProfile }) => {
  const mockSkillData = profile.skills.map(s => ({
    subject: s,
    A: Math.floor(Math.random() * 40) + 60,
    fullMark: 100,
  })).slice(0, 6);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hello, {profile.fullName.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500">Welcome back to your career growth journey.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onEditProfile}
            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm"
          >
            <span className="mr-2">✏️</span> Edit Profile
          </button>
          <button 
            onClick={onExplore}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center"
          >
            <span className="mr-2">🧭</span> Explore Paths
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{profile.fullName}</p>
                <p className="text-slate-500 text-sm">{profile.currentRole}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Education</span>
                <span className="font-semibold text-slate-800">{profile.education}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Experience</span>
                <span className="font-semibold text-slate-800">{profile.yearsOfExperience} Years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Skills Identified</span>
                <span className="font-semibold text-slate-800">{profile.skills.length}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Aspirations</h4>
            <p className="text-sm text-slate-600 italic">"{profile.aspirations}"</p>
          </div>
        </div>

        {/* Skill Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Skill Visualization</h3>
          <div className="h-full -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockSkillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200 flex flex-col justify-between">
            <p className="text-indigo-100 text-sm font-medium">Growth Index</p>
            <div>
              <p className="text-4xl font-bold">84%</p>
              <p className="text-xs text-indigo-200 mt-1">+12% this month</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <p className="text-slate-500 text-sm font-medium">Job Matches</p>
            <div>
              <p className="text-4xl font-bold text-slate-900">{careerPaths.length || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Available to explore</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm col-span-2 flex flex-col justify-between">
            <p className="text-slate-500 text-sm font-medium">Next Milestone</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">Portfolio Refresh</p>
                <p className="text-xs text-blue-500 font-semibold">2 days remaining</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
                🚀
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recommended Career Paths</h2>
          <button onClick={onExplore} className="text-blue-600 font-semibold text-sm hover:underline">See All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerPaths.slice(0, 3).map((path, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-all text-blue-600 group-hover:text-white">
                  💼
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {path.matchScore}% Match
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{path.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{path.description}</p>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center">
                  💰 {path.salaryRange}
                </span>
                <span className="flex items-center">
                  📈 {path.growthPotential}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
