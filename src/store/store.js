import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import playerReducer from './playerSlice';

const FAVORITES_STORAGE_KEY = 'modsenfy-favorites';

function loadFavorites() {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!savedFavorites) {
      return [];
    }

    const favorites = JSON.parse(savedFavorites);
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
}

const store = configureStore({
  reducer: {
    player: playerReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    favorites: {
      tracks: loadFavorites(),
    },
  },
});

store.subscribe(() => {
  const favoriteTracks = store.getState().favorites.tracks;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteTracks));
});

export default store;
