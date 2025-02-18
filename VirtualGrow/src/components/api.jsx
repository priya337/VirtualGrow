import axios from "axios";

// Ensure the environment variable is properly checked
const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5007";

const API_URL = axios.create({
  baseURL: "https://virtualgrow-server.onrender.com" // Use the environment variable or default localhost
});

// 🔹 Create User Profile (Signup)
export const signupUser = async (userData) => {
  return API_URL.post("/signup", userData);
};

// 🔹 Fetch User Profile by Email
export const getUserProfile = async (email) => {
  return API_URL.get(`/profile/${email}`);
};

// 🔹 Delete User Profile by Email
export const deleteUserProfile = async (email) => {
  return API_URL.delete(`/delete-profile/${email}`);
};

// Export the API instance correctly
export default API_URL;
