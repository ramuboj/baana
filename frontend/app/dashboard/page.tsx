'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, clearToken } from '@/lib/auth';
import { setCountry, type CountryCode } from '@/lib/locale';
import CommunityAnnouncement from '@/components/CommunityAnnouncement';
import BrandMark from '@/components/BrandMark';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type User = {
  email: string;
  region: CountryCode | null;
  role: 'user' | 'admin';
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  place_of_birth: string | null;
  current_location: string | null;
  city: string | null;
  country: string | null;
  current_country: string | null;
  father_name: string | null;
  mother_name: string | null;
  contact_number: string | null;
  created_at: string;
};

function display(value: string | null | undefined) {
  return value || 'Not provided';
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    setAuthenticated(true);
    setMounted(true);
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};
    fetch(`${API_URL}/auth/me`, {
      headers,
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const error = new Error(data.error || 'Unable to load profile') as Error & { status?: number };
          error.status = res.status;
          throw error;
        }
        setUser(data.user);
        if (data.user.region) {
          setCountry(data.user.region);
        }
      })
      .catch((err: Error & { status?: number }) => {
        setError(err.message);
        if (err.status === 401) {
          clearToken();
          router.replace('/login');
        }
      });
  }, [router]);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      clearToken();
      router.replace('/login');
      router.refresh();
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (!user) return;
      setSaving(true);
      setError('');
      const form = new FormData(e.currentTarget);
      const token = getToken();
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(Object.fromEntries(form.entries())),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to update profile');
        setUser(data.user);
        setEditing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to update profile');
      } finally {
        setSaving(false);
    }
  }

  if (!mounted) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#94a3b8' }}>Loading…</p>
      </main>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="dashboard-page">
      <div
        className="dashboard-header"
      >
        <div>
          <Link href="/" className="dashboard-brand">
            <BrandMark />
          </Link>
          <p className="dashboard-kicker">{t('Community Portal')}</p>
          <h1>{t('Welcome')}{user?.first_name ? `, ${user.first_name}` : ''}</h1>
        </div>
        <nav className="dashboard-nav">
          <Link href="/">{t('Home')}</Link>
          <Link href="/chat">{t('Chat')}</Link>
          {user?.region === 'IN' && <Link href="/india/news">{t('India News')}</Link>}
          {user?.region === 'US' && <Link href="/usa/news">{t('USA News')}</Link>}
          {user?.role === 'admin' && <Link href="/admin">{t('Admin')}</Link>}
          <button type="button" onClick={handleLogout}>{t('Log out')}</button>
        </nav>
      </div>
      {error && <p className="dashboard-error" role="alert">{error}</p>}
      {user?.region && <CommunityAnnouncement region={user.region} />}
      <section className="dashboard-grid">
        <article className="dashboard-card profile-card">
          <p className="dashboard-kicker">{t('Your Profile')}</p>
          <h2>{display(user?.first_name || user?.last_name ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() : null)}</h2>
          {editing ? (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <label>{t('First name')}<input name="first_name" defaultValue={user?.first_name || ''} /></label>
              <label>{t('Last name')}<input name="last_name" defaultValue={user?.last_name || ''} /></label>
              <label>{t('Date of birth')}<input name="date_of_birth" type="date" defaultValue={user?.date_of_birth || ''} /></label>
              <label>{t('Place of birth')}<input name="place_of_birth" defaultValue={user?.place_of_birth || ''} /></label>
              <label>{t('Current location')}<input name="current_location" defaultValue={user?.current_location || ''} /></label>
              <label>{t('City')}<input name="city" defaultValue={user?.city || ''} /></label>
              <label>{t('Current country')}<select name="current_country" defaultValue={user?.current_country || user?.country || ''}><option value="India">India</option><option value="United States">United States</option></select></label>
              <label>{t("Father's name")}<input name="father_name" defaultValue={user?.father_name || ''} /></label>
              <label>{t("Mother's name")}<input name="mother_name" defaultValue={user?.mother_name || ''} /></label>
              <label>{t('Contact number')}<input name="contact_number" defaultValue={user?.contact_number || ''} /></label>
              <div className="profile-edit-actions"><button type="submit" disabled={saving}>{saving ? t('Saving…') : t('Save changes')}</button><button type="button" onClick={() => setEditing(false)}>{t('Cancel')}</button></div>
            </form>
          ) : <dl className="profile-details">
            <div><dt>{t('Email')}</dt><dd>{display(user?.email || null)}</dd></div>
            <div><dt>{t('Date of birth')}</dt><dd>{display(user?.date_of_birth)}</dd></div>
            <div><dt>{t('Place of birth')}</dt><dd>{display(user?.place_of_birth)}</dd></div>
            <div><dt>{t('Location')}</dt><dd>{display([user?.city, user?.current_country].filter(Boolean).join(', ') || user?.current_location)}</dd></div>
            <div><dt>{t('Current country')}</dt><dd>{display(user?.current_country || user?.country)}</dd></div>
            <div><dt>{t('Contact')}</dt><dd>{display(user?.contact_number)}</dd></div>
            <div><dt>{t('Parents')}</dt><dd>{display([user?.father_name && `${t('Father')}: ${user.father_name}`, user?.mother_name && `${t('Mother')}: ${user.mother_name}`].filter(Boolean).join(' · ') || null)}</dd></div>
          </dl>}
          {!editing && <button type="button" className="settings-action" onClick={() => setEditing(true)}>{t('Edit profile')}</button>}
        </article>
        <article className="dashboard-card settings-card">
          <p className="dashboard-kicker">{t('Account Settings')}</p>
          <h2>{t('Settings')}</h2>
          <p>{t('Manage your community account and keep your profile information up to date.')}</p>
          <div className="settings-row"><span>{t('Signed in as')}</span><strong>{display(user?.email || null)}</strong></div>
          <div className="settings-row"><span>{t('Region')}</span><strong>{user?.region === 'IN' ? t('India') : user?.region === 'US' ? t('United States') : t('Not set')}</strong></div>
          <div className="settings-row"><span>{t('Member since')}</span><strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</strong></div>
          <button type="button" className="settings-action" onClick={handleLogout}>{t('Sign out of this account')}</button>
        </article>
      </section>
      <div className="dashboard-footer">
        <Link href="/contact">{t('Need help? Contact us')}</Link>
      </div>
    </main>
  );
}
