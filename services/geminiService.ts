
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerPath, SkillGap, RoadmapStep } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Helper to call API with exponential backoff retries and jitter for transient errors.
 * Jitter helps prevent synchronized retry spikes (thundering herd problem).
 */
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error?.message || '';
      const isRetryable = errorMessage.includes('429') || 
                          errorMessage.includes('RESOURCE_EXHAUSTED') || 
                          errorMessage.includes('500') || 
                          errorMessage.includes('503') ||
                          errorMessage.includes('quota');
      
      if (isRetryable && i < maxRetries - 1) {
        // Exponential backoff: initialDelay * 2^i
        // Jitter: random value between 0 and 1000ms
        const jitter = Math.random() * 1000;
        const delay = (initialDelay * Math.pow(2, i)) + jitter;
        
        console.warn(`Masar AI: Retrying after error (${errorMessage.substring(0, 50)}...). Attempt ${i + 1} of ${maxRetries}. Delay: ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export const generateCareerPaths = async (profile: UserProfile): Promise<CareerPath[]> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a senior career strategist. Analyze this user profile and provide a ranked list of 4 highly relevant career paths. 
      Focus on long-term sustainability and the user's aspirations.
      Profile: ${JSON.stringify(profile)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
              matchScore: { type: Type.NUMBER, description: "Match percentage 0-100" },
              salaryRange: { type: Type.STRING },
              growthPotential: { type: Type.STRING, description: "High, Medium, or Low" },
              requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              outlook: { type: Type.STRING, description: "Market outlook for the next 5-10 years" }
            },
            required: ["title", "description", "responsibilities", "matchScore", "salaryRange", "growthPotential", "requiredSkills", "outlook"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};

export const analyzeSkillGap = async (profile: UserProfile, targetRole: string): Promise<SkillGap[]> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Role: "${targetRole}". 
      User Profile: ${JSON.stringify(profile)}.
      Perform a precise skill gap analysis. Compare current proficiency against the requirements for the target role.
      Provide actionable advice and specific resources (courses, books, platforms) for each gap.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skillName: { type: Type.STRING },
              currentLevel: { type: Type.NUMBER },
              targetLevel: { type: Type.NUMBER },
              importance: { type: Type.STRING, description: "Critical, Recommended, or Optional" },
              resources: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionableAdvice: { type: Type.STRING, description: "Specific steps to bridge the gap" }
            },
            required: ["skillName", "currentLevel", "targetLevel", "importance", "resources", "actionableAdvice"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};

export const generateRoadmap = async (profile: UserProfile, targetRole: string): Promise<RoadmapStep[]> => {
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed 12-month professional development roadmap for transitioning to "${targetRole}".
      User: ${profile.fullName}, current role: ${profile.currentRole}.
      The roadmap should be practical, time-bound, and divided into 4 key phases.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              timeframe: { type: Type.STRING },
              actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
              status: { type: Type.STRING }
            },
            required: ["title", "description", "timeframe", "actionItems", "status"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  });
};
