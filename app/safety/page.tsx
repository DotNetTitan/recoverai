'use client';
// app/safety/page.tsx — Safety Tools (Trigger Tracker, Safety Plan, Grounding)
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, ArrowLeft, ArrowRight, ClipboardList, Headphones, Play, Square, Volume2, Wind, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGemini } from '@/hooks/useGemini';
import { useSpeech } from '@/hooks/useSpeech';
import { AI_CONFIG, APP_ROUTES, BREATHING_EXERCISE_STEPS, GROUNDING_SENSE_STEPS, MOOD_OPTIONS, SITUATION_OPTIONS, OUTCOME_OPTIONS } from '@/utils/constants';
import { AiStatus } from '@/components/AiStatus';
import styles from './page.module.css';

type Tab = 'grounding' | 'tracker' | 'plan';

const TRACKER_INSIGHTS_PROMPT = `You are a supportive recovery coach analyzing a user's trigger log entries.
Review their logged patterns — moods, situations, and outcomes — and provide:
1. Key patterns or trends you notice
2. Their most common triggers or risk situations
3. What's been working well (positive outcomes)
4. One practical suggestion going forward

Keep the tone warm, encouraging, and concise. Format with short sections.`;

const BODY_SCAN_STEPS = [
  'Bring your attention to your feet. Notice any sensations — warmth, pressure, or tingling.',
  'Slowly move your focus to your legs, knees, and thighs. Let them soften and relax.',
  'Shift to your hips and lower back. Breathe into any tightness you notice.',
  'Bring awareness to your stomach and chest. Feel your breath moving in and out naturally.',
  'Notice your hands, arms, and shoulders. Let them drop and release any tension.',
  'Bring attention to your neck and jaw. Soften your face, your eyes, your forehead.',
  'Now scan your whole body from head to toe. Imagine a wave of relaxation washing over you.',
  'Take one more deep breath. You are here, you are safe, you are grounded.',
];

const SAFETY_PLAN_PROMPT = `You are a supportive recovery assistant helping someone create a personalized safety plan for managing substance use recovery.

Generate a comprehensive safety plan that includes:
1. Warning signs to watch for (emotional, physical, behavioral)
2. Internal coping strategies (breathing, grounding, self-talk)
3. People to contact for support (with prompts for names/numbers they should add)
4. Professional resources and hotlines
5. Ways to make the environment safer
6. Things that make life worth living (reasons for recovery)

Keep the tone warm, supportive, and actionable. Format with clear sections and bullet points. This is for someone in recovery from substance use disorder.`;

