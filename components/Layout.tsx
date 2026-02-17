
import React, { useState } from 'react';
import { AppState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeState: AppState;
  onNavigate: (state: AppState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeState, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppState.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: AppState.EXPLORER, label: 'Career Compass', icon: '🧭' },
    { id: AppState.SKILLS, label: 'Skill Gap', icon: '🎯' },
    { id: AppState.ROADMAP, label: 'Growth Plan', icon: '🚀' },
  ];

  if (activeState === AppState.ONBOARDING) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MASAR AI
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Career Navigator</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeState === item.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-2 rounded-lg bg-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
              JD
            </div>
            <div className="ml-3">
              <p className="text-xs font-semibold text-slate-900">John Doe</p>
              <p className="text-[10px] text-slate-500">Free Tier</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Nav Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
        <h1 className="text-lg font-bold text-blue-600">MASAR AI</h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-6">
          <nav className="space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center p-4 text-lg font-semibold rounded-2xl ${
                  activeState === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                <span className="mr-4 text-2xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
