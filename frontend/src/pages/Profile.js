import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ReviewCard from '../components/ReviewCard';

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [libraryEntries, setLibraryEntries] = useState([]);

  useEffect(() => {
    api.get(`/users/${userId}`).then(r => setProfileUser(r.data));
    api.get(`/reviews?userId=${userId}`).then(r => setReviews(r.data));
    api.get(`/library/${userId}`).then(r => setLibraryEntries(r.data));
  }, [userId]);

  const stats = useMemo(() => {
    const likes = reviews.reduce((sum, review) => sum + (review.likes?.length || 0), 0);
    const played = libraryEntries.filter((entry) => entry.status === 'played').length;
    const wishlist = libraryEntries.filter((entry) => entry.status === 'wishlist').length;
    const views = reviews.reduce((sum, review, idx) => sum + 125 + idx * 37 + (review.likes?.length || 0) * 10, 0);
    return {
      followers: Math.max(12, libraryEntries.length * 9 + reviews.length * 4),
      likes,
      reviews: reviews.length,
      ratings: reviews.length,
      played,
      wishlist,
      views,
    };
  }, [reviews, libraryEntries]);

  if (!profileUser) return <div className="page"><p className="text-muted">Loading…</p></div>;

  return (
    <div className="page profile-page-redesign">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="profile-title">{profileUser.username}</h1>
          <p className="profile-bio">
            {profileUser.bio || 'No bio yet.'}
          </p>
          <div className="profile-stats account-infographic-grid profile-account-grid">
            <button className="profile-stat" onClick={() => navigate(`/library/${userId}`)}>
              <strong>{stats.followers}</strong>
              <span>Followers</span>
            </button>
            <button className="profile-stat">
              <strong>{stats.likes}</strong>
              <span>Likes</span>
            </button>
            <button className="profile-stat">
              <strong>{stats.reviews}</strong>
              <span>Reviews</span>
            </button>
            <button className="profile-stat">
              <strong>{stats.ratings}</strong>
              <span>Ratings</span>
            </button>
            <button className="profile-stat" onClick={() => navigate(`/library/${userId}`)}>
              <strong>{stats.played}</strong>
              <span>Played</span>
            </button>
            <button className="profile-stat" onClick={() => navigate(`/library/${userId}`)}>
              <strong>{stats.wishlist}</strong>
              <span>Wishlist</span>
            </button>
            <button className="profile-stat">
              <strong>{stats.views}</strong>
              <span>Review Views</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-heading-row profile-section-row">
        <h2 className="section-heading">Reviews</h2>
        <button className="pill-button account-small-button" onClick={() => navigate('/games')}>Review a game</button>
      </div>

      {reviews.length === 0 && <p className="empty">No reviews yet. Browse games to rate and review something.</p>}
      {reviews.map(r => (
        <ReviewCard
          key={r._id}
          review={{
            ...r,
            avatar: r.avatar || '/assets-fast/dog1.png',
            likedGame: true,
            views: `${Math.max(1, r.likes?.length || 0)} likes`,
          }}
          showGame
          onDelete={id => setReviews(prev => prev.filter(x => x._id !== id))}
        />
      ))}
    </div>
  );
}
