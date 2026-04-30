import { logoPath } from '../data/siteData';

const socials = ['instagram', 'threads', 'x', 'butterfly', 'facebook', 'tiktok', 'youtube'];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img loading="lazy" decoding="async" src={logoPath} alt="Gameboxd logo" />
        <span>Gameboxd</span>
      </div>
      <div className="footer-socials" aria-label="social links">
        {socials.map((item) => (
          <span key={item} className="social-pill">{item[0]}</span>
        ))}
      </div>
    </footer>
  );
}
