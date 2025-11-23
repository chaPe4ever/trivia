import { combineReducers } from '@reduxjs/toolkit';
import { triviaReducer } from './trivia/trivia.reducer';
import { settingsReducer } from './settings/settings.reducer';

export const rootReducer = combineReducers({
  trivia: triviaReducer,
  settings: settingsReducer,
});
