import axios from 'axios';

export const TRACKS_PER_PAGE = 20;
const RECOMMENDED_TRACKS_COUNT = 5;

const AUDIUS_API_URL = 'https://api.audius.co/v1';
const RECOMMENDATION_SOURCE_PAGES = 4;

const audiusApi = axios.create({
  baseURL: AUDIUS_API_URL,
});

const tracksCache = new Map();

function getTrackStreamUrl(trackId) {
  return `${AUDIUS_API_URL}/tracks/${trackId}/stream`;
}

function normalizeTrack(rawTrack) {
  return {
    id: rawTrack.id,
    title: rawTrack.title || 'Untitled track',
    artistName: rawTrack.user?.name || rawTrack.user?.handle || 'Unknown artist',
    artworkUrl: rawTrack.artwork?.['480x480'] || '',
    isPlayable: rawTrack.access?.stream !== false && rawTrack.is_available !== false,
    streamUrl: getTrackStreamUrl(rawTrack.id),
  };
}

function createRequestInformation(searchQuery, sortMethod, page, limit) {
  const params = {
    limit,
    offset: (page - 1) * limit,
  };

  if (searchQuery) {
    params.query = searchQuery;
    params.sort_method = sortMethod;

    return {
      endpoint: '/tracks/search',
      params,
    };
  }

  if (sortMethod === 'recent') {
    return {
      endpoint: '/tracks/latest',
      params,
    };
  }

  params.time = 'allTime';

  return {
    endpoint: '/tracks/trending',
    params,
  };
}

export async function getTracks({
  searchQuery = '',
  sortMethod = 'popular',
  page = 1,
  limit = TRACKS_PER_PAGE,
  signal,
} = {}) {
  const preparedSearchQuery = searchQuery.trim();
  const cacheKey = `${preparedSearchQuery}|${sortMethod}|${page}|${limit}`;

  if (tracksCache.has(cacheKey)) {
    return tracksCache.get(cacheKey);
  }

  const requestInformation = createRequestInformation(preparedSearchQuery, sortMethod, page, limit);

  const response = await audiusApi.get(requestInformation.endpoint, {
    params: requestInformation.params,
    signal,
  });

  const rawTracks = response.data?.data || [];
  const tracks = rawTracks.filter((track) => track?.id).map(normalizeTrack);

  tracksCache.set(cacheKey, tracks);

  return tracks;
}

function shuffleTracks(tracks) {
  const shuffledTracks = [...tracks];

  for (let index = shuffledTracks.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporaryTrack = shuffledTracks[index];

    shuffledTracks[index] = shuffledTracks[randomIndex];
    shuffledTracks[randomIndex] = temporaryTrack;
  }

  return shuffledTracks;
}

export async function getRecommendedTracks(signal) {
  const randomPage = Math.floor(Math.random() * RECOMMENDATION_SOURCE_PAGES) + 2;

  const tracks = await getTracks({
    page: randomPage,
    limit: TRACKS_PER_PAGE,
    signal,
  });

  const playableTracks = tracks.filter((track) => track.isPlayable);
  const recommendationSource =
    playableTracks.length >= RECOMMENDED_TRACKS_COUNT ? playableTracks : tracks;

  return shuffleTracks(recommendationSource).slice(0, RECOMMENDED_TRACKS_COUNT);
}
