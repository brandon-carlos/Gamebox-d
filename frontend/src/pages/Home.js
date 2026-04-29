// frontend/src/pages/Home.js
import { useEffect, useState } from 'react';
import api from '../api';
import ReviewCard from '../components/ReviewCard';

export default function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => { api.get('/reviews').then(r => setReviews(r.data)); }, []);

  return (
    <div className="page">
      <h1 className="page-title">Recent Reviews</h1>
      {reviews.length === 0 && (
        <p className="empty">No reviews yet — search for a game and be the first!</p>
      )}
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
