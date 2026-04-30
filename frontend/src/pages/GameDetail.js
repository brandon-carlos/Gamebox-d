import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import ReviewCard from '../components/ReviewCard';
import Stars from '../components/Stars';
import { iconPaths, makeMockReviews } from '../data/siteData';
import { useAuth } from '../context/AuthContext';
import { developerText, genreText, manufactureRating, normalizeGame, stripHtml } from '../utils/rawgHelpers';

function gameToPostData(game) {
  return {
    id: game.rawgId || game.id,
    name: game.name,
    background_image: game.background_image || game.backgroundImage,
    genres: game.genres || [],
    rating: game.rating || game.rawgRating || 0,
    released: game.released || '',
  };
}

export default function GameDetail() {
  const { rawgId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState(state?.game ? normalizeGame(state.game) : null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(4);
  const [liked, setLiked] = useState(true);
  const [screenshots, setScreenshots] = useState([]);
  const [visibleReviewCount, setVisibleReviewCount] = useState(6);

  const [modalOpen, setModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(4);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [libraryStatus, setLibraryStatus] = useState('');

  useEffect(() => {
    api.get(`/games/${rawgId}`)
      .then(({ data }) => {
        const normalizedGame = normalizeGame({
          ...data,
          id: data.rawgId,
          background_image: data.backgroundImage,
          rating: data.avgRating || data.rawgRating,
          screenshots: data.screenshots || [],
        });

        setGame(normalizedGame);
        setScreenshots(data.screenshots || []);

        const actualReviews = data.reviews?.length
          ? data.reviews.map((review, idx) => ({
              ...review,
              avatar: `/assets-fast/dog${(idx % 16) + 1}.png`,
              likedGame: idx % 3 !== 1,
              views: `${(idx + 2) * 100}k`,
              game: normalizedGame,
            }))
          : [];

        const hydratedReviews = actualReviews.length ? actualReviews : makeMockReviews([normalizedGame], 12);
        setReviews(hydratedReviews);
        const nextRating = Math.round(normalizedGame.rating || manufactureRating(rawgId));
        setRating(nextRating);
        setReviewRating(nextRating || 4);

        const myReview = actualReviews.find((review) => review.user?._id === user?._id);
        if (myReview) {
          setReviewText(myReview.text || '');
          setReviewRating(myReview.rating || nextRating || 4);
        }
      })
      .catch(() => {
        const fallbackGame = state?.game ? normalizeGame(state.game) : null;
        if (fallbackGame) {
          setGame(fallbackGame);
          const nextRating = Math.round(fallbackGame.rating || manufactureRating(rawgId));
          setRating(nextRating);
          setReviewRating(nextRating || 4);
          setReviews(makeMockReviews([fallbackGame], 12));
        }
      });
  }, [rawgId, state?.game, user?._id]);

  useEffect(() => {
    if (!user) {
      setLibraryStatus('');
      return;
    }
    api.get(`/library/${user._id}`)
      .then(({ data }) => {
        const entry = (data || []).find((item) => item.game?.rawgId === Number(rawgId));
        setLibraryStatus(entry?.status || '');
      })
      .catch(() => setLibraryStatus(''));
  }, [user, rawgId]);

  const popularReviews = useMemo(() => reviews.slice(0, 3), [reviews]);
  const recentReviews = useMemo(() => reviews.slice(3, Math.min(visibleReviewCount, reviews.length)), [reviews, visibleReviewCount]);
  const canViewMoreReviews = visibleReviewCount < reviews.length;

  function handleViewMoreReviews() {
    if (canViewMoreReviews) {
      setVisibleReviewCount((count) => Math.min(count + 4, reviews.length));
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function openReviewModal() {
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewError('');
    setModalOpen(true);
  }

  async function saveLibraryStatus(status) {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!game) return;
    try {
      await api.post('/library', { gameData: gameToPostData(game), status });
      setLibraryStatus(status);
      setSaveMessage(status === 'played' ? 'Marked as played!' : 'Added to wishlist!');
      setTimeout(() => setSaveMessage(''), 2200);
    } catch (error) {
      setSaveMessage('Could not update library.');
      setTimeout(() => setSaveMessage(''), 2200);
    }
  }

  async function submitReview(event) {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!reviewRating) {
      setReviewError('Please choose a star rating.');
      return;
    }
    if (!reviewText.trim()) {
      setReviewError('Please write a short review.');
      return;
    }
    try {
      const { data } = await api.post('/reviews', {
        gameData: gameToPostData(game),
        rating: reviewRating,
        text: reviewText.trim(),
      });

      const decorated = {
        ...data,
        avatar: '/assets-fast/dog1.png',
        likedGame: liked,
        views: `${data.likes?.length || 0} likes`,
        game,
      };

      setReviews((prev) => {
        const withoutMine = prev.filter((review) => review.user?._id !== user._id);
        return [decorated, ...withoutMine];
      });

      setRating(reviewRating);
      setModalOpen(false);
      setSaveMessage('Review saved!');
      setTimeout(() => setSaveMessage(''), 2200);
    } catch (error) {
      setReviewError(error.response?.data?.error || 'Could not save review.');
    }
  }

  if (!game) {
    return <div className="simple-loading">Loading...</div>;
  }

  const description = game.description || `No full description was available from RAWG for ${game.name}, so this page is showing a generated placeholder summary.`;
  const year = game.released?.slice(0, 4) || '2024';
  const devs = developerText(game) || 'Unknown Developer';
  const headingMeta = `${game.name} | ${year} | ${devs}`;
  const heroImage = screenshots?.[0]?.image || game.background_image || game.backgroundImage;

  return (
    <div className="page-stack game-page-detail">
      <section className="game-hero-detail">
        <div className="gameplay-veil" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="game-hero-grid">
          <div className="detail-cover-wrap">
            <img loading="lazy" decoding="async" className="detail-cover" src={game.background_image || heroImage || '/assets-fast/logo.png'} alt={game.name} />
          </div>
          <div className="detail-copy-wrap">
            <h1 className="game-detail-title">{headingMeta}</h1>
            <p className="game-detail-description">{stripHtml(description)}</p>

            <div className="game-meta-grid">
              <span>Genres: {genreText(game) || 'N/A'}</span>
              <span>RAWG rating: {(game.rating || manufactureRating(rawgId)).toFixed?.(1) || game.rating}/5</span>
              <span>Metacritic: {game.metacritic || 'N/A'}</span>
              <span>Avg playtime: {game.playtime || 'N/A'} hrs</span>
            </div>

            <div className="detail-rating-stack">
              <button className="rating-open-button" onClick={openReviewModal}>Give it a rating / review</button>
              <div className="detail-rating-row">
                <Stars rating={rating} />
                <button className="icon-toggle-button" onClick={() => setLiked((prev) => !prev)}>
                  <img loading="lazy" decoding="async" className={liked ? 'heart-active' : 'heart-muted'} src={iconPaths.heart} alt="like game" />
                </button>
              </div>

              <div className="game-action-row">
                <button className={`pill-button small-pill ${libraryStatus === 'played' ? 'selected-action' : ''}`} onClick={() => saveLibraryStatus('played')}>
                  {libraryStatus === 'played' ? 'Played ✓' : 'Played'}
                </button>
                <button className={`pill-button small-pill ${libraryStatus === 'wishlist' ? 'selected-action' : ''}`} onClick={() => saveLibraryStatus('wishlist')}>
                  {libraryStatus === 'wishlist' ? 'Wishlist ✓' : 'Wishlist'}
                </button>
              </div>

              {!user && <p className="small-helper"><Link to="/login">Log in</Link> to rate, review, or save this game.</p>}
              {saveMessage && <p className="success-msg">{saveMessage}</p>}
            </div>
          </div>
        </div>
      </section>

      {screenshots.length > 1 && (
        <section className="section-block">
          <h2 className="section-heading">Gameplay Images</h2>
          <div className="horizontal-scroller screenshot-strip">
            {screenshots.slice(0, 6).map((shot) => (
              <img loading="lazy" decoding="async" key={shot.id} className="screenshot-card" src={shot.image} alt={`${game.name} screenshot`} />
            ))}
          </div>
        </section>
      )}

      <section className="section-block">
        <h2 className="section-heading">Popular Reviews</h2>
        <div className="review-list">
          {popularReviews.map((review) => <ReviewCard key={review._id} review={review} showGame={false} />)}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-heading">Recent Reviews</h2>
        <div className="review-list">
          {recentReviews.map((review) => <ReviewCard key={review._id} review={review} showGame={false} />)}
        </div>
      </section>

      <div className="center-action-wrap">
        <button className="green-cta-button" onClick={handleViewMoreReviews}>
          {canViewMoreReviews ? 'View More Reviews' : 'Back To Top'}
        </button>
      </div>

      <div className="rawg-attribution">
        Game metadata, ratings, screenshots, and images powered by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.
      </div>

      {modalOpen && (
        <div className="review-modal-backdrop" onClick={() => setModalOpen(false)}>
          <section className="review-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close-button" onClick={() => setModalOpen(false)}>×</button>
            <h2 className="pixel-title modal-title">Review {game.name}</h2>
            <form className="pixel-form review-modal-form" onSubmit={submitReview}>
              <label>
                Star Rating
                <Stars rating={reviewRating} onSet={setReviewRating} />
              </label>
              <label>
                Review Description
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  placeholder="What did you think of this game?"
                  rows={5}
                />
              </label>
              {reviewError && <p className="form-error">{reviewError}</p>}
              <button type="submit" className="green-cta-button modal-submit-button">Save Review</button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
