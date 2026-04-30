export default function Stars({ rating = 0, onSet, size = 'default' }) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className={`stars stars-${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= safeRating ? 'filled' : ''} ${onSet ? 'interactive' : ''}`}
          onClick={() => onSet && onSet(star)}
          role={onSet ? 'button' : undefined}
          tabIndex={onSet ? 0 : undefined}
          onKeyDown={(event) => {
            if (onSet && (event.key === 'Enter' || event.key === ' ')) onSet(star);
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
