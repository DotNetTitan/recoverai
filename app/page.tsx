'use client';
// app/page.tsx - Home Screen
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  FileText,
  Heart,
  Settings,
  Shield,
  Sparkles,
  Wind,
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { AFFIRMATIONS, APP_ROUTES, CRISIS_HOTLINE_TEL, HOME_NAV_CARDS } from '@/utils/constants';
import styles from './page.module.css';

const HOME_ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Heart,
  Shield,
};

export default function HomePage() {
  const { profile, isOnboarded, isLoaded } = useProfile();
  const router = useRouter();

  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      router.replace(APP_ROUTES.ONBOARDING);
    }
  }, [isLoaded, isOnboarded, router]);

  if (!isLoaded || !isOnboarded) return null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Good to see you,</p>
          <h1 className={styles.name}>{profile?.name ?? 'Friend'}</h1>
        </div>
        <Link href={APP_ROUTES.SETTINGS} className={styles.settingsBtn} aria-label="Settings">
          <span className={styles.settingsIcon}>
            <Settings size={20} />
          </span>
        </Link>
      </header>

      <div className={styles.affirmation}>
        <p className={styles.affirmationText}>
          <Sparkles size={16} className={styles.affirmationIcon} />
          <span>{affirmation}</span>
        </p>
      </div>

      <section className={styles.crisisSection}>
        <Link
          href={APP_ROUTES.CRISIS}
          className="btn btn-crisis"
          aria-label="I Need Help Now - open crisis mode"
          id="crisis-btn"
        >
          <AlertTriangle size={24} aria-hidden="true" />
          I Need Help Now
        </Link>
      </section>

      <section className={styles.navGrid} aria-label="Main navigation">
        {HOME_NAV_CARDS.map(({ href, icon, label, desc }) => {
          const Icon = HOME_ICON_MAP[icon];
          return (
            <Link key={href} href={href} className="card-nav" aria-label={label}>
              <Icon size={32} color="var(--color-mint-tint)" aria-hidden="true" />
              <span className={styles.navLabel}>{label}</span>
              <span className={styles.navDesc}>{desc}</span>
            </Link>
          );
        })}
      </section>

      <section className={styles.groundingSection}>
        <Link href={`${APP_ROUTES.SAFETY}#grounding`} className={`card ${styles.groundingCard}`}>
          <div className={styles.groundingInner}>
            <Wind size={24} color="var(--color-gold)" aria-hidden="true" />
            <div>
              <p className={styles.groundingLabel}>Quick Grounding</p>
              <p className={styles.groundingDesc}>Box breathing - 4 minutes</p>
            </div>
            <span className={styles.groundingArrow}>
              <ArrowRight size={20} />
            </span>
          </div>
        </Link>
      </section>

      <footer className={styles.disclaimer}>
        <p>
          RecoverAI is a supportive tool, not a medical service.{' '}
          <strong>In an emergency dial 112.</strong>{' '}
          For mental health crisis support call{' '}
          <a href={CRISIS_HOTLINE_TEL} className={styles.hotlineLink}>14416</a> (Tele-MANAS).
        </p>
      </footer>
    </main>
  );
}
