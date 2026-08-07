import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracks: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      const trackToAdd = action.payload;
      let trackAlreadyExists = false;

      for (let index = 0; index < state.tracks.length; index += 1) {
        const favoriteTrack = state.tracks[index];

        if (favoriteTrack.id === trackToAdd.id) {
          trackAlreadyExists = true;
          break;
        }
      }

      if (!trackAlreadyExists) {
        state.tracks.push(trackToAdd);
      }
    },
    removeFavorite(state, action) {
      const trackId = action.payload;
      const updatedTracks = [];

      for (let index = 0; index < state.tracks.length; index += 1) {
        const favoriteTrack = state.tracks[index];

        if (favoriteTrack.id !== trackId) {
          updatedTracks.push(favoriteTrack);
        }
      }

      state.tracks = updatedTracks;
    },
    toggleFavorite(state, action) {
      const selectedTrack = action.payload;
      let favoriteTrackIndex = -1;

      for (let index = 0; index < state.tracks.length; index += 1) {
        const favoriteTrack = state.tracks[index];

        if (favoriteTrack.id === selectedTrack.id) {
          favoriteTrackIndex = index;
          break;
        }
      }

      if (favoriteTrackIndex === -1) {
        state.tracks.push(selectedTrack);
        return;
      }

      state.tracks.splice(favoriteTrackIndex, 1);
    },
    setFavorites(state, action) {
      if (Array.isArray(action.payload)) {
        state.tracks = action.payload;
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, setFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
