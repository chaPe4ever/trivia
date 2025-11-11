import { createSlice } from '@reduxjs/toolkit';
import { QuestionsType } from '../../utils/types';

const INITIAL_STATE = {
  triviaCategories: [],
  userSelectionOptions: {
    questionsNumber: 10,
    type: 'Any Type',
    difficulty: 'Any Difficulty',
    category: 'Any Category',
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: INITIAL_STATE,
  reducers: {
    setTriviaCategories(state, action) {
      state.triviaCategories = action.payload;
    },
    setUserSelectionOptions(state, action) {
      state.userSelectionOptions = action.payload;
    },
  },
});

export const { setTriviaCategories, setUserSelectionOptions } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
