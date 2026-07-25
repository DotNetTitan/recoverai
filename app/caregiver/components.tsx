'use client';
import { BookOpen, HeartHandshake, MessageCircle, Share, ShieldAlert, Volume2 } from 'lucide-react';
import { CAREGIVER_ARTICLES } from '@/utils/constants';
import { AiStatus } from '@/components/AiStatus';
import styles from './page.module.css';

interface CaregiverHubProps {
  iconMap: Record<string, React.ElementType>;
  shareError: string | null;
  onOpenGuidance: () => void;
  onShare: () => void;
}

interface CaregiverGuidanceProps {
  error: string | null;
  guidance: string;
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSpeak: (value: string) => void;
}

const ARTICLE_ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  HeartHandshake,
  ShieldAlert,
};

export function CaregiverGuidance({
  error,
  guidance,
  input,
  loading,
  onInputChange,
  onSubmit,
  onSpeak,
}: CaregiverGuidanceProps) {
  return (
    <main className="section stack-lg">
      <p className={styles.mutedText}>Describe the situation. AI will suggest what to say.</p>
      <textarea
        className={`input ${styles.guidanceInput}`}
        placeholder="E.g., They just told me they relapsed and I don't know what to say..."
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
      />
      <button className="btn btn-primary btn-full" onClick={onSubmit} disabled={loading || !input.trim()}>
        {loading ? 'Getting guidance...' : 'Get Guidance'}
      </button>
      <AiStatus error={error} loading={loading} skeletonHeight={80} />
      {guidance && !loading && (
        <div className="card">
          <p className={styles.guidanceText}>{guidance}</p>
          <button className="btn btn-ghost" onClick={() => onSpeak(guidance)}>
            <Volume2 size={18} /> Read aloud
          </button>
        </div>
      )}
    </main>
  );
}

export function CaregiverHub({ iconMap, shareError, onOpenGuidance, onShare }: CaregiverHubProps) {
  const MessageIcon = iconMap.MessageCircle ?? MessageCircle;

  return (
    <main className="section stack-lg">
      {shareError && (
        <div className="card" role="alert">
          <p>{shareError}</p>
        </div>
      )}

      <button className={`card ${styles.featureCard} ${styles.clickableCard}`} onClick={onOpenGuidance}>
        <div className={styles.featureHeader}>
          <MessageIcon size={24} />
          <h2 className={styles.featureTitle}>What do I say right now?</h2>
        </div>
        <p className={styles.featureText}>AI-powered guidance for tough conversations.</p>
      </button>

      <div className={`card ${styles.featureCard}`}>
        <h2 className={styles.featureTitle}>Are they in crisis right now?</h2>
        <p className={styles.featureText}>Follow the emergency checklist to keep them safe.</p>
        <button className={`btn ${styles.featureButton}`}>View Emergency Checklist</button>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>Essential Reading</h2>
        <div className="stack">
          {CAREGIVER_ARTICLES.map((article) => {
            const Icon = ARTICLE_ICON_MAP[article.icon];
            return (
              <button key={article.id} className={`card ${styles.articleButton}`}>
                <div className={styles.articleIcon}>
                  <Icon size={20} color="var(--color-mint-tint)" />
                </div>
                <span className={styles.articleTitle}>{article.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`card ${styles.shareCard}`}>
        <Share size={32} color="var(--color-gold)" className={styles.shareIcon} />
        <h3 className={styles.shareTitle}>Share RecoverAI</h3>
        <p className={styles.mutedText}>
          Send this app to your loved one so they have support when they need it most.
        </p>
        <button className="btn btn-outline btn-full" onClick={onShare}>
          Share App Link
        </button>
      </div>
    </main>
  );
}
