'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setToken } from '@/lib/auth';
import BrandMark from '@/components/BrandMark';
import { useLanguage } from '@/lib/i18n';
import { COUNTRIES } from '@/lib/countries';
import '../auth.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [regionLocked, setRegionLocked] = useState(false);
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const region = new URLSearchParams(window.location.search).get('region');
    if (region === 'IN' || region === 'US') {
      setCountry(region === 'IN' ? 'India' : 'United States');
      setCurrentCountry(region === 'IN' ? 'India' : 'United States');
      setRegionLocked(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(t('Password must be at least 8 characters'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('Passwords do not match'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          first_name: firstName.trim() || undefined,
          last_name: lastName.trim() || undefined,
          date_of_birth: dateOfBirth || undefined,
          place_of_birth: placeOfBirth.trim() || undefined,
          current_location: currentLocation.trim() || undefined,
          city: city.trim() || undefined,
          country: country || undefined,
          current_country: currentCountry || undefined,
          father_name: fatherName.trim() || undefined,
          mother_name: motherName.trim() || undefined,
          contact_number: contactNumber.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(t(data.error || 'Registration failed'));
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
      setError(t('Network error. Is the backend running?'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bukka-auth">
      <nav className="auth-nav">
        <Link href="/" className="auth-nav-logo">
          <BrandMark />
        </Link>
        <ul className="auth-nav-links">
          <li><Link href="/#about">{t('About')}</Link></li>
          <li><Link href="/#heritage">{t('Heritage')}</Link></li>
          <li><Link href="/#join">{t('Join Us')}</Link></li>
          <li><Link href="/contact">{t('Contact')}</Link></li>
          <li><Link href="/login">{t('Login')}</Link></li>
        </ul>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <p className="auth-subtitle">{t('Cast Community')}</p>
          <h1 className="auth-title">{t('Register as a Member')}</h1>
          <div className="auth-divider" />
          <form onSubmit={handleSubmit}>
            <fieldset className="auth-fieldset">
              <span className="auth-fieldset-legend">{t('Account')}</span>
              <label htmlFor="email" className="auth-label">{t('Email')}</label>
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
              <label htmlFor="password" className="auth-label">
                {t('Password')} ({t('min')} {MIN_PASSWORD_LENGTH} {t('characters')})
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={MIN_PASSWORD_LENGTH}
                className="auth-input"
              />
              <label htmlFor="confirmPassword" className="auth-label">{t('Confirm password')}</label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={MIN_PASSWORD_LENGTH}
                className="auth-input"
              />
            </fieldset>

            <fieldset className="auth-fieldset">
              <span className="auth-fieldset-legend">{t('Personal details')}</span>
              <label htmlFor="firstName" className="auth-label">{t('First name')}</label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
              <label htmlFor="lastName" className="auth-label">{t('Last name')}</label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
              <label htmlFor="dateOfBirth" className="auth-label">{t('Date of birth')}</label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
              <label htmlFor="placeOfBirth" className="auth-label">{t('Place of birth')}</label>
              <input
                id="placeOfBirth"
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                disabled={loading}
                placeholder={t('City / Town')}
                className="auth-input"
              />
              <label htmlFor="currentLocation" className="auth-label">{t('State / Region')}</label>
              <input
                id="currentLocation"
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                disabled={loading}
                placeholder={t('State or Region')}
                className="auth-input"
              />
              <label htmlFor="city" className="auth-label">{t('City')}</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={loading}
                placeholder={t('City')}
                className="auth-input"
                autoComplete="address-level2"
              />
              <label htmlFor="country" className="auth-label">{t('Registration region')}</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={loading || regionLocked}
                className="auth-input"
                autoComplete="country-name"
                required
              >
                <option value="">{t('Select region')}</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{t(c)}</option>
                ))}
              </select>
              <label htmlFor="currentCountry" className="auth-label">{t('Current country')}</label>
              <select
                id="currentCountry"
                value={currentCountry}
                onChange={(e) => setCurrentCountry(e.target.value)}
                disabled={loading}
                className="auth-input"
                autoComplete="country-name"
                required
              >
                <option value="">{t('Select current country')}</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
              </select>
              <label htmlFor="fatherName" className="auth-label">{t("Father's name")}</label>
              <input
                id="fatherName"
                type="text"
                autoComplete="off"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
              <label htmlFor="motherName" className="auth-label">{t("Mother's name")}</label>
              <input
                id="motherName"
                type="text"
                autoComplete="off"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                disabled={loading}
                className="auth-input"
              />
              <label htmlFor="contactNumber" className="auth-label">{t('Contact number')}</label>
              <input
                id="contactNumber"
                type="tel"
                autoComplete="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                disabled={loading}
                placeholder={t('Phone / Mobile')}
                className="auth-input"
              />
            </fieldset>

            {error && (
              <p role="alert" className="auth-error">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="auth-btn auth-btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? t('Creating account…') : t('Register')}
            </button>
          </form>
          <p className="auth-footer-links" style={{ marginTop: '1.5rem' }}>
            {t('Already have an account?')} <Link href="/login">{t('Log in')}</Link>
          </p>
          <p className="auth-footer-links" style={{ marginTop: '0.5rem' }}>
            <Link href="/">{`← ${t('Back to home')}`}</Link>
          </p>
        </div>
      </main>

      <footer className="auth-page-footer">
        <BrandMark className="brand-mark--footer" label="Bukka Ayyavarlu Community" />
      </footer>
    </div>
  );
}
