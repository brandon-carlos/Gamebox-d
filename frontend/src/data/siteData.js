export const dogImage = (n) => `/assets-fast/dog${n}.png`;

export const logoPath = '/assets-fast/logo.png';
export const iconPaths = {
  heart: '/assets-fast/heart.png',
  followers: '/assets-fast/Contact.png',
  views: '/assets-fast/views.png',
};

export const pageBackgrounds = {
  green: '/assets-fast/Background-Green.png',
  blue: '/assets-fast/Background-Blue.png',
  red: '/assets-fast/Background-Red.png',
  purple: '/assets-fast/Background-purple.png',
  cyan: '/assets-fast/Background-cyan.png',
};

export const overlayBulbasaur = '/assets-fast/pixil_dither_overlay_background.png';

export const employeeProfiles = [
  { id: 'emp-1', name: 'John Hammond', role: 'CEO', description: 'I like to play games and stuff', image: dogImage(1), stats: { gamesPlayed: 30, reviews: 15, followers: '1.5k' } },
  { id: 'emp-2', name: 'John Hammond', role: 'Chief Technical Officer', description: 'I like to play games and stuff', image: dogImage(7), stats: { gamesPlayed: 30, reviews: 15, followers: '1.5k' } },
  { id: 'emp-3', name: 'John Hammond', role: 'Chief Financial Officer', description: 'I like to play games and stuff', image: dogImage(11), stats: { gamesPlayed: 30, reviews: 15, followers: '1.5k' } },
  { id: 'emp-4', name: 'John Hammond', role: 'Web Developer', description: 'I like to play games and stuff', image: dogImage(15), stats: { gamesPlayed: 30, reviews: 15, followers: '1.5k' } },
  { id: 'emp-5', name: 'John Hammond', role: 'Steam Associate', description: 'I like to play games and stuff', image: dogImage(20), stats: { gamesPlayed: 30, reviews: 15, followers: '1.5k' } },
];

export const popularMembers = [
  { id: 'pm-1', name: 'John Hammond', image: dogImage(2), gamesPlayed: 30, reviews: 15, followers: '1.5k' },
  { id: 'pm-2', name: 'John Reagan', image: dogImage(3), gamesPlayed: 30, reviews: 15, followers: '1.5k' },
  { id: 'pm-3', name: 'John Smith', image: dogImage(4), gamesPlayed: 30, reviews: 15, followers: '1.5k' },
  { id: 'pm-4', name: 'John John', image: dogImage(5), gamesPlayed: 30, reviews: 15, followers: '1.5k' },
];

export const allMembers = Array.from({ length: 32 }, (_, idx) => ({
  id: `m-${idx + 1}`,
  name: [
    'John Hammond', 'John Raymond', 'John Reagan', 'John Smith',
    'Morgan Byte', 'Casey Pixel', 'Jamie Quest', 'Riley Console',
    'Taylor Savepoint', 'Alex Arcade', 'Sam Speedrun', 'Jordan Joycon'
  ][idx % 12],
  image: dogImage((idx % 37) + 1),
  reviews: `${(idx % 8) + 1}.${idx % 10}k reviews`,
  views: `${(idx % 9) + 1}.${(idx + 3) % 10}k`,
  followers: `${(idx % 7) + 1}.${(idx + 5) % 10}k`,
  likes: `${(idx % 6) + 1}.${(idx + 7) % 10}k`,
}));

export const contactCards = [
  { id: 'c-1', name: 'John Hammond', image: dogImage(12), gamesPlayed: 30, reviews: 15, email: 'email@google.com' },
  { id: 'c-2', name: 'John Hammond', image: dogImage(14), gamesPlayed: 30, reviews: 15, email: 'email@google.com' },
  { id: 'c-3', name: 'John Hammond', image: dogImage(17), gamesPlayed: 30, reviews: 15, email: 'email@google.com' },
  { id: 'c-4', name: 'John Hammond', image: dogImage(19), gamesPlayed: 30, reviews: 15, email: 'email@google.com' },
];

export const featuredNews = [
  { id: 1, title: 'Major Update for LOL', summary: 'Read about the article now and your change affects the game.', image: '/assets-fast/overwatch.png' },
  { id: 2, title: 'Overwatch adds new character', summary: 'Read about the article now and your change affects the game.', image: '/assets-fast/lastofus.png' },
  { id: 3, title: 'Controversial new map for CS 2', summary: 'Read about the article now and your change affects the game.', image: '/assets-fast/CS.png' },
];

