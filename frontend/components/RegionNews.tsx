'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';
import '../app/auth.css';
import CommunityAnnouncement from './CommunityAnnouncement';
import CountrySelector from './CountrySelector';
import AuthNavLink from './AuthNavLink';
import BrandMark from './BrandMark';
import { useLanguage } from '@/lib/i18n';
import './region-news.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Article = {
  id: number;
  label: string;
  title: string;
  date_label: string;
  body: string;
};

export default function RegionNews({ region }: { region: CountryCode }) {
  const { t } = useLanguage();
  const [state, setState] = useState<'loading' | 'allowed' | 'denied' | 'signed-out'>('loading');
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [accountRegion, setAccountRegion] = useState<CountryCode | null>(null);
  const header = (
    <nav className="auth-nav">
      <Link href="/" className="auth-nav-logo">
        <BrandMark />
        <CountrySelector region={accountRegion} />
      </Link>
      <ul className="auth-nav-links">
        <li><Link href="/">{t('Home')}</Link></li>
        <li><Link href="/contact">{t('Contact')}</Link></li>
        <li><AuthNavLink /></li>
      </ul>
    </nav>
  );

  useEffect(() => {
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers })
      .then(async (res) => {
        if (res.status === 401) {
          setState('signed-out');
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Unable to verify your region');
        if (data.user?.region === 'IN' || data.user?.region === 'US') {
          setAccountRegion(data.user.region);
        }
        if (data.user?.region !== region && data.user?.role !== 'admin') {
          setMessage(
            data.user?.region === 'US'
              ? 'Authentication conflict: your account is registered in the United States. India news is unavailable for this account.'
              : 'Authentication conflict: your account is registered in India. USA news is unavailable for this account.'
          );
          setState('denied');
          return;
        }
        const contentResponse = await fetch(`${API_URL}/regions/${region}/content?kind=news`, {
          credentials: 'include',
          headers,
        });
        const contentData = await contentResponse.json().catch(() => ({}));
        if (!contentResponse.ok) {
          throw new Error(contentData.error || 'Unable to load regional news');
        }
        setArticles(contentData.content || []);
        setState('allowed');
      })
      .catch((err: Error) => {
        setMessage(err.message);
        setState('denied');
      });
  }, [region]);

  if (state === 'loading') return <main className="region-news-page">{header}<div className="region-news-content"><p>{t('Verifying your community region…')}</p></div></main>;
  if (state === 'signed-out') {
    return (
      <main className="region-news-page">{header}<div className="region-news-content">
        <p className="auth-chat-subtitle">{t('Members only')}</p>
        <h1 className="auth-chat-title">{t('Sign in to view regional news')}</h1>
        <p className="region-news-message">{t(region === 'IN' ? 'Please sign in with your India community account to continue.' : 'Please sign in with your USA community account to continue.')}</p>
        <Link className="auth-btn auth-btn-primary" href="/login">{t('Go to login')}</Link>
      </div></main>
    );
  }
  if (state === 'denied') {
    return (
      <main className="region-news-page">{header}<div className="region-news-content">
        <p className="auth-chat-subtitle">{t('Access restricted')}</p>
        <h1 className="auth-chat-title">{t('Regional authentication conflict')}</h1>
        <p className="region-news-message" role="alert">{t(message)}</p>
        <Link className="auth-btn auth-btn-primary" href="/profile">{t('Return to profile')}</Link>
      </div></main>
    );
  }

  const pageTitle = region === 'IN' ? 'India Community News' : 'USA Community News';
  const pageSubtitle = region === 'IN'
    ? 'Faith, family, and service across our homeland'
    : 'Faith and fellowship for families across America';
  return (
    <main className="region-news-page">{header}<div className="region-news-content">
      <nav className="region-news-nav"><Link href="/profile">{t('Profile')}</Link><Link href="/">{t('Home')}</Link></nav>
      <p className="auth-chat-subtitle">{t(region === 'IN' ? 'India region' : 'USA region')}</p>
      <h1 className="auth-chat-title">{t(pageTitle)}</h1>
      <p className="region-news-subtitle">{t(pageSubtitle)}</p>
      <CommunityAnnouncement region={region} />
      <div className="region-news-grid">
        {articles.map((article) => (
          <article className="region-news-card" key={article.id}>
            <p className="auth-chat-subtitle">{t(article.label)}</p>
            <h2>{t(article.title)}</h2>
            <p className="region-news-date">{t(article.date_label)}</p>
            <p>{t(article.body)}</p>
          </article>
        ))}
        {!articles.length && <p className="region-news-message">{t('No regional updates have been published yet.')}</p>}
      </div>
    </div></main>
  );
}
