'use client';

import { useEffect, useState } from 'react';
import './home.css';
import Link from 'next/link';
import CountrySelector from '@/components/CountrySelector';
import AuthNavLink from '@/components/AuthNavLink';
import RegionNewsNavLink from '@/components/RegionNewsNavLink';
import CommunityAnnouncement from '@/components/CommunityAnnouncement';
import BrandMark from '@/components/BrandMark';
import { useLanguage } from '@/lib/i18n';
import { getAuthHeaders } from '@/lib/auth';
import type { CountryCode } from '@/lib/locale';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type Account = {
  region: CountryCode;
  role: 'user' | 'admin';
};

type PublicSettings = {
  registration_enabled: boolean;
  homepage_notice: string;
};

export default function HomePage() {
  const { t } = useLanguage();
  const [account, setAccount] = useState<Account | null>(null);
  const [settings, setSettings] = useState<PublicSettings>({
    registration_enabled: true,
    homepage_notice: '',
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include', headers: getAuthHeaders() })
      .then(async (res) => {
        if (res.status === 401) return;
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to verify your account');
        if ((data.user?.region === 'IN' || data.user?.region === 'US') &&
            (data.user?.role === 'user' || data.user?.role === 'admin')) {
          setAccount({ region: data.user.region, role: data.user.role });
        }
      })
      .catch((error: Error) => console.error('Unable to load home account:', error));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/settings/public`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Unable to load site settings');
        setSettings(data);
      })
      .catch((error: Error) => console.error('Unable to load public site settings:', error));
  }, []);

  return (
    <div className="bukka-home">
      <nav className="nav">
        <div className="nav-logo">
          <BrandMark />
          <CountrySelector region={account?.region} />
        </div>
        <button
          type="button"
          className="nav-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="home-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          {t(menuOpen ? 'Close menu' : 'Menu')}
        </button>
        <ul id="home-navigation" className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>{t('About')}</a></li>
          {account && <>
            <li><a href="#heritage" onClick={() => setMenuOpen(false)}>{t('Heritage')}</a></li>
            <li><a href="#practice" onClick={() => setMenuOpen(false)}>{t('Practice')}</a></li>
            <li><a href="#history" onClick={() => setMenuOpen(false)}>{t('History')}</a></li>
            <li><a href="#values" onClick={() => setMenuOpen(false)}>{t('Values')}</a></li>
            <li><a href="#join" onClick={() => setMenuOpen(false)}>{t('Join Us')}</a></li>
            <li><Link href="/contact">{t('Contact')}</Link></li>
            <li><RegionNewsNavLink /></li>
            {account.role === 'admin' && <li><Link href="/admin">{t('Admin')}</Link></li>}
          </>}
          {!account && settings.registration_enabled && <li><Link href="/register">{t('Register')}</Link></li>}
          <li className="nav-auth-item"><AuthNavLink /></li>
        </ul>
      </nav>
      {settings.homepage_notice && <p className="homepage-notice" role="status">{t(settings.homepage_notice)}</p>}

      <section className="hero">
        <svg className="hero-mandala" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="198" stroke="#C9A84C" strokeWidth="1" />
          <circle cx="200" cy="200" r="170" stroke="#C9A84C" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="140" stroke="#C9A84C" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" stroke="#C9A84C" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="60" stroke="#C9A84C" strokeWidth="1" />
          <circle cx="200" cy="200" r="20" stroke="#C9A84C" strokeWidth="1" />
          <line x1="200" y1="2" x2="200" y2="398" stroke="#C9A84C" strokeWidth="0.5" />
          <line x1="2" y1="200" x2="398" y2="200" stroke="#C9A84C" strokeWidth="0.5" />
          <line x1="59" y1="59" x2="341" y2="341" stroke="#C9A84C" strokeWidth="0.5" />
          <line x1="341" y1="59" x2="59" y2="341" stroke="#C9A84C" strokeWidth="0.5" />
          <ellipse cx="200" cy="110" rx="14" ry="30" stroke="#C9A84C" strokeWidth="0.7" />
          <ellipse cx="200" cy="290" rx="14" ry="30" stroke="#C9A84C" strokeWidth="0.7" />
          <ellipse cx="110" cy="200" rx="30" ry="14" stroke="#C9A84C" strokeWidth="0.7" />
          <ellipse cx="290" cy="200" rx="30" ry="14" stroke="#C9A84C" strokeWidth="0.7" />
        </svg>

        <p className="hero-eyebrow">{t('A Living Legacy — Since Ancient Times')}</p>
        <div className="hero-video-frame">
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            poster="/bukka-ayyavarlu-logo.png"
            aria-label={t('Bukka Ayyavarlu community welcome video')}
          >
            <source src="/bukka-ayyavarlu-intro.mp4" type="video/mp4" />
          </video>
        </div>
        <h1 className="hero-title">{t('Bukka')}<br /><span>{t('Ayyavarlu')}</span></h1>
        <p className="hero-subtitle">
          {t('Guardians of tradition, keepers of culture — a proud community woven through the centuries of Telangana heritage.')}
        </p>
        <a href="#about" className="hero-cta">{t('Discover Our Story')}</a>

        <div className="hero-scroll">
          <div className="scroll-line" />
          {t('Scroll')}
        </div>
      </section>
      {account && <div className="home-announcement-wrap">
        <CommunityAnnouncement region={account.region} />
      </div>}

      <section className="about" id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-visual">
              <div className="about-frame">
                <div className="about-frame-inner">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="90" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="100" cy="100" r="65" stroke="#C9A84C" strokeWidth="0.8" />
                    <circle cx="100" cy="100" r="40" stroke="#C9A84C" strokeWidth="1" />
                    <circle cx="100" cy="100" r="18" stroke="#C9A84C" strokeWidth="1" />
                    <circle cx="100" cy="100" r="6" fill="#C9A84C" />
                    <polygon points="100,20 116,55 154,55 124,78 136,113 100,91 64,113 76,78 46,55 84,55" stroke="#C9A84C" strokeWidth="0.8" fill="none" />
                    <circle cx="100" cy="10" r="4" fill="#C9A84C" fillOpacity="0.5" />
                    <circle cx="100" cy="190" r="4" fill="#C9A84C" fillOpacity="0.5" />
                    <circle cx="10" cy="100" r="4" fill="#C9A84C" fillOpacity="0.5" />
                    <circle cx="190" cy="100" r="4" fill="#C9A84C" fillOpacity="0.5" />
                  </svg>
                  <p className="about-frame-caption">{t('Traditional Kolam — Symbol of Prosperity & Welcome')}</p>
                </div>
              </div>
              <div className="about-tag">
                <strong>2000+</strong>
                {t('Years of Heritage')}
              </div>
            </div>
            <div className="about-content">
              <p className="section-label">{t('Who We Are')}</p>
              <h2 className="section-title">{t('A Community Rooted in Pride & Purpose')}</h2>
              <div className="section-rule" />
              <div className="section-body">
                <p style={{ marginBottom: '1.2rem' }}>
                  {t('The Bukka Ayyavarlu are a distinguished community with deep roots in the Andhra and Telangana regions of India. Known for their craftsmanship, valor, and devotion, they have shaped the social, cultural, and economic fabric of South Indian civilization across countless generations.')}
                </p>
                <p style={{ marginBottom: '1.2rem' }}>
                  {t('The name itself carries meaning — "Bukka" refers to the sacred vermillion used in worship, while "Ayyavarlu" denotes respected elders and honorable persons. Together, they speak of a people blessed with dignity and purpose.')}
                </p>
                <p>
                  {t('Spread across Andhra Pradesh, Telangana, and beyond, the Bukka Ayyavarlu community continues to thrive — honoring its ancient customs while embracing the promise of a modern future.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!account && (
        <section className="public-home-gate" aria-labelledby="public-home-title">
          <div className="section-inner">
            <p className="section-label">{t('Community members')}</p>
            <h2 id="public-home-title" className="section-title">{t('Your community, wherever you are')}</h2>
            <p className="section-body">
              {t('Sign in to see the community news, gatherings, and resources for your registered region.')}
            </p>
            <div className="cta-buttons">
              <Link href="/login" className="btn-primary">{t('Sign in')}</Link>
              {settings.registration_enabled && <Link href="/register" className="btn-secondary">{t('Register')}</Link>}
            </div>
          </div>
        </section>
      )}

      {account && <>
      <section className="pillars" id="heritage">
        <div className="section-inner">
          <div className="pillars-header">
            <p className="section-label">{t('Our Heritage')}</p>
            <h2 className="section-title">{t('Pillars of Identity')}</h2>
            <div className="section-rule" />
          </div>
          <div className="pillars-grid">
            <div className="pillar">
              <div className="pillar-number">01</div>
              <div className="pillar-icon">🪔</div>
              <div className="pillar-title">{t('Devotion & Worship')}</div>
              <p className="pillar-text">{t('Deeply connected to temple traditions and sacred practices, the community has long served as custodians of ritual, ceremony, and devotion — particularly in the veneration of Shiva and Shakti.')}</p>
            </div>
            <div className="pillar">
              <div className="pillar-number">02</div>
              <div className="pillar-icon">⚒️</div>
              <div className="pillar-title">{t('Craft & Artistry')}</div>
              <p className="pillar-text">{t('Master artisans by tradition, the Bukka Ayyavarlu have contributed intricate works in metal, stone, and textile — crafts passed lovingly from hand to hand across generations.')}</p>
            </div>
            <div className="pillar">
              <div className="pillar-number">03</div>
              <div className="pillar-icon">📜</div>
              <div className="pillar-title">{t('Oral & Literary Tradition')}</div>
              <p className="pillar-text">{t('A community of storytellers and scholars, preserving wisdom through poetry, song, and spoken word — sustaining a rich Telugu literary heritage that predates the written record.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="practice" id="practice">
        <div className="section-inner">
          <div className="practice-intro">
            <p className="section-label">{t('A Living Faith')}</p>
            <h2 className="section-title">{t('Sacred Practice, Shared Together')}</h2>
            <div className="section-rule" />
            <p className="section-body">
              {t('Our religious life is carried through everyday acts of devotion, family remembrance, and service to one another. Across India and the United States, members keep these values alive in homes, temples, and community gatherings.')}
            </p>
          </div>
          <div className="practice-grid">
            <article className="practice-card">
              <span className="practice-symbol" aria-hidden>ॐ</span>
              <h3>{t('Prayer & Reflection')}</h3>
              <p>{t('Make space for gratitude, remembrance, and a quiet connection with the divine.')}</p>
            </article>
            <article className="practice-card">
              <span className="practice-symbol" aria-hidden>✦</span>
              <h3>{t('Celebration & Ritual')}</h3>
              <p>{t('Gather with family and community to honor festivals, traditions, and sacred milestones.')}</p>
            </article>
            <article className="practice-card">
              <span className="practice-symbol" aria-hidden>दान</span>
              <h3>{t('Service & Compassion')}</h3>
              <p>{t('Let devotion become action through generosity, hospitality, and care for the community.')}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="history" id="history">
        <div className="section-inner">
          <div className="history-header">
            <p className="section-label">{t('Our Timeline')}</p>
            <h2 className="section-title">{t('Through the Ages')}</h2>
            <div className="section-rule" />
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <p className="timeline-era">{t('Ancient Era')}</p>
              <h3 className="timeline-heading">{t('Origins in Ancient Andhra')}</h3>
              <p className="timeline-desc">{t('The origins of the Bukka Ayyavarlu community are traced to ancient Andhra, where they established themselves as skilled artisans, devout worshippers, and respected community leaders in the earliest Telugu-speaking settlements.')}</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">{t('Medieval Period · 10th–14th Century')}</p>
              <h3 className="timeline-heading">{t('Rise Under the Kakatiya & Vijayanagara Empires')}</h3>
              <p className="timeline-desc">{t('During the golden age of the Kakatiya and Vijayanagara kingdoms, the community flourished under royal patronage. Their skills in ritual, craft, and administration made them indispensable to the royal courts and temple economies of the Deccan.')}</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">{t('Early Modern · 15th–18th Century')}</p>
              <h3 className="timeline-heading">{t('Custodians of Temple Culture')}</h3>
              <p className="timeline-desc">{t('As great temple complexes expanded across the Telugu lands, Bukka Ayyavarlu families became integral to their upkeep and ceremony — maintaining traditions of sacred service that continue to this day.')}</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">{t('Modern Era · 19th Century – Present')}</p>
              <h3 className="timeline-heading">{t('Adaptation & Expansion')}</h3>
              <p className="timeline-desc">{t('Through the colonial era and into independent India, the community adapted with resilience — embracing education, professional life, and civic engagement while holding steadfast to the values and customs that define them.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values" id="values">
        <div className="values-ticker" aria-hidden="true">
          {['Tradition', 'Devotion', 'Craftsmanship', 'Unity', 'Wisdom', 'Honor', 'Heritage', 'Service',
            'Tradition', 'Devotion', 'Craftsmanship', 'Unity', 'Wisdom', 'Honor', 'Heritage', 'Service']
            .map((value, index) => <span className="ticker-item" key={`${value}-${index}`}>{t(value)}</span>)}
        </div>
        <div className="section-inner">
          <div className="values-grid">
            <blockquote className="values-quote">
              &quot;{t('The roots of our ancestors are the branches of our future.')}&quot;
              <cite>{t('— Community Proverb')}</cite>
            </blockquote>
            <div className="values-list">
              <div className="value-card">
                <div className="value-card-title">{t('Family & Kinship')}</div>
                <p className="value-card-text">{t('The family unit is the bedrock of community life — every celebration, ceremony, and ritual reinforces bonds across generations.')}</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">{t('Sacred Duty')}</div>
                <p className="value-card-text">{t('Dharmic responsibility runs deep. From daily worship to community service, duty is not obligation — it is identity.')}</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">{t('Knowledge & Learning')}</div>
                <p className="value-card-text">{t('Education is revered as much as tradition. The community prizes both ancient wisdom and contemporary scholarship equally.')}</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">{t('Unity in Diversity')}</div>
                <p className="value-card-text">{t('Spread across states and countries, the Bukka Ayyavarlu remain one — bound by shared customs, language, and a living cultural memory.')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" id="join">
        <div className="section-inner">
          <p className="section-label">{t('Be Part of the Legacy')}</p>
          <h2 className="section-title">{t('Connect With Your Roots')}</h2>
          <p className="section-body">
            {t('Whether you are a proud member of the Bukka Ayyavarlu community or someone drawn to our heritage — this is your home. Join us in preserving, celebrating, and continuing a legacy that spans millennia.')}
          </p>
          <div className="cta-buttons">
            <Link href="/register" className="btn-primary">{t('Register as a Member')}</Link>
            <Link href="/contact" className="btn-secondary">{t('Contact Us')}</Link>
            <Link href="#history" className="btn-secondary">{t('Learn Our History')}</Link>
          </div>
        </div>
      </section>
      </>}

      <footer className="footer">
        <BrandMark className="brand-mark--footer" label="Bukka Ayyavarlu Community" />
        <p className="footer-copy">© {new Date().getFullYear()} {t('Bukka Ayyavarlu Community')}. {t('All rights reserved.')}</p>
      </footer>
    </div>
  );
}
