import api from '../api';
import { fallbackGameCatalog } from '../data/siteData';
import { normalizeGame } from './rawgHelpers';

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);
const dateWindow = `${oneYearAgo.toISOString().slice(0, 10)},${today.toISOString().slice(0, 10)}`;

async function safeGet(path, options) {
  try {
    const response = await api.get(path, options);
    return response.data;
  } catch (error) {
    return null;
  }
}

function normalizedList(list) {
  return (list || []).map(normalizeGame);
}

function matchGenre(genreName) {
  return fallbackGameCatalog
    .filter(game => (game.genres || []).some(genre => genre.name.toLowerCase().includes(genreName.toLowerCase())))
    .map(normalizeGame);
}

export async function fetchDiscover(params = {}) {
  const data = await safeGet('/games/discover', { params });
  return data?.results?.length ? normalizedList(data.results) : null;
}

export async function fetchGameMeta(type, params = {}) {
  const data = await safeGet(`/games/meta/${type}`, { params });
  return data?.length ? data : null;
}

export async function fetchScreenshots(rawgId) {
  const data = await safeGet(`/games/${rawgId}/screenshots`, { params: { page_size: 6 } });
  return data?.length ? data : [];
}

export async function fetchHomeSections() {
  const [popular, newest, highlyRated, action, adventure, rpg, shooter, horror, indie] = await Promise.all([
    fetchDiscover({ ordering: '-added', page_size: 10 }),
    fetchDiscover({ ordering: '-released', dates: dateWindow, page_size: 10 }),
    fetchDiscover({ ordering: '-rating', metacritic: '80,100', page_size: 10 }),
    fetchDiscover({ genres: 'action', ordering: '-added', page_size: 10 }),
    fetchDiscover({ genres: 'adventure', ordering: '-rating', page_size: 10 }),
    fetchDiscover({ genres: 'role-playing-games-rpg', ordering: '-rating', page_size: 10 }),
    fetchDiscover({ genres: 'shooter', ordering: '-added', page_size: 10 }),
    fetchDiscover({ genres: 'horror', ordering: '-rating', page_size: 10 }),
    fetchDiscover({ genres: 'indie', ordering: '-rating', page_size: 10 }),
  ]);

  return {
    popular: popular || normalizedList(fallbackGameCatalog.slice(0, 8)),
    newest: newest || normalizedList(fallbackGameCatalog.slice(8, 14)),
    highlyRated: highlyRated || normalizedList(fallbackGameCatalog.slice(8, 16)),
    action: action || normalizedList(fallbackGameCatalog.slice(0, 8)),
    adventure: adventure || normalizedList(fallbackGameCatalog.slice(8, 14)),
    rpg: rpg || normalizedList(fallbackGameCatalog.slice(10, 14)),
    shooter: shooter || normalizedList(fallbackGameCatalog.slice(0, 8)),
    horror: horror || matchGenre('horror'),
    indie: indie || matchGenre('indie'),
  };
}

export async function searchGames(query) {
  const data = await safeGet('/games/search', { params: { q: query, page_size: 12 } });
  return data?.length
    ? normalizedList(data)
    : normalizedList(fallbackGameCatalog.filter((game) => game.name.toLowerCase().includes(query.toLowerCase())));
}
