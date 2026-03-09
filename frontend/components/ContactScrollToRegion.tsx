'use client';

import { useEffect } from 'react';
import { getCountry } from '@/lib/locale';

export default function ContactScrollToRegion() {
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const fromHash = hash === '#contact-india' ? 'IN' : hash === '#contact-us' ? 'US' : null;
    const fromPref = getCountry();
    const target = fromHash ?? fromPref;
    if (target) {
      const id = target === 'IN' ? 'contact-india' : 'contact-us';
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, []);

  return null;
}
