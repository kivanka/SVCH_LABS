import { configureStore } from '@reduxjs/toolkit';
import equipmentReducer from './equipmentSlice';
import { enableMapSet } from 'immer';

enableMapSet();

const store = configureStore({
    reducer: {
        equipment: equipmentReducer,
    },
});

export default store;
