'use client';
// app/onboarding/page.tsx — 4-step onboarding flow
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Volume2, Sprout, Heart } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useSpeech } from '@/hooks/useSpeech';
import { UserProfile } from '@/context/types';
import { SUBSTANCE_OPTIONS, TRIGGER_OPTIONS } from '@/utils/constants';
import styles from './page.module.css';

const TOTAL_STEPS = 4;

const STEP_PROMPTS = [
  'What\'s your first name?',
  'What brings you here today?',
  'Which substances are you concerned about?',
  'Add an emergency contact.',
];

const ROLE_OPTIONS = [
  { value: 'recovery', label: 'I\'m in recovery', desc: 'Managing my own substance use', icon: Sprout },
  { value: 'caregiver', label: 'I\'m a caregiver', desc: 'Supporting someone I love', icon: Heart },
];

export default function OnboardingPage() {
  const { saveProfile } = useProfile();
  const { speak } = useSpeech();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'recovery' | 'caregiver' | ''>('');
  const [substances, setSubstances] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  function toggleItem(list: string[], item: string, setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  function readPrompt() {
    speak(STEP_PROMPTS[step]);
  }

  function canAdvance() {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return role !== '';
    if (step === 2) return substances.length > 0;
    if (step === 3) return contactName.trim().length > 0;
    return true;
  }

  function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      const profile: UserProfile = {
        name: name.trim(),
        role: role as 'recovery' | 'caregiver',
        substances,
        triggers,
        emergencyContactName: contactName.trim(),
        emergencyContactPhone: contactPhone.trim(),
        onboardingComplete: true,
      };
      saveProfile(profile);
      router.replace('/');
    }
  }

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressBar} role="progressbar" aria-valuenow={step + 1} aria-valuemax={TOTAL_STEPS}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`${styles.progressDot} ${i <= step ? styles.progressDotActive : ''}`} />
        ))}
      </div>

      <main className={styles.main}>
        {/* Step heading */}
        <div className={styles.stepHeader}>
          <h1 className={styles.stepQuestion}>{STEP_PROMPTS[step]}</h1>
          <button className="btn btn-ghost" onClick={readPrompt} aria-label="Read question aloud">
            <Volume2 size={18} />
          </button>
        </div>

        {/* ── Step 0: Name ─────────────────────────────── */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <input
              className="input"
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={50}
              aria-label="First name"
              id="input-name"
            />
          </div>
        )}

        {/* ── Step 1: Role ─────────────────────────────── */}
        {step === 1 && (
          <div className={`${styles.stepContent} stack`}>
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`card ${styles.roleCard} ${role === opt.value ? styles.roleCardActive : ''}`}
                onClick={() => setRole(opt.value as 'recovery' | 'caregiver')}
                aria-pressed={role === opt.value}
                id={`role-${opt.value}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <opt.icon size={20} color={role === opt.value ? 'var(--color-gold)' : 'var(--color-mint-tint)'} />
                  <span className={styles.roleLabel}>{opt.label}</span>
                </div>
                <span className={styles.roleDesc}>{opt.desc}</span>
                {role === opt.value && <Check size={20} className={styles.roleCheck} />}
              </button>
            ))}
          </div>
        )}

        {/* ── Step 2: Substances + Triggers ─────────────── */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <p className={styles.chipGroupLabel}>Substances of concern</p>
            <div className={styles.chipWrap}>
              {SUBSTANCE_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`chip ${substances.includes(s) ? 'active' : ''}`}
                  onClick={() => toggleItem(substances, s, setSubstances)}
                  aria-pressed={substances.includes(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className={styles.chipGroupLabel} style={{ marginTop: 20 }}>Your known triggers <span className={styles.optionalTag}>(optional)</span></p>
            <div className={styles.chipWrap}>
              {TRIGGER_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`chip ${triggers.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleItem(triggers, t, setTriggers)}
                  aria-pressed={triggers.includes(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 3: Emergency contact ─────────────────── */}
        {step === 3 && (
          <div className={`${styles.stepContent} stack`}>
            <input
              className="input"
              type="text"
              placeholder="Contact name (e.g. Mom, Sponsor)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              maxLength={60}
              aria-label="Emergency contact name"
              id="input-contact-name"
            />
            <input
              className="input"
              type="tel"
              placeholder="Phone number (optional)"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              aria-label="Emergency contact phone"
              id="input-contact-phone"
            />
            <p className={styles.disclaimer}>
              This is stored only on your device. It&apos;s used for the &quot;Call Contact&quot; button in Crisis Mode.
            </p>
          </div>
        )}
      </main>

      {/* Next button */}
      <div className={styles.footer}>
        <button
          className="btn btn-primary btn-full"
          onClick={handleNext}
          disabled={!canAdvance()}
          aria-label={step === TOTAL_STEPS - 1 ? 'Finish setup' : 'Next step'}
          id="next-btn"
        >
          {step === TOTAL_STEPS - 1 ? (
            <>All set — Let&apos;s go <ArrowRight size={18} /></>
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
