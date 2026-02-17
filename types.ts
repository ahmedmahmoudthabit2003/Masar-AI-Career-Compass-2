
export interface UserProfile {
  fullName: string;
  currentRole: string;
  yearsOfExperience: number;
  education: string;
  skills: string[];
  interests: string[];
  aspirations: string;
}

export interface CareerPath {
  title: string;
  description: string;
  responsibilities: string[];
  matchScore: number;
  salaryRange: string;
  growthPotential: 'High' | 'Medium' | 'Low';
  requiredSkills: string[];
  outlook: string;
}

export interface SkillGap {
  skillName: string;
  currentLevel: number; // 0-100
  targetLevel: number;  // 0-100
  importance: 'Critical' | 'Recommended' | 'Optional';
  resources: string[];
  actionableAdvice: string;
}

export interface RoadmapStep {
  title: string;
  description: string;
  timeframe: string;
  actionItems: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  EXPLORER = 'EXPLORER',
  SKILLS = 'SKILLS',
  ROADMAP = 'ROADMAP',
  EDIT_PROFILE = 'EDIT_PROFILE'
}
