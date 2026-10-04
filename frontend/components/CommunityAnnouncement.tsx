'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CountryCode } from '@/lib/locale';
import { useLanguage } from '@/lib/i18n';
import { getAuthHeaders } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Announcement = {
  title: string;
  body: string;
};

export default function CommunityAnnouncement({ region }: { region?: CountryCode }) {
  const { t } = useLanguage();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const newsPath = region === 'IN' ? '/india/news' : region === 'US' ? '/usa/news' : '/login';

  useEffect(() => {
    if (!region) return;
    fetch(`${API_URL}/regions/${region}/content?kind=announcement`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to load regional announcements');
        setAnnouncement(data.content?.[0] || null);
      })
      .catch((error: Error) => console.error('Unable to load community announcement:', error));
  }, [region]);

  if (!region || !announcement) return null;

  return (
    <aside className="community-announcement" role="status">
      <span className="community-announcement-badge">{t('Announcement')}</span>
      <div>
        <h2>{t(announcement.title)}</h2>
        <p>{t(announcement.body)}</p>
      </div>
      <Link href={newsPath}>{t('View regional details')}</Link>
    </aside>
  );
}
