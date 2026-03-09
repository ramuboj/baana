import './home.css';
import Link from 'next/link';
import CountrySelector from '@/components/CountrySelector';

export default function HomePage() {
  return (
    <div className="bukka-home">
      <nav className="nav">
        <div className="nav-logo">
          Bukka Ayyavarlu
          <CountrySelector variant="nav" />
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#heritage">Heritage</a></li>
          <li><a href="#history">History</a></li>
          <li><a href="#values">Values</a></li>
          <li><a href="#join">Join Us</a></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/login">Login</Link></li>
        </ul>
      </nav>

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

        <p className="hero-eyebrow">A Living Legacy — Since Ancient Times</p>
        <h1 className="hero-title">Bukka<br /><span>Ayyavarlu</span></h1>
        <p className="hero-subtitle">
          Guardians of tradition, keepers of culture — a proud community woven through the centuries of Telangana heritage.
        </p>
        <a href="#about" className="hero-cta">Discover Our Story</a>

        <div className="hero-scroll">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>

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
                  <p className="about-frame-caption">Traditional Kolam — Symbol of<br />Prosperity &amp; Welcome</p>
                </div>
              </div>
              <div className="about-tag">
                <strong>2000+</strong>
                Years of<br />Heritage
              </div>
            </div>
            <div className="about-content">
              <p className="section-label">Who We Are</p>
              <h2 className="section-title">A Community Rooted in<br />Pride &amp; Purpose</h2>
              <div className="section-rule" />
              <div className="section-body">
                <p style={{ marginBottom: '1.2rem' }}>
                  The <strong style={{ color: 'var(--cream)' }}>Bukka Ayyavarlu</strong> are a distinguished community with deep roots in the Andhra and Telangana regions of India. Known for their craftsmanship, valor, and devotion, they have shaped the social, cultural, and economic fabric of South Indian civilization across countless generations.
                </p>
                <p style={{ marginBottom: '1.2rem' }}>
                  The name itself carries meaning — <em>&quot;Bukka&quot;</em> refers to the sacred vermillion used in worship, while <em>&quot;Ayyavarlu&quot;</em> denotes respected elders and honorable persons. Together, they speak of a people blessed with dignity and purpose.
                </p>
                <p>
                  Spread across Andhra Pradesh, Telangana, and beyond, the Bukka Ayyavarlu community continues to thrive — honoring its ancient customs while embracing the promise of a modern future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pillars" id="heritage">
        <div className="section-inner">
          <div className="pillars-header">
            <p className="section-label">Our Heritage</p>
            <h2 className="section-title">Pillars of Identity</h2>
            <div className="section-rule" />
          </div>
          <div className="pillars-grid">
            <div className="pillar">
              <div className="pillar-number">01</div>
              <div className="pillar-icon">🪔</div>
              <div className="pillar-title">Devotion &amp; Worship</div>
              <p className="pillar-text">Deeply connected to temple traditions and sacred practices, the community has long served as custodians of ritual, ceremony, and devotion — particularly in the veneration of Shiva and Shakti.</p>
            </div>
            <div className="pillar">
              <div className="pillar-number">02</div>
              <div className="pillar-icon">⚒️</div>
              <div className="pillar-title">Craft &amp; Artistry</div>
              <p className="pillar-text">Master artisans by tradition, the Bukka Ayyavarlu have contributed intricate works in metal, stone, and textile — crafts passed lovingly from hand to hand across generations.</p>
            </div>
            <div className="pillar">
              <div className="pillar-number">03</div>
              <div className="pillar-icon">📜</div>
              <div className="pillar-title">Oral &amp; Literary Tradition</div>
              <p className="pillar-text">A community of storytellers and scholars, preserving wisdom through poetry, song, and spoken word — sustaining a rich Telugu literary heritage that predates the written record.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="history" id="history">
        <div className="section-inner">
          <div className="history-header">
            <p className="section-label">Our Timeline</p>
            <h2 className="section-title">Through the Ages</h2>
            <div className="section-rule" />
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <p className="timeline-era">Ancient Era</p>
              <h3 className="timeline-heading">Origins in Ancient Andhra</h3>
              <p className="timeline-desc">The origins of the Bukka Ayyavarlu community are traced to ancient Andhra, where they established themselves as skilled artisans, devout worshippers, and respected community leaders in the earliest Telugu-speaking settlements.</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">Medieval Period · 10th–14th Century</p>
              <h3 className="timeline-heading">Rise Under the Kakatiya &amp; Vijayanagara Empires</h3>
              <p className="timeline-desc">During the golden age of the Kakatiya and Vijayanagara kingdoms, the community flourished under royal patronage. Their skills in ritual, craft, and administration made them indispensable to the royal courts and temple economies of the Deccan.</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">Early Modern · 15th–18th Century</p>
              <h3 className="timeline-heading">Custodians of Temple Culture</h3>
              <p className="timeline-desc">As great temple complexes expanded across the Telugu lands, Bukka Ayyavarlu families became integral to their upkeep and ceremony — maintaining traditions of sacred service that continue to this day.</p>
            </div>
            <div className="timeline-item">
              <p className="timeline-era">Modern Era · 19th Century – Present</p>
              <h3 className="timeline-heading">Adaptation &amp; Expansion</h3>
              <p className="timeline-desc">Through the colonial era and into independent India, the community adapted with resilience — embracing education, professional life, and civic engagement while holding steadfast to the values and customs that define them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values" id="values">
        <div className="values-ticker" aria-hidden="true">
          <span className="ticker-item">Tradition</span>
          <span className="ticker-item">Devotion</span>
          <span className="ticker-item">Craftsmanship</span>
          <span className="ticker-item">Unity</span>
          <span className="ticker-item">Wisdom</span>
          <span className="ticker-item">Honor</span>
          <span className="ticker-item">Heritage</span>
          <span className="ticker-item">Service</span>
          <span className="ticker-item">Tradition</span>
          <span className="ticker-item">Devotion</span>
          <span className="ticker-item">Craftsmanship</span>
          <span className="ticker-item">Unity</span>
          <span className="ticker-item">Wisdom</span>
          <span className="ticker-item">Honor</span>
          <span className="ticker-item">Heritage</span>
          <span className="ticker-item">Service</span>
        </div>
        <div className="section-inner">
          <div className="values-grid">
            <blockquote className="values-quote">
              &quot;The roots of our ancestors are the branches of our future.&quot;
              <cite>— Community Proverb</cite>
            </blockquote>
            <div className="values-list">
              <div className="value-card">
                <div className="value-card-title">Family &amp; Kinship</div>
                <p className="value-card-text">The family unit is the bedrock of community life — every celebration, ceremony, and ritual reinforces bonds across generations.</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">Sacred Duty</div>
                <p className="value-card-text">Dharmic responsibility runs deep. From daily worship to community service, duty is not obligation — it is identity.</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">Knowledge &amp; Learning</div>
                <p className="value-card-text">Education is revered as much as tradition. The community prizes both ancient wisdom and contemporary scholarship equally.</p>
              </div>
              <div className="value-card">
                <div className="value-card-title">Unity in Diversity</div>
                <p className="value-card-text">Spread across states and countries, the Bukka Ayyavarlu remain one — bound by shared customs, language, and a living cultural memory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" id="join">
        <div className="section-inner">
          <p className="section-label">Be Part of the Legacy</p>
          <h2 className="section-title">Connect With Your Roots</h2>
          <p className="section-body">
            Whether you are a proud member of the Bukka Ayyavarlu community or someone drawn to our heritage — this is your home. Join us in preserving, celebrating, and continuing a legacy that spans millennia.
          </p>
          <div className="cta-buttons">
            <Link href="/register" className="btn-primary">Register as a Member</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
            <Link href="#history" className="btn-secondary">Learn Our History</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">Bukka Ayyavarlu Community</div>
        <p className="footer-copy">© {new Date().getFullYear()} Bukka Ayyavarlu Community. All rights reserved.</p>
      </footer>
    </div>
  );
}
