// frontend/src/components/ReviewCard.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stars from './Stars';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function initials(username) { return username ? username.slice(0, 2).toUpperCase() : '??'; }

export default function ReviewCard({ review, showGame = false, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(review.likes || []);
  const [comments, setComments] = useState(review.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const liked = user && likes.some(id =>
    (typeof id === 'string' ? id : id._id?.toString() || id.toString()) === user._id
  );

  async function handleLike() {
    if (!user) return navigate('/login');
    const { data } = await api.post(`/reviews/${review._id}/like`);
    setLikes(prev =>
      data.liked ? [...prev, user._id] : prev.filter(id => {
        const s = typeof id === 'string' ? id : id._id?.toString() || id.toString();
        return s !== user._id;
      })
    );
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data } = await api.post(`/reviews/${review._id}/comments`, { text: commentText });
    setComments(prev => [...prev, data]);
    setCommentText('');
  }

  async function handleDelete() {
    if (!window.confirm('Delete this review?')) return;
    await api.delete(`/reviews/${review._id}`);
    onDelete && onDelete(review._id);
  }

  const gameObj = review.game;
  const isOwn = user && review.user?._id === user._id;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar" onClick={() => navigate(`/profile/${review.user?._id}`)}>
          {initials(review.user?.username)}
        </div>
        <div>
          <div className="review-username" onClick={() => navigate(`/profile/${review.user?._id}`)}>
            {review.user?.username}
          </div>
          {showGame && gameObj && (
            <div className="review-game-link" onClick={() => navigate(`/game/${gameObj.rawgId}`)}>
              {gameObj.name}
            </div>
          )}
        </div>
        <Stars rating={review.rating} />
        <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="review-text">{review.text}</p>

      <div className="review-actions">
        <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
          ♥ {likes.length}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowComments(s => !s)}>
          💬 {comments.length}
        </button>
        {isOwn && (
          <>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/review/${gameObj?.rawgId}`, { state: { existing: review, game: gameObj } })}
            >Edit</button>
            <button className="btn btn-ghost btn-sm btn-danger" onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.length === 0 && <p style={{ color: 'var(--text3)', fontSize: 13 }}>No comments yet.</p>}
          {comments.map(c => (
            <div key={c._id} className="comment">
              <strong onClick={() => navigate(`/profile/${c.user?._id}`)}>{c.user?.username}: </strong>
              <span>{c.text}</span>
            </div>
          ))}
          {user && (
            <form className="comment-form" onSubmit={handleComment}>
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment…"
              />
              <button type="submit" className="btn btn-sm">Post</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
