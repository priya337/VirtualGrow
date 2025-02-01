import { createContext, useState, useEffect } from "react";
import API from "../components/api/api"; // ✅ Ensure correct import path

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  console.log("🔍 Local Storage Check:");
  console.log("📌 Access Token:", localStorage.getItem("accessToken"));
  console.log("📌 Refresh Token:", localStorage.getItem("refreshToken"));

  // ✅ Auto-login if token exists
  useEffect(() => {
    if (accessToken) {
      const storedEmail = localStorage.getItem("userEmail"); // ✅ Store email after login
      if (!storedEmail) {
        console.warn("⚠️ No email stored in localStorage. Cannot fetch profile.");
        return;
      }

      console.log(`✅ Fetching user profile for: ${storedEmail}`);
      API.get(`/users/profile/${storedEmail}`, {
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
      const { data } = await API.post("/users/login", { email, password });
  
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userEmail", email);
  
      setAccessToken(data.accessToken);
      setUser(data.user);
  
      console.log("✅ Login successful");
      return "success"; // ✅ Return success
    } catch (error) {
      if (error.response?.status === 404) {
        console.error("❌ User not found");
        return "user_not_found"; // ✅ Return user not found
      } else if (error.response?.status === 403) {
        console.error("⚠️ Invalid credentials");
        return "invalid_credentials"; // ✅ Return invalid credentials
      } else {
        console.error("❌ Login failed:", error.response?.data || error.message);
        return "error"; // ✅ Return generic error
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
      const { data } = await API.post("/users/refresh-token", { refreshToken });

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
    localStorage.removeItem("userEmail"); // ✅ Remove stored email
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
  
      API.get(`/users/profile/${storedEmail}`, {
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
