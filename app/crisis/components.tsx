'use client';
import { ArrowLeft, Mic, MicOff, Phone, PhoneCall, Volume2 } from 'lucide-react';
import {
  CRISIS_HOTLINE_LABEL,
  CRISIS_HOTLINE_TEL,
  CRISIS_OPTIONS,
  EMERGENCY_TEL,
} from '@/utils/constants';
import styles from './page.module.css';

interface CrisisSelectProps {
  iconMap: Record<string, React.ElementType>;
  listening: boolean;
  supported: boolean;
  onSelect: (message: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
}

interface CrisisResponseProps {
  responseText: string;
  onReset: () => void;
  onSpeak: (text: string) => void;
}

interface EmergencyActionsProps {
  contactName?: string;
  contactTel?: string;
}

export function CrisisSelect({
  iconMap,
  listening,
  supported,
  onSelect,
  onStartListening,
  onStopListening,
}: CrisisSelectProps) {
  return (
    <>
      <h1 className={styles.prompt}>What&apos;s happening right now?</h1>
      <p className={styles.subPrompt}>Tap a card or use your voice</p>

      <div className={styles.optionsStack}>
        {CRISIS_OPTIONS.map(({ id, label }) => {
          const Icon = iconMap[id];
          return (
            <button
              key={id}
              className="card-crisis"
              onClick={() => onSelect(label)}
              aria-label={label}
              id={`crisis-option-${id}`}
            >
              {Icon && <Icon size={28} color="var(--color-mint-tint)" aria-hidden="true" />}
              <span className={styles.optionLabel}>{label}</span>
            </button>
          );
        })}
      </div>

      {supported ? (
        <button
          className={`btn ${listening ? 'btn-crisis' : 'btn-outline'} btn-full ${styles.voiceButton}`}
          onClick={listening ? onStopListening : onStartListening}
          aria-label={listening ? 'Stop listening' : 'Speak your situation'}
          id="voice-btn"
        >
          {listening ? (
            <>
              <MicOff size={20} /> Listening... tap to stop
            </>
          ) : (
            <>
              <Mic size={20} /> Speak instead
            </>
          )}
        </button>
      ) : (
        <p className={styles.noVoice}>Voice input not available in this browser. Use Chrome or Edge.</p>
      )}
    </>
  );
}

export function CrisisResponse({ responseText, onReset, onSpeak }: CrisisResponseProps) {
  return (
    <div aria-live="polite">
      <h1 className={`${styles.prompt} ${styles.responseTitle}`}>Here for you</h1>
      <div className={styles.responseCard}>
        <p className={styles.responseText}>{responseText}</p>
        <button
          className={`btn btn-ghost ${styles.readButton}`}
          onClick={() => onSpeak(responseText)}
          aria-label="Read response aloud"
        >
          <Volume2 size={18} /> Read aloud
        </button>
      </div>
      <button
        className={`btn btn-outline btn-full ${styles.resetButton}`}
        onClick={onReset}
        aria-label="Go back to options"
      >
        <ArrowLeft size={20} /> Try a different option
      </button>
    </div>
  );
}

export function EmergencyActions({ contactName, contactTel }: EmergencyActionsProps) {
  return (
    <div className="pinned-bottom">
      <a
        href={EMERGENCY_TEL}
        className={`btn btn-crisis ${styles.emergencyButton}`}
        aria-label="Dial 112 for emergency services in India"
        id="call-112-btn"
      >
        <PhoneCall size={20} /> 112 Emergency
      </a>
      <a
        href={CRISIS_HOTLINE_TEL}
        className="btn btn-outline"
        aria-label="Call 14416 Tele-MANAS mental health helpline"
        id="call-14416-btn"
      >
        <PhoneCall size={20} /> {CRISIS_HOTLINE_LABEL}
      </a>
      {contactTel && (
        <a
          href={contactTel}
          className={`btn btn-ghost ${styles.contactButton}`}
          aria-label={`Call ${contactName ?? 'your contact'}`}
          id="call-contact-btn"
        >
          <Phone size={18} /> {contactName ?? 'Contact'}
        </a>
      )}
    </div>
  );
}
