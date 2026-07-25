'use client';
// app/education/page.tsx — Educational Resources Hub with AI Q&A
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Volume2, ChevronRight, Brain, ShieldAlert, HeartHandshake, Pill, Phone } from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { EDUCATION_SYSTEM_PROMPT } from '@/utils/constants';
import styles from './page.module.css';

const CATEGORIES = [
  { id: 'understanding', title: 'Understanding Addiction', icon: Brain, articles: ['What is SUD?', 'Brain Science', 'Common Myths'] },
  { id: 'stages', title: 'Recovery Stages', icon: ShieldAlert, articles: ['Early Recovery', 'Maintenance', 'What to Expect'] },
  { id: 'caregiver', title: 'Supporting a Loved One', icon: HeartHandshake, articles: ['Setting Boundaries', 'Self-Care', 'Avoiding Enabling'] },
  { id: 'meds', title: 'Treatment Options', icon: Pill, articles: ['Types of Treatment', 'MAT Overview'] },
  { id: 'resources', title: 'Local Resources', icon: Phone, articles: ['Hotlines', 'Support Groups'] },
];

export default function EducationPage() {
  const router = useRouter();
  const { callGemini } = useGemini();
  const { speak, stopSpeaking } = useSpeech();
  
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setAsking(true);
    setAnswer('');
    stopSpeaking();
    
    const text = await callGemini({ systemPrompt: EDUCATION_SYSTEM_PROMPT, userMessage: query, maxTokens: 200 });
    setAnswer(text);
    setAsking(false);
  }

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => { stopSpeaking(); router.push('/'); }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={{ fontSize: 'var(--font-h2)' }}>Learn</h1>
      </header>

      <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
        
        {/* AI Q&A */}
        <div className={styles.qaSection}>
          <h2 className={styles.sectionTitle}>Ask a Question</h2>
          <form onSubmit={handleAsk} className={styles.searchForm}>
            <input 
              type="text" 
              className="input" 
              placeholder="E.g., What are common withdrawal signs?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={asking}
            />
            <button type="submit" className="btn btn-primary" disabled={asking || !query.trim()}>
              <Search size={20} />
            </button>
          </form>

          {asking && (
            <div className={styles.loadingAnswer}>
              <div className="skeleton" style={{ height: 80, width: '100%' }} />
            </div>
          )}

          {answer && !asking && (
            <div className={styles.answerCard}>
              <p className={styles.answerText}>{answer}</p>
              <div className={styles.answerActions}>
                 <button className="btn btn-ghost" onClick={() => speak(answer)}>
                  <Volume2 size={18} /> Read aloud
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Curated Topics</h2>
          <div className="stack">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <cat.icon size={24} color="var(--color-mint-tint)" />
                  <h3 className={styles.categoryTitle}>{cat.title}</h3>
                </div>
                <div className={styles.articleList}>
                  {cat.articles.map((art) => (
                     <button key={art} className={styles.articleLink}>
                       {art} <ChevronRight size={16} />
                     </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
