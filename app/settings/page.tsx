'use client';
// app/settings/page.tsx - Settings Page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronRight, LogOut, Shield, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useProfile } from '@/hooks/useProfile';
import { APP_ROUTES, SETTINGS_COPY } from '@/utils/constants';
import styles from './page.module.css';

export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useProfile();
  const { resetData } = useApp();
  const [confirmingReset, setConfirmingReset] = useState(false);

  function handleReset() {
    resetData();
    router.push(APP_ROUTES.ONBOARDING);
  }

  return (
    <div className={styles.page}>
      <header className="page-header">
        <button className="btn btn-ghost page-header-back" onClick={() => router.push(APP_ROUTES.HOME)} aria-label="Go back to home">
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Settings</h1>
      </header>

      <main className="section stack-lg">
        <div className="card">
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <User size={32} color="var(--color-forest-green)" />
            </div>
            <div>
              <h2 className={styles.profileName}>{profile?.name}</h2>
              <p className={styles.profileRole}>{profile?.role}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-full" onClick={() => router.push(APP_ROUTES.ONBOARDING)}>
            Edit Profile
          </button>
        </div>

        <div className="stack">
          <button className={`card ${styles.settingsButton}`}>
            <Bell size={20} color="var(--color-mint-tint)" />
            <span className={styles.settingsLabel}>Notifications</span>
            <ChevronRight size={20} color="var(--color-soft-stone)" />
          </button>
          <button className={`card ${styles.settingsButton}`}>
            <Shield size={20} color="var(--color-mint-tint)" />
            <span className={styles.settingsLabel}>Privacy & Data</span>
            <ChevronRight size={20} color="var(--color-soft-stone)" />
          </button>
        </div>

        <div className={styles.footer}>
          {confirmingReset ? (
            <div className="card" role="alert">
              <p>{SETTINGS_COPY.RESET_CONFIRM}</p>
              <div className={styles.confirmActions}>
                <button className="btn btn-crisis" onClick={handleReset}>
                  Yes, Reset Everything
                </button>
                <button className="btn btn-ghost" onClick={() => setConfirmingReset(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className={`btn btn-ghost btn-full ${styles.resetButton}`} onClick={() => setConfirmingReset(true)}>
              <LogOut size={20} /> Reset App Data
            </button>
          )}
          <p className={styles.version}>{SETTINGS_COPY.VERSION_LABEL}</p>
        </div>
      </main>
    </div>
  );
}
