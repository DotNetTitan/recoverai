'use client';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/context/types';

/**
 * Convenience hook wrapping AppContext for profile access.
 * Returns the user profile, a save function, onboarded status, and loaded state.
 */
export function useProfile() {
  const { profile, updateProfile, isLoaded } = useApp();

  const saveProfile = (data: UserProfile) => updateProfile(data);

  const isOnboarded = Boolean(profile?.onboardingComplete);

  return { profile, saveProfile, isOnboarded, isLoaded };
}
