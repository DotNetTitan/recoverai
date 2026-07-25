'use client';
// app/education/page.tsx — Educational Resources Hub with AI Q&A
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, ShieldAlert, HeartHandshake, Pill, Phone } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES, EDUCATION_SYSTEM_PROMPT } from '@/utils/constants';
import { EducationCategories, EducationQa } from './components';
import styles from './page.module.css';

const EDUCATION_ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  ShieldAlert,
  HeartHandshake,
  Pill,
  Phone,
};

export default function EducationPage() {
  const router = useRouter();
  const { callGemini, loading, error } = useGemini();
  const { speak, stopSpeaking } = useSpeech();
  
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setAnswer('');
    stopSpeaking();
    
    const text = await callGemini({
      systemPrompt: EDUCATION_SYSTEM_PROMPT,
      userMessage: query,
      maxTokens: AI_CONFIG.EDUCATION_MAX_TOKENS,
    });
    setAnswer(text);
  }

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => { stopSpeaking(); router.push(APP_ROUTES.HOME); }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Learn</h1>
      </header>

      <main className="section stack-lg">
        <EducationQa
          answer={answer}
          error={error}
          loading={loading}
          query={query}
          onAsk={handleAsk}
          onQueryChange={setQuery}
          onSpeak={speak}
        />
        <EducationCategories iconMap={EDUCATION_ICON_MAP} />
      </main>
    </div>
  );
}
