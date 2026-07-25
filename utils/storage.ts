// utils/storage.ts — Typed localStorage abstraction
import { UserProfile, TriggerEntry, SafetyPlan, STORAGE_KEYS } from '@/context/types';

function safeGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to write "${key}" to localStorage`);
  }
}

// Profile
export const getProfile = (): UserProfile | null =>
  safeGet<UserProfile>(STORAGE_KEYS.PROFILE);

export const saveProfile = (profile: UserProfile): void =>
  safeSet(STORAGE_KEYS.PROFILE, profile);

// Trigger Log
export const getTriggerLog = (): TriggerEntry[] =>
  safeGet<TriggerEntry[]>(STORAGE_KEYS.TRIGGER_LOG) ?? [];

export const saveTriggerLog = (log: TriggerEntry[]): void =>
  safeSet(STORAGE_KEYS.TRIGGER_LOG, log);

export const addTriggerEntry = (entry: TriggerEntry): void => {
  const log = getTriggerLog();
  saveTriggerLog([entry, ...log]);
};

// Safety Plan
export const getSafetyPlan = (): SafetyPlan | null =>
  safeGet<SafetyPlan>(STORAGE_KEYS.SAFETY_PLAN);

export const saveSafetyPlan = (plan: SafetyPlan): void =>
  safeSet(STORAGE_KEYS.SAFETY_PLAN, plan);
