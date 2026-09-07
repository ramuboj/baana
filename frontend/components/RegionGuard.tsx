'use client';

import { useEffect, useState } from 'react';
import type { CountryCode } from '@/lib/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type RegionGuardProps = {
  region: CountryCode;
  children: React.ReactNode;
};

export default function RegionGuard({ region, children }: RegionGuardProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(async (res) => {
        if (res.status === 401) {
          setAllowed(true);
          return;
        }
        if (!res.ok) {
          throw new Error('Unable to verify region');
        }
        const data = await res.json();
        setAllowed(data.user?.region === region);
      })
      .catch(() => setAllowed(false));
  }, [region]);

  if (allowed === false) return null;
  return <>{children}</>;
}
