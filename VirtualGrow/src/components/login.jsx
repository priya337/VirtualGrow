import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/VirtualGarden.css";

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
        navigate("/userprofile"); // ✅ Redirect to User Profile
      } else {
        setError("❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("❌ An error occurred. Please try again later.");
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
        <button type="submit" className="login-button">Login</button>
      </form>
      <button className="signup-button" onClick={() => navigate("/signup")}>New here? Sign up</button>
      <p>
        <a className="reset-password" href="/reset-password">Reset Password</a>
      </p>
    </div>
  );
};

export default Login;
