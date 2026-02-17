
import React from 'react';
import { SkillGap } from '../types';

interface SkillGapProps {
  role: string;
  gaps: SkillGap[];
  isLoading: boolean;
}

const SkillGapAnalyzer: React.FC<SkillGapProps> = ({ role, gaps, isLoading }) => {
  if (!role) return (
    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 max-w-2xl mx-auto px-10">
      <div className="text-7xl mb-6 grayscale opacity-20">🎯</div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bridge the Knowledge Gap</h2>
      <p className="text-slate-400 mt-3 leading-relaxed">
        Masar's AI identifies exactly what you need to learn. <br/> 
        Select a career path in the <span className="text-blue-600 font-bold">Explorer</span> to unlock this module.
      </p>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Skill Gap Analysis 🎯</h1>
        <p className="text-slate-500 mt-2 text-lg leading-relaxed">
          Critical comparison for <span className="text-blue-600 font-extrabold">{role}</span>. 
          We've mapped your current stack against industry gold standards.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Auditing Industry Benchmarks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {gaps.map((gap, idx) => (
            <div key={idx} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-slate-900">{gap.skillName}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      gap.importance === 'Critical' 
                        ? 'bg-red-50 text-red-600 border border-red-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {gap.importance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <span>Current: <b className="text-slate-700">{gap.currentLevel}%</b></span>
                    <span className="text-slate-200">|</span>
                    <span>Target: <b className="text-blue-600">{gap.targetLevel}%</b></span>
                  </div>
                </div>
                
                <div className="bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-wider">Gap Delta</p>
                  <p className="text-2xl font-black text-slate-900">{gap.targetLevel - gap.currentLevel}%</p>
                </div>
              </div>

              {/* Progress Visualizer */}
              <div className="relative h-6 bg-slate-100 rounded-2xl overflow-hidden mb-10 border border-slate-50">
                {/* Current Level */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out relative z-10 ${
                    gap.currentLevel > 70 ? 'bg-green-500' : gap.currentLevel > 40 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${gap.currentLevel}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                {/* Gap Region */}
                <div 
                  className="absolute h-full bg-blue-100 transition-all duration-1000 delay-300"
                  style={{ 
                    left: `${gap.currentLevel}%`, 
                    width: `${Math.max(0, gap.targetLevel - gap.currentLevel)}%` 
                  }}
                />
                {/* Target Marker */}
                <div 
                  className="absolute top-0 bottom-0 border-r-4 border-blue-600 z-20 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                  style={{ left: `${gap.targetLevel}%` }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-4 tracking-widest flex items-center">
                    <span className="mr-3 text-lg">💡</span> Actionable Advice
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    {gap.actionableAdvice}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase mb-4 tracking-widest flex items-center">
                    <span className="mr-3 text-lg">📚</span> Curated Resources
                  </h4>
                  <div className="space-y-3">
                    {gap.resources.map((res, rIdx) => (
                      <div 
                        key={rIdx} 
                        className="group flex items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mr-4 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {rIdx + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{res}</span>
                        <span className="ml-auto text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillGapAnalyzer;
