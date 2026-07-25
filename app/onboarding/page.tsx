'use client';
// app/onboarding/page.tsx - 4-step onboarding flow
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Heart, Sprout, Volume2 } from 'lucide-react';
import { UserProfile, UserRole } from '@/context/types';
import { useProfile } from '@/hooks/useProfile';
import { useSpeech } from '@/hooks/useSpeech';
import {
  APP_ROUTES,
  INPUT_LIMITS,
  ONBOARDING_ROLE_OPTIONS,
  ONBOARDING_STEP_PROMPTS,
  ONBOARDING_TOTAL_STEPS,
  SUBSTANCE_OPTIONS,
  TRIGGER_OPTIONS,
} from '@/utils/constants';
import { toggleSelectedItem } from '@/utils/helpers';
import styles from './page.module.css';

const ROLE_ICON_MAP: Record<string, React.ElementType> = {
  caregiver: Heart,
  recovery: Sprout,
};

export default function OnboardingPage() {
  const { saveProfile } = useProfile();
  const { speak } = useSpeech();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [substances, setSubstances] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  function readPrompt() {
    speak(ONBOARDING_STEP_PROMPTS[step]);
  }

  function canAdvance() {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return role !== '';
    if (step === 2) return substances.length > 0;
    if (step === 3) return contactName.trim().length > 0;
    return true;
  }

  function handleNext() {
    if (step < ONBOARDING_TOTAL_STEPS - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      role: role as UserRole,
      substances,
      triggers,
      emergencyContactName: contactName.trim(),
      emergencyContactPhone: contactPhone.trim(),
      onboardingComplete: true,
    };
    saveProfile(profile);
    router.replace(APP_ROUTES.HOME);
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressBar} role="progressbar" aria-valuenow={step + 1} aria-valuemax={ONBOARDING_TOTAL_STEPS}>
        {Array.from({ length: ONBOARDING_TOTAL_STEPS }).map((_, index) => (
          <div key={index} className={`${styles.progressDot} ${index <= step ? styles.progressDotActive : ''}`} />
        ))}
      </div>

      <main className={styles.main}>
        <div className={styles.stepHeader}>
          <h1 className={styles.stepQuestion}>{ONBOARDING_STEP_PROMPTS[step]}</h1>
          <button className="btn btn-ghost" onClick={readPrompt} aria-label="Read question aloud">
            <Volume2 size={18} />
          </button>
        </div>

        {step === 0 && (
          <div className={styles.stepContent}>
            <input
              className="input"
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              maxLength={INPUT_LIMITS.FIRST_NAME_MAX_LENGTH}
              aria-label="First name"
              id="input-name"
            />
          </div>
        )}

        {step === 1 && (
          <div className={`${styles.stepContent} stack`}>
            {ONBOARDING_ROLE_OPTIONS.map((option) => {
              const Icon = ROLE_ICON_MAP[option.value];
              return (
                <button
                  key={option.value}
                  className={`card ${styles.roleCard} ${role === option.value ? styles.roleCardActive : ''}`}
                  onClick={() => setRole(option.value)}
                  aria-pressed={role === option.value}
                  id={`role-${option.value}`}
                >
                  <div className={styles.roleHeader}>
                    <Icon size={20} color={role === option.value ? 'var(--color-gold)' : 'var(--color-mint-tint)'} />
                    <span className={styles.roleLabel}>{option.label}</span>
                  </div>
                  <span className={styles.roleDesc}>{option.desc}</span>
                  {role === option.value && <Check size={20} className={styles.roleCheck} />}
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <p className={styles.chipGroupLabel}>Substances of concern</p>
            <div className={styles.chipWrap}>
              {SUBSTANCE_OPTIONS.map((substance) => (
                <button
                  key={substance}
                  className={`chip ${substances.includes(substance) ? 'active' : ''}`}
                  onClick={() => setSubstances((items) => toggleSelectedItem(items, substance))}
                  aria-pressed={substances.includes(substance)}
                >
                  {substance}
                </button>
              ))}
            </div>

            <p className={`${styles.chipGroupLabel} ${styles.triggerGroupLabel}`}>
              Your known triggers <span className={styles.optionalTag}>(optional)</span>
            </p>
            <div className={styles.chipWrap}>
              {TRIGGER_OPTIONS.map((trigger) => (
                <button
                  key={trigger}
                  className={`chip ${triggers.includes(trigger) ? 'active' : ''}`}
                  onClick={() => setTriggers((items) => toggleSelectedItem(items, trigger))}
                  aria-pressed={triggers.includes(trigger)}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`${styles.stepContent} stack`}>
            <input
              className="input"
              type="text"
              placeholder="Contact name (e.g. Mom, Sponsor)"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              maxLength={INPUT_LIMITS.CONTACT_NAME_MAX_LENGTH}
              aria-label="Emergency contact name"
              id="input-contact-name"
            />
            <input
              className="input"
              type="tel"
              placeholder="Phone number (optional)"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
              aria-label="Emergency contact phone"
              id="input-contact-phone"
            />
            <p className={styles.disclaimer}>
              This is stored only on your device. It&apos;s used for the &quot;Call Contact&quot; button in Crisis Mode.
            </p>
          </div>
        )}
      </main>

      <div className={styles.footer}>
        <button
          className="btn btn-primary btn-full"
          onClick={handleNext}
          disabled={!canAdvance()}
          aria-label={step === ONBOARDING_TOTAL_STEPS - 1 ? 'Finish setup' : 'Next step'}
          id="next-btn"
        >
          {step === ONBOARDING_TOTAL_STEPS - 1 ? (
            <>All set - Let&apos;s go <ArrowRight size={18} /></>
          ) : (
            <>Next <ArrowRight size={18} /></>
          )}
        </button>
        {step === 3 && (
          <button className="btn btn-ghost btn-full" onClick={handleNext} id="skip-btn">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
