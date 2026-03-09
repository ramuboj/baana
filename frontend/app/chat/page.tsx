'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import CountrySelector from '@/components/CountrySelector';
import Chatbot from '@/components/Chatbot';
import '../auth.css';

export default function ChatPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.replace('/login');
      return;
    }
    setToken(t);
    setAuthenticated(true);
    setMounted(true);
  }, [router]);

  if (!mounted) {
    return (
      <div className="bukka-auth">
        <main className="auth-main" style={{ justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Lato', color: 'var(--cream-dim)' }}>Loading…</p>
        </main>
      </div>
    );
  }

  if (!authenticated) {
    return null;
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
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/#join">Join Us</Link></li>
        </ul>
      </nav>

      <main className="auth-main auth-main-chat">
        <div className="auth-chat-wrap">
          <p className="auth-chat-subtitle">Community support</p>
          <h1 className="auth-chat-title">Chat</h1>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1rem', color: 'var(--cream-dim)', marginBottom: '1.5rem' }}>
            Ask a question or start a conversation.
          </p>
          <Chatbot className="chatbot-bukka" token={token} />
          <p className="auth-footer-links" style={{ marginTop: '1.5rem' }}>
            <Link href="/dashboard">← Dashboard</Link>
            {' · '}
            <Link href="/">Home</Link>
          </p>
        </div>
      </main>

      <footer className="auth-page-footer">
        Bukka Ayyavarlu Community
      </footer>
    </div>
  );
}
