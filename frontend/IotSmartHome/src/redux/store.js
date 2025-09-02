import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import devicesReducer from './slices/devicesSlice';
import sensorsReducer from './slices/sensorsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: devicesReducer,
    sensors: sensorsReducer,
  },
});