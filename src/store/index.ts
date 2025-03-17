import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import courseReducer from './slices/courseSlice';
import progressReducer from './slices/progressSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    progress: progressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 