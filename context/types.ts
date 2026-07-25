// context/types.ts — Single source of truth for all data shapes

export type UserRole = 'recovery' | 'caregiver';

export type ScriptType =
  | 'call-sponsor'
  | 'talk-to-family'
  | 'self-talk'
  | 'refuse-pressure';

export type CrisisOption =
  | 'craving'
  | 'about-to-use'
  | 'overwhelmed'
  | 'need-to-call'
  | 'need-grounding';

export interface UserProfile {
  name: string;
  role: UserRole;
  substances: string[];
  triggers: string[];
  emergencyContactName: string;
  emergencyContactPhone: string; // E.164 format: +1234567890
  onboardingComplete: boolean;
}

export interface TriggerEntry {
  id: string;        // crypto.randomUUID()
  timestamp: number; // Date.now()
  mood: string;
  situation: string;
  outcome: string;
  notes?: string;
}

export interface SafetyPlan {
  warningSigns: string[];
  internalCopingStrategies: string[];
  socialContacts: string[];
  professionalContacts: string[];
  environmentSafetySteps: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  profile: UserProfile | null;
  triggerLog: TriggerEntry[];
  safetyPlan: SafetyPlan | null;
}

export const STORAGE_KEYS = {
  PROFILE: 'recoverai_profile',
  TRIGGER_LOG: 'recoverai_trigger_log',
  SAFETY_PLAN: 'recoverai_safety_plan',
} as const;
