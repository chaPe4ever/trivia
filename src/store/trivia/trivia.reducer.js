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
    setCorrectQuestionsAndAnswers(state, action) {
      state.correctQuestionsAndAnswers = action.payload;
    },
  },
});

export const {
  setTriviaQuestions,
  setQuestionIndex,
  setCorrectQuestionsAndAnswers,
} = triviaSlice.actions;

export const triviaReducer = triviaSlice.reducer;
