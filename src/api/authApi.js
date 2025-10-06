import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

// Login user
export const login = async (email, password) => {
  return await axios.post(`${BASE_URL}/token/`, {
    username: email, // Django default uses username
    password,
  });
};

// Register user
export const registerUser = async (userData) => {
  return await axios.post(`${BASE_URL}/users/`, userData);
};
