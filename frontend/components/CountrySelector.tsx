'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getCountry, setCountry, type CountryCode } from '@/lib/locale';

type CountrySelectorProps = {
  variant?: 'nav' | 'inline';
  onSelect?: (country: CountryCode) => void;
};

export default function CountrySelector({ variant = 'nav', onSelect }: CountrySelectorProps) {
  const pathname = usePathname();
  const [selected, setSelected] = useState<CountryCode | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSelected(getCountry());
    setMounted(true);
  }, []);

  function handleSelect(e: React.MouseEvent, country: CountryCode) {
    e.preventDefault();
    e.stopPropagation();
    setCountry(country);
    setSelected(country);
    onSelect?.(country);
    if (pathname === '/contact') {
      const el = document.getElementById(country === 'IN' ? 'contact-india' : 'contact-us');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (!mounted) {
    return (
      <span className={`country-selector country-selector--${variant}`}>
        <span className="country-selector-label">India</span>
        <span className="country-selector-sep">|</span>
        <span className="country-selector-label">US</span>
      </span>
    );
  }

  return (
    <span className={`country-selector country-selector--${variant}`}>
      <button
        type="button"
        className={`country-selector-btn ${selected === 'IN' ? 'country-selector-btn--active' : ''}`}
        onClick={(e) => handleSelect(e, 'IN')}
        aria-pressed={selected === 'IN'}
        title="India"
      >
        India
      </button>
      <span className="country-selector-sep" aria-hidden>|</span>
      <button
        type="button"
        className={`country-selector-btn ${selected === 'US' ? 'country-selector-btn--active' : ''}`}
        onClick={(e) => handleSelect(e, 'US')}
        aria-pressed={selected === 'US'}
        title="United States"
      >
        US
      </button>
    </span>
  );
}
