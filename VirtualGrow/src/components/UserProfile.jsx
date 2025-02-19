import { useContext, useState } from "react";
import { AuthContext } from "../context/authcontext.jsx";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Dashboard = () => {
  const { user, deleteUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  // Function to delete user profile using the call in AuthContext
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      await deleteUserProfile();
      setMessage("User profile deleted successfully!");
      // Since the deleteUserProfile function calls logout(),
      // you might already be logged out.
      // Redirect to Signup page after a short delay.
      setTimeout(() => navigate("/signup"), 2000);
    } catch (error) {
      setMessage("Error deleting profile.");
    }
    setLoading(false);
    setShowDeleteModal(false);
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
          background: "rgba(255, 255, 255, 0.9)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        {/* Profile Image Placeholder */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "10px",
            border: "3px solid #2F855A",
            background: user.photo
              ? `url(${user.photo}) no-repeat center center / cover`
              : "url('/images/basket.jpg') no-repeat center center / cover",
            marginBottom: "10px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
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

        {message && (
          <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
        )}

        {/* Delete Profile Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
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
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : (
            "Delete My Profile"
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              width: "300px",
            }}
          >
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete your profile? This action cannot
              be undone.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  background: "#CBD5E0",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                style={{
                  background: "#E53E3E",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
