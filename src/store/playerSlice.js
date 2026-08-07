import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTrack: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack(state, action) {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    pauseTrack(state) {
      state.isPlaying = false;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
  },
});

export const { playTrack, pauseTrack, setIsPlaying } = playerSlice.actions;

export default playerSlice.reducer;
