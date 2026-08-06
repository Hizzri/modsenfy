import axios from 'axios';

export const TRACKS_PER_PAGE = 20;

const AUDIUS_API_URL = 'https://api.audius.co/v1';

const audiusApi = axios.create({
  baseURL: AUDIUS_API_URL,
  timeout: 15000,
});

const tracksCache = new Map();

function prepareSearchQuery(searchQuery) {
  if (typeof searchQuery !== 'string') {
    return '';
  }

  return searchQuery.trim();
}

function preparePageNumber(page) {
  if (typeof page !== 'number') {
    return 1;
  }

  if (page < 1) {
    return 1;
  }

  return page;
}

function prepareLimit(limit) {
  if (typeof limit !== 'number') {
    return TRACKS_PER_PAGE;
  }

  if (limit < 1) {
    return TRACKS_PER_PAGE;
  }

  if (limit > TRACKS_PER_PAGE) {
    return TRACKS_PER_PAGE;
  }

  return limit;
}

function prepareSortMethod(sortMethod) {
  if (sortMethod === 'recent') {
    return 'recent';
  }

  return 'popular';
}

function createCacheKey(searchQuery, sortMethod, page, limit) {
  const cacheKeyParts = [searchQuery, sortMethod, String(page), String(limit)];

  return cacheKeyParts.join('|');
}

function getArtworkUrl(rawTrack) {
  if (!rawTrack.artwork) {
    return '';
  }

  if (rawTrack.artwork['480x480']) {
    return rawTrack.artwork['480x480'];
  }

  if (rawTrack.artwork['1000x1000']) {
    return rawTrack.artwork['1000x1000'];
  }

  if (rawTrack.artwork['150x150']) {
    return rawTrack.artwork['150x150'];
  }

  return '';
}

function getArtistName(rawTrack) {
  if (!rawTrack.user) {
    return 'Unknown artist';
  }

  if (rawTrack.user.name) {
    return rawTrack.user.name;
  }

  if (rawTrack.user.handle) {
    return rawTrack.user.handle;
  }

  return 'Unknown artist';
}

function checkIfTrackCanBePlayed(rawTrack) {
  if (rawTrack.is_available === false) {
    return false;
  }

  if (rawTrack.is_streamable === false) {
    return false;
  }

  if (rawTrack.access && rawTrack.access.stream === false) {
    return false;
  }

  return true;
}

export function getTrackStreamUrl(trackId) {
  const safeTrackId = encodeURIComponent(trackId);

  return `${AUDIUS_API_URL}/tracks/${safeTrackId}/stream`;
}

function normalizeTrack(rawTrack) {
  const normalizedTrack = {
    id: rawTrack.id,
    title: rawTrack.title || 'Untitled track',
    artistName: getArtistName(rawTrack),
    artworkUrl: getArtworkUrl(rawTrack),
    duration: rawTrack.duration || 0,
    genre: rawTrack.genre || '',
    playCount: rawTrack.play_count || 0,
    favoriteCount: rawTrack.favorite_count || 0,
    repostCount: rawTrack.repost_count || 0,
    createdAt: rawTrack.created_at || rawTrack.release_date || '',
    permalink: rawTrack.permalink || '',
    isPlayable: checkIfTrackCanBePlayed(rawTrack),
    streamUrl: getTrackStreamUrl(rawTrack.id),
  };

  return normalizedTrack;
}

function normalizeTracks(rawTracks) {
  const normalizedTracks = [];

  for (let index = 0; index < rawTracks.length; index += 1) {
    const rawTrack = rawTracks[index];
    const normalizedTrack = normalizeTrack(rawTrack);

    normalizedTracks.push(normalizedTrack);
  }

  return normalizedTracks;
}

function createAudiusRequest(searchQuery, sortMethod, page, limit) {
  const offset = (page - 1) * limit;

  const requestInformation = {
    endpoint: '/tracks/trending',
    params: {
      limit,
      offset,
    },
  };

  if (searchQuery !== '') {
    requestInformation.endpoint = '/tracks/search';
    requestInformation.params.query = searchQuery;
    requestInformation.params.sort_method = sortMethod;

    return requestInformation;
  }

  if (sortMethod === 'recent') {
    requestInformation.endpoint = '/tracks/latest';

    return requestInformation;
  }

  requestInformation.endpoint = '/tracks/trending';
  requestInformation.params.time = 'allTime';

  return requestInformation;
}

export async function getTracks(requestOptions) {
  const searchQuery = prepareSearchQuery(requestOptions.searchQuery);
  const sortMethod = prepareSortMethod(requestOptions.sortMethod);
  const page = preparePageNumber(requestOptions.page);
  const limit = prepareLimit(requestOptions.limit);
  const signal = requestOptions.signal;

  const cacheKey = createCacheKey(searchQuery, sortMethod, page, limit);

  if (tracksCache.has(cacheKey)) {
    const cachedTracks = tracksCache.get(cacheKey);

    return cachedTracks;
  }

  const requestInformation = createAudiusRequest(searchQuery, sortMethod, page, limit);

  const axiosConfig = {
    params: requestInformation.params,
  };

  if (signal) {
    axiosConfig.signal = signal;
  }

  const response = await audiusApi.get(requestInformation.endpoint, axiosConfig);

  let rawTracks = [];

  if (response.data && Array.isArray(response.data.data)) {
    rawTracks = response.data.data;
  }

  const normalizedTracks = normalizeTracks(rawTracks);

  tracksCache.set(cacheKey, normalizedTracks);

  return normalizedTracks;
}

export function isCanceledRequest(error) {
  if (axios.isCancel(error)) {
    return true;
  }

  if (error && error.code === 'ERR_CANCELED') {
    return true;
  }

  return false;
}

export function getAudiusErrorMessage(error) {
  if (error && error.response) {
    const statusCode = error.response.status;

    if (statusCode === 429) {
      return 'Too many requests were sent to Audius. Please try again later.';
    }

    if (statusCode >= 500) {
      return 'Audius is temporarily unavailable. Please try again later.';
    }

    return 'Audius could not process the request.';
  }

  if (error && error.request) {
    return 'Audius did not respond. Check your internet connection.';
  }

  return 'The request to Audius could not be created.';
}
