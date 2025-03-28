import PocketBase from "pocketbase";

// Create and export a single instance
export const pb = new PocketBase(import.meta.env.VITE_PB_URL);
pb.beforeSend = function (url, options) {
  options.headers = {
    ...options.headers,
    "ngrok-skip-browser-warning": "1",
  };
  return { url, options };
};