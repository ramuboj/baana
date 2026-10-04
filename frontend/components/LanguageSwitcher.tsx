'use client';

import { useLanguage, type Language } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const options: { code: Language; label: string; name: string }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'te', label: 'తెలుగు', name: 'Telugu' },
  ];

  return (
    <div className="language-switcher" role="group" aria-label="Choose language">
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLanguage(option.code)}
          aria-pressed={language === option.code}
          aria-label={option.name}
          className={language === option.code ? 'language-switcher-active' : ''}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
