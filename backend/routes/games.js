// backend/routes/games.js
const express = require('express');
const axios   = require('axios');
const auth    = require('../middleware/auth');
const Game    = require('../models/Game');
const Review  = require('../models/Review');

const router = express.Router();

async function upsertGame(rawgData) {
  return Game.findOneAndUpdate(
    { rawgId: rawgData.id },
    {
      rawgId: rawgData.id,
      name: rawgData.name,
      backgroundImage: rawgData.background_image || '',
      genres: (rawgData.genres || []).map(g => g.name).join(', '),
      rawgRating: rawgData.rating || 0,
    },
    { upsert: true, new: true }
  );
}

// GET /api/games/search?q=
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const { data } = await axios.get('https://api.rawg.io/api/games', {
      params: { key: process.env.RAWG_API_KEY, search: q, page_size: 10 },
    });
    res.json(data.results || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:rawgId
router.get('/:rawgId', async (req, res) => {
  try {
    const rawgId = parseInt(req.params.rawgId);
    let game = await Game.findOne({ rawgId });

    if (!game) {
      const { data } = await axios.get(`https://api.rawg.io/api/games/${rawgId}`, {
        params: { key: process.env.RAWG_API_KEY },
      });
      game = await upsertGame(data);
    }

    const reviews = await Review.find({ game: game._id })
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

    res.json({ ...game.toObject(), avgRating, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/games/upsert  (saves a RAWG game object into our DB)
router.post('/upsert', auth, async (req, res) => {
  try {
    const game = await upsertGame(req.body);
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, upsertGame };
