import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
import playerReducer from './playerSlice';

const FAVORITES_STORAGE_KEY = 'modsenfy-favorites';

function loadFavoritesFromLocalStorage() {
  try {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!savedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(savedFavorites);

    if (!Array.isArray(parsedFavorites)) {
      return [];
    }

    return parsedFavorites;
  } catch {
    return [];
  }
}

const preloadedState = {
  favorites: {
    tracks: loadFavoritesFromLocalStorage(),
  },
};

const store = configureStore({
  reducer: {
    player: playerReducer,
    favorites: favoritesReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  try {
    const currentState = store.getState();
    const favoriteTracks = currentState.favorites.tracks;
    const savedFavorites = JSON.stringify(favoriteTracks);

    localStorage.setItem(FAVORITES_STORAGE_KEY, savedFavorites);
  } catch {
    // The application can continue working even if LocalStorage is unavailable.
  }
});

export default store;
