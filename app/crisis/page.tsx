'use client';
// app/crisis/page.tsx — Crisis Mode: zero-typing intervention
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  PhoneCall,
  Phone,
  ArrowLeft,
  AlertCircle,
  Flame,
  Wind,
  Users,
  Leaf,
  Volume2,
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { buildCrisisPrompt, CRISIS_HOTLINE_TEL } from '@/utils/constants';
import styles from './page.module.css';

const CRISIS_OPTIONS = [
  { id: 'craving', label: "I'm having a craving", icon: Flame },
  { id: 'about-to-use', label: "I'm about to use", icon: AlertCircle },
  { id: 'overwhelmed', label: 'I feel overwhelmed', icon: Wind },
  { id: 'need-to-call', label: 'I need to call someone', icon: Users },
  { id: 'need-grounding', label: 'I need a grounding exercise', icon: Leaf },
];

type Phase = 'select' | 'loading' | 'response';

export default function CrisisPage() {
  const { profile } = useProfile();
  const { callGemini, loading } = useGemini();
  const { speak, stopSpeaking, transcript, listening, startListening, stopListening, supported } = useSpeech();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('select');
  const [responseText, setResponseText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  // Auto-speak AI response
  useEffect(() => {
    if (responseText) speak(responseText);
    return () => stopSpeaking();
  }, [responseText, speak, stopSpeaking]);

  // Submit voice transcript automatically when listening stops
  useEffect(() => {
    if (transcript && !listening) handleSubmit(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, listening]);

  async function handleSubmit(userMessage: string) {
    if (!userMessage.trim()) return;
    setSelectedOption(userMessage);
    setPhase('loading');

    const systemPrompt = buildCrisisPrompt(
      profile?.name ?? 'Friend',
      profile?.triggers ?? [],
      profile?.emergencyContactName ?? 'your emergency contact'
    );

    const text = await callGemini({ systemPrompt, userMessage, maxTokens: 150 });
    setResponseText(text);
    setPhase('response');
  }

  function reset() {
    stopSpeaking();
    setPhase('select');
    setResponseText('');
    setSelectedOption('');
  }

  const contactTel = profile?.emergencyContactPhone
    ? `tel:${profile.emergencyContactPhone}`
    : undefined;

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button
          className="btn btn-ghost"
          onClick={() => { stopSpeaking(); router.push('/'); }}
          aria-label="Go back to home"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <span className={styles.topTitle}>Crisis Support</span>
      </div>

      <main className={styles.main}>
        {/* ── Phase: Select ─────────────────────────────── */}
        {phase === 'select' && (
          <>
            <h1 className={styles.prompt}>What&apos;s happening right now?</h1>
            <p className={styles.subPrompt}>Tap a card or use your voice</p>

            <div className={styles.optionsStack}>
              {CRISIS_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className="card-crisis"
                  onClick={() => handleSubmit(label)}
                  aria-label={label}
                  id={`crisis-option-${id}`}
                >
                  <Icon size={28} color="var(--color-mint-tint)" aria-hidden="true" />
                  <span className={styles.optionLabel}>{label}</span>
                </button>
              ))}
            </div>

            {/* Voice input */}
            {supported ? (
              <button
                className={`btn ${listening ? 'btn-crisis' : 'btn-outline'} btn-full`}
                style={{ marginTop: 16 }}
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? 'Stop listening' : 'Speak your situation'}
                id="voice-btn"
              >
                {listening ? (
                  <><MicOff size={20} /> Listening… tap to stop</>
                ) : (
                  <><Mic size={20} /> Speak instead</>
                )}
              </button>
            ) : (
              <p className={styles.noVoice}>Voice input not available in this browser. Use Chrome or Edge.</p>
            )}
          </>
        )}

        {/* ── Phase: Loading ─────────────────────────────── */}
        {phase === 'loading' && (
          <div className={styles.loadingState} aria-live="polite" aria-busy="true">
            <div className={styles.pulseCircle} />
            <p className={styles.loadingText}>Preparing your support…</p>
            <p className={styles.loadingSubtext}>{selectedOption}</p>
          </div>
        )}

        {/* ── Phase: Response ─────────────────────────────── */}
        {phase === 'response' && (
          <div aria-live="polite">
            <h1 className={styles.prompt} style={{ fontSize: 'var(--font-h2)' }}>Here for you</h1>
            <div className={styles.responseCard}>
              <p className={styles.responseText}>{responseText}</p>
              <button
                className="btn btn-ghost"
                onClick={() => speak(responseText)}
                aria-label="Read response aloud"
                style={{ marginTop: 12 }}
              >
                <Volume2 size={18} /> Read aloud
              </button>
            </div>
            <button
              className="btn btn-outline btn-full"
              style={{ marginTop: 16 }}
              onClick={reset}
              aria-label="Go back to options"
            >
              <ArrowLeft size={20} /> Try a different option
            </button>
          </div>
        )}
      </main>

      {/* Pinned emergency buttons — always visible */}
      <div className="pinned-bottom">
        <a
          href={CRISIS_HOTLINE_TEL}
          className="btn btn-crisis"
          style={{ flex: 1, background: 'var(--color-calm-blue)' }}
          aria-label="Call 988 crisis lifeline"
          id="call-988-btn"
        >
          <PhoneCall size={20} /> Call 988
        </a>
        {contactTel && (
          <a
            href={contactTel}
            className="btn btn-outline"
            style={{ flex: 1 }}
            aria-label={`Call ${profile?.emergencyContactName ?? 'your contact'}`}
            id="call-contact-btn"
          >
            <Phone size={20} /> {profile?.emergencyContactName ?? 'Contact'}
          </a>
        )}
      </div>
    </div>
  );
}
