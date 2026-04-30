import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from './Stars';
import { iconPaths } from '../data/siteData';

export default function ReviewCard({ review, showGame = false, compact = false }) {
  const navigate = useNavigate();
  const [liked] = useState(Boolean(review.likedGame ?? true));

  return (
    <article className={`pixel-review-card ${compact ? 'compact' : ''}`}>
      <div className="pixel-review-head">
        <img loading="lazy" decoding="async" className="review-dog-avatar" src={review.avatar || '/assets-fast/dog1.png'} alt={review.user?.username || 'member'} />
        <div className="review-head-copy">
          <div className="review-name-row">
            <span className="review-member-name">{review.user?.username || 'John'}</span>
            <Stars rating={review.rating} size="small" />
            <img loading="lazy" decoding="async" className={`inline-icon heart ${liked ? 'active' : ''}`} src={iconPaths.heart} alt="liked" />
          </div>
          {showGame && review.game && (
            <button className="linkish game-review-link" onClick={() => navigate(`/game/${review.game.rawgId || review.game.id}`, { state: { game: review.game } })}>
              {review.game.name}
            </button>
          )}
          <p className="review-quote">“{review.text}”</p>
        </div>
      </div>
      {review.views && <div className="review-views">{review.views} views</div>}
    </article>
  );
}
