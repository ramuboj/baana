'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandMark from '@/components/BrandMark';
import { getAuthHeaders } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';
import { useLanguage } from '@/lib/i18n';
import '../admin.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type AdminUser = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  region: CountryCode | null;
  role: 'user' | 'admin';
  created_at: string;
};

type RegionalContent = {
  id: number;
  region: CountryCode;
  kind: 'news' | 'announcement';
  label: string;
  title: string;
  date_label: string;
  body: string;
  is_published: boolean;
  sort_order: number;
};

type SiteSettings = {
  registration_enabled: boolean;
  homepage_notice: string;
  updated_at: string;
};

type ApiErrorPayload = { error?: string };
type ApiError = Error & { status?: number };

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  const data = await response.json().catch((): ApiErrorPayload => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Administrator request failed') as ApiError;
    error.status = response.status;
    throw error;
  }
  return data as T;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [adminId, setAdminId] = useState<number | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [region, setRegion] = useState<CountryCode>('IN');
  const [content, setContent] = useState<RegionalContent[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    registration_enabled: true,
    homepage_notice: '',
    updated_at: '',
  });
  const [busy, setBusy] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([
      apiRequest<{ user: { id: number } }>('/auth/me'),
      apiRequest<{ users: AdminUser[] }>('/admin/users'),
      apiRequest<{ content: RegionalContent[] }>(`/admin/content?region=${region}`),
      apiRequest<{ settings: SiteSettings }>('/admin/settings'),
    ])
      .then(([current, memberData, contentData, settingsData]) => {
        if (!active) return;
        setAdminId(current.user.id);
        setUsers(memberData.users);
        setContent(contentData.content);
        setSettings(settingsData.settings);
      })
      .catch((requestError: ApiError) => {
        if (!active) return;
        if (requestError.status === 401) {
          router.replace('/login');
          return;
        }
        if (requestError.status === 403) {
          setDenied(true);
          return;
        }
        setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [region, router]);

  async function updateUser(userId: number, patch: Partial<Pick<AdminUser, 'role' | 'region'>>) {
    setBusy(`user-${userId}`);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest<{ user: AdminUser }>(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      setUsers((current) => current.map((user) => user.id === userId ? result.user : user));
      setNotice(t('Member access updated.'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('Unable to update member access'));
    } finally {
      setBusy('');
    }
  }

  async function addContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const draft = {
      region,
      kind: String(form.get('kind')),
      label: String(form.get('label') || ''),
      title: String(form.get('title') || ''),
      date_label: String(form.get('date_label') || ''),
      body: String(form.get('body') || ''),
      is_published: true,
    };
    setBusy('new-content');
    setError('');
    setNotice('');
    try {
      const result = await apiRequest<{ content: RegionalContent }>('/admin/content', {
        method: 'POST',
        body: JSON.stringify(draft),
      });
      setContent((current) => [...current, result.content]);
      formElement.reset();
      setNotice(t('Regional content published.'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('Unable to publish content'));
    } finally {
      setBusy('');
    }
  }

  async function saveContent(event: FormEvent<HTMLFormElement>, item: RegionalContent) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const updates = {
      kind: String(form.get('kind')),
      label: String(form.get('label') || ''),
      title: String(form.get('title') || ''),
      date_label: String(form.get('date_label') || ''),
      body: String(form.get('body') || ''),
      is_published: form.get('is_published') === 'on',
    };
    setBusy(`content-${item.id}`);
    setError('');
    setNotice('');
    try {
      const result = await apiRequest<{ content: RegionalContent }>(`/admin/content/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      setContent((current) => current.map((entry) => entry.id === item.id ? result.content : entry));
      setNotice(t('Regional content saved.'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('Unable to save content'));
    } finally {
      setBusy('');
    }
  }

  async function deleteContent(item: RegionalContent) {
    setBusy(`content-${item.id}`);
    setError('');
    setNotice('');
    try {
      await apiRequest<{ message: string }>(`/admin/content/${item.id}`, { method: 'DELETE' });
      setContent((current) => current.filter((entry) => entry.id !== item.id));
      setNotice(t('Regional content deleted.'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('Unable to delete content'));
    } finally {
      setBusy('');
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('settings');
    setError('');
    setNotice('');
    try {
      const result = await apiRequest<{ settings: SiteSettings }>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      setSettings(result.settings);
      setNotice(t('Site settings saved.'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : t('Unable to save site settings'));
    } finally {
      setBusy('');
    }
  }

  if (loading) {
    return <main className="admin-page"><p className="admin-status">{t('Loading administrator tools…')}</p></main>;
  }

  if (denied) {
    return (
      <main className="admin-page">
        <section className="admin-access-card">
          <p className="admin-kicker">{t('Restricted area')}</p>
          <h1>{t('Administrator access required')}</h1>
          <p>{t('This account does not have permission to manage the community site.')}</p>
          <Link href="/dashboard">{t('Return to profile')}</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <Link href="/" className="admin-brand"><BrandMark /></Link>
          <p className="admin-kicker">{t('Community administration')}</p>
          <h1>{t('Administrator dashboard')}</h1>
          <p>{t('Manage member access, regional updates, and site settings.')}</p>
        </div>
        <nav className="admin-nav">
          <Link href="/dashboard">{t('Profile')}</Link>
          <Link href="/">{t('Home')}</Link>
        </nav>
      </header>

      {error && <p className="admin-alert" role="alert">{t(error)}</p>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}

      <section className="admin-panel" aria-labelledby="admin-members-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-kicker">{t('Access control')}</p>
            <h2 id="admin-members-heading">{t('Members and roles')}</h2>
          </div>
          <span>{users.length} {t('members')}</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-users-table">
            <thead><tr>
              <th>{t('Member')}</th><th>{t('Region')}</th><th>{t('Role')}</th><th>{t('Joined')}</th>
            </tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.email}</strong>
                    <span>{user.email}</span>
                  </td>
                  <td>
                    <select
                      aria-label={`${t('Region')} — ${user.email}`}
                      value={user.region || ''}
                      disabled={busy === `user-${user.id}`}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === 'IN' || value === 'US') {
                          void updateUser(user.id, { region: value });
                        }
                      }}
                    >
                      <option value="" disabled>{t('Not set')}</option>
                      <option value="IN">{t('India')}</option>
                      <option value="US">{t('United States')}</option>
                    </select>
                  </td>
                  <td>
                    <select
                      aria-label={`${t('Role')} — ${user.email}`}
                      value={user.role}
                      disabled={user.id === adminId || busy === `user-${user.id}`}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === 'user' || value === 'admin') {
                          void updateUser(user.id, { role: value });
                        }
                      }}
                    >
                      <option value="user">{t('Member')}</option>
                      <option value="admin">{t('Administrator')}</option>
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="admin-content-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-kicker">{t('Regional publishing')}</p>
            <h2 id="admin-content-heading">{t('News and announcements')}</h2>
          </div>
          <div className="admin-region-tabs" aria-label={t('Select region')}>
            <button type="button" aria-pressed={region === 'IN'} onClick={() => setRegion('IN')}>{t('India')}</button>
            <button type="button" aria-pressed={region === 'US'} onClick={() => setRegion('US')}>{t('United States')}</button>
          </div>
        </div>

        <form className="admin-content-form" onSubmit={addContent}>
          <h3>{t('Add regional content')}</h3>
          <div className="admin-form-grid">
            <label>{t('Content type')}
              <select name="kind" defaultValue="news">
                <option value="news">{t('News')}</option>
                <option value="announcement">{t('Announcement')}</option>
              </select>
            </label>
            <label>{t('Category')}<input name="label" maxLength={120} /></label>
            <label>{t('Title')}<input name="title" required maxLength={255} /></label>
            <label>{t('Date or status')}<input name="date_label" maxLength={120} /></label>
          </div>
          <label>{t('Details')}<textarea name="body" required rows={3} /></label>
          <button type="submit" disabled={busy === 'new-content'}>
            {busy === 'new-content' ? t('Publishing…') : t('Publish')}
          </button>
        </form>

        <div className="admin-content-list">
          {content.map((item) => (
            <form className="admin-content-item" key={item.id} onSubmit={(event) => saveContent(event, item)}>
              <div className="admin-form-grid">
                <label>{t('Content type')}
                  <select name="kind" defaultValue={item.kind}>
                    <option value="news">{t('News')}</option>
                    <option value="announcement">{t('Announcement')}</option>
                  </select>
                </label>
                <label>{t('Category')}<input name="label" defaultValue={item.label} maxLength={120} /></label>
                <label>{t('Title')}<input name="title" defaultValue={item.title} required maxLength={255} /></label>
                <label>{t('Date or status')}<input name="date_label" defaultValue={item.date_label} maxLength={120} /></label>
              </div>
              <label>{t('Details')}<textarea name="body" defaultValue={item.body} required rows={3} /></label>
              <div className="admin-content-actions">
                <label className="admin-publish-toggle">
                  <input type="checkbox" name="is_published" defaultChecked={item.is_published} />
                  {t('Published')}
                </label>
                <button type="submit" disabled={busy === `content-${item.id}`}>{t('Save')}</button>
                <button type="button" className="admin-delete-button" disabled={busy === `content-${item.id}`} onClick={() => deleteContent(item)}>{t('Delete')}</button>
              </div>
            </form>
          ))}
          {!content.length && <p className="admin-empty">{t('No content has been added for this region yet.')}</p>}
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="admin-settings-heading">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-kicker">{t('Site configuration')}</p>
            <h2 id="admin-settings-heading">{t('Site settings')}</h2>
          </div>
        </div>
        <form className="admin-settings-form" onSubmit={saveSettings}>
          <label className="admin-publish-toggle">
            <input
              type="checkbox"
              checked={settings.registration_enabled}
              onChange={(event) => setSettings((current) => ({ ...current, registration_enabled: event.target.checked }))}
            />
            {t('Allow new member registration')}
          </label>
          <label>{t('Homepage notice')}
            <textarea
              value={settings.homepage_notice}
              maxLength={500}
              rows={3}
              onChange={(event) => setSettings((current) => ({ ...current, homepage_notice: event.target.value }))}
            />
          </label>
          <button type="submit" disabled={busy === 'settings'}>{busy === 'settings' ? t('Saving…') : t('Save settings')}</button>
        </form>
      </section>
    </main>
  );
}
