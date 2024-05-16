import { configureStore } from '@reduxjs/toolkit';
import equipmentReducer from './equipmentSlice';

const store = configureStore({
  reducer: {
    equipment: equipmentReducer,
  },
});

export default store;
