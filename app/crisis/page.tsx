'use client';
// app/crisis/page.tsx - Crisis Mode: zero-typing intervention
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Flame, Leaf, Users, Wind } from 'lucide-react';
import { AiStatus } from '@/components/AiStatus';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useGemini } from '@/hooks/useGemini';
import { useProfile } from '@/hooks/useProfile';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES } from '@/utils/constants';
import { buildCrisisPrompt } from '@/utils/prompts';
import { CrisisResponse, CrisisSelect, EmergencyActions } from './components';
import styles from './page.module.css';

const CRISIS_ICONS: Record<string, React.ElementType> = {
  craving: Flame,
  'about-to-use': AlertCircle,
  overwhelmed: Wind,
  'need-to-call': Users,
  'need-grounding': Leaf,
};

type Phase = 'select' | 'loading' | 'response';

export default function CrisisPage() {
  const { profile } = useProfile();
  const { callGemini, error } = useGemini();
  const {
    listening,
    speak,
    startListening,
    stopListening,
    stopSpeaking,
    supported,
    transcript,
  } = useSpeech();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('select');
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (transcript && !listening) handleSubmit(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, listening]);

  async function handleSubmit(userMessage: string) {
    if (!userMessage.trim()) return;
    setPhase('loading');

    const systemPrompt = buildCrisisPrompt(
      profile?.name ?? 'Friend',
      profile?.triggers ?? [],
      profile?.emergencyContactName ?? 'your emergency contact'
    );

    const text = await callGemini({
      systemPrompt,
      userMessage,
      maxTokens: AI_CONFIG.CRISIS_MAX_TOKENS,
    });
    setResponseText(text);
    setPhase('response');
  }

  function reset() {
    stopSpeaking();
    setPhase('select');
    setResponseText('');
  }

  const contactTel = profile?.emergencyContactPhone
    ? `tel:${profile.emergencyContactPhone}`
    : undefined;

  return (
    <ErrorBoundary label="Crisis Mode">
      <div className={styles.page}>
        <header className={styles.topBar}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              stopSpeaking();
              router.push(APP_ROUTES.HOME);
            }}
            aria-label="Go back to home"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </header>

        <main className={styles.main}>
          {phase === 'select' && (
            <CrisisSelect
              iconMap={CRISIS_ICONS}
              listening={listening}
              supported={supported}
              onSelect={handleSubmit}
              onStartListening={startListening}
              onStopListening={stopListening}
            />
          )}

          {phase === 'loading' && (
            <AiStatus
              error={error}
              loading
              loadingClassName={styles.loadingState}
              skeletonClassName={styles.loadingSkeleton}
              skeletonHeight={120}
            />
          )}

          {phase === 'response' && (
            <>
              <AiStatus error={error} />
              <CrisisResponse responseText={responseText} onReset={reset} onSpeak={speak} />
            </>
          )}
        </main>

        <EmergencyActions
          contactName={profile?.emergencyContactName}
          contactTel={contactTel}
        />
      </div>
    </ErrorBoundary>
  );
}
