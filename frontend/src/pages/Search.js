// frontend/src/pages/Search.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Search() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const { data } = await api.get(`/games/search?q=${encodeURIComponent(query)}`);
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="page">
      <h1 className="page-title">Search Games</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a game…"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {loading && <p className="text-muted">Searching…</p>}

      {results.map(game => (
        <div
          key={game.id}
          className="game-row"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/game/${game.id}`, { state: { game } })}
        >
          <div className="game-cover">
            {game.background_image
              ? <img src={game.background_image} alt={game.name} />
              : '🎮'}
          </div>
          <div className="game-row-info">
            <div className="game-row-title">{game.name}</div>
            <div className="game-row-meta">
              {(game.genres || []).map(g => g.name).join(', ')}
              {game.rating ? ` · ★ ${game.rating}` : ''}
            </div>
          </div>
          <span className="btn btn-ghost btn-sm">View →</span>
        </div>
      ))}

      {!loading && results.length === 0 && query && (
        <p className="empty">No results for "{query}"</p>
      )}
    </div>
  );
}
