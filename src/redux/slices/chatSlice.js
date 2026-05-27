import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations:        [],
    messages:             [],
    activeConversationId: null,
  },
  reducers: {
    setConversations(state, { payload }) {
      state.conversations = payload;
    },
    prependConversation(state, { payload }) {
      state.conversations.unshift(payload);
    },
    removeConversation(state, { payload: id }) {
      state.conversations = state.conversations.filter((c) => c._id !== id);
    },
    updateConvTitle(state, { payload: { id, title } }) {
      const conv = state.conversations.find((c) => c._id === id);
      if (conv) conv.title = title;
    },
    updateConvLastMessage(state, { payload: { id, text } }) {
      const conv = state.conversations.find((c) => c._id === id);
      if (conv) conv.lastMessage = text;
    },
    setMessages(state, { payload }) {
      state.messages = payload;
    },
    appendMessage(state, { payload }) {
      state.messages.push(payload);
    },
    removeLastMessage(state) {
      state.messages.pop();
    },
    setActiveConvId(state, { payload }) {
      state.activeConversationId = payload;
    },
    clearChat(state) {
      state.messages             = [];
      state.activeConversationId = null;
    },
  },
});

export const {
  setConversations,
  prependConversation,
  removeConversation,
  updateConvTitle,
  updateConvLastMessage,
  setMessages,
  appendMessage,
  removeLastMessage,
  setActiveConvId,
  clearChat,
} = chatSlice.actions;

export const selectConversations = (state) => state.chat.conversations;
export const selectMessages      = (state) => state.chat.messages;
export const selectActiveConvId  = (state) => state.chat.activeConversationId;

export default chatSlice.reducer;
