'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegionNewsNavLink() {
  const { t } = useLanguage();
  const [region, setRegion] = useState<CountryCode | 'admin' | null>(null);

  useEffect(() => {
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data.user?.region === 'IN' || data.user?.region === 'US') {
          setRegion(data.user.role === 'admin' ? 'admin' : data.user.region);
        }
      })
      .catch((error: Error) => console.error('Unable to load regional navigation:', error));
  }, []);

  if (!region) return null;

  if (region === 'admin') {
    return (
      <span className="nav-region-news-links">
        <Link href="/india/news">{t('India News')}</Link>
        <Link href="/usa/news">{t('USA News')}</Link>
      </span>
    );
  }
  return <Link href={region === 'IN' ? '/india/news' : '/usa/news'}>{t('News')}</Link>;
}
