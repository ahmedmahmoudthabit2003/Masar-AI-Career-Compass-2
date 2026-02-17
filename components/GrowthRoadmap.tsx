
import React from 'react';
import { RoadmapStep } from '../types';

interface GrowthRoadmapProps {
  role: string;
  roadmap: RoadmapStep[];
  isLoading: boolean;
}

const GrowthRoadmap: React.FC<GrowthRoadmapProps> = ({ role, roadmap, isLoading }) => {
  if (!role) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
      <div className="text-5xl mb-4">🚀</div>
      <h2 className="text-xl font-bold text-slate-900">Your Future Awaits</h2>
      <p className="text-slate-500 mt-2">Pick a destination in the Explorer to generate your roadmap.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Growth Roadmap 🚀</h1>
        <p className="text-slate-500">Your 12-month transformation plan to become a <span className="text-blue-600 font-bold">{role}</span>.</p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Architecting your master plan...</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200 rounded-full hidden md:block"></div>

          <div className="space-y-12">
            {roadmap.map((step, idx) => (
              <div key={idx} className="relative md:pl-24 group">
                {/* Timeline Dot */}
                <div className="absolute left-6 top-1.5 w-5 h-5 bg-white border-4 border-blue-600 rounded-full z-10 hidden md:block group-hover:scale-125 transition-transform"></div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                        {step.timeframe}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-400">
                      {idx === 0 ? '🏁 START' : idx === roadmap.length - 1 ? '🏆 GOAL' : '⏳ IN PROGRESS'}
                    </div>
                  </div>

                  <p className="text-slate-500 mb-6 text-lg">{step.description}</p>

                  <div className="bg-slate-50 p-6 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Action Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.actionItems.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-start gap-3 text-slate-700">
                          <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                          </div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthRoadmap;
