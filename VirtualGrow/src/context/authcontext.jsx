import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; // Replacing API with axios

export const AuthContext = createContext();
export const UseAuth = () => useContext(AuthContext);

// Hardcoded Backend URL
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
      axios.get(`${BACKEND_URL}/users/profile/${storedEmail}`, {
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
      const { data } = await axios.post(`${BACKEND_URL}/users/login`, { email, password });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userEmail", email);

      setAccessToken(data.accessToken);
      setUser(data.user);

      console.log("✅ Login successful");
      return "success";
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("❌ User not found");
        return "user_not_found";
      } else if (error.response?.status === 403) {
        console.error("⚠️ Invalid credentials");
        return "invalid_credentials";
      } else {
        console.error("❌ Login failed:", error.response?.data || error.message);
        return "error";
      }
    }
  };

  // 🔄 Refresh Token Function
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("⚠️ No refresh token found. Logging out.");
      return logout();
    }

    try {
      console.log("🔄 Refreshing access token...");
      const { data } = await axios.post(`${BACKEND_URL}/users/refresh-token`, { refreshToken });

      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);

      console.log("✅ Access token refreshed:", data.accessToken);
    } catch (error) {
      console.error("❌ Token refresh failed:", error.response?.data || error.message);
      logout();
    }
  };

  // 🔓 Logout Function
  const logout = () => {
    console.log("🚪 Logging out. Clearing tokens...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    setUser(null);
    setAccessToken(null);
    console.log("✅ Tokens removed, user logged out.");
  };

  useEffect(() => {
    if (accessToken) {
      const storedEmail = localStorage.getItem("userEmail");
      if (!storedEmail) {
        console.warn("⚠️ No email stored in localStorage. Cannot fetch profile.");
        return;
      }

      axios.get(`${BACKEND_URL}/users/profile/${storedEmail}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => {
          console.log("✅ User profile fetched successfully:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            console.error("❌ User not found. Please sign up first.");
          } else if (error.response?.status === 403) {
            console.error("❌ Unauthorized access. Logging out.");
            logout();
          } else {
            console.error("❌ Error fetching user profile:", error.response?.data || error.message);
          }
        });
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout, accessToken, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
s