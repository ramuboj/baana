'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken, clearToken } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setAuthenticated(true);
    setMounted(true);
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/login');
    router.refresh();
  }

  if (!mounted) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#94a3b8' }}>Loading…</p>
      </main>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem' }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '0.875rem' }}>
            Home
          </Link>
          <Link href="/chat" style={{ fontSize: '0.875rem' }}>
            Chat
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Log out
          </button>
        </div>
      </div>
      <div
        style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '2rem',
          border: '1px solid #334155',
        }}
      >
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          You are logged in. This page only loads when a valid JWT exists in
          localStorage.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Use the Log out button to clear the token and return to the login
          page.
        </p>
      </div>
    </main>
  );
}
