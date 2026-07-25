'use client';
// app/safety/page.tsx — Safety Tools (Trigger Tracker, Safety Plan, Grounding)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, ArrowRight, ClipboardList, Play, Square, Wind } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { APP_ROUTES, BREATHING_EXERCISE_STEPS, GROUNDING_SENSE_STEPS } from '@/utils/constants';
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
        <button className="btn btn-ghost" onClick={() => router.push(APP_ROUTES.HOME)} aria-label="Go back to home">
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Safety Tools</h1>
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

      <main className="section stack-lg">
        
        {/* Grounding Tab */}
        {activeTab === 'grounding' && (
          <div className="stack" id="grounding">
            <h2 className={styles.sectionTitle}>Box Breathing</h2>
            <div className={styles.breathingCard}>
              <div className={`${styles.breathingCircle} ${breathing ? styles.breathingActive : ''}`} />
              <button 
                className={`btn ${breathing ? 'btn-outline' : 'btn-primary'} ${styles.breathingButton}`}
                onClick={() => setBreathing(!breathing)}
              >
                {breathing ? <><Square size={18} /> Stop</> : <><Play size={18} /> Start 4-4-4-4</>}
              </button>
              {breathing && (
                <p className={styles.breathingInstruction}>
                  {BREATHING_EXERCISE_STEPS.map((label, index) => (
                    <span key={label} className={styles.breathingStep}>
                      {label}
                      {index < BREATHING_EXERCISE_STEPS.length - 1 && <ArrowRight size={14} />}
                    </span>
                  ))}
                </p>
              )}
            </div>

            <h2 className={`${styles.sectionTitle} ${styles.groundingTitle}`}>5-4-3-2-1 Exercise</h2>
            <div className="card">
              <ul className={styles.groundingList}>
                {GROUNDING_SENSE_STEPS.map((step) => (
                  <li key={step.count}><strong>{step.count}</strong> {step.text}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="stack">
             <div className="grid-2">
                <div className={`card ${styles.logSummary}`}>
                  <p className={styles.logCount}>{triggerLog.length}</p>
                  <p className={styles.logLabel}>Total Logs</p>
                </div>
                <button className={`btn btn-primary ${styles.logButton}`}>
                  + Log a moment
                </button>
             </div>
             
             <h2 className={`${styles.sectionTitle} ${styles.recentLogsTitle}`}>Recent Logs</h2>
             {triggerLog.length === 0 ? (
               <p className={styles.emptyLog}>No moments logged yet.</p>
             ) : (
               <div className="stack">
                 {triggerLog.map(entry => (
                   <div key={entry.id} className={`card ${styles.logEntry}`}>
                     <div className={styles.logEntryHeader}>
                       <span className={styles.logDate}>{new Date(entry.timestamp).toLocaleDateString()}</span>
                       <span className={`chip ${styles.moodChip}`}>{entry.mood}</span>
                     </div>
                     <p className={styles.logText}><strong>Situation:</strong> {entry.situation}</p>
                     <p className={styles.logText}><strong>Outcome:</strong> {entry.outcome}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div className="stack">
             <div className={`card ${styles.planCard}`}>
               <ClipboardList size={48} color="var(--color-mint-tint)" className={styles.planIcon} />
               <h3 className={styles.planTitle}>My Safety Plan</h3>
               <p className={styles.planText}>
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
