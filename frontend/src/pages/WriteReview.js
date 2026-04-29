// frontend/src/pages/WriteReview.js
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Stars from '../components/Stars';
import { useAuth } from '../context/AuthContext';

export default function WriteReview() {
  const { rawgId } = useParams();
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const game     = location.state?.game;
  const existing = location.state?.existing;

  const [rating, setRating] = useState(existing?.rating || 0);
  const [text, setText]     = useState(existing?.text || '');
  const [error, setError]   = useState('');

  if (!user) { navigate('/login'); return null; }

  const gameData = game?.rawgId
    ? { id: game.rawgId, name: game.name, background_image: game.backgroundImage, genres: [], rating: game.rawgRating }
    : game
      ? { id: game.id, name: game.name, background_image: game.background_image, genres: game.genres || [], rating: game.rating }
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) { setError('Please select a rating.'); return; }
    if (!text.trim()) { setError('Please write something.'); return; }
    await api.post('/reviews', { gameData, rating, text });
    navigate(`/game/${rawgId}`);
  }

  return (
    <div className="page-narrow">
      <div className="auth-card">
        <h1 className="auth-title">{existing ? 'Edit Review' : 'Write a Review'}</h1>
        {game && <p className="auth-sub">{game.name || game.rawgId}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Rating</label>
            <Stars rating={rating} onSet={setRating} />
          </div>
          <div className="form-group">
            <label>Review</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What did you think of this game?"
              rows={6}
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="submit" className="btn btn-primary">Submit Review</button>
            <button type="button" className="btn" onClick={() => navigate(`/game/${rawgId}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
