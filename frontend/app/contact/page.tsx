import Link from 'next/link';
import CountrySelector from '@/components/CountrySelector';
import ContactScrollToRegion from '@/components/ContactScrollToRegion';
import '../auth.css';

export default function ContactPage() {
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
          <li><Link href="/login">Login</Link></li>
        </ul>
      </nav>

      <ContactScrollToRegion />
      <main className="auth-main auth-main-contact">
        <div className="contact-wrap">
          <div className="contact-intro">
            <p className="auth-chat-subtitle">Get in touch</p>
            <h1 className="auth-chat-title">Contact Us</h1>
            <div className="auth-divider" />
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--cream-dim)', maxWidth: '560px' }}>
              Whether you have questions about the community, wish to register as a member, or want to connect with fellow Bukka Ayyavarlu — we are here to help. We serve members in <strong>India</strong> and the <strong>United States</strong>. Reach out through the details below or send us a message.
            </p>
          </div>

          {/* India */}
          <section className="contact-country-section" aria-labelledby="contact-india">
            <h2 id="contact-india" className="contact-country-heading">
              <span className="contact-country-flag" aria-hidden>🇮🇳</span>
              India
            </h2>
            <div className="contact-grid">
              <div className="contact-info-card">
                <h3>General enquiries</h3>
                <p>
                  <a href="mailto:contact.in@bukkaayyavarlu.org">contact.in@bukkaayyavarlu.org</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  For membership, events, and general information.
                </p>
              </div>
              <div className="contact-info-card">
                <h3>Phone</h3>
                <p>
                  <a href="tel:+911234567890">+91 123 456 7890</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  Mon–Sat, 10:00 AM – 6:00 PM IST
                </p>
              </div>
              <div className="contact-info-card">
                <h3>Registered address</h3>
                <p>
                  Bukka Ayyavarlu Community Trust<br />
                  [Address line 1]<br />
                  [City], [State] – [PIN]<br />
                  India
                </p>
              </div>
            </div>
          </section>

          {/* United States */}
          <section className="contact-country-section" aria-labelledby="contact-us">
            <h2 id="contact-us" className="contact-country-heading">
              <span className="contact-country-flag" aria-hidden>🇺🇸</span>
              United States
            </h2>
            <div className="contact-grid">
              <div className="contact-info-card">
                <h3>General enquiries</h3>
                <p>
                  <a href="mailto:contact.us@bukkaayyavarlu.org">contact.us@bukkaayyavarlu.org</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  For membership, events, and general information.
                </p>
              </div>
              <div className="contact-info-card">
                <h3>Phone</h3>
                <p>
                  <a href="tel:+11234567890">+1 (123) 456-7890</a>
                </p>
                <p style={{ marginTop: '0.75rem' }}>
                  Mon–Fri, 9:00 AM – 5:00 PM EST
                </p>
              </div>
              <div className="contact-info-card">
                <h3>Address</h3>
                <p>
                  Bukka Ayyavarlu Community (US)<br />
                  [Address line 1]<br />
                  [City], [State] [ZIP]<br />
                  United States
                </p>
              </div>
            </div>
          </section>

          {/* Shared */}
          <div className="contact-info-card contact-info-shared" style={{ marginBottom: '2rem' }}>
            <h3>Member registration</h3>
            <p>
              New members from India or the US can register online via the <Link href="/register">Registration</Link> page. Select your country during registration. For assistance with the process or verification, use the contact email for your region above.
            </p>
          </div>

          <section aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="auth-chat-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              Send a message
            </h2>
            <div className="contact-form-card">
              <form
                action="mailto:contact@bukkaayyavarlu.org"
                method="get"
                encType="text/plain"
              >
                <label htmlFor="contact-name" className="auth-label">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  className="auth-input"
                  required
                  placeholder="Full name"
                />
                <label htmlFor="contact-email" className="auth-label">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  className="auth-input"
                  required
                  placeholder="your@email.com"
                />
                <label htmlFor="contact-region" className="auth-label">Region</label>
                <select
                  id="contact-region"
                  name="region"
                  className="auth-input"
                >
                  <option value="">Select region</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                </select>
                <label htmlFor="contact-subject" className="auth-label">Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="auth-input"
                  placeholder="Brief subject"
                />
                <label htmlFor="contact-message" className="auth-label">Message</label>
                <textarea
                  id="contact-message"
                  name="body"
                  className="auth-input"
                  required
                  rows={5}
                  placeholder="Your message…"
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
                <button type="submit" className="auth-btn auth-btn-primary">
                  Send message
                </button>
              </form>
              <p className="auth-footer-links" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Your message will open in your email client. We will respond as soon as possible.
              </p>
            </div>
          </section>

          <p className="auth-footer-links" style={{ marginTop: '2rem' }}>
            <Link href="/">← Back to home</Link>
          </p>
        </div>
      </main>

      <footer className="auth-page-footer">
        Bukka Ayyavarlu Community · India & United States
      </footer>
    </div>
  );
}
