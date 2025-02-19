import { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext.jsx"; // ✅ Import AuthContext
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!user) {
    navigate("/login"); // ✅ Redirect if not logged in
    return null;
  }

  // ✅ Function to delete user profile
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      await axios.delete(`${BACKEND_URL}/api/users/delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      // ✅ Clear local storage after deletion
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");

      setMessage("User profile deleted successfully!");
      setTimeout(() => navigate("/signup"), 2000); // Redirect to Signup after deletion
    } catch (error) {
      setMessage(error.response?.data?.error || "Error deleting profile.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        background: "url('/images/nature.jpg') no-repeat center center",
        backgroundSize: "cover",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)", // Light overlay
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        {/* ✅ Square User Profile Picture */}
        <img
          src={user.photo ? user.photo : "/images/default-avatar.png"} // ✅ Show user photo or placeholder
          alt="User Avatar"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            border: "3px solid #2F855A",
            marginBottom: "10px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>Welcome, {user.name}!</h2>

        <div style={{ textAlign: "left", marginTop: "15px", fontSize: "16px" }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Age:</strong> {user.age}</p>
          <p><strong>Location:</strong> {user.location || "Not provided"}</p>
          <p>
            <strong>Interested in Exterior Plants:</strong> {user.ExteriorPlants ? "Yes" : "No"}
          </p>
          <p>
            <strong>Interested in Interior Plants:</strong> {user.InteriorPlants ? "Yes" : "No"}
          </p>
        </div>

        {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

        {/* ✅ Delete Profile Button */}
        <button
          onClick={handleDeleteProfile}
          style={{
            width: "100%",
            background: "#E53E3E",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background 0.3s",
          }}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Delete My Profile"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
