import logger from 'redux-logger';

import { rootReducer } from './root-reducer';
import { configureStore } from '@reduxjs/toolkit';

const middleWares = import.meta.env.DEV ? [logger] : [];

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleWares),
});
