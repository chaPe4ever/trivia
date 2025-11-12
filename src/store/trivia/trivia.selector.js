import { createSelector } from 'reselect';
import { selectSettingsReducer } from '../settings/settings.selector';

const selectTriviaReducer = (state) => state.trivia;

export const selectQuestion = createSelector(
  [selectTriviaReducer],
  (trivia) => {
    if (!trivia || Object.keys(trivia).length === 0) {
      return {};
    }
    const question = trivia.questions[0];
    return question;
  }
);

export const selectAnswers = createSelector([selectTriviaReducer], (trivia) => {
  if (!trivia || Object.keys(trivia).length === 0) {
    return [];
  }
  const question = trivia.questions[0];

  if (!question || Object.keys(question).length === 0) {
    return [];
  }
  const answers = [...question.incorrectAnswers, question.correctAnswer];

  return answers.sort();
});

export const selectQuestionProgress = createSelector(
  [selectTriviaReducer, selectSettingsReducer],
  (trivia, settings) => {
    if (!trivia || Object.keys(trivia).length === 0) {
      return {};
    }
    return {
      index: trivia.questionIndex,
      questionsNumber: settings.triviaSettings.questionsNumber,
    };
  }
);

export const selectCorrectQuestionsAndAnswers = createSelector(
  [selectTriviaReducer],
  (trivia) => trivia.correctQuestionsAndAnswers
);
