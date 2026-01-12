import type { Db } from "./types";

// Zing-themed tag colors
const tags = [
  { id: 0, name: "football-fan", color: "#e0f7ff" },
  { id: 1, name: "holiday-card", color: "#e8e0ff" },
  { id: 2, name: "influencer", color: "#fff0e6" },
  { id: 3, name: "manager", color: "#f0e8ff" },
  { id: 4, name: "musician", color: "#e6fff7" },
  { id: 5, name: "vip", color: "#ffe8f0" },
];

export const generateTags = (_: Db) => {
  return [...tags];
};
