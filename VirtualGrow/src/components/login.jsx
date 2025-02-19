import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext.jsx"; // ✅ Ensure correct casing
import { useNavigate } from "react-router-dom";
// import "./src/VirtualGarden.css"; // ✅ Import global CSS

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const result = await login(form.email, form.password);
      if (result === "success") {
        navigate("/userprofile"); 
      } else if (result === "user_not_found") {
        setError("❌ User not found. Please sign up.");
      } else if (result === "invalid_credentials") {
        setError("⚠️ Invalid email or password. Please try again.");
      } else {
        setError("❌ Something went wrong. Please try again later.");
      }
    } catch (err) {
      setError("❌ An unexpected error occurred. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="error-message">{error}</p>} 
        <button className="login-button" type="submit">Login</button>
        <button className="signup-button" type="button" onClick={() => navigate("/signup")}>New here? Sign up</button>
      </form>

      <div className="forgot-password-links">
        <p>
          <a className="reset-password" href="/reset-password">
            Reset Password
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
