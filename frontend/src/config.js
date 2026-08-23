const rawApiUrl = import.meta.env.VITE_API_URL || "https://emung.onrender.com";

const formatApiUrl = (url) => {
  if (!url) return "https://emung.onrender.com";
  let formatted = url.trim().replace(/\/$/, "");
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = `https://${formatted}`;
  }
  return formatted;
};

export const API_URL = formatApiUrl(rawApiUrl);
