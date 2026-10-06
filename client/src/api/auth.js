import api from "./axios";

export const registerWithEmail = (email, password) =>
  api.post("/auth/register", { email, password }).then((res) => res.data);

export const loginWithEmail = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const requestOtp = (phone) =>
  api.post("/auth/otp/request", { phone }).then((res) => res.data);

export const verifyOtp = (phone, code) =>
  api.post("/auth/otp/verify", { phone, code }).then((res) => res.data);

export const getMe = () => api.get("/auth/me").then((res) => res.data);