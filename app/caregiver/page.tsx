'use client';
// app/caregiver/page.tsx — Caregiver Module
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES } from '@/utils/constants';
import { CAREGIVER_SYSTEM_PROMPT } from '@/utils/prompts';
import { CaregiverGuidance, CaregiverHub } from './components';
import styles from './page.module.css';

type Tab = 'hub' | 'what-do-i-say';

const CAREGIVER_ICON_MAP: Record<string, React.ElementType> = {
  MessageCircle,
};

export default function CaregiverPage() {
  const router = useRouter();
  const { callGemini, loading, error } = useGemini();
  const { speak, stopSpeaking } = useSpeech();

  const [tab, setTab] = useState<Tab>('hub');
  const [situationInput, setSituationInput] = useState('');
  const [guidance, setGuidance] = useState('');
  const [shareError, setShareError] = useState<string | null>(null);

  function handleBack() {
    stopSpeaking();
    if (tab === 'what-do-i-say') {
      setTab('hub');
    } else {
      router.push(APP_ROUTES.HOME);
    }
  }

  async function handleGetGuidance() {
    if (!situationInput.trim()) return;
    setGuidance('');
    const text = await callGemini({
      systemPrompt: CAREGIVER_SYSTEM_PROMPT,
      userMessage: situationInput,
      maxTokens: AI_CONFIG.CAREGIVER_MAX_TOKENS,
    });
    setGuidance(text);
  }

  async function handleShare() {
    try {
      await navigator.share({ title: 'RecoverAI', url: window.location.origin });
      setShareError(null);
    } catch {
      setShareError('Sharing failed. Copy the page link from your browser and send it directly.');
    }
  }

  return (
    <ErrorBoundary label="Caregiver Support">
      <div className={styles.page}>
        <header className="page-header">
          <button className="btn btn-ghost page-header-back" onClick={handleBack} aria-label="Go back">
            <ArrowLeft size={20} /> Back
          </button>
          <h1>{tab === 'what-do-i-say' ? 'What Do I Say?' : 'Caregiver Hub'}</h1>
        </header>
        {tab === 'what-do-i-say' ? (
          <CaregiverGuidance
            error={error}
            guidance={guidance}
            input={situationInput}
            loading={loading}
            onInputChange={setSituationInput}
            onSubmit={handleGetGuidance}
            onSpeak={speak}
          />
        ) : (
          <CaregiverHub
            iconMap={CAREGIVER_ICON_MAP}
            shareError={shareError}
            onOpenGuidance={() => setTab('what-do-i-say')}
            onShare={handleShare}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
