import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer';
import logger from 'redux-logger';

const store = configureStore({
    reducer:rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;