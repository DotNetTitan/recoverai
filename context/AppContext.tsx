'use client';
// context/AppContext.tsx — Global typed state with localStorage persistence
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { AppState, UserProfile, TriggerEntry, SafetyPlan } from '@/context/types';
import {
  clearAllData,
  getProfile,
  saveProfile,
  getTriggerLog,
  getSafetyPlan,
  saveSafetyPlan,
  addTriggerEntry as storeTriggerEntry,
} from '@/utils/storage';

interface AppContextValue extends AppState {
  updateProfile: (p: UserProfile) => void;
  addTriggerEntry: (e: TriggerEntry) => void;
  updateSafetyPlan: (plan: SafetyPlan) => void;
  resetData: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [triggerLog, setTriggerLog] = useState<TriggerEntry[]>([]);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on mount (SSR-safe pattern)
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProfile(getProfile());
    setTriggerLog(getTriggerLog());
    setSafetyPlan(getSafetyPlan());
    setIsLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const updateProfile = useCallback((p: UserProfile) => {
    saveProfile(p);
    setProfile(p);
  }, []);

  const addTriggerEntry = useCallback((entry: TriggerEntry) => {
    storeTriggerEntry(entry);
    setTriggerLog((prev) => [entry, ...prev]);
  }, []);

  const updateSafetyPlan = useCallback((plan: SafetyPlan) => {
    saveSafetyPlan(plan);
    setSafetyPlan(plan);
  }, []);

  const resetData = useCallback(() => {
    clearAllData();
    setProfile(null);
    setTriggerLog([]);
    setSafetyPlan(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        triggerLog,
        safetyPlan,
        isLoaded,
        updateProfile,
        addTriggerEntry,
        updateSafetyPlan,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
