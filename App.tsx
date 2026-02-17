
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import CareerExplorer from './components/CareerExplorer';
import SkillGapAnalyzer from './components/SkillGap';
import GrowthRoadmap from './components/GrowthRoadmap';
import { AppState, UserProfile, CareerPath, SkillGap, RoadmapStep } from './types';
import { generateCareerPaths, analyzeSkillGap, generateRoadmap } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  
  const [loadingPaths, setLoadingPaths] = useState(false);
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Persistence: Check for finalized profile or onboarding progress
  useEffect(() => {
    const savedProfile = localStorage.getItem('masar_final_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setAppState(AppState.DASHBOARD);
        triggerInitialAnalysis(parsed);
      } catch (e) {
        console.error("Critical error loading profile", e);
      }
    }
  }, []);

  // Clear success message after timeout
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const triggerInitialAnalysis = async (userProfile: UserProfile) => {
    setLoadingPaths(true);
    setError(null);
    try {
      const paths = await generateCareerPaths(userProfile);
      setCareerPaths(paths);
      if (appState === AppState.EDIT_PROFILE) {
        setSuccessMsg("Career paths recalculated successfully! ✨");
      }
    } catch (error: any) {
      console.error("Masar AI Error:", error);
      const isQuota = error.message?.includes('429') || error.message?.includes('quota');
      setError(isQuota 
        ? "API quota temporarily reached. We've scheduled a retry, but the service is currently under high load." 
        : "Neural analysis interrupted. Please check your connection and try again."
      );
    } finally {
      setLoadingPaths(false);
    }
  };

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    const wasEditing = appState === AppState.EDIT_PROFILE;
    setProfile(userProfile);
    localStorage.setItem('masar_final_profile', JSON.stringify(userProfile));
    localStorage.removeItem('masar_onboarding_progress'); // Clear temporary progress
    setAppState(AppState.DASHBOARD);
    
    if (wasEditing) {
      setSuccessMsg("Profile updated successfully. Refreshing recommendations...");
    }
    
    triggerInitialAnalysis(userProfile);
  };

  const handleRoleSelection = async (role: string) => {
    setSelectedRole(role);
    setAppState(AppState.SKILLS);
    setError(null);
    
    if (profile) {
      setLoadingGaps(true);
      setLoadingRoadmap(true);
      try {
        const [gaps, plan] = await Promise.all([
          analyzeSkillGap(profile, role),
          generateRoadmap(profile, role)
        ]);
        setSkillGaps(gaps);
        setRoadmap(plan);
      } catch (error: any) {
        console.error("Masar AI Role Analysis Error:", error);
        setError("Role-specific deep dive failed. This is usually due to temporary API traffic spikes.");
      } finally {
        setLoadingGaps(false);
        setLoadingRoadmap(false);
      }
    }
  };

  const refreshPaths = async () => {
    if (profile) {
      triggerInitialAnalysis(profile);
    }
  };

  const handleEditProfile = () => {
    setAppState(AppState.EDIT_PROFILE);
    setError(null);
  };

  return (
    <Layout activeState={appState} onNavigate={setAppState}>
      {/* Toast Feedback System */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 space-y-3">
        {error && (
          <div className="p-4 bg-white border-l-4 border-red-500 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-10 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold">!</div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-0.5">Analysis Alert</p>
                <p className="text-sm text-slate-600 font-medium">{error}</p>
              </div>
            </div>
            <button onClick={() => setError(null)} className="p-2 text-slate-300 hover:text-slate-500">×</button>
          </div>
        )}
        
        {successMsg && (
          <div className="p-4 bg-white border-l-4 border-green-500 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-top-10 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold">✓</div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest mb-0.5">Success</p>
                <p className="text-sm text-slate-600 font-medium">{successMsg}</p>
              </div>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="p-2 text-slate-300 hover:text-slate-500">×</button>
          </div>
        )}
      </div>

      {(appState === AppState.ONBOARDING || appState === AppState.EDIT_PROFILE) && (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          initialProfile={profile} 
          isEditing={appState === AppState.EDIT_PROFILE} 
        />
      )}
      
      {appState === AppState.DASHBOARD && profile && (
        <Dashboard 
          profile={profile} 
          careerPaths={careerPaths} 
          onExplore={() => setAppState(AppState.EXPLORER)} 
          onEditProfile={handleEditProfile}
        />
      )}
      
      {appState === AppState.EXPLORER && (
        <CareerExplorer 
          paths={careerPaths} 
          isLoading={loadingPaths} 
          onSelect={handleRoleSelection}
          onRefresh={refreshPaths}
        />
      )}
      
      {appState === AppState.SKILLS && (
        <SkillGapAnalyzer 
          role={selectedRole} 
          gaps={skillGaps} 
          isLoading={loadingGaps} 
        />
      )}
      
      {appState === AppState.ROADMAP && (
        <GrowthRoadmap 
          role={selectedRole} 
          roadmap={roadmap} 
          isLoading={loadingRoadmap} 
        />
      )}
    </Layout>
  );
};

export default App;
