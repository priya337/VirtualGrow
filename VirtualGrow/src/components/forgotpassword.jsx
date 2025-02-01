import { useState } from "react";
import API from "../components/api/api"; // ✅ Ensure correct API import

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/users/forgot-password", { email });
      setMessage("✅ Password reset request received! If your email exists, you will receive instructions.");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("❌ User not found.");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
