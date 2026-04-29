// frontend/src/pages/Activity.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReviewCard from '../components/ReviewCard';

export default function Activity() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers]     = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/reviews').then(r => setReviews(r.data));
    api.get('/users').then(r => setUsers(r.data));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Activity</h1>

      <p className="section-title">Recent Reviews</p>
      {reviews.length === 0 && <p className="empty">No reviews yet.</p>}
      {reviews.map(r => (
        <ReviewCard
          key={r._id}
          review={r}
          showGame
          onDelete={id => setReviews(prev => prev.filter(x => x._id !== id))}
        />
      ))}

      <p className="section-title">Members</p>
      {users.map(u => (
        <div
          key={u._id}
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', marginBottom: 10 }}
          onClick={() => navigate(`/profile/${u._id}`)}
        >
          <div className="review-avatar" style={{ cursor: 'pointer' }}>
            {u.username.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{u.username}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{u.bio || 'No bio'}</div>
          </div>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>View profile →</span>
        </div>
      ))}
    </div>
  );
}
