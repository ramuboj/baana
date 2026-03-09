'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setToken } from '@/lib/auth';
import CountrySelector from '@/components/CountrySelector';
import '../auth.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      if (data.token) {
        setToken(data.token);
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('No token received');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bukka-auth">
      <nav className="auth-nav">
        <Link href="/" className="auth-nav-logo">
          Bukka Ayyavarlu
          <CountrySelector variant="nav" />
        </Link>
        <ul className="auth-nav-links">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#heritage">Heritage</Link></li>
          <li><Link href="/#join">Join Us</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/register">Register</Link></li>
        </ul>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <p className="auth-subtitle">Community Portal</p>
          <h1 className="auth-title">Log in</h1>
          <div className="auth-divider" />
          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="auth-label">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="auth-input"
            />
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="auth-input"
            />
            {error && (
              <p role="alert" className="auth-error">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn auth-btn-primary"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="auth-footer-links" style={{ marginTop: '1.5rem' }}>
            Don&apos;t have an account? <Link href="/register">Register</Link>
          </p>
          <p className="auth-footer-links" style={{ marginTop: '0.5rem' }}>
            <Link href="/">← Back to home</Link>
          </p>
        </div>
      </main>

      <footer className="auth-page-footer">
        Bukka Ayyavarlu Community
      </footer>
    </div>
  );
}