export default function SafetyPage() {
  const router = useRouter();
  const { triggerLog, profile, addTriggerEntry } = useApp();
  const { callGemini, loading, error } = useGemini();
  const { speak, stopSpeaking } = useSpeech();
  const [activeTab, setActiveTab] = useState<Tab>('grounding');
  const [breathing, setBreathing] = useState(false);
  const [safetyPlan, setSafetyPlan] = useState('');
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ mood: '', situation: '', outcome: '', notes: '' });
  const [insights, setInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [bodyScan, setBodyScan] = useState(false);
  const [bodyScanStep, setBodyScanStep] = useState(0);

  async function handleGetInsights() {
    setInsightsLoading(true);
    setInsights('');
    const logSummary = triggerLog.map(e => `Mood: ${e.mood}, Situation: ${e.situation}, Outcome: ${e.outcome}`).join('\n');
    const text = await callGemini({
      systemPrompt: TRACKER_INSIGHTS_PROMPT,
      userMessage: `Here are my logged moments:\n${logSummary}\n\nWhat patterns do you see?`,
      maxTokens: AI_CONFIG.DEFAULT_MAX_TOKENS,
    });
    setInsights(text);
    setInsightsLoading(false);
  }

  async function handleBuildPlan() {
    setSafetyPlan('');
    stopSpeaking();
    
    const userContext = profile?.name 
      ? `The user's name is ${profile.name}.` 
      : '';
    
    const text = await callGemini({
      systemPrompt: SAFETY_PLAN_PROMPT,
      userMessage: `Create a personalized safety plan for managing recovery. ${userContext}`,
      maxTokens: AI_CONFIG.DEFAULT_MAX_TOKENS,
    });
    setSafetyPlan(text);
  }

  function handleLogMoment() {
    if (!logForm.mood || !logForm.situation || !logForm.outcome) return;
    
    addTriggerEntry({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      mood: logForm.mood,
      situation: logForm.situation,
      outcome: logForm.outcome,
      notes: logForm.notes || undefined,
    });
    
    setLogForm({ mood: '', situation: '', outcome: '', notes: '' });
    setShowLogForm(false);
  }

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost page-header-back" onClick={() => router.push(APP_ROUTES.HOME)} aria-label="Go back to home">
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
                    <span key={`${label}-${index}`} className={styles.breathingStep}>
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

            <h2 className={styles.sectionTitle}>Body Scan Meditation</h2>
            <div className={`card ${styles.bodyScanCard}`}>
              <div className={styles.bodyScanHeader}>
                <Headphones size={24} color="var(--color-gold)" />
                <p className={styles.bodyScanDesc}>A guided scan from head to toe. Read aloud or follow silently.</p>
              </div>
              {!bodyScan ? (
                <button className="btn btn-primary btn-full" onClick={() => { setBodyScan(true); setBodyScanStep(0); }}>
                  <Play size={18} /> Start Guide
                </button>
              ) : (
                <div className="stack">
                  <div className={styles.bodyScanStepCard}>
                    <p className={styles.bodyScanStepNumber}>Step {bodyScanStep + 1} of {BODY_SCAN_STEPS.length}</p>
                    <p className={styles.bodyScanStepText}>{BODY_SCAN_STEPS[bodyScanStep]}</p>
                  </div>
                  <div className="grid-2">
                    <button className="btn btn-outline" onClick={() => speak(BODY_SCAN_STEPS[bodyScanStep])}>
                      <Volume2 size={18} /> Read aloud
                    </button>
                    {bodyScanStep < BODY_SCAN_STEPS.length - 1 ? (
                      <button className="btn btn-primary" onClick={() => setBodyScanStep(s => s + 1)}>
                        Next <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={() => setBodyScan(false)}>
                        Done
                      </button>
                    )}
                  </div>
                  {bodyScanStep > 0 && (
                    <button className="btn btn-ghost btn-full" onClick={() => setBodyScanStep(s => s - 1)}>
                      Previous step
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tracker Tab */}
        {activeTab === 'tracker' && (
          <div className="stack">
             {!showLogForm ? (
               <>
                 <div className="grid-2">
                    <div className={`card ${styles.logSummary}`}>
                      <p className={styles.logCount}>{triggerLog.length}</p>
                      <p className={styles.logLabel}>Total Logs</p>
                    </div>
                    <button className={`btn btn-primary ${styles.logButton}`} onClick={() => setShowLogForm(true)}>
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
                         {entry.notes && <p className={styles.logText}><strong>Notes:</strong> {entry.notes}</p>}
                       </div>
                     ))}
                   </div>
                 )}

                 {triggerLog.length >= 2 && (
                   <>
                     <h2 className={styles.sectionTitle}>Pattern Insights</h2>
                     {insightsLoading ? (
                       <AiStatus loading loadingClassName={styles.loadingPlan} skeletonHeight={60} />
                     ) : insights ? (
                       <div className={`card ${styles.insightsCard}`}>
                         <div className={styles.insightsText}>
                           {insights.split('\n').map((line, idx) => <p key={idx}>{line}</p>)}
                         </div>
                         <button className="btn btn-ghost" onClick={() => speak(insights)}>
                           <Volume2 size={18} /> Read aloud
                         </button>
                       </div>
                     ) : (
                       <button className="btn btn-outline btn-full" onClick={handleGetInsights}>
                         <Activity size={18} /> Analyze Patterns
                       </button>
                     )}
                   </>
                 )}
               </>
             ) : (
               <div className="card">
                 <div className={styles.formHeader}>
                   <h3 className={styles.formTitle}>Log a Moment</h3>
                   <button className="btn btn-ghost" onClick={() => setShowLogForm(false)} aria-label="Close form">
                     <X size={20} />
                   </button>
                 </div>
                 
                 <div className="stack">
                   <div>
                     <label className={styles.label}>How were you feeling?</label>
                     <select 
                       className="input" 
                       value={logForm.mood}
                       onChange={(e) => setLogForm({ ...logForm, mood: e.target.value })}
                     >
                       <option value="">Select mood...</option>
                       {MOOD_OPTIONS.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                     </select>
                   </div>
                   
                   <div>
                     <label className={styles.label}>What was the situation?</label>
                     <select 
                       className="input" 
                       value={logForm.situation}
                       onChange={(e) => setLogForm({ ...logForm, situation: e.target.value })}
                     >
                       <option value="">Select situation...</option>
                       {SITUATION_OPTIONS.map(sit => <option key={sit} value={sit}>{sit}</option>)}
                     </select>
                   </div>
                   
                   <div>
                     <label className={styles.label}>What was the outcome?</label>
                     <select 
                       className="input" 
                       value={logForm.outcome}
                       onChange={(e) => setLogForm({ ...logForm, outcome: e.target.value })}
                     >
                       <option value="">Select outcome...</option>
                       {OUTCOME_OPTIONS.map(out => <option key={out} value={out}>{out}</option>)}
                     </select>
                   </div>
                   
                   <div>
                     <label className={styles.label}>Notes (optional)</label>
                     <textarea 
                       className="input" 
                       placeholder="Any additional details..."
                       rows={3}
                       value={logForm.notes}
                       onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                     />
                   </div>
                   
                   <button 
                     className="btn btn-primary btn-full" 
                     onClick={handleLogMoment}
                     disabled={!logForm.mood || !logForm.situation || !logForm.outcome}
                   >
                     Save Log
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div className="stack">
             {!safetyPlan ? (
               <div className={`card ${styles.planCard}`}>
                 <ClipboardList size={48} color="var(--color-mint-tint)" className={styles.planIcon} />
                 <h3 className={styles.planTitle}>My Safety Plan</h3>
                 <p className={styles.planText}>
                   A personalized plan helps you navigate a crisis safely. 
                 </p>
                 
                 <AiStatus
                   error={error}
                   loading={loading}
                   loadingClassName={styles.loadingPlan}
                   skeletonHeight={60}
                 />
                 
                 {!loading && !error && (
                   <button 
                     className="btn btn-primary btn-full"
                     onClick={handleBuildPlan}
                   >
                     Build My Plan
                   </button>
                 )}
               </div>
             ) : (
               <div className="stack">
                 <div className={`card ${styles.planContent}`}>
                   <h3 className={styles.planContentTitle}>Your Safety Plan</h3>
                   <div className={styles.planText}>
                     {safetyPlan.split('\n').map((line, idx) => (
                       <p key={idx}>{line}</p>
                     ))}
                   </div>
                 </div>
                 <div className={styles.planActions}>
                   <button 
                     className="btn btn-ghost"
                     onClick={() => speak(safetyPlan)}
                   >
                     <Volume2 size={18} /> Read aloud
                   </button>
                   <button 
                     className="btn btn-outline"
                     onClick={() => setSafetyPlan('')}
                   >
                     Create new plan
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
}
