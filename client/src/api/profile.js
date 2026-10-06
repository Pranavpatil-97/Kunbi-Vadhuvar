import api from "./axios";

export const createProfile = (data) => api.post("/profiles", data).then((res) => res.data);
export const getMyProfile = () => api.get("/profiles/me").then((res) => res.data);
export const updateMyProfile = (data) => api.put("/profiles/me", data).then((res) => res.data);
export const getProfileById = (id) => api.get(`/profiles/${id}`).then((res) => res.data);
export const searchProfiles = (params) =>
  api.get("/profiles", { params }).then((res) => res.data);