// frontend/src/components/Navbar.js
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🎮 <span>Gameboxd</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/activity">Activity</NavLink>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <NavLink to={`/library/${user._id}`} className="btn btn-ghost btn-sm">Library</NavLink>
            <NavLink to={`/profile/${user._id}`} className="nav-username">
              {user.username.slice(0, 2).toUpperCase()}
            </NavLink>
            <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
