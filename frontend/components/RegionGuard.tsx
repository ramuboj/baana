'use client';

import { useEffect, useState } from 'react';
import type { CountryCode } from '@/lib/locale';
import { getAuthHeaders } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type RegionGuardProps = {
  region: CountryCode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function RegionGuard({ region, children, fallback = null }: RegionGuardProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<'loading' | 'allowed' | 'signed-out' | 'denied' | 'error'>('loading');

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers: getAuthHeaders() })
      .then(async (res) => {
        if (res.status === 401) {
          setState('signed-out');
          return;
        }
        if (!res.ok) {
          throw new Error('Unable to verify your region');
        }
        const data = await res.json();
        setState(data.user?.role === 'admin' || data.user?.region === region ? 'allowed' : 'denied');
      })
      .catch((error: Error) => {
        console.error('Unable to verify region access:', error);
        setState('error');
      });
  }, [region]);

  if (state === 'signed-out') return <>{fallback}</>;
  if (state === 'denied') return <p className="contact-region-gate" role="alert">{t('This contact information is assigned to another region.')}</p>;
  if (state === 'error') return <p className="contact-region-gate" role="alert">{t('Unable to verify regional access. Please try again later.')}</p>;
  if (state !== 'allowed') return null;
  return <>{children}</>;
}
