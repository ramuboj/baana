'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';
import '../app/auth.css';
import CommunityAnnouncement from './CommunityAnnouncement';
import CountrySelector from './CountrySelector';
import AuthNavLink from './AuthNavLink';
import './region-news.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const content: Record<CountryCode, {
  title: string;
  subtitle: string;
  articles: { label: string; title: string; date: string; body: string }[];
}> = {
  IN: {
    title: 'India Community News',
    subtitle: 'Faith, family, and service across our homeland',
    articles: [
      { label: 'Festival calendar', title: 'India holiday observances', date: 'Plan ahead', body: 'Families are preparing for Ugadi, Diwali, and other sacred holidays with prayer, temple visits, and community meals. Watch this space for local gathering details.' },
      { label: 'Family gathering', title: 'Spring break family picnic', date: 'Registration opening soon', body: 'Join fellow families for a spring break picnic with devotional songs, traditional games, shared food, and children’s activities. India-region members will receive the venue and schedule by email.' },
      { label: 'Temple life', title: 'Gathering in devotion', date: 'Community update', body: 'Members and families continue to preserve prayer, festival, and temple traditions across Andhra Pradesh and Telangana.' },
      { label: 'Community', title: 'Passing wisdom forward', date: 'Community update', body: 'Elders and young members are creating new opportunities to share Telugu heritage, stories, and sacred customs.' },
    ],
  },
  US: {
    title: 'USA Community News',
    subtitle: 'Faith and fellowship for families across America',
    articles: [
      { label: 'Holiday calendar', title: 'USA holiday observances', date: 'Plan ahead', body: 'Members are planning community gatherings around Independence Day, Thanksgiving, and the holiday season while honoring our shared religious traditions.' },
      { label: 'Family gathering', title: 'Spring break family picnic', date: 'Registration opening soon', body: 'Bring the family for a spring break picnic with prayer, cultural activities, traditional games, and a community potluck. USA-region members will receive the venue and schedule by email.' },
      { label: 'Community', title: 'Growing together', date: 'Community update', body: 'Our US members are building welcoming gatherings that keep family, devotion, and cultural memory close to home.' },
      { label: 'Service', title: 'A spirit of seva', date: 'Community update', body: 'Community volunteers are connecting families through service, hospitality, and celebrations throughout the year.' },
    ],
  },
};

export default function RegionNews({ region }: { region: CountryCode }) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied' | 'signed-out'>('loading');
  const [message, setMessage] = useState('');
  const header = (
    <nav className="auth-nav">
      <Link href="/" className="auth-nav-logo">
        Bukka Ayyavarlu
        <CountrySelector variant="nav" />
      </Link>
      <ul className="auth-nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/contact">Contact</Link></li>
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
        if (data.user?.region !== region) {
          setMessage(
            data.user?.region === 'US'
              ? 'Authentication conflict: your account is registered in the United States. India news is unavailable for this account.'
              : 'Authentication conflict: your account is registered in India. USA news is unavailable for this account.'
          );
          setState('denied');
          return;
        }
        setState('allowed');
      })
      .catch((err: Error) => {
        setMessage(err.message);
        setState('denied');
      });
  }, [region]);

  if (state === 'loading') return <main className="region-news-page">{header}<div className="region-news-content"><p>Verifying your community region…</p></div></main>;
  if (state === 'signed-out') {
    return (
      <main className="region-news-page">{header}<div className="region-news-content">
        <p className="auth-chat-subtitle">Members only</p>
        <h1 className="auth-chat-title">Sign in to view regional news</h1>
        <p className="region-news-message">Please sign in with your {region === 'IN' ? 'India' : 'USA'} community account to continue.</p>
        <Link className="auth-btn auth-btn-primary" href="/login">Go to login</Link>
      </div></main>
    );
  }
  if (state === 'denied') {
    return (
      <main className="region-news-page">{header}<div className="region-news-content">
        <p className="auth-chat-subtitle">Access restricted</p>
        <h1 className="auth-chat-title">Regional authentication conflict</h1>
        <p className="region-news-message" role="alert">{message}</p>
        <Link className="auth-btn auth-btn-primary" href="/profile">Return to profile</Link>
      </div></main>
    );
  }

  const page = content[region];
  return (
    <main className="region-news-page">{header}<div className="region-news-content">
      <nav className="region-news-nav"><Link href="/profile">Profile</Link><Link href="/">Home</Link></nav>
      <p className="auth-chat-subtitle">{region === 'IN' ? 'India region' : 'USA region'}</p>
      <h1 className="auth-chat-title">{page.title}</h1>
      <p className="region-news-subtitle">{page.subtitle}</p>
      <CommunityAnnouncement region={region} />
      <div className="region-news-grid">
        {page.articles.map((article) => (
          <article className="region-news-card" key={article.title}>
            <p className="auth-chat-subtitle">{article.label}</p>
            <h2>{article.title}</h2>
            <p className="region-news-date">{article.date}</p>
            <p>{article.body}</p>
          </article>
        ))}
      </div>
    </div></main>
  );
}
