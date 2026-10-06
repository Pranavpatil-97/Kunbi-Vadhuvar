import api from "./axios";

export const listConversations = () => api.get("/messages").then((res) => res.data);
export const getConversation = (userId, page = 1) =>
  api.get(`/messages/${userId}`, { params: { page } }).then((res) => res.data);