# Gameboxd — Setup Instructions (MongoDB)

## Tech Stack
- **Frontend:** React, React Router v6, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose (ODM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **External API:** RAWG (game search & data)

---

## Step 1: Install Prerequisites

- **Node.js** (v18+): https://nodejs.org
- **MongoDB Community Server**: https://www.mongodb.com/try/download/community
  - Install and start it — it runs on `localhost:27017` by default
  - Optional GUI: **MongoDB Compass** https://www.mongodb.com/products/compass

---

## Step 2: Get a Free RAWG API Key

1. Go to https://rawg.io/apidocs
2. Sign up and copy your API key

---

## Step 3: Configure the Backend

Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/gameboxd
JWT_SECRET=pick-any-long-random-string
RAWG_API_KEY=paste-your-rawg-key-here
PORT=4000
```

> No database creation needed — MongoDB creates `gameboxd` automatically on first connection.

---

## Step 4: Start the Backend

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Connected to MongoDB
Backend running on http://localhost:4000
```

---

## Step 5: Start the Frontend

Open a **new terminal tab**:
```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## Step 6: Test the App

1. Click **Sign up** → create an account
2. Click **Search** → search "Elden Ring" → click a result
3. Click **+ Add to Library** → select "Played"
4. Click **Write Review** → rate and submit
5. Sign up as a second user → **like** and **comment** on the first review
6. Click **Activity** to see the global feed

---

## Project Structure

```
gameboxd/
├── backend/
│   ├── index.js              ← connects Mongoose, starts Express
│   ├── .env                  ← your config (fill this in)
│   ├── models/
│   │   ├── User.js           ← username, password (hashed), bio
│   │   ├── Game.js           ← cached RAWG game data
│   │   ├── LibraryEntry.js   ← user ↔ game + status (played/playing/wishlist)
│   │   └── Review.js         ← rating, text, likes[], comments[] (embedded)
│   ├── middleware/
│   │   └── auth.js           ← JWT verification middleware
│   └── routes/
│       ├── auth.js           ← POST /api/auth/signup  /api/auth/login
│       ├── games.js          ← GET /api/games/search  GET /api/games/:rawgId
│       ├── library.js        ← GET/POST/DELETE /api/library
│       ├── reviews.js        ← GET/POST/DELETE /api/reviews  + likes + comments
│       └── users.js          ← GET /api/users  GET /api/users/:id
└── frontend/
    └── src/
        ├── index.css         ← all styling (dark theme)
        ├── api.js            ← axios instance with JWT interceptor
        ├── App.js            ← React Router routes
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Stars.js
        │   └── ReviewCard.js ← likes, comments, edit, delete
        └── pages/
            ├── Home.js       ← recent reviews feed
            ├── Login.js
            ├── Signup.js
            ├── Search.js     ← RAWG API search
            ├── GameDetail.js ← game page with reviews
            ├── WriteReview.js
            ├── Library.js    ← played / playing / wishlist tabs
            ├── Profile.js    ← user stats + reviews
            └── Activity.js   ← global feed + members list
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login, receive JWT |
| GET | /api/games/search?q= | No | Search RAWG |
| GET | /api/games/:rawgId | No | Game detail + reviews |
| GET | /api/library/:userId | No | User's game library |
| POST | /api/library | Yes | Add/update library entry |
| DELETE | /api/library/:rawgId | Yes | Remove from library |
| GET | /api/reviews | No | Recent reviews (?gameId= or ?userId=) |
| POST | /api/reviews | Yes | Create or update review |
| DELETE | /api/reviews/:id | Yes | Delete own review |
| POST | /api/reviews/:id/like | Yes | Toggle like |
| POST | /api/reviews/:id/comments | Yes | Add comment |
| GET | /api/users | No | All users |
| GET | /api/users/:id | No | One user's profile |

## MongoDB Collections (auto-created by Mongoose)

| Collection | Description |
|------------|-------------|
| users | Accounts — username, hashed password, bio |
| games | Games cached from RAWG |
| libraryentries | User ↔ Game relationship with status |
| reviews | Rating + text, with embedded comments and likes array |