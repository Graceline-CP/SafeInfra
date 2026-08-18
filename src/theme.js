// src/theme.js

export const colors = {
  accent: "#2563EB",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  bg: "#F9FAFB",
  card: "#FFFFFF",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
};

// Priority badge color helper — use this everywhere a priority/severity badge shows up
export function priorityColor(level) {
  switch (level) {
    case "Critical": return { bg: "#FEE2E2", text: "#DC2626" };
    case "High": return { bg: "#FFEDD5", text: "#D97706" };
    case "Medium": return { bg: "#FEF3C7", text: "#B45309" };
    case "Low": return { bg: "#D1FAE5", text: "#059669" };
    default: return { bg: "#F3F4F6", text: "#6B7280" };
  }
}