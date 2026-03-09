export type CountryCode = 'IN' | 'US';

export const COUNTRY_KEY = 'country';

export function getCountry(): CountryCode | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(COUNTRY_KEY);
  return v === 'IN' || v === 'US' ? v : null;
}

export function setCountry(country: CountryCode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COUNTRY_KEY, country);
}
