// frontend/src/pages/Profile.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import ReviewCard from '../components/ReviewCard';

export default function Profile() {
  const { userId } = useParams();
  const navigate   = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews]         = useState([]);
  const [counts, setCounts]           = useState({ played: 0, playing: 0, wishlist: 0 });

  useEffect(() => {
    api.get(`/users/${userId}`).then(r => setProfileUser(r.data));
    api.get(`/reviews?userId=${userId}`).then(r => setReviews(r.data));
    api.get(`/library/${userId}`).then(r => {
      const entries = r.data;
      setCounts({
        played:  entries.filter(e => e.status === 'played').length,
        playing: entries.filter(e => e.status === 'playing').length,
        wishlist: entries.filter(e => e.status === 'wishlist').length,
      });
    });
  }, [userId]);

  if (!profileUser) return <div className="page"><p className="text-muted">Loading…</p></div>;

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{profileUser.username}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 2 }}>
            {profileUser.bio || 'No bio yet.'}
          </p>
          <div className="profile-stats">
            <div className="profile-stat" onClick={() => navigate(`/library/${userId}`)}>
              <div className="profile-stat-num">{counts.played}</div>
              <div className="profile-stat-label">Played</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-num">{reviews.length}</div>
              <div className="profile-stat-label">Reviews</div>
            </div>
            <div className="profile-stat" onClick={() => navigate(`/library/${userId}`)}>
              <div className="profile-stat-num">{counts.wishlist}</div>
              <div className="profile-stat-label">Wishlist</div>
            </div>
          </div>
        </div>
      </div>

      <p className="section-title">Reviews</p>
      {reviews.length === 0 && <p className="empty">No reviews yet.</p>}
      {reviews.map(r => (
        <ReviewCard
          key={r._id}
          review={r}
          showGame
          onDelete={id => setReviews(prev => prev.filter(x => x._id !== id))}
        />
      ))}
    </div>
  );
}
