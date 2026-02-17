
import React from 'react';
import { CareerPath } from '../types';

interface CareerExplorerProps {
  paths: CareerPath[];
  isLoading: boolean;
  onSelect: (role: string) => void;
  onRefresh: () => void;
}

const CareerExplorer: React.FC<CareerExplorerProps> = ({ paths, isLoading, onSelect, onRefresh }) => {
  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Career Compass 🧭</h1>
          <p className="text-slate-500 mt-1">Multi-dimensional career mapping tailored to your unique profile.</p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <span>🔄</span> Recalibrate
        </button>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Processing Neural Paths...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-500 hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full translate-x-16 -translate-y-16 ${idx % 2 === 0 ? 'bg-blue-600' : 'bg-indigo-600'}`} />

              <div className="flex justify-between items-start mb-8">
                <div className={`text-4xl p-5 rounded-3xl ${idx % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {idx % 2 === 0 ? '💎' : '⚡'}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-slate-900">{path.matchScore}%</div>
                  <div className="text-[10px] text-blue-500 uppercase font-black tracking-widest">Alignment Score</div>
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{path.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">{path.description}</p>
              
              <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-3xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-wider">Salary Potential</p>
                    <p className="text-slate-900 font-bold text-lg">{path.salaryRange}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-3xl">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-wider">Growth Factor</p>
                    <p className={`font-bold text-lg ${path.growthPotential === 'High' ? 'text-green-600' : 'text-amber-600'}`}>
                      {path.growthPotential}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-3 tracking-wider flex items-center">
                    <span className="mr-2">📋</span> Core Responsibilities
                  </p>
                  <ul className="grid grid-cols-1 gap-2">
                    {path.responsibilities.slice(0, 3).map((res, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        {res}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-black uppercase mb-1 tracking-wider">Future Outlook</p>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">{path.outlook}</p>
                </div>
              </div>

              <button 
                onClick={() => onSelect(path.title)}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                Perform Skill Deep-Dive 🎯
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareerExplorer;
