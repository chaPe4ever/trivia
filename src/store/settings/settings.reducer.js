import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: INITIAL_STATE,
  reducers: {
    setTriviaSettings(state, action) {},
  },
});

export const { setTriviaSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
