// frontend/src/components/Stars.js
export default function Stars({ rating, onSet }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : ''} ${onSet ? 'interactive' : ''}`}
          onClick={() => onSet && onSet(i)}
        >★</span>
      ))}
    </span>
  );
}
