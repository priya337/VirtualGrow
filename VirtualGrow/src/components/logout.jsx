import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext.jsx"; // ✅ Import AuthContext
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; 

const Logout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  // ✅ Redirect to login after logout
  useEffect(() => {
    if (!user && loggedOut) {
      navigate("/login");
    }
  }, [user, navigate, loggedOut]);

  const handleLogout = async () => {
    setLoading(true); // ✅ Show spinner while logging out
    await logout();
    setLoading(false);
    setLoggedOut(true);
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
        {/* ✅ Goodbye Message */}
        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>
          You have successfully logged out! 🌿
        </h2>
        <p style={{ fontSize: "14px", color: "#4A5568", marginBottom: "15px" }}>
          Thank you for visiting! We look forward to seeing you again soon. 🍃
        </p>

        {/* ✅ Button to LoginPage */}
        <button
          onClick={() => window.location.href = "https://virtual-grow.netlify.app/login"}
          style={{
            width: "100%",
            background: "#38A169",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Logout;
