import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import Stars from '../components/Stars';
import api from '../api';
import { fallbackGameCatalog, featuredNews, logoPath, makeMockReviews } from '../data/siteData';
import { fetchHomeSections } from '../utils/gameData';

function PosterCard({ game, onClick, large = false }) {
  return (
    <button className={`poster-card ${large ? 'large' : ''}`} onClick={() => onClick(game)}>
      <img loading="lazy" decoding="async" src={game.background_image || game.backgroundImage} alt={game.name} />
      <div className="poster-card-overlay">
        <div className="poster-card-title">{game.name}</div>
        <Stars rating={game.rating || game.rawgRating || 0} size="small" />
      </div>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sections, setSections] = useState({ popular: fallbackGameCatalog.slice(0, 8), newest: fallbackGameCatalog.slice(0, 6) });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchHomeSections().then(setSections);
    api.get('/reviews')
      .then(({ data }) => {
        setReviews(data.length ? data.map((review, idx) => ({ ...review, avatar: `/assets-fast/dog${(idx % 18) + 1}.png`, likedGame: idx % 3 !== 1, views: `${(idx + 2) * 100}k` })) : makeMockReviews());
      })
      .catch(() => setReviews(makeMockReviews()));
  }, []);

  const featuredStrip = useMemo(() => (sections.popular?.length ? sections.popular : fallbackGameCatalog).slice(0, 8), [sections.popular]);
  const popularReviews = useMemo(() => (reviews.length ? reviews : makeMockReviews()).slice(0, 3), [reviews]);

  return (
    <div className="page-stack home-page">
      <section className="hero-panel home-hero">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${(sections.popular?.[0]?.background_image) || '/assets-fast/CS.png'})` }} />
        <div className="hero-content">
          <h1 className="pixel-title brand-title">Gameboxd</h1>
          <img loading="lazy" decoding="async" className="hero-logo-art" src={logoPath} alt="Gameboxd logo art" />
          <div className="hero-actions">
            {user ? (
              <>
                <button className="pill-button light" onClick={() => navigate(`/profile/${user._id}`)}>My Account</button>
                <button className="pill-button" onClick={() => navigate('/games')}>Browse Games</button>
              </>
            ) : (
              <>
                <button className="pill-button light" onClick={() => navigate('/signup')}>Create Account</button>
                <button className="pill-button" onClick={() => navigate('/login')}>Log in</button>
              </>
            )}
          </div>
          <div className="hero-copy-block">
            <p>See games you’ve played</p>
            <p>Save the ones you want to play</p>
            <p>Check out what others have said.</p>
          </div>
        </div>
      </section>

      <section className="section-block compact-center">
        <p className="section-kicker">The network for game lovers</p>
        <div className="game-grid feature-grid">
          {featuredStrip.map((game) => (
            <PosterCard key={game.id} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} large />
          ))}
        </div>
      </section>

      <section className="three-up-notes">
        <div>Keep track of the games you’ve played. Save each game to get specific activities and log for all your favorite games.</div>
        <div>Save games that you might want to play while and share reviews for games you loved.</div>
        <div>Read other reviews and opinions.</div>
      </section>

      <section className="section-block">
        <div className="section-heading-row">
          <h2 className="section-heading">Popular Games In Rotation Currently</h2>
        </div>
        <div className="horizontal-scroller film-strip">
          {featuredStrip.concat(featuredStrip.slice(0, 4)).map((game, idx) => (
            <PosterCard key={`${game.id}-${idx}`} game={game} onClick={(selected) => navigate(`/game/${selected.id}`, { state: { game: selected } })} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-heading">Popular Reviews</h2>
        <div className="review-list large-gap">
          {popularReviews.map((review) => (
            <div key={review._id} className="review-with-poster">
              <img loading="lazy" decoding="async" className="inline-poster" src={review.game?.background_image || review.game?.backgroundImage || '/assets-fast/CS.png'} alt={review.game?.name || 'game poster'} />
              <div className="review-card-shell">
                <div className="review-card-heading">
                  <span className="review-game-title">{review.game?.name || 'Valorant'} | {new Date(review.createdAt).getFullYear()}</span>
                </div>
                <ReviewCard review={review} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-heading">Recent News</h2>
        <div className="horizontal-scroller news-strip">
          {featuredNews.map((item) => (
            <article key={item.id} className="news-card">
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} />
              <div className="news-card-body">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
