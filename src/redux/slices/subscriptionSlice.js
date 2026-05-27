import { createSlice } from '@reduxjs/toolkit';

// Dedicated slice for subscription billing UI (future-ready).
// Currently unused in UI — populated by GET /api/subscription/plan when billing is enabled.
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    currentPlan: null,
    history:     [],
    loading:     false,
  },
  reducers: {
    setSubscriptionData(state, { payload }) {
      if (payload.currentPlan !== undefined) state.currentPlan = payload.currentPlan;
      if (payload.history     !== undefined) state.history     = payload.history;
    },

    setSubscriptionLoading(state, { payload }) {
      state.loading = payload;
    },

    clearSubscription(state) {
      state.currentPlan = null;
      state.history     = [];
      state.loading     = false;
    },
  },
});

export const { setSubscriptionData, setSubscriptionLoading, clearSubscription } = subscriptionSlice.actions;

export const selectCurrentPlan         = (state) => state.subscription.currentPlan;
export const selectSubscriptionHistory = (state) => state.subscription.history;
export const selectSubscriptionLoading = (state) => state.subscription.loading;

export default subscriptionSlice.reducer;
