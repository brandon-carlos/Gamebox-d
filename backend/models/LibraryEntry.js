// backend/models/LibraryEntry.js
const mongoose = require('mongoose');

const libraryEntrySchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game:   { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  status: { type: String, enum: ['played', 'playing', 'wishlist'], required: true },
}, { timestamps: true });

libraryEntrySchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('LibraryEntry', libraryEntrySchema);
