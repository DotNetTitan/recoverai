'use client';
// hooks/useProfile.ts — Convenience hook wrapping app context profile access
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/context/types';

export function useProfile() {
  const { profile, updateProfile, isLoaded } = useApp();

  const saveProfile = (data: UserProfile) => updateProfile(data);

  const isOnboarded = Boolean(profile?.onboardingComplete);

  return { profile, saveProfile, isOnboarded, isLoaded };
}
