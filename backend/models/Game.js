// backend/models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  rawgId:          { type: Number, required: true, unique: true },
  name:            { type: String, required: true },
  backgroundImage: { type: String, default: '' },
  genres:          { type: String, default: '' },
  rawgRating:      { type: Number, default: 0 },
});

module.exports = mongoose.model('Game', gameSchema);
