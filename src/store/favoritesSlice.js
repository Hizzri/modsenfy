import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tracks: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action) {
      const selectedTrack = action.payload;
      const favoriteTrackIndex = state.tracks.findIndex((track) => track.id === selectedTrack.id);

      if (favoriteTrackIndex === -1) {
        state.tracks.push(selectedTrack);
      } else {
        state.tracks.splice(favoriteTrackIndex, 1);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
