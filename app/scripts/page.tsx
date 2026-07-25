'use client';
// app/scripts/page.tsx — Personalized Emergency Scripts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Home, MessageCircle, ShieldOff } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES, SCRIPT_TYPES, UI_TIMING, buildScriptPrompt } from '@/utils/constants';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AiStatus } from '@/components/AiStatus';
import { ScriptContextSelector, ScriptResponse, ScriptTypeSelector } from './components';
import styles from './page.module.css';

const ICON_MAP: Record<string, React.ElementType> = {
  'call-sponsor': Users,
  'talk-to-family': Home,
  'self-talk': MessageCircle,
  'refuse-pressure': ShieldOff,
};

type Phase = 'select-type' | 'select-context' | 'loading' | 'response';

export default function ScriptsPage() {
  const { profile } = useProfile();
  const { callGemini, error } = useGemini();
  const { speak, stopSpeaking } = useSpeech();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('select-type');
  const [selectedType, setSelectedType] = useState<typeof SCRIPT_TYPES[number] | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [scriptContent, setScriptContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function generateScript(type: typeof SCRIPT_TYPES[number], context: string) {
    setPhase('loading');
    setScriptContent('');
    setActionError(null);
    const prompt = buildScriptPrompt(
      profile?.name ?? 'Friend',
      profile?.substances?.[0] ?? 'substance',
      type.label,
      context
    );
    const text = await callGemini({
      systemPrompt: prompt,
      userMessage: 'Please generate the script.',
      maxTokens: AI_CONFIG.SCRIPT_MAX_TOKENS,
    });
    setScriptContent(text);
    setPhase('response');
  }

  function handleTypeSelect(type: typeof SCRIPT_TYPES[number]) {
    setSelectedType(type);
    setPhase('select-context');
  }

  function handleContextSelect(context: string) {
    setSelectedContext(context);
    if (selectedType) {
      generateScript(selectedType, context);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(scriptContent);
      setActionError(null);
      setCopied(true);
      setTimeout(() => setCopied(false), UI_TIMING.COPY_FEEDBACK_MS);
    } catch {
      setActionError('Copy failed. Select the script text and copy it manually.');
      setCopied(false);
    }
  }

  function handleRegenerate() {
    if (!selectedType || !selectedContext) return;
    stopSpeaking();
    generateScript(selectedType, selectedContext);
  }

  function handleDone() {
    stopSpeaking();
    setPhase('select-type');
  }

  return (
    <ErrorBoundary label="Emergency Scripts">
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => { stopSpeaking(); router.push(APP_ROUTES.HOME); }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Scripts</h1>
      </header>

      <main className="section stack-lg">
        {phase === 'select-type' && (
          <ScriptTypeSelector iconMap={ICON_MAP} onSelect={handleTypeSelect} />
        )}

        {phase === 'select-context' && (
          <ScriptContextSelector
            onBack={() => setPhase('select-type')}
            onSelect={handleContextSelect}
          />
        )}

        {phase === 'loading' && (
          <AiStatus
            error={error}
            loading
            loadingClassName={styles.loadingState}
            skeletonClassName={styles.loadingSkeleton}
            skeletonHeight={100}
          />
        )}

        {phase === 'response' && (
          <>
            <AiStatus error={error} />
            <ScriptResponse
              actionError={actionError}
              copied={copied}
              scriptContent={scriptContent}
              selectedContext={selectedContext}
              selectedType={selectedType}
              onCopy={handleCopy}
              onDone={handleDone}
              onRegenerate={handleRegenerate}
              onSpeak={speak}
            />
          </>
        )}
      </main>
    </div>
    </ErrorBoundary>
  );
}
