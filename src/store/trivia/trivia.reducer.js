import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {};

export const triviaSlice = createSlice({
  name: 'trivia',
  initialState: INITIAL_STATE,
  reducers: {
    setTriviaQuestion(state, action) {},
  },
});

export const { setTriviaSettings } = triviaSlice.actions;

export const triviaReducer = triviaSlice.reducer;
