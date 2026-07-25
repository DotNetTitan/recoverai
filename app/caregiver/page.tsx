'use client';
// app/caregiver/page.tsx — Caregiver Module
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, ShieldAlert, HeartHandshake, Share, MessageCircle, Volume2 } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import styles from './page.module.css';

const ARTICLES = [
  { id: '1', title: 'How to talk about a relapse', icon: HeartHandshake },
  { id: '2', title: 'Setting healthy boundaries', icon: ShieldAlert },
  { id: '3', title: 'Understanding what they are going through', icon: BookOpen },
];

type Tab = 'hub' | 'what-do-i-say';

export default function CaregiverPage() {
  const router = useRouter();
  const { callGemini } = useGemini();
  const { speak, stopSpeaking } = useSpeech();

  const [tab, setTab] = useState<Tab>('hub');
  const [situationInput, setSituationInput] = useState('');
  const [guidance, setGuidance] = useState('');
  const [guidanceLoading, setGuidanceLoading] = useState(false);

  async function handleGetGuidance() {
    if (!situationInput.trim()) return;
    setGuidanceLoading(true);
    setGuidance('');
    const prompt = `You are a compassionate guide for a caregiver supporting someone with substance use disorder. Keep your response warm, practical, and under 150 words. Never give medical advice.`;
    const text = await callGemini({ systemPrompt: prompt, userMessage: situationInput, maxTokens: 200 });
    setGuidance(text);
    setGuidanceLoading(false);
  }

  if (tab === 'what-do-i-say') {
    return (
      <div className={styles.page}>
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => { stopSpeaking(); setTab('hub'); }}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 style={{ fontSize: 'var(--font-h2)' }}>What Do I Say?</h1>
        </header>
        <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
          <p style={{ color: 'var(--color-soft-stone)' }}>Describe the situation. AI will suggest what to say.</p>
          <textarea
            className="input"
            style={{ minHeight: 100, resize: 'vertical' }}
            placeholder="E.g., They just told me they relapsed and I don't know what to say..."
            value={situationInput}
            onChange={(e) => setSituationInput(e.target.value)}
          />
          <button className="btn btn-primary btn-full" onClick={handleGetGuidance} disabled={guidanceLoading || !situationInput.trim()}>
            {guidanceLoading ? 'Getting guidance...' : 'Get Guidance'}
          </button>
          {guidance && (
            <div className="card" style={{ marginTop: 12 }}>
              <p style={{ lineHeight: 1.6, marginBottom: 12 }}>{guidance}</p>
              <button className="btn btn-ghost" onClick={() => speak(guidance)}>
                <Volume2 size={18} /> Read aloud
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={{ fontSize: 'var(--font-h2)' }}>Caregiver Hub</h1>
      </header>

      <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
        
        <button className="card" style={{ background: 'var(--color-calm-blue)', color: 'white', borderColor: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }} onClick={() => setTab('what-do-i-say')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <MessageCircle size={24} />
            <h2 style={{ fontSize: 20 }}>What do I say right now?</h2>
          </div>
          <p style={{ fontSize: 14, opacity: 0.9 }}>
            AI-powered guidance for tough conversations.
          </p>
        </button>

        <div className="card" style={{ background: 'var(--color-calm-blue)', color: 'white', borderColor: 'transparent' }}>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Are they in crisis right now?</h2>
          <p style={{ fontSize: 14, marginBottom: 16, opacity: 0.9 }}>
            Follow the emergency checklist to keep them safe.
          </p>
          <button className="btn" style={{ background: 'white', color: 'var(--color-calm-blue)', width: '100%' }}>
            View Emergency Checklist
          </button>
        </div>

        <div>
          <h2 className={styles.sectionTitle}>Essential Reading</h2>
          <div className="stack">
            {ARTICLES.map((art) => (
               <button key={art.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, textAlign: 'left', width: '100%', cursor: 'pointer' }}>
                 <div style={{ padding: 8, background: 'rgba(230, 242, 240, 0.1)', borderRadius: 8 }}>
                   <art.icon size={20} color="var(--color-mint-tint)" />
                 </div>
                 <span style={{ fontWeight: 600, fontSize: 16 }}>{art.title}</span>
               </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: 24, marginTop: 12 }}>
           <Share size={32} color="var(--color-gold)" style={{ margin: '0 auto 12px' }} />
           <h3 style={{ marginBottom: 8 }}>Share RecoverAI</h3>
           <p style={{ fontSize: 14, color: 'var(--color-soft-stone)', marginBottom: 16 }}>
             Send this app to your loved one so they have support when they need it most.
           </p>
           <button className="btn btn-outline btn-full" onClick={() => navigator.share({ title: 'RecoverAI', url: window.location.origin })}>
             Share App Link
           </button>
        </div>

      </main>
    </div>
  );
}