export const fallbackGameCatalog = [
  { id: 1, name: 'Counter-Strike 2', slug: 'counter-strike-2', background_image: '/assets-fast/CS.png', rating: 4.2, genres: [{ name: 'Shooter' }], released: '2012-08-21' },
  { id: 2, name: 'Minecraft', slug: 'minecraft', background_image: '/assets-fast/minecraft.png', rating: 4.8, genres: [{ name: 'Adventure' }], released: '2011-11-18' },
  { id: 3, name: 'Roblox', slug: 'roblox', background_image: '/assets-fast/GTA5.png', rating: 4.0, genres: [{ name: 'Sandbox' }], released: '2006-09-01' },
  { id: 4, name: 'Fortnite', slug: 'fortnite', background_image: '/assets-fast/overwatch.png', rating: 4.1, genres: [{ name: 'Battle Royale' }], released: '2017-07-21' },
  { id: 5, name: 'League of Legends', slug: 'league-of-legends', background_image: '/assets-fast/witcher.png', rating: 4.0, genres: [{ name: 'MOBA' }], released: '2009-10-27' },
  { id: 6, name: 'The Sims 4', slug: 'the-sims-4', background_image: '/assets-fast/celeste.png', rating: 4.3, genres: [{ name: 'Simulation' }], released: '2014-09-02' },
  { id: 7, name: 'Overwatch 2', slug: 'overwatch-2', background_image: '/assets-fast/overwatch.png', rating: 4.0, genres: [{ name: 'Shooter' }], released: '2022-10-04' },
  { id: 8, name: 'Valorant', slug: 'valorant', background_image: '/assets-fast/godofwar.png', rating: 4.4, genres: [{ name: 'Shooter' }], released: '2020-06-02' },
  { id: 9, name: 'Red Dead Redemption 2', slug: 'red-dead-redemption-2', background_image: '/assets-fast/RDR2.png', rating: 4.9, genres: [{ name: 'Adventure' }], released: '2018-10-26' },
  { id: 10, name: 'The Last of Us', slug: 'the-last-of-us', background_image: '/assets-fast/lastofus.png', rating: 4.9, genres: [{ name: 'Adventure' }], released: '2013-06-14' },
  { id: 11, name: 'Baldur\'s Gate 3', slug: 'baldurs-gate-3', background_image: '/assets-fast/baldursgate.png', rating: 4.9, genres: [{ name: 'RPG' }], released: '2023-08-03' },
  { id: 12, name: 'Clair Obscur: Expedition 33', slug: 'expedition-33', background_image: '/assets-fast/expedition33.png', rating: 4.7, genres: [{ name: 'RPG' }], released: '2025-04-24' },
  { id: 13, name: 'Fatal Frame II', slug: 'fatal-frame-ii', background_image: '/assets-fast/FatalF2.png', rating: 4.4, genres: [{ name: 'Horror' }], released: '2003-11-25' },
  { id: 14, name: 'Fatal Frame III', slug: 'fatal-frame-iii', background_image: '/assets-fast/FatalF3.png', rating: 4.3, genres: [{ name: 'Horror' }], released: '2005-07-28' },
  { id: 15, name: 'Fatal Frame', slug: 'fatal-frame', background_image: '/assets-fast/FatalF.png', rating: 4.2, genres: [{ name: 'Horror' }], released: '2001-12-13' },
  { id: 16, name: 'Siren', slug: 'siren', background_image: '/assets-fast/Siren.png', rating: 4.2, genres: [{ name: 'Horror' }], released: '2003-11-06' },
  { id: 17, name: 'Silent Hill 2', slug: 'silent-hill-2', background_image: '/assets-fast/SilentHill2.png', rating: 4.8, genres: [{ name: 'Horror' }], released: '2001-09-24' },
  { id: 18, name: 'The Stanley Parable', slug: 'the-stanley-parable', background_image: '/assets-fast/stanleyparable.png', rating: 4.5, genres: [{ name: 'Indie' }], released: '2013-10-17' },
  { id: 19, name: 'Braid', slug: 'braid', background_image: '/assets-fast/braid.png', rating: 4.6, genres: [{ name: 'Indie' }], released: '2008-08-06' },
  { id: 20, name: 'Cuphead', slug: 'cuphead', background_image: '/assets-fast/cuphead.png', rating: 4.7, genres: [{ name: 'Indie' }], released: '2017-09-29' },
  { id: 21, name: 'Celeste', slug: 'celeste', background_image: '/assets-fast/celeste.png', rating: 4.9, genres: [{ name: 'Indie' }], released: '2018-01-25' },
  { id: 22, name: 'A Short Hike', slug: 'a-short-hike', background_image: '/assets-fast/ashorthike.png', rating: 4.8, genres: [{ name: 'Indie' }], released: '2019-07-30' },
];

const sampleQuotes = [
  'This game is really fun, had a great time!',
  'This game was a lot of cool moments!',
  'This game has a lot of cool characters in it',
  'This is the sombering 5000 hrs',
  'This game brings a lot to the atmosphere of gaming',
  'I hate this game',
  'This game rocks!',
  'Super awesome!!',
  'Really liked the mechanics',
];

export function makeMockReviews(games = fallbackGameCatalog.slice(0, 4), count = 6) {
  return Array.from({ length: count }, (_, idx) => ({
    _id: `mock-review-${idx + 1}`,
    user: { _id: `mock-user-${idx + 1}`, username: ['John', 'Jamie', 'Riley', 'Taylor', 'Morgan', 'Sky'][idx % 6] },
    rating: (idx % 5) + 1,
    text: sampleQuotes[idx % sampleQuotes.length],
    likedGame: idx % 3 !== 1,
    likes: Array.from({ length: (idx % 5) + 1 }, (_, likeIdx) => `like-${likeIdx}`),
    comments: [],
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
    views: `${200 + idx * 200}k`,
    game: games[idx % games.length],
    avatar: dogImage((idx % 12) + 21),
  }));
}
