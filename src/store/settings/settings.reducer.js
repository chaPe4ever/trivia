import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  triviaCategories: [],
  triviaSettings: {
    questionsNumber: 10,
    type: 'Any Type',
    difficulty: 'Any Difficulty',
    category: {},
  },
  token: '',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: INITIAL_STATE,
  reducers: {
    setTriviaCategories(state, action) {
      state.triviaCategories = action.payload;
    },
    setTriviaSettings(state, action) {
      state.triviaSettings = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { setTriviaCategories, setTriviaSettings, setToken } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
