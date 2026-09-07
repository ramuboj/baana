'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type AuthNavLinkProps = {
  className?: string;
};

export default function AuthNavLink({ className }: AuthNavLinkProps) {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getToken()));

  useEffect(() => {
    const token = getToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers })
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        }
      })
        .catch(() => undefined);
  }, []);

  return (
    <Link className={className} href={authenticated ? '/profile' : '/login'}>
      {authenticated ? 'Profile' : 'Login'}
    </Link>
  );
}
