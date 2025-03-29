import PocketBase from "pocketbase";

// Create and export a single instance
export const pb = new PocketBase(import.meta.env.VITE_PB_URL);