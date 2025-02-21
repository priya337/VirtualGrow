import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

// Replace with your actual backend URL
const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  // Local state to hold user info (fetched directly)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 1. Fetch the user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Make sure you include { withCredentials: true } if you're using cookies
        const { data } = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          withCredentials: true,
        });
        console.log("✅ Fetched user profile:", data);
        setUser(data); // Store user data in local state
      } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        setMessage("Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // 2. Delete user profile
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      // Make a DELETE request or the appropriate request to delete the profile
      await axios.delete(`${BACKEND_URL}/api/users/delete`, {
        withCredentials: true,
      });
      setMessage("User profile deleted successfully!");
      // After deletion (and logout), redirect to /signup or anywhere else
      setTimeout(() => navigate("/signup"), 2000);
    } catch (error) {
      console.error("❌ Error deleting profile:", error);
      setMessage("Error deleting profile.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // 3. If still loading, or if no user was fetched, show something
  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <p style={{ color: "red" }}>{message || "No user data available."}</p>
      </div>
    );
  }

  // 4. If user data is present, show the profile
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Profile Image Placeholder with user.photo */}
        <div
          style={{
            ...styles.profileImage,
            background: user.photo
              ? `url(${user.photo}) no-repeat center center / cover`
              : "url('/images/basket.jpg') no-repeat center center / cover",
          }}
        ></div>

        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>
          Welcome, {user.name}!
        </h2>

        <div style={{ textAlign: "left", marginTop: "15px", fontSize: "16px" }}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Location:</strong> {user.location || "Not provided"}
          </p>
          <p>
            <strong>Interested in Exterior Plants:</strong>{" "}
            {user.ExteriorPlants ? "Yes" : "No"}
          </p>
          <p>
            <strong>Interested in Interior Plants:</strong>{" "}
            {user.InteriorPlants ? "Yes" : "No"}
          </p>
        </div>

        {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

        {/* Delete Profile Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          style={styles.deleteButton}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Delete My Profile"}
        </button>
      </div>

      {/* Confirmation Modal for Deletion */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete your profile? This cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                style={styles.confirmButton}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Confirm"}
              </button>
            </div>
          </div>
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
