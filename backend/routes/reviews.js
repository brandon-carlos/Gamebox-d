// backend/routes/reviews.js
const express = require('express');
const auth    = require('../middleware/auth');
const Review  = require('../models/Review');
const { upsertGame } = require('./games');

const router = express.Router();

const populate = q => q
  .populate('user', 'username')
  .populate('game')
  .populate('comments.user', 'username');

// GET /api/reviews?gameId=&userId=
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.gameId)  filter.game = req.query.gameId;
    if (req.query.userId)  filter.user = req.query.userId;
    const reviews = await populate(Review.find(filter).sort({ createdAt: -1 }).limit(30));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews — create or update
router.post('/', auth, async (req, res) => {
  try {
    const { gameData, rating, text } = req.body;
    const game = await upsertGame(gameData);
    const review = await Review.findOneAndUpdate(
      { user: req.userId, game: game._id },
      { rating, text },
      { upsert: true, new: true }
    );
    res.json(await populate(Review.findById(review._id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    if (review.user.toString() !== req.userId) return res.status(403).json({ error: 'Forbidden' });
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:id/like — toggle
router.post('/:id/like', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    const idx = review.likes.indexOf(req.userId);
    if (idx >= 0) review.likes.splice(idx, 1);
    else review.likes.push(req.userId);
    await review.save();
    res.json({ liked: idx < 0, likeCount: review.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews/:id/comments
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const review = await Review.findById(req.params.id);
    review.comments.push({ user: req.userId, text });
    await review.save();
    const updated = await populate(Review.findById(review._id));
    res.json(updated.comments[updated.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
