'use client';
// app/safety/page.tsx — Safety Tools (Trigger Tracker, Safety Plan, Grounding)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Wind, Activity, ClipboardList, Play, Square } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';

type Tab = 'grounding' | 'tracker' | 'plan';

export default function SafetyPage() {
  const router = useRouter();
  const { triggerLog } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('grounding');
  const [breathing, setBreathing] = useState(false);

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={{ fontSize: 'var(--font-h2)' }}>Safety Tools</h1>
      </header>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'grounding' ? styles.activeTab : ''}`} onClick={() => setActiveTab('grounding')}>
          <Wind size={18} /> Grounding
        </button>
        <button className={`${styles.tab} ${activeTab === 'tracker' ? styles.activeTab : ''}`} onClick={() => setActiveTab('tracker')}>
          <Activity size={18} /> Tracker
        </button>
        <button className={`${styles.tab} ${activeTab === 'plan' ? styles.activeTab : ''}`} onClick={() => setActiveTab('plan')}>
          <ClipboardList size={18} /> Plan
        </button>
      </div>

      <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
        
        {/* Grounding Tab */}
        {activeTab === 'grounding' && (
          <div className="stack" id="grounding">
            <h2 className={styles.sectionTitle}>Box Breathing</h2>
            <div className={styles.breathingCard}>
              <div className={`${styles.breathingCircle} ${breathing ? styles.breathingActive : ''}`} />
              <button 
                className={`btn ${breathing ? 'btn-outline' : 'btn-primary'}`} 
                style={{ position: 'relative', zIndex: 10 }}
                onClick={() => setBreathing(!breathing)}
              >
                {breathing ? <><Square size={18} /> Stop</> : <><Play size={18} /> Start 4-4-4-4</>}
              </button>
              {breathing && (
                <p className={styles.breathingInstruction} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  Inhale (4s) <ArrowRight size={14} /> Hold (4s) <ArrowRight size={14} /> Exhale (4s) <ArrowRight size={14} /> Hold (4s)
                </p>
              )}
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>5-4-3-2-1 Exercise</h2>
            <div className="card">
              <ul className={styles.groundingList}>
                <li><strong>5</strong> things you can see</li>
                <li><strong>4</strong> things you can feel</li>
                <li><strong>3</strong> things you can hear</li>
                <li><strong>2</strong> things you can smell</li>
                <li><strong>1</strong> thing you can taste</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="stack">
             <div className="grid-2">
                <div className="card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--color-warm-white)' }}>{triggerLog.length}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-soft-stone)' }}>Total Logs</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '16px 12px' }}>
                  + Log a moment
                </button>
             </div>
             
             <h2 className={styles.sectionTitle} style={{ marginTop: 16 }}>Recent Logs</h2>
             {triggerLog.length === 0 ? (
               <p style={{ color: 'var(--color-soft-stone)', textAlign: 'center', padding: 20 }}>No moments logged yet.</p>
             ) : (
               <div className="stack">
                 {triggerLog.map(entry => (
                   <div key={entry.id} className="card" style={{ padding: 16 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <span style={{ fontWeight: 'bold' }}>{new Date(entry.timestamp).toLocaleDateString()}</span>
                       <span className="chip" style={{ minHeight: 24, padding: '2px 8px', fontSize: 12 }}>{entry.mood}</span>
                     </div>
                     <p style={{ fontSize: 14 }}><strong>Situation:</strong> {entry.situation}</p>
                     <p style={{ fontSize: 14 }}><strong>Outcome:</strong> {entry.outcome}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div className="stack">
             <div className="card" style={{ textAlign: 'center', padding: 32 }}>
               <ClipboardList size={48} color="var(--color-mint-tint)" style={{ margin: '0 auto 16px' }} />
               <h3 style={{ marginBottom: 8, color: 'var(--color-warm-white)' }}>My Safety Plan</h3>
               <p style={{ color: 'var(--color-soft-stone)', fontSize: 14, marginBottom: 20 }}>
                 A personalized plan helps you navigate a crisis safely. 
               </p>
               <button className="btn btn-primary btn-full">
                 Build Plan with AI
               </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
