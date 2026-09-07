'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, clearToken } from '@/lib/auth';
import { setCountry, type CountryCode } from '@/lib/locale';
import CommunityAnnouncement from '@/components/CommunityAnnouncement';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type User = {
  email: string;
  region: CountryCode | null;
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
          <p className="dashboard-kicker">Community Portal</p>
          <h1>Welcome{user?.first_name ? `, ${user.first_name}` : ''}</h1>
        </div>
        <nav className="dashboard-nav">
          <Link href="/">Home</Link>
          <Link href="/chat">Chat</Link>
          {user?.region === 'IN' && <Link href="/india/news">India News</Link>}
          {user?.region === 'US' && <Link href="/usa/news">USA News</Link>}
          <button type="button" onClick={handleLogout}>Log out</button>
        </nav>
      </div>
      {error && <p className="dashboard-error" role="alert">{error}</p>}
      {user?.region && <CommunityAnnouncement region={user.region} />}
      <section className="dashboard-grid">
        <article className="dashboard-card profile-card">
          <p className="dashboard-kicker">Your Profile</p>
          <h2>{display(user?.first_name || user?.last_name ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim() : null)}</h2>
          {editing ? (
            <form className="profile-edit-form" onSubmit={handleSave}>
              <label>First name<input name="first_name" defaultValue={user?.first_name || ''} /></label>
              <label>Last name<input name="last_name" defaultValue={user?.last_name || ''} /></label>
              <label>Date of birth<input name="date_of_birth" type="date" defaultValue={user?.date_of_birth || ''} /></label>
              <label>Place of birth<input name="place_of_birth" defaultValue={user?.place_of_birth || ''} /></label>
              <label>Current location<input name="current_location" defaultValue={user?.current_location || ''} /></label>
              <label>City<input name="city" defaultValue={user?.city || ''} /></label>
              <label>Current country<select name="current_country" defaultValue={user?.current_country || user?.country || ''}><option value="India">India</option><option value="United States">United States</option></select></label>
              <label>Father&apos;s name<input name="father_name" defaultValue={user?.father_name || ''} /></label>
              <label>Mother&apos;s name<input name="mother_name" defaultValue={user?.mother_name || ''} /></label>
              <label>Contact number<input name="contact_number" defaultValue={user?.contact_number || ''} /></label>
              <div className="profile-edit-actions"><button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={() => setEditing(false)}>Cancel</button></div>
            </form>
          ) : <dl className="profile-details">
            <div><dt>Email</dt><dd>{display(user?.email || null)}</dd></div>
            <div><dt>Date of birth</dt><dd>{display(user?.date_of_birth)}</dd></div>
            <div><dt>Place of birth</dt><dd>{display(user?.place_of_birth)}</dd></div>
            <div><dt>Location</dt><dd>{display([user?.city, user?.current_country].filter(Boolean).join(', ') || user?.current_location)}</dd></div>
            <div><dt>Current country</dt><dd>{display(user?.current_country || user?.country)}</dd></div>
            <div><dt>Contact</dt><dd>{display(user?.contact_number)}</dd></div>
            <div><dt>Parents</dt><dd>{display([user?.father_name && `Father: ${user.father_name}`, user?.mother_name && `Mother: ${user.mother_name}`].filter(Boolean).join(' · ') || null)}</dd></div>
          </dl>}
          {!editing && <button type="button" className="settings-action" onClick={() => setEditing(true)}>Edit profile</button>}
        </article>
        <article className="dashboard-card settings-card">
          <p className="dashboard-kicker">Account Settings</p>
          <h2>Settings</h2>
          <p>Manage your community account and keep your profile information up to date.</p>
          <div className="settings-row"><span>Signed in as</span><strong>{display(user?.email || null)}</strong></div>
          <div className="settings-row"><span>Region</span><strong>{user?.region === 'IN' ? 'India' : user?.region === 'US' ? 'United States' : 'Not set'}</strong></div>
          <div className="settings-row"><span>Member since</span><strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</strong></div>
          <button type="button" className="settings-action" onClick={handleLogout}>Sign out of this account</button>
        </article>
      </section>
      <div className="dashboard-footer">
        <Link href="/contact">Need help? Contact us</Link>
      </div>
    </main>
  );
}
