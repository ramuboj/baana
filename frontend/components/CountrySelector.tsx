'use client';

import type { CountryCode } from '@/lib/locale';
import { useLanguage } from '@/lib/i18n';

export default function CountrySelector({ region }: { region: CountryCode | null | undefined }) {
  const { t } = useLanguage();
  if (!region) return null;

  const country = region === 'IN' ? 'India' : 'United States';
  return (
    <span className="country-region-badge" aria-label={t('Your community region')}>
      {t(country)}
    </span>
  );
}
