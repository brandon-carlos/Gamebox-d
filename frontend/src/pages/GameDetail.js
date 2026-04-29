// frontend/src/pages/GameDetail.js
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import Stars from '../components/Stars';
import ReviewCard from '../components/ReviewCard';
import { useAuth } from '../context/AuthContext';

export default function GameDetail() {
  const { rawgId } = useParams();
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [game, setGame]           = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [libStatus, setLibStatus] = useState('');
  const [msg, setMsg]             = useState('');

  useEffect(() => {
    api.get(`/games/${rawgId}`).then(({ data }) => {
      setGame(data);
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating);
    });
    if (user) {
      api.get(`/library/${user._id}`).then(({ data }) => {
        const entry = data.find(e => e.game?.rawgId === parseInt(rawgId));
        setLibStatus(entry?.status || '');
      });
    }
  }, [rawgId, user]);

  async function handleLibrary(e) {
    const status = e.target.value;
    if (!status) return;
    const rawgGame = location.state?.game || {
      id: game.rawgId, name: game.name,
      background_image: game.backgroundImage,
      genres: (game.genres || '').split(', ').map(n => ({ name: n })),
      rating: game.rawgRating,
    };
    await api.post('/library', { gameData: rawgGame, status });
    setLibStatus(status);
    setMsg('Library updated!');
    setTimeout(() => setMsg(''), 2000);
  }

  async function handleRemove() {
    await api.delete(`/library/${rawgId}`);
    setLibStatus('');
  }

  if (!game) return <div className="page"><p className="text-muted">Loading…</p></div>;

  const userReview = reviews.find(r => r.user?._id === user?._id);

  return (
    <div className="page">
      {/* Hero */}
      <div className="card" style={{ display: 'flex', gap: 24 }}>
        <div className="game-cover-lg">
          {game.backgroundImage
            ? <img src={game.backgroundImage} alt={game.name} />
            : <span style={{ fontSize: 40 }}>🎮</span>}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{game.name}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 12 }}>{game.genres}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Stars rating={Math.round(avgRating || 0)} />
            <span style={{ fontSize: 22, fontWeight: 700 }}>{avgRating ? avgRating.toFixed(1) : '—'}</span>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>({reviews.length} reviews)</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={libStatus} onChange={handleLibrary} style={{ width: 'auto' }}>
                <option value="">+ Add to Library</option>
                <option value="played">✅ Played</option>
                <option value="playing">🎮 Playing</option>
                <option value="wishlist">⭐ Wishlist</option>
              </select>
              {libStatus && (
                <button className="btn btn-sm btn-danger" onClick={handleRemove}>Remove</button>
              )}
              {userReview
                ? <button className="btn btn-sm" onClick={() => navigate(`/review/${rawgId}`, { state: { existing: userReview, game } })}>Edit My Review</button>
                : <button className="btn btn-primary btn-sm" onClick={() => navigate(`/review/${rawgId}`, { state: { game } })}>Write Review</button>
              }
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text2)' }}>
              <Link to="/login">Log in</Link> to add to your library or write a review.
            </p>
          )}
          {msg && <p className="success-msg">{msg}</p>}
        </div>
      </div>

      <p className="section-title">Reviews</p>
      {reviews.length === 0 && <p className="empty">No reviews yet — be the first!</p>}
      {reviews.map(r => (
        <ReviewCard
          key={r._id}
          review={r}
          onDelete={id => setReviews(prev => prev.filter(x => x._id !== id))}
        />
      ))}
    </div>
  );
}
