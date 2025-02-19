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
    if (accessToken) {
      const storedEmail = localStorage.getItem("userEmail");
      if (!storedEmail) {
        console.warn("⚠️ No email stored in localStorage. Cannot fetch profile.");
        return;
      }

      console.log(`✅ Fetching user profile for: ${storedEmail}`);
      axios.get(`${BACKEND_URL}/api/users/profile/${storedEmail}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => {
          console.log("✅ User profile fetched successfully:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.error("❌ Error fetching user profile:", error.response?.data || error.message);
          logout();
        });
    }
  }, [accessToken]);


 // 🔑 Login Function
 const login = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      { email, password },
      { withCredentials: true } // ✅ Ensure cookies are sent
    );

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userEmail", email);

    setAccessToken(data.accessToken);
    setUser(data.user);

    console.log("✅ Login successful. Tokens stored.");
    return "success";
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    return error.response?.data?.error || "error";
  }
};


  // 🆕 🔐 Signup Function
  const signup = async (userData) => {
    try {
      await axios.post(`${BACKEND_URL}/api/users/signup`, userData);
      console.log("✅ Signup successful");
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
    const response = await fetch('/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      // Remove credentials: 'include' if you're not using cookies
      body: JSON.stringify({ email: 'user@example.com' }) 
    });

    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }

    // You can still log the user out or redirect after deletion
    // logout();
    console.log('Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
  }
};


  
  // 🆕 🔓 Logout Function (Updated to Call Backend)
  const logout = async () => {
    try {
      console.log("🔍 Checking Refresh Token Before Logout:", localStorage.getItem("refreshToken"));
      
      await axios.post(`${BACKEND_URL}/api/users/logout`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      });
  
      console.log("🚪 Logging out. Clearing tokens...");
  
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      setUser(null);
      setAccessToken(null);
  
      console.log("✅ Tokens removed, user logged out.");
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error.message);
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, accessToken, refreshAccessToken, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
