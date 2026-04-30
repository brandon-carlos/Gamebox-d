export function normalizeGame(game = {}) {
  const rawg = game.rawg || {};
  return {
    id: game.id || game.rawgId,
    rawgId: game.rawgId || game.id,
    name: game.name || 'Untitled Game',
    released: game.released || rawg.released || '',
    rating: game.rating ?? game.rawgRating ?? rawg.rating ?? 0,
    metacritic: game.metacritic ?? rawg.metacritic ?? null,
    background_image: game.background_image || game.backgroundImage || rawg.background_image || '',
    background_image_additional: game.background_image_additional || rawg.background_image_additional || '',
    description: game.description_raw || game.description || rawg.description_raw || rawg.description || '',
    genres: Array.isArray(game.genres)
      ? game.genres
      : String(game.genres || '').split(',').filter(Boolean).map(name => ({ name: name.trim(), slug: name.trim().toLowerCase() })),
    developers: Array.isArray(game.developers)
      ? game.developers
      : String(game.developers || '').split(',').filter(Boolean).map(name => ({ name: name.trim() })),
    platforms: Array.isArray(game.platforms) ? game.platforms : [],
    screenshots: game.screenshots || [],
    ratings_count: game.ratings_count || rawg.ratings_count || 0,
    reviews_text_count: game.reviews_text_count || rawg.reviews_text_count || 0,
    playtime: game.playtime || rawg.playtime || 0,
  };
}

export function stripHtml(text = '') {
  return String(text).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function genreText(game) {
  return normalizeGame(game).genres.map(g => g.name).filter(Boolean).join(', ');
}

export function developerText(game) {
  return normalizeGame(game).developers.map(d => d.name).filter(Boolean).join(', ');
}

export function manufactureRating(seed = 1) {
  const value = 3.4 + ((Number(seed) || String(seed).length) % 15) / 10;
  return Math.min(5, Number(value.toFixed(1)));
}
