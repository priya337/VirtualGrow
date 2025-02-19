import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UseAuth } from "../context/authcontext.jsx"; 
import ClipLoader from "react-spinners/ClipLoader"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword } = UseAuth(); 

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const response = await resetPassword(token, newPassword);
    setMessage(response.message);
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
      <div style={{
        background: "rgba(255, 255, 255, 0.9)", // Light white overlay
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        width: "350px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>Reset Password</h2>
        <p style={{ fontSize: "14px", color: "#4A5568" }}>Enter a new password for your account.</p>

        <form onSubmit={handleResetPassword} style={{ marginTop: "15px" }}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #CBD5E0",
              outline: "none",
              marginBottom: "10px"
            }}
          />
          <button 
            type="submit" 
            style={{
              width: "100%",
              background: "#38A169",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Reset Password"}
          </button>
        </form>

        {message && <p style={{ color: "#2F855A", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
