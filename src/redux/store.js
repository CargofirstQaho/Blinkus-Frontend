import { configureStore } from '@reduxjs/toolkit';
import authReducer         from './slices/authSlice';
import chatReducer         from './slices/chatSlice';
import dashboardReducer    from './slices/dashboardSlice';
import subscriptionReducer from './slices/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    chat:         chatReducer,
    dashboard:    dashboardReducer,
    subscription: subscriptionReducer,
  },
});
