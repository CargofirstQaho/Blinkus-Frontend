import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,
    token:           null,
    isAuthenticated: false,
    authLoading:     false,
    initialized:     false,

    // ── Subscription & plan (hydrated from user object + usage response) ──────
    plan:               'free',
    isPremium:          false,
    permissions:        [],
    subscriptionEndsAt: null,
    usage: {
      aiQuestionsToday: 0,
      aiQuestionsLimit: 20, // free plan default; null = unlimited (paid plan)
    },
  },
  reducers: {
    setUser(state, { payload }) {
      state.user            = payload.user;
      state.token           = payload.token;
      state.isAuthenticated = true;

      // Hydrate subscription fields from user object
      if (payload.user) {
        state.plan               = payload.user.plan               ?? 'free';
        state.isPremium          = payload.user.isPremium          ?? false;
        state.permissions        = payload.user.permissions        ?? [];
        state.subscriptionEndsAt = payload.user.subscriptionEndsAt ?? null;
      }

      // Hydrate usage if provided (included in getMe and login responses)
      if (payload.usage) {
        state.usage = payload.usage;
      }
    },

    clearUser(state) {
      state.user               = null;
      state.token              = null;
      state.isAuthenticated    = false;
      state.plan               = 'free';
      state.isPremium          = false;
      state.permissions        = [];
      state.subscriptionEndsAt = null;
      state.usage              = { aiQuestionsToday: 0, aiQuestionsLimit: 20 };
    },

    setAuthLoading(state, { payload }) {
      state.authLoading = payload;
    },

    setInitialized(state) {
      state.initialized = true;
    },

    // Update usage counters — call after a successful AI message send
    setUsage(state, { payload }) {
      state.usage = payload;
    },

    // Optimistically increment the daily AI usage counter on the frontend
    incrementAiUsage(state) {
      state.usage = {
        ...state.usage,
        aiQuestionsToday: (state.usage.aiQuestionsToday ?? 0) + 1,
      };
    },
  },
});

export const {
  setUser, clearUser, setAuthLoading, setInitialized,
  setUsage, incrementAiUsage,
} = authSlice.actions;

export const selectUser               = (state) => state.auth.user;
export const selectToken              = (state) => state.auth.token;
export const selectIsAuthenticated    = (state) => state.auth.isAuthenticated;
export const selectAuthLoading        = (state) => state.auth.authLoading;
export const selectAuthInitialized    = (state) => state.auth.initialized;
export const selectPlan               = (state) => state.auth.plan;
export const selectIsPremium          = (state) => state.auth.isPremium;
export const selectPermissions        = (state) => state.auth.permissions;
export const selectSubscriptionEndsAt = (state) => state.auth.subscriptionEndsAt;
export const selectUsage              = (state) => state.auth.usage;

export default authSlice.reducer;
