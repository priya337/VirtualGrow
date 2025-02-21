import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);

        // 1. Try to read the cookie named "token" from document.cookie
        //    This only works if the cookie is NOT HttpOnly
        const cookieString = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));

        if (!cookieString) {
          console.error("No 'token=' cookie found in document.cookie");
          setMessage("No token cookie found. Please log in.");
          setLoading(false);
          return;
        }

        // cookieString might look like "token=eyJhbGciOiJIUzI1NiIsInR..."
        // We'll attach that directly in the Cookie header:
        const { data } = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          headers: {
            Cookie: cookieString,
          },
          // No need for withCredentials here, since we’re manually setting Cookie
        });

        console.log("✅ Fetched user profile:", data);
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setMessage("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Delete profile (similar approach)
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      const cookieString = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));

      if (!cookieString) {
        setMessage("No token cookie found. Please log in.");
        setLoading(false);
        return;
      }

      await axios.delete(`${BACKEND_URL}/api/users/delete`, {
        headers: {
          Cookie: cookieString,
        },
      });

      setMessage("User profile deleted successfully!");
      setTimeout(() => navigate("/signup"), 2000);
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      setMessage("Error deleting profile.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (!user) {
    return <p style={{ color: "red" }}>{message || "No user data available."}</p>;
  }

  return (
    <div>
      {/* Your existing UI */}
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      {/* ... etc ... */}

      <button onClick={() => setShowDeleteModal(true)} disabled={loading}>
        {loading ? <ClipLoader size={20} color="white" /> : "Delete My Profile"}
      </button>

      {showDeleteModal && (
        <div>
          <h3>Confirm Deletion</h3>
          <button onClick={handleDeleteProfile} disabled={loading}>
            {loading ? <ClipLoader size={20} color="white" /> : "Confirm"}
          </button>
        </div>
      )}
    </div>
  );
};

// Basic styling
const styles = {
  container: {
    background: "url('/images/nature.jpg') no-repeat center center",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.9)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "10px",
    border: "3px solid #2F855A",
    marginBottom: "10px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  deleteButton: {
    width: "100%",
    background: "#E53E3E",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "20px",
    transition: "background 0.3s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  },
  cancelButton: {
    background: "#CBD5E0",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  confirmButton: {
    background: "#E53E3E",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
};

export default Dashboard;
