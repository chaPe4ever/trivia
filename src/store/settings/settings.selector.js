import { createSelector } from 'reselect';

export const selectSettingsReducer = (state) => state.settings;

export const selectCategories = createSelector(
  [selectSettingsReducer],
  (settings) => {
    return settings.triviaCategories;
  }
);

export const selectSettings = createSelector(
  [selectSettingsReducer],
  (settings) => settings.triviaSettings
);

export const selectToken = createSelector(
  [selectSettingsReducer],
  (settings) => settings.token
);

export const selectCorrectAnswers = createSelector(
  [selectSettingsReducer],
  (settings) => settings.correctAnswers
);
