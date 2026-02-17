
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  isEditing?: boolean;
}

const INTEREST_OPTIONS = [
  "Artificial Intelligence", "Sustainability", "FinTech", "Creative Arts", 
  "Healthcare", "Education", "Management", "Software Engineering", 
  "Data Science", "Marketing", "Cybersecurity", "Human Resources"
];

const COMMON_SKILLS = [
  "React", "TypeScript", "Python", "JavaScript", "Project Management", "Figma", 
  "SQL", "Data Analysis", "Product Strategy", "Leadership", "Public Speaking", 
  "Java", "AWS", "Docker", "Kubernetes", "UI/UX Design", "Machine Learning",
  "Node.js", "C++", "Agile Methodologies", "Communication", "Problem Solving",
  "Tailwind CSS", "Data Visualization", "Market Research", "Financial Modeling"
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialProfile, isEditing = false }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    fullName: '',
    currentRole: '',
    yearsOfExperience: 0,
    education: '',
    skills: [],
    interests: [],
    aspirations: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Skill Autocomplete Logic
  const filteredSkills = useMemo(() => {
    const inputClean = skillInput.trim().toLowerCase();
    if (!inputClean) return [];
    return COMMON_SKILLS.filter(s => 
      s.toLowerCase().includes(inputClean) && 
      !profile.skills.some(existing => existing.toLowerCase() === s.toLowerCase())
    ).slice(0, 5);
  }, [skillInput, profile.skills]);

  // Load progress on initial mount (if not editing)
  useEffect(() => {
    if (!isEditing && !initialProfile) {
      const saved = localStorage.getItem('masar_onboarding_progress');
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved progress", e);
        }
      }
    }
  }, [isEditing, initialProfile]);

  const saveProgress = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSaveStatus('saving');
    localStorage.setItem('masar_onboarding_progress', JSON.stringify(profile));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const addSkill = (skillToAdd?: string) => {
    const finalSkill = (skillToAdd || skillInput).trim();
    if (finalSkill) {
      // Duplicate prevention (case-insensitive)
      const isDuplicate = profile.skills.some(s => s.toLowerCase() === finalSkill.toLowerCase());
      if (!isDuplicate) {
        setProfile({ ...profile, skills: [...profile.skills, finalSkill] });
      }
      setSkillInput('');
      setShowAutocomplete(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      
      {/* Persistent Save Progress Floating Button (for desktop) */}
      {!isEditing && (
        <div className="fixed top-8 right-8 z-50">
          <button 
            onClick={saveProgress}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg backdrop-blur-md ${
              saveStatus === 'saved' 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {saveStatus === 'saving' ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saveStatus === 'saved' ? '✓ Progress Saved' : '💾 Save Progress'}
          </button>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-8 md:p-14 overflow-visible relative">
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 rounded-t-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            {isEditing ? 'Profile Management' : `Milestone ${step} / 5`}
          </span>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
            {step === 1 && "The Basics"}
            {step === 2 && "Career Snapshot"}
            {step === 3 && "Your Toolkit"}
            {step === 4 && "Domain Focus"}
            {step === 5 && "The Grand Vision"}
          </h2>
        </div>

        <div className="space-y-8 min-h-[340px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Legal Full Name</label>
              <input
                autoFocus
                type="text"
                className="w-full px-7 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all text-xl font-bold bg-slate-50/50"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Alex Sterling"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Current Professional Role</label>
                <input
                  type="text"
                  className="w-full px-7 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold"
                  value={profile.currentRole}
                  onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                  placeholder="e.g. Senior Visual Designer"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-7 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold"
                    value={profile.yearsOfExperience}
                    onChange={(e) => setProfile({ ...profile, yearsOfExperience: Math.max(0, parseInt(e.target.value) || 0) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Education Level</label>
                  <input
                    type="text"
                    className="w-full px-7 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold text-sm"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    placeholder="e.g. MBA in Strategy"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-7 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold"
                    value={skillInput}
                    onChange={(e) => {
                      setSkillInput(e.target.value);
                      setShowAutocomplete(true);
                    }}
                    onFocus={() => setShowAutocomplete(true)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Enter skill (e.g. Python, SQL)"
                  />
                  <button
                    onClick={() => addSkill()}
                    className="px-8 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-widest"
                  >
                    Add
                  </button>
                </div>
                {showAutocomplete && filteredSkills.length > 0 && (
                  <div className="absolute z-50 w-full mt-3 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2">Suggested Skills</p>
                      {filteredSkills.map((s) => (
                        <button
                          key={s}
                          onClick={() => addSkill(s)}
                          className="w-full text-left px-5 py-3.5 hover:bg-blue-50 text-slate-700 font-bold transition-colors rounded-xl flex items-center justify-between group"
                        >
                          {s}
                          <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">Add +</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5 max-h-48 overflow-y-auto p-4 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                {profile.skills.length === 0 && (
                  <div className="w-full text-center py-6">
                    <p className="text-slate-400 text-sm font-medium italic">Type and press Enter to populate your skill set</p>
                  </div>
                )}
                {profile.skills.map((s, idx) => (
                  <span key={idx} className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-blue-200 flex items-center animate-in zoom-in-50 duration-300">
                    {s}
                    <button 
                      onClick={() => setProfile({...profile, skills: profile.skills.filter(sk => sk !== s)})}
                      className="ml-3 text-white/60 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    profile.interests.includes(interest)
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Where do you see yourself in 5 years?</label>
              <textarea
                className="w-full px-8 py-6 rounded-[2rem] border-2 border-slate-100 focus:border-blue-500 outline-none transition-all h-44 text-lg font-medium leading-relaxed bg-slate-50/50"
                value={profile.aspirations}
                onChange={(e) => setProfile({ ...profile, aspirations: e.target.value })}
                placeholder="Describe your ideal career destination..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="text-slate-400 font-black uppercase tracking-widest hover:text-slate-800 px-6 py-3 transition-all text-xs"
            >
              Previous
            </button>
          ) : <div />}
          
          <button
            onClick={step === 5 ? () => onComplete(profile) : handleNext}
            className="px-12 py-5 bg-blue-600 text-white font-black rounded-[1.25rem] hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center text-sm uppercase tracking-widest group"
          >
            {step === 5 ? (isEditing ? 'Confirm Changes' : 'Start My Journey') : 'Proceed'}
            <span className="ml-3 text-xl font-light group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
