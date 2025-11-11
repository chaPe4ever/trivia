import { createSelector } from 'reselect';

const selectSettingsReducer = (state) => state.settings;

export const selectCategories = createSelector(
  [selectSettingsReducer],
  (settings) => {
    return settings.triviaCategories;
  }
);
