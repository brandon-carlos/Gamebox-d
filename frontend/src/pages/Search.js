import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fallbackGameCatalog } from '../data/siteData';
import { fetchDiscover, fetchGameMeta, fetchHomeSections, searchGames } from '../utils/gameData';
import Stars from '../components/Stars';
import { normalizeGame } from '../utils/rawgHelpers';

function BrowseCard({ game, onClick }) {
  const normalized = normalizeGame(game);
  return (
    <button className="browse-card" onClick={() => onClick(normalized)}>
      <img loading="lazy" decoding="async" src={normalized.background_image || '/assets-fast/logo.png'} alt={normalized.name} />
      <div className="browse-card-title">{normalized.name}</div>
      <div className="browse-card-meta">
        <Stars rating={normalized.rating || 0} size="small" />
        <span className="mini-heart">♥</span>
      </div>
    </button>
  );
}

const otherOptions = [
  { label: 'Metacritic 90+', params: { metacritic: '90,100', ordering: '-metacritic' } },
  { label: 'Most Added', params: { ordering: '-added' } },
  { label: 'Newest Updated', params: { ordering: '-updated' } },
  { label: 'Classic Games', params: { dates: '1995-01-01,2012-12-31', ordering: '-rating' } },
];

export default function Search() {
  const navigate = useNavigate();
  const [sections, setSections] = useState({
    popular: fallbackGameCatalog.slice(0, 3),
    newest: fallbackGameCatalog.slice(0, 6),
    highlyRated: fallbackGameCatalog.slice(8, 13),
    horror: fallbackGameCatalog.slice(12, 17),
    indie: fallbackGameCatalog.slice(17, 22),
  });
  const [genres, setGenres] = useState([
    { name: 'Action', slug: 'action' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'RPG', slug: 'role-playing-games-rpg' },
    { name: 'Shooter', slug: 'shooter' },
    { name: 'Indie', slug: 'indie' },
    { name: 'Horror', slug: 'horror' },
  ]);
  const [platforms, setPlatforms] = useState([]);
  const [activeGenre, setActiveGenre] = useState('horror');
  const [activeGenreName, setActiveGenreName] = useState('Horror');
  const [genreGames, setGenreGames] = useState([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customGames, setCustomGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hoverMenu, setHoverMenu] = useState('');
  const [loadingLabel, setLoadingLabel] = useState('');

  const refs = {
    newest: useRef(null),
    highlyRated: useRef(null),
    popular: useRef(null),
    genre: useRef(null),
  };

  useEffect(() => {
    fetchHomeSections().then((data) => {
      setSections(data);
      setGenreGames(data.horror || []);
    });
    fetchGameMeta('genres', { page_size: 12 }).then((data) => data && setGenres(data));
    fetchGameMeta('platforms', { page_size: 8 }).then((data) => data && setPlatforms(data));
  }, []);

  async function handleSearchSubmit(event) {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    setLoadingLabel('Searching');
    const results = await searchGames(searchTerm.trim());
    setSearchResults(results);
    setLoadingLabel('');
  }

  async function handleGenre(genre) {
    setActiveGenre(genre.slug);
    setActiveGenreName(genre.name);
    setHoverMenu('');
    setLoadingLabel(`Loading ${genre.name}`);
    const results = await fetchDiscover({ genres: genre.slug, ordering: '-rating', page_size: 12 });
    setGenreGames(results || []);
    setLoadingLabel('');
    refs.genre.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleOther(option) {
    setHoverMenu('');
    setLoadingLabel(`Loading ${option.label}`);
    const results = await fetchDiscover({ ...option.params, page_size: 12 });
    setCustomTitle(option.label);
    setCustomGames(results || []);
    setLoadingLabel('');
  }

  async function handlePlatform(platform) {
    setHoverMenu('');
    setLoadingLabel(`Loading ${platform.name}`);
    const results = await fetchDiscover({ platforms: platform.id, ordering: '-rating', page_size: 12 });
    setCustomTitle(platform.name);
    setCustomGames(results || []);
    setLoadingLabel('');
  }

  function scrollToSection(key) {
    refs[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const displayedGenreGames = useMemo(() => {
    return genreGames.length ? genreGames : sections[activeGenre] || sections.horror || [];
  }, [genreGames, sections, activeGenre]);

  return (
    <div className="page-stack">
      <section className="browse-toolbar">
        <div className="filter-bar-left">
          <span className="sort-pill">Sort by</span>
          <button className="filter-button" onClick={() => scrollToSection('newest')}>Newest</button>
          <button className="filter-button" onClick={() => scrollToSection('highlyRated')}>Rating</button>
          <button className="filter-button" onClick={() => scrollToSection('popular')}>Popular</button>

          <div className="hover-filter-wrap" onMouseEnter={() => setHoverMenu('platforms')} onMouseLeave={() => setHoverMenu('')}>
            <button className="filter-button">Platforms</button>
            {hoverMenu === 'platforms' && (
              <div className="overlay-menu small">
                {platforms.map((platform) => <button key={platform.id} onClick={() => handlePlatform(platform)}>{platform.name}</button>)}
              </div>
            )}
          </div>

          <div className="hover-filter-wrap" onMouseEnter={() => setHoverMenu('other')} onMouseLeave={() => setHoverMenu('')}>
            <button className="filter-button">Other</button>
            {hoverMenu === 'other' && (
              <div className="overlay-menu small">
                {otherOptions.map((option) => <button key={option.label} onClick={() => handleOther(option)}>{option.label}</button>)}
              </div>
            )}
          </div>
        </div>

        <form className="browse-search" onSubmit={handleSearchSubmit}>
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Find a Game" />
        </form>
      </section>

      {loadingLabel && <p className="loading-pill">{loadingLabel}...</p>}

      {searchResults.length > 0 && (
        <section className="section-block">
          <h2 className="section-heading">Search Results</h2>
          <div className="horizontal-scroller browse-scroller">
            {searchResults.map((game) => (
              <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
            ))}
          </div>
        </section>
      )}

      {customGames.length > 0 && (
        <section className="section-block">
          <h2 className="section-heading">{customTitle}</h2>
          <div className="horizontal-scroller browse-scroller">
            {customGames.map((game) => (
              <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
            ))}
          </div>
        </section>
      )}

      <section className="section-block" ref={refs.popular}>
        <h2 className="section-heading">Popular Games To Get Right Now</h2>
        <div className="horizontal-scroller browse-scroller large-cards">
          {(sections.popular || []).slice(0, 5).map((game) => (
            <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
          ))}
        </div>
      </section>

      <section className="section-block" ref={refs.newest}>
        <h2 className="section-heading">Newest</h2>
        <div className="horizontal-scroller browse-scroller">
          {(sections.newest || []).map((game) => (
            <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
          ))}
        </div>
      </section>

      <section className="section-block" ref={refs.highlyRated}>
        <h2 className="section-heading">Highly Rated</h2>
        <div className="horizontal-scroller browse-scroller">
          {(sections.highlyRated || []).map((game) => (
            <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading-row" ref={refs.genre}>
          <h2 className="section-heading">Genre: {activeGenreName}</h2>
          <div className="hover-filter-wrap" onMouseEnter={() => setHoverMenu('genre')} onMouseLeave={() => setHoverMenu('')}>
            <button className="filter-button">Genres</button>
            {hoverMenu === 'genre' && (
              <div className="overlay-menu">
                {genres.map((genre) => (
                  <button key={genre.id || genre.slug} onClick={() => handleGenre(genre)}>{genre.name}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="horizontal-scroller browse-scroller">
          {(displayedGenreGames || []).map((game) => (
            <BrowseCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
          ))}
        </div>
      </section>

      <div className="rawg-attribution">
        Game data and images powered by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.
      </div>

      <div className="center-action-wrap">
        <button className="green-cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>View More</button>
      </div>
    </div>
  );
}
