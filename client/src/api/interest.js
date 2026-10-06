import api from "./axios";

export const sendInterest = (receiverId) =>
  api.post("/interests", { receiverId }).then((res) => res.data);

export const respondToInterest = (interestId, action) =>
  api.put(`/interests/${interestId}/respond`, { action }).then((res) => res.data);

export const getReceivedInterests = (status) =>
  api.get("/interests/received", { params: status ? { status } : {} }).then((res) => res.data);

export const getSentInterests = (status) =>
  api.get("/interests/sent", { params: status ? { status } : {} }).then((res) => res.data);

export const getMatches = () => api.get("/interests/matches").then((res) => res.data);