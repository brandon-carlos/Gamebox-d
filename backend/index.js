// backend/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/games',   require('./routes/games').router);
app.use('/api/library', require('./routes/library'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users',   require('./routes/users'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 4000, () =>
      console.log(`Backend running on http://localhost:${process.env.PORT || 4000}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
