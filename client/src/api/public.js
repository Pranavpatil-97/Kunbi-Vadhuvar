import axios from "axios";

// Plain axios (not the authenticated `api` instance) — no token needed here
const publicApi = axios.create({ baseURL: "http://localhost:5000/api" });

export const getPublicProfiles = () =>
  publicApi.get("/public/profiles").then((res) => res.data);