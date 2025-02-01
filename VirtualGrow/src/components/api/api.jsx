import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api", // Update this based on your backend URL
});

// 🔹 Create User Profile (Signup)
export const signupUser = async (userData) => {
  return API.post("/signup", userData);
};

// 🔹 Fetch User Profile by Email
export const getUserProfile = async (email) => {
  return API.get(`/profile/${email}`);
};

// 🔹 Delete User Profile by Email
export const deleteUserProfile = async (email) => {
  return API.delete(`/delete-profile/${email}`);
};

export default API;
