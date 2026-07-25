'use client';
// app/page.tsx — Home Screen
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  BookOpen,
  Shield,
  Heart,
  Wind,
  AlertTriangle,
  Settings,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import styles from './page.module.css';

const NAV_CARDS = [
  { href: '/scripts', icon: FileText, label: 'Emergency Scripts', desc: 'AI-generated scripts for tough moments' },
  { href: '/education', icon: BookOpen, label: 'Learn', desc: 'Understand recovery & addiction' },
  { href: '/safety', icon: Shield, label: 'Safety Tools', desc: 'Track triggers & build your plan' },
  { href: '/caregiver', icon: Heart, label: 'Caregiver', desc: 'Support for those who care' },
];

const AFFIRMATIONS = [
  'Every moment of resistance is a victory.',
  'You have survived 100% of your hardest days.',
  'Recovery is not a straight line — and that\'s okay.',
  'You are stronger than the urge.',
  'One moment at a time.',
];

export default function HomePage() {
  const { profile, isOnboarded, isLoaded } = useProfile();
  const router = useRouter();

  const affirmation =
    AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  useEffect(() => {
    if (isLoaded && !isOnboarded) {
      router.replace('/onboarding');
    }
  }, [isLoaded, isOnboarded, router]);

  if (!isLoaded || !isOnboarded) return null;

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Good to see you,</p>
          <h1 className={styles.name}>{profile?.name ?? 'Friend'}</h1>
        </div>
        <Link href="/settings" className={styles.settingsBtn} aria-label="Settings">
          <span className={styles.settingsIcon}><Settings size={20} /></span>
        </Link>
      </header>

      {/* Affirmation */}
      <div className={styles.affirmation}>
        <p style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <Sparkles size={16} style={{ flexShrink: 0, marginTop: 2 }} /> 
          <span>{affirmation}</span>
        </p>
      </div>

      {/* Crisis CTA */}
      <section className={styles.crisisSection}>
        <Link
          href="/crisis"
          className="btn btn-crisis"
          aria-label="I Need Help Now — open crisis mode"
          id="crisis-btn"
        >
          <AlertTriangle size={24} aria-hidden="true" />
          I Need Help Now
        </Link>
      </section>

      {/* Nav cards */}
      <section className={styles.navGrid} aria-label="Main navigation">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href} className="card-nav" aria-label={label}>
            <Icon size={32} color="var(--color-mint-tint)" aria-hidden="true" />
            <span className={styles.navLabel}>{label}</span>
            <span className={styles.navDesc}>{desc}</span>
          </Link>
        ))}
      </section>

      {/* Quick grounding */}
      <section className={styles.groundingSection}>
        <Link href="/safety#grounding" className="card" style={{ display: 'block', textDecoration: 'none' }}>
          <div className={styles.groundingInner}>
            <Wind size={24} color="var(--color-gold)" aria-hidden="true" />
            <div>
              <p className={styles.groundingLabel}>Quick Grounding</p>
              <p className={styles.groundingDesc}>Box breathing · 4 minutes</p>
            </div>
            <span className={styles.groundingArrow}><ArrowRight size={20} /></span>
          </div>
        </Link>
      </section>

      {/* Disclaimer */}
      <footer className={styles.disclaimer}>
        <p>
          RecoverAI is a supportive tool, not a medical service.{' '}
          <strong>In an emergency dial 112.</strong>{' '}
          For mental health crisis support call{' '}
          <a href="tel:14416" className={styles.hotlineLink}>14416</a> (Tele-MANAS).
        </p>
      </footer>
    </main>
  );
}
