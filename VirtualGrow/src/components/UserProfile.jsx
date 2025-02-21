import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { UseAuth } from "../context/authcontext.jsx"; // <--- Import the same hook

const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  // Grab accessToken (and maybe user, if you store it in context) from your AuthContext
  const { accessToken, user: contextUser, logout } = UseAuth();

  // Local state if you want to store the user separately
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) {
        // If there's no token in context, user is not logged in
        setMessage("No access token found. Please log in.");
        return;
      }

      try {
        setLoading(true);

        // Attach token in Authorization header (Bearer pattern)
        const { data } = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("✅ Fetched user profile:", data);
        setUser(data);
        setMessage("");
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setMessage("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  // If user is still null, or no token, show something
  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (!user) {
    return <p style={{ color: "red" }}>{message || "No user data available."}</p>;
  }

  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        setMessage("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      await axios.delete(`${BACKEND_URL}/api/users/delete`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage("User profile deleted successfully!");
      // Maybe call logout() to clear context
      setTimeout(() => {
        logout();
        navigate("/signup");
      }, 2000);
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      setMessage("Error deleting profile.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      {/* Profile UI */}
      <h2>Welcome, {user.name}!</h2>
      <p>Email: {user.email}</p>
      {/* etc... */}

      <button onClick={() => setShowDeleteModal(true)}>
        {loading ? <ClipLoader size={20} color="white" /> : "Delete My Profile"}
      </button>

      {showDeleteModal && (
        <div>
          <p>Are you sure you want to delete your profile?</p>
          <button onClick={handleDeleteProfile}>Confirm</button>
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
