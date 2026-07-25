import { getProfile, saveProfile, getTriggerLog, saveTriggerLog, addTriggerEntry, getSafetyPlan, saveSafetyPlan } from '../utils/storage';
import { UserProfile, TriggerEntry, SafetyPlan } from '../context/types';

beforeEach(() => {
  localStorage.clear();
});

describe('Storage - Profile', () => {
  const testProfile: UserProfile = {
    name: 'Alex',
    role: 'recovery',
    substances: ['Alcohol'],
    triggers: ['Stress'],
    emergencyContactName: 'Mom',
    emergencyContactPhone: '+15551234567',
    onboardingComplete: true,
  };

  it('saves and loads a profile', () => {
    saveProfile(testProfile);
    const loaded = getProfile();
    expect(loaded).toEqual(testProfile);
  });

  it('returns null when no profile is saved', () => {
    expect(getProfile()).toBeNull();
  });

  it('overwrites existing profile on save', () => {
    saveProfile(testProfile);
    const updated = { ...testProfile, name: 'Jordan' };
    saveProfile(updated);
    expect(getProfile()?.name).toBe('Jordan');
  });
});

describe('Storage - Trigger Log', () => {
  const entry: TriggerEntry = {
    id: 'test-id-1',
    timestamp: 1700000000000,
    mood: 'Anxious',
    situation: 'At a party',
    outcome: 'Resisted',
  };

  it('returns empty array when no log exists', () => {
    expect(getTriggerLog()).toEqual([]);
  });

  it('saves and loads trigger log', () => {
    saveTriggerLog([entry]);
    const log = getTriggerLog();
    expect(log).toHaveLength(1);
    expect(log[0]).toEqual(entry);
  });

  it('adds a new entry at the beginning of the log', () => {
    saveTriggerLog([entry]);
    const second: TriggerEntry = {
      id: 'test-id-2',
      timestamp: 1700000000001,
      mood: 'Stressed',
      situation: 'At work',
      outcome: 'Called sponsor',
    };
    addTriggerEntry(second);
    const log = getTriggerLog();
    expect(log).toHaveLength(2);
    expect(log[0].id).toBe('test-id-2');
  });
});

describe('Storage - Safety Plan', () => {
  const plan: SafetyPlan = {
    warningSigns: ['Irritability'],
    internalCopingStrategies: ['Deep breathing'],
    socialContacts: ['Mom'],
    professionalContacts: ['988'],
    environmentSafetySteps: ['Remove substances'],
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
  };

  it('returns null when no safety plan is saved', () => {
    expect(getSafetyPlan()).toBeNull();
  });

  it('saves and loads a safety plan', () => {
    saveSafetyPlan(plan);
    expect(getSafetyPlan()).toEqual(plan);
  });
});
