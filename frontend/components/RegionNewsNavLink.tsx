'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function RegionNewsNavLink() {
  const [region, setRegion] = useState<CountryCode | null>(null);

  useEffect(() => {
    const token = getToken();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data.user?.region === 'IN' || data.user?.region === 'US') {
          setRegion(data.user.region);
        }
      })
      .catch(() => undefined);
  }, []);

  if (!region) return null;

  return (
    <Link href={region === 'IN' ? '/india/news' : '/usa/news'}>
      News
    </Link>
  );
}
