'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type AuthNavLinkProps = {
  className?: string;
};

export default function AuthNavLink({ className }: AuthNavLinkProps) {
  const { t } = useLanguage();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers })
      .then((res) => {
        setAuthenticated(res.ok);
      })
      .catch((error: Error) => {
        console.error('Unable to verify sign-in state:', error);
        setAuthenticated(false);
      });
  }, []);

  return (
    <Link className={className} href={authenticated ? '/profile' : '/login'}>
      {t(authenticated ? 'Profile' : 'Login')}
    </Link>
  );
}
