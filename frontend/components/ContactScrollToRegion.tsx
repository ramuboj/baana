'use client';

import { useEffect } from 'react';
import { getAuthHeaders } from '@/lib/auth';

export default function ContactScrollToRegion() {
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const fromHash = hash === '#contact-india' ? 'IN' : hash === '#contact-us' ? 'US' : null;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/me`, {
      credentials: 'include',
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        const region = data.user?.region;
        if (region !== 'IN' && region !== 'US') return;
        if (fromHash && fromHash !== region) return;
        const id = region === 'IN' ? 'contact-india' : 'contact-us';
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      })
      .catch((error: Error) => console.error('Unable to load contact region:', error));
  }, []);

  return null;
}
