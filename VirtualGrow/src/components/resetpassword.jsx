import { useState } from "react";
import { UseAuth } from "../context/authcontext.jsx"; // ✅ Import AuthContext

const ResetPassword = () => {
  const { resetPassword } = UseAuth(); // ✅ Use resetPassword function from AuthContext
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await resetPassword(email, newPassword);
      setMessage("✅ Password updated successfully! You can now log in.");
    } catch (err) {
      if (err === "invalid_request") {
        setError("❌ Invalid or expired reset request.");
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;
