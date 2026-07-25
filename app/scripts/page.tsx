'use client';
// app/scripts/page.tsx — Personalized Emergency Scripts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Home, MessageCircle, ShieldOff, Volume2, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { SCRIPT_TYPES, CONTEXT_TAGS, buildScriptPrompt } from '@/utils/constants';
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
  const { callGemini } = useGemini();
  const { speak, stopSpeaking } = useSpeech();
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>('select-type');
  const [selectedType, setSelectedType] = useState<typeof SCRIPT_TYPES[number] | null>(null);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [scriptContent, setScriptContent] = useState('');
  const [copied, setCopied] = useState(false);

  async function generateScript(type: typeof SCRIPT_TYPES[number], context: string) {
    setPhase('loading');
    setScriptContent('');
    const prompt = buildScriptPrompt(
      profile?.name ?? 'Friend',
      profile?.substances?.[0] ?? 'substance',
      type.label,
      context
    );
    const text = await callGemini({ systemPrompt: prompt, userMessage: 'Please generate the script.', maxTokens: 250 });
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

  function handleCopy() {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ErrorBoundary label="Emergency Scripts">
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => { stopSpeaking(); router.push('/'); }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={{ fontSize: 'var(--font-h2)' }}>Scripts</h1>
      </header>

      <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
        {phase === 'select-type' && (
          <>
            <div>
              <h2 className={styles.prompt}>What do you need to say?</h2>
              <p className={styles.subPrompt}>AI will help you find the right words.</p>
            </div>
            <div className="stack">
              {SCRIPT_TYPES.map((type) => {
                const Icon = ICON_MAP[type.id];
                return (
                  <button key={type.id} className="card-crisis" style={{ minHeight: 80, padding: 16 }} onClick={() => handleTypeSelect(type)}>
                    <Icon size={24} color="var(--color-mint-tint)" />
                    <span className={styles.optionLabel}>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {phase === 'select-context' && (
          <>
            <div>
              <h2 className={styles.prompt}>What&apos;s the situation?</h2>
              <p className={styles.subPrompt}>Select a context to personalize your script.</p>
            </div>
            <div className={styles.chipWrap}>
              {CONTEXT_TAGS.map((tag) => (
                <button key={tag} className="chip" onClick={() => handleContextSelect(tag)}>
                  {tag}
                </button>
              ))}
            </div>
            <button className="btn btn-outline btn-full" style={{ marginTop: 24 }} onClick={() => setPhase('select-type')}>
              <ArrowLeft size={20} /> Back to scripts
            </button>
          </>
        )}

        {phase === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSkeleton}>
              <div className="skeleton" style={{ height: 100, width: '100%' }} />
              <div className="skeleton" style={{ height: 20, width: '50%', margin: '0 auto' }} />
            </div>
          </div>
        )}

        {phase === 'response' && (
          <div className="stack">
            <div className={styles.scriptCard}>
              <div className={styles.scriptHeader}>
                <span className={styles.scriptType}>{selectedType?.label}</span>
                <span className={styles.scriptContext}>{selectedContext}</span>
              </div>
              <div className={styles.scriptBody}>
                {scriptContent.split('\n\n').map((para, i) => (
                  <p key={i} className={styles.scriptParagraph} onClick={() => speak(para)}>
                    {para}
                  </p>
                ))}
              </div>
              <p className={styles.tapToRead}>Tap any paragraph to hear it out loud.</p>
            </div>

            <div className="grid-2">
              <button className="btn btn-outline" onClick={() => speak(scriptContent)}>
                <Volume2 size={20} /> Listen All
              </button>
              <button className="btn btn-outline" onClick={handleCopy}>
                {copied ? <><CheckCircle size={20} color="var(--color-mint-tint)" /> Copied</> : <><Copy size={20} /> Copy</>}
              </button>
            </div>

            <button className="btn btn-ghost btn-full" onClick={() => { stopSpeaking(); generateScript(selectedType!, selectedContext!); }}>
              <RefreshCw size={20} /> Regenerate
            </button>

             <button className="btn btn-primary btn-full" style={{marginTop: 20}} onClick={() => { stopSpeaking(); setPhase('select-type'); }}>
              Done
            </button>
          </div>
        )}
      </main>
    </div>
    </ErrorBoundary>
  );
}
