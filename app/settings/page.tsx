'use client';
// app/settings/page.tsx — Settings Page
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { STORAGE_KEYS } from '@/context/types';

export default function SettingsPage() {
  const router = useRouter();
  const { profile } = useProfile();

  function handleReset() {
    if (confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.TRIGGER_LOG);
      localStorage.removeItem(STORAGE_KEYS.SAFETY_PLAN);
      window.location.href = '/onboarding';
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingBottom: 40 }}>
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => router.push('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1 style={{ fontSize: 'var(--font-h2)' }}>Settings</h1>
      </header>

      <main className="section stack-lg" style={{ flex: 1, marginTop: 12 }}>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-mint-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="var(--color-forest-green)" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, color: 'var(--color-warm-white)' }}>{profile?.name}</h2>
              <p style={{ color: 'var(--color-soft-stone)', textTransform: 'capitalize' }}>{profile?.role}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-full" onClick={() => router.push('/onboarding')}>
            Edit Profile
          </button>
        </div>

        <div className="stack">
           <button className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', border: 'none' }}>
             <Bell size={20} color="var(--color-mint-tint)" />
             <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>Notifications</span>
             <ChevronRight size={20} color="var(--color-soft-stone)" />
           </button>
           <button className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, width: '100%', border: 'none' }}>
             <Shield size={20} color="var(--color-mint-tint)" />
             <span style={{ flex: 1, textAlign: 'left', fontWeight: 600 }}>Privacy & Data</span>
             <ChevronRight size={20} color="var(--color-soft-stone)" />
           </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 40 }}>
           <button className="btn btn-ghost btn-full" style={{ color: 'var(--color-crisis-red)' }} onClick={handleReset}>
             <LogOut size={20} /> Reset App Data
           </button>
           <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-soft-stone)', marginTop: 16 }}>
             RecoverAI v1.0.0
           </p>
        </div>

      </main>
    </div>
  );
}
