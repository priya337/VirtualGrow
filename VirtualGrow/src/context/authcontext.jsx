import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; // ✅ Using axios directly

export const AuthContext = createContext();
export const UseAuth = () => useContext(AuthContext);

// ✅ Hardcoded Backend URL
const BACKEND_URL = "https://virtualgrow-server.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  console.log("🔍 Local Storage Check:");
  console.log("📌 Access Token:", localStorage.getItem("accessToken"));
  console.log("📌 Refresh Token:", localStorage.getItem("refreshToken"));

  // ✅ Auto-login if token exists
  useEffect(() => {
    console.log("🔍 Checking if user is logged in via cookie...");
    axios
      .get(`${BACKEND_URL}/api/users/profile`, {
        withCredentials: true, // Send cookies
      })
      .then((res) => {
        console.log("✅ Auto-login successful, user profile:", res.data);
        setUser(res.data);
      })
      .catch((error) => {
        console.log(
          "❌ Not logged in or error fetching profile:",
          error.response?.data || error.message
        );
        setUser(null);
      });
  }, []);


 // 🔑 Login Function
 const login = async (email, password) => {
  try {
    // Send login request
    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Login successful:", data);

    // Update user state with data returned from the login response
    setUser(data.user);

    // Store tokens if provided (you may opt to use cookies only)
    if (data.accessToken && data.refreshToken) {
      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log("Tokens stored:", data.accessToken, data.refreshToken);
    } else {
      console.log("Tokens not received from the response");
    }

    // Optionally, fetch a detailed user profile if needed
    await fetchUserProfile();

    return "success";
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return error.response?.data?.error || "error";
  }
};


  // 🆕 🔐 Signup Function
  const signup = async (userData) => {
    try {
      await axios.post(`${BACKEND_URL}/api/users/signup`, userData, { withCredentials: true });
      console.log("✅ Signup successful");
  
      // Fetch and update user profile immediately after signup
      await fetchUserProfile();
  
      return "success";
    } catch (error) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
      return error.response?.data?.error || "error";
    }
  };
  
  

  // 🔄 Refresh Token Function
  const refreshAccessToken = async () => {
    try {
      console.log("🔄 Refreshing access token...");
      const { data } = await axios.post(
        `${BACKEND_URL}/api/users/refresh-token`,
        {}, // No body needed if token is in cookies
        { withCredentials: true }
      );
  
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
  
      console.log("✅ Access token refreshed:", data.accessToken);
    } catch (error) {
      console.error("❌ Token refresh failed:", error.response?.data || error.message);
      logout();
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
        const { data } = await axios.post(`${BACKEND_URL}/api/users/reset-password`, { email, newPassword });

        console.log("✅ Password reset successful:", data.message);
        return { success: true, message: data.message };
    } catch (error) {
        console.error("❌ Password reset failed:", error.response?.data || error.message);
        return { success: false, message: error.response?.data?.error || "Something went wrong!" };
    }
};

const deleteUserProfile = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // This sends the cookies
      body: JSON.stringify({ email: 'user@example.com' })
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }

    console.log('Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
};

const logout = async () => {
  try {
    console.log("🔍 Attempting logout...");
    await axios.post(`${BACKEND_URL}/api/users/logout`, {}, { withCredentials: true });
    setUser(null);
    setAccessToken(null); // Clear token from state
    localStorage.removeItem("accessToken"); // Clear token from local storage
    console.log("✅ Logged out successfully, cookies cleared on server.");
  } catch (error) {
    console.error("❌ Logout failed:", error.response?.data || error.message);
  }
};

const fetchUserProfile = async (name) => {
  try {
    // Ensure you encode the name in case it contains special characters
    const { data } = await axios.get(`${BACKEND_URL}/api/users/profile/${encodeURIComponent(name)}`);
    console.log("✅ User profile fetched:", data);
    setUser(data);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error.response?.data || error.message);
  }
};

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, accessToken, refreshAccessToken, resetPassword, fetchUserProfile  }}>
      {children}
    </AuthContext.Provider>
  );
};
