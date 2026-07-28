'use client';
// app/scripts/page.tsx — Personalized Emergency Scripts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, MessageCircle, ShieldOff, Users } from 'lucide-react';
import { AiStatus } from '@/components/AiStatus';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useGemini } from '@/hooks/useGemini';
import { useProfile } from '@/hooks/useProfile';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES, SCRIPT_TYPES, UI_TIMING } from '@/utils/constants';
import { buildScriptPrompt } from '@/utils/prompts';
import { ScriptContextSelector, ScriptResponse, ScriptTypeSelector } from './components';
import styles from './page.module.css';

const ICON_MAP: Record<string, React.ElementType> = {
  'call-sponsor': Users,
  'talk-to-family': Home,
  'self-talk': MessageCircle,
  'refuse-pressure': ShieldOff,
};

const CACHE_KEY = 'recoverai_script_cache';

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
  const [largeFont, setLargeFont] = useState(false);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { content, typeId, context } = JSON.parse(cached);
        const type = SCRIPT_TYPES.find(t => t.id === typeId);
        if (type && context) {
          setSelectedType(type);
          setSelectedContext(context);
          setScriptContent(content);
          setPhase('response');
        }
      }
    } catch { }
  }, []);

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
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ content: text, typeId: type.id, context }));
    } catch { }
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
    try { sessionStorage.removeItem(CACHE_KEY); } catch { }
  }

  return (
    <ErrorBoundary label="Emergency Scripts">
      <div className={styles.page}>
        <header className="page-header">
          <button className="btn btn-ghost page-header-back" onClick={() => { stopSpeaking(); router.push(APP_ROUTES.HOME); }} aria-label="Go back to home">
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
                largeFont={largeFont}
                scriptContent={scriptContent}
                selectedContext={selectedContext}
                selectedType={selectedType}
                onCopy={handleCopy}
                onDone={handleDone}
                onRegenerate={handleRegenerate}
                onSpeak={speak}
                onToggleFont={() => setLargeFont(v => !v)}
              />
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
