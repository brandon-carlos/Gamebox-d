import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoPath } from '../data/siteData';

const linkItems = [
  { to: '/login', label: 'Log in', guestOnly: true },
  { to: '/signup', label: 'Make Account', guestOnly: true },
  { to: '/games', label: 'Games' },
  { to: '/about', label: 'About Us' },
  { to: '/members', label: 'Members' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="site-navbar">
      <Link to="/" className="site-logo">
        <img loading="lazy" decoding="async" src={logoPath} alt="Gameboxd logo" />
        <span>Gameboxd</span>
      </Link>

      <div className="site-nav-links">
        {linkItems
          .filter((item) => !(user && item.guestOnly))
          .map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}

        {user && (
          <>
            <NavLink to={`/library/${user._id}`}>Library</NavLink>
            <NavLink to={`/profile/${user._id}`}>Account</NavLink>
            <button
              className="text-nav-button"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
