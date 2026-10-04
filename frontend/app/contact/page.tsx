'use client';

import Link from 'next/link';
import ContactScrollToRegion from '@/components/ContactScrollToRegion';
import RegionGuard from '@/components/RegionGuard';
import BrandMark from '@/components/BrandMark';
import { useLanguage } from '@/lib/i18n';
import '../auth.css';

export default function ContactPage() {
  const { t } = useLanguage();
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

      <ContactScrollToRegion />
      <main className="auth-main auth-main-contact">
        <div className="contact-wrap">
          <div className="contact-intro">
            <p className="auth-chat-subtitle">{t('Get in touch')}</p>
            <h1 className="auth-chat-title">{t('Contact Us')}</h1>
            <div className="auth-divider" />
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--cream-dim)', maxWidth: '560px' }}>
              {t('Whether you have questions about the community, wish to register as a member, or want to connect with fellow Bukka Ayyavarlu — we are here to help. We serve members in India and the United States. Reach out through the details below or send us a message.')}
            </p>
          </div>

          {/* India */}
          <RegionGuard
            region="IN"
            fallback={<p className="contact-region-gate">{t('Sign in with your India account to view India contact information.')} <Link href="/login">{t('Sign in')}</Link></p>}
          ><section className="contact-country-section" aria-labelledby="contact-india">
            <h2 id="contact-india" className="contact-country-heading">
              <span className="contact-country-flag" aria-hidden>🇮🇳</span>
              {t('India')}
            </h2>
            <div className="contact-grid">
              <div className="contact-info-card">
                <h3>{t('General enquiries')}</h3>
                <p>
                  <a href="mailto:contact.in@bukkaayyavarlu.org">contact.in@bukkaayyavarlu.org</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  {t('For membership, events, and general information.')}
                </p>
              </div>
              <div className="contact-info-card">
                <h3>{t('Phone')}</h3>
                <p>
                  <a href="tel:+911234567890">+91 123 456 7890</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  {t('Mon–Sat, 10:00 AM – 6:00 PM IST')}
                </p>
              </div>
              <div className="contact-info-card">
                <h3>{t('Registered address')}</h3>
                <p>
                  {t('Bukka Ayyavarlu Community Trust')}<br />
                  {t('[Address line 1]')}<br />
                  {t('[City], [State] – [PIN]')}<br />
                  {t('India')}
                </p>
              </div>
            </div>
          </section></RegionGuard>

          {/* United States */}
          <RegionGuard
            region="US"
            fallback={<p className="contact-region-gate">{t('Sign in with your USA account to view USA contact information.')} <Link href="/login">{t('Sign in')}</Link></p>}
          ><section className="contact-country-section" aria-labelledby="contact-us">
            <h2 id="contact-us" className="contact-country-heading">
              <span className="contact-country-flag" aria-hidden>🇺🇸</span>
              {t('United States')}
            </h2>
            <div className="contact-grid">
              <div className="contact-info-card">
                <h3>{t('General enquiries')}</h3>
                <p>
                  <a href="mailto:contact.us@bukkaayyavarlu.org">contact.us@bukkaayyavarlu.org</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  {t('For membership, events, and general information.')}
                </p>
              </div>
              <div className="contact-info-card">
                <h3>{t('Phone')}</h3>
                <p>
                  <a href="tel:+11234567890">+1 (123) 456-7890</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  {t('Mon–Fri, 9:00 AM – 5:00 PM EST')}
                </p>
              </div>
              <div className="contact-info-card">
                <h3>{t('Address')}</h3>
                <p>
                  {t('Bukka Ayyavarlu Community (US)')}<br />
                  {t('[Address line 1]')}<br />
                  {t('[City], [State] [ZIP]')}<br />
                  {t('United States')}
                </p>
              </div>
            </div>
          </section></RegionGuard>

          {/* Shared */}
          <div className="contact-info-card contact-info-shared" style={{ marginBottom: '2rem' }}>
            <h3>{t('Member registration')}</h3>
            <p>
              {t('New members from India or the US can register online via the Registration page. Select your country during registration. For assistance with the process or verification, use the contact email for your region above.')}
            </p>
          </div>

          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="auth-chat-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              {t('Send a message')}
            </h2>
            <div className="contact-form-card">
              <form
                action="mailto:contact@bukkaayyavarlu.org"
                method="get"
                encType="text/plain"
              >
                <label htmlFor="contact-name" className="auth-label">{t('Your name')}</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="auth-input"
                  required
                  placeholder={t('Full name')}
                />
                <label htmlFor="contact-email" className="auth-label">{t('Email')}</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  required
                  placeholder="your@email.com"
                />
                <label htmlFor="contact-region" className="auth-label">{t('Region')}</label>
                <select
                  id="contact-region"
                  name="region"
                  className="auth-input"
                >
                  <option value="">{t('Select region')}</option>
                  <option value="India">{t('India')}</option>
                  <option value="United States">{t('United States')}</option>
                </select>
                <label htmlFor="contact-subject" className="auth-label">{t('Subject')}</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="auth-input"
                  placeholder={t('Brief subject')}
                />
                <label htmlFor="contact-message" className="auth-label">{t('Message')}</label>
                <textarea
                  id="contact-message"
                  name="body"
                  className="auth-input"
                  required
                  rows={5}
                  placeholder={t('Your message…')}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
                <button type="submit" className="auth-btn auth-btn-primary">
                  {t('Send message')}
                </button>
              </form>
              <p className="auth-footer-links" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {t('Your message will open in your email client. We will respond as soon as possible.')}
              </p>
            </div>
          </section>

          <p className="auth-footer-links" style={{ marginTop: '2rem' }}>
            <Link href="/">{`← ${t('Back to home')}`}</Link>
          </p>
        </div>
      </main>

      <footer className="auth-page-footer">
        <BrandMark className="brand-mark--footer" label="Bukka Ayyavarlu Community · India & United States" />
      </footer>
    </div>
  );
}
