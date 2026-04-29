// backend/routes/library.js
const express      = require('express');
const auth         = require('../middleware/auth');
const LibraryEntry = require('../models/LibraryEntry');
const Game         = require('../models/Game');
const { upsertGame } = require('./games');

const router = express.Router();

// GET /api/library/:userId
router.get('/:userId', async (req, res) => {
  try {
    const entries = await LibraryEntry.find({ user: req.params.userId })
      .populate('game')
      .sort({ updatedAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/library
router.post('/', auth, async (req, res) => {
  try {
    const { gameData, status } = req.body;
    const game = await upsertGame(gameData);
    const entry = await LibraryEntry.findOneAndUpdate(
      { user: req.userId, game: game._id },
      { status },
      { upsert: true, new: true }
    ).populate('game');
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/library/:rawgId
router.delete('/:rawgId', auth, async (req, res) => {
  try {
    const game = await Game.findOne({ rawgId: parseInt(req.params.rawgId) });
    if (game) await LibraryEntry.findOneAndDelete({ user: req.userId, game: game._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
