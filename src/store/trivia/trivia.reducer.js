import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {};

export const triviaSlice = createSlice({
  name: 'trivia',
  initialState: INITIAL_STATE,
  reducers: {
    setTriviaQuestions(state, action) {
      state.questions = action.payload;
    },
    setQuestionIndex(state, action) {
      state.questionIndex = action.payload;
    },
    setWrongQuestions(state, action) {
      state.wrongQuestions = action.payload;
    },
    setError(state, action) {
      // Store only serializable error information
      if (action.payload) {
        const error = action.payload;
        state.error = {
          message: error.message || 'An error occurred',
          status: error.response?.status || error.status || null,
          code: error.code || null,
        };
      } else {
        state.error = null;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setTriviaQuestions,
  setQuestionIndex,
  setWrongQuestions,
  setError,
  clearError,
} = triviaSlice.actions;

export const triviaReducer = triviaSlice.reducer;
