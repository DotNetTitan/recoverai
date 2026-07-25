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

type Tab = 'hub' | 'what-do-i-say' | 'emergency-checklist' | 'article';

const CAREGIVER_ICON_MAP: Record<string, React.ElementType> = {
  MessageCircle,
};

const EMERGENCY_CHECKLIST_ITEMS = [
  { title: 'Stay Calm', desc: 'Take a deep breath. Your calm presence helps them feel safer.' },
  { title: 'Ask Directly', desc: 'Are you thinking about using? Have you used? Are you safe right now?' },
  { title: 'Listen Without Judgment', desc: 'Let them share without interrupting or lecturing. Now is not the time for blame.' },
  { title: 'Remove Access', desc: 'If substances are present, remove them safely. If they have already used, assess if medical help is needed.' },
  { title: 'Call for Help if Needed', desc: 'If they are in immediate danger, call 112. For mental health crisis support, call 14416 (Tele-MANAS).' },
  { title: 'Stay with Them', desc: 'Do not leave them alone until the crisis passes or professional help arrives.' },
  { title: 'Contact Their Support Network', desc: 'Reach out to their sponsor, therapist, or trusted support person if they have one.' },
  { title: 'Follow Up', desc: 'After the immediate crisis, help them reconnect with their recovery resources and treatment.' },
];

const CAREGIVER_ARTICLE_CONTENT: Record<string, string> = {
  'relapse-talk': `**How to Talk About a Relapse**\n\nRelapse is often part of recovery, not a failure. Here's how to approach the conversation:\n\n• **Stay calm and compassionate.** Avoid anger, blame, or "I told you so" statements.\n• **Ask open-ended questions.** "What happened?" "How are you feeling?" "What do you need right now?"\n• **Validate their feelings.** "I know this is hard." "Recovery is difficult work."\n• **Focus on next steps.** "What can we do together to help you get back on track?"\n• **Remind them of their progress.** One setback doesn't erase the work they've done.\n• **Encourage professional support.** Suggest reconnecting with their therapist, sponsor, or treatment program.\n\n**What NOT to say:**\n• "You're weak." or "You have no willpower."\n• "How could you do this to me/the family?"\n• "I'm done helping you."\n\nRemember: Your reaction can significantly impact whether they feel safe being honest with you in the future.`,
  
  'boundaries': `**Setting Healthy Boundaries**\n\nLoving someone in recovery doesn't mean sacrificing your own well-being. Healthy boundaries protect both of you.\n\n**Why boundaries matter:**\n• They prevent enabling behaviors that can harm recovery.\n• They protect your mental and emotional health.\n• They model healthy relationship dynamics.\n\n**Examples of healthy boundaries:**\n• "I will not give you money if I suspect it will be used for substances."\n• "I will not lie or cover for you to your employer, family, or friends."\n• "I will leave the room/house if you are intoxicated and behaving aggressively."\n• "I need you to attend your therapy sessions as agreed."\n\n**How to set boundaries:**\n1. Be clear and specific about what you will and won't do.\n2. State consequences calmly and follow through consistently.\n3. Use "I" statements: "I feel..." "I need..." "I will..."\n4. Don't set boundaries you can't enforce.\n5. Expect pushback initially, but stay firm.\n\n**Remember:** Boundaries are not punishments. They are acts of love and self-preservation.`,
  
  'understanding': `**Understanding What They're Going Through**\n\nSubstance use disorder (SUD) is a chronic, relapsing brain disease—not a moral failing or lack of willpower.\n\n**The Science:**\n• Repeated substance use changes brain chemistry, especially in areas controlling reward, motivation, and impulse control.\n• Cravings can be intense and overwhelming, triggered by stress, people, places, or emotions.\n• Withdrawal can be physically painful and emotionally unbearable.\n\n**Common Struggles:**\n• **Shame and guilt.** They may feel like a burden or a failure.\n• **Cravings.** These can persist long after physical withdrawal ends.\n• **Triggers everywhere.** Social settings, stress, boredom, even celebrations can trigger urges.\n• **Fear of judgment.** They may hide struggles because they fear disappointing you.\n• **Mental health challenges.** Anxiety, depression, or trauma often co-occur with SUD.\n\n**What helps:**\n• Treat it as a health condition, not a character flaw.\n• Celebrate small wins (attending a meeting, resisting a craving, being honest).\n• Normalize setbacks as part of the process, not as personal betrayal.\n• Educate yourself about their specific substance and recovery path.\n\n**Your role:**\nYou can't fix them, but you can be a steady, compassionate presence. Your support matters more than you know.`,
};

export default function CaregiverPage() {
  const router = useRouter();
  const { callGemini, loading, error } = useGemini();
  const { speak, stopSpeaking } = useSpeech();

  const [tab, setTab] = useState<Tab>('hub');
  const [situationInput, setSituationInput] = useState('');
  const [guidance, setGuidance] = useState('');
  const [shareError, setShareError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string>('');

  function handleBack() {
    stopSpeaking();
    if (tab !== 'hub') {
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
  
  function getPageTitle() {
    if (tab === 'what-do-i-say') return 'What Do I Say?';
    if (tab === 'emergency-checklist') return 'Emergency Checklist';
    if (tab === 'article') return 'Article';
    return 'Caregiver Hub';
  }

  return (
    <ErrorBoundary label="Caregiver Support">
      <div className={styles.page}>
        <header className="page-header">
          <button className="btn btn-ghost page-header-back" onClick={handleBack} aria-label="Go back">
            <ArrowLeft size={20} /> Back
          </button>
          <h1>{getPageTitle()}</h1>
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
        ) : tab === 'emergency-checklist' ? (
          <main className="section stack-lg">
            <p className={styles.mutedText}>Follow these steps when your loved one is in immediate crisis.</p>
            <div className="stack">
              {EMERGENCY_CHECKLIST_ITEMS.map((item, idx) => (
                <div key={idx} className="card">
                  <h3 className={styles.checklistTitle}>
                    <span className={styles.checklistNumber}>{idx + 1}</span>
                    {item.title}
                  </h3>
                  <p className={styles.checklistDesc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </main>
        ) : tab === 'article' ? (
          <main className="section stack-lg">
            <div className="card">
              <div className={styles.articleContent}>
                {CAREGIVER_ARTICLE_CONTENT[selectedArticle]?.split('\n').map((line, idx) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={idx} className={styles.articleHeading}>{line.replace(/\*\*/g, '')}</h3>;
                  }
                  if (line.startsWith('•')) {
                    return <li key={idx} className={styles.articleListItem}>{line.substring(1).trim()}</li>;
                  }
                  if (line.trim()) {
                    return <p key={idx} className={styles.articleParagraph}>{line}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </main>
        ) : (
          <CaregiverHub
            iconMap={CAREGIVER_ICON_MAP}
            shareError={shareError}
            onOpenGuidance={() => setTab('what-do-i-say')}
            onOpenChecklist={() => setTab('emergency-checklist')}
            onOpenArticle={(articleId) => { setSelectedArticle(articleId); setTab('article'); }}
            onShare={handleShare}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
