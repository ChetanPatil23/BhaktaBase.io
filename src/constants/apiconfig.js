export const API_BASE_URL = "http://localhost:3000";

export const COMMON_HEADERS = {
  "ngrok-skip-browser-warning": "69420",
};

export const fetchFromApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...COMMON_HEADERS, ...options.headers };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};