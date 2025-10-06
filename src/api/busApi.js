import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const searchRoutes = async (params) => {
  try {
    const res = await axios.get(`${API_URL}/routes/search/`, { params });
    return res.data;
  } catch (err) {
    console.error("Search API error:", err.response?.data || err.message);
    return [];
  }
};
