// frontend/src/pages/Library.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const TABS = ['played', 'playing', 'wishlist'];
const BADGE = { played: 'badge-played', playing: 'badge-playing', wishlist: 'badge-wishlist' };

export default function Library() {
  const { userId } = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [entries, setEntries] = useState([]);
  const [tab, setTab]         = useState('played');

  const isOwn = user?._id === userId;

  useEffect(() => { api.get(`/library/${userId}`).then(r => setEntries(r.data)); }, [userId]);

  async function handleRemove(rawgId) {
    await api.delete(`/library/${rawgId}`);
    setEntries(prev => prev.filter(e => e.game?.rawgId !== rawgId));
  }

  const filtered = entries.filter(e => e.status === tab);

  return (
    <div className="page">
      <h1 className="page-title">{isOwn ? 'My Library' : 'Library'}</h1>

      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            <span style={{ marginLeft: 6, color: 'var(--text3)', fontSize: 12 }}>
              ({entries.filter(e => e.status === t).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="empty">Nothing here yet.</p>}

      {filtered.map(entry => (
        <div key={entry._id} className="game-row">
          <div className="game-cover" onClick={() => navigate(`/game/${entry.game?.rawgId}`)}>
            {entry.game?.backgroundImage
              ? <img src={entry.game.backgroundImage} alt={entry.game.name} />
              : '🎮'}
          </div>
          <div className="game-row-info">
            <div className="game-row-title" onClick={() => navigate(`/game/${entry.game?.rawgId}`)}>
              {entry.game?.name}
            </div>
            <div className="game-row-meta">{entry.game?.genres}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`badge ${BADGE[entry.status]}`}>{entry.status}</span>
            <button
              className="btn btn-sm"
              onClick={() => navigate(`/review/${entry.game?.rawgId}`, { state: { game: entry.game } })}
            >Review</button>
            {isOwn && (
              <button className="btn btn-sm btn-danger" onClick={() => handleRemove(entry.game?.rawgId)}>
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
