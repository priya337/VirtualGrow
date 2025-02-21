import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext.jsx";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; 

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form.email, form.password);
      if (result === "success") {
        navigate("/profile");
      } else {
        setError("❌ Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("❌ An error occurred. Please try again later.");
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
      <div style={{
        background: "rgba(255, 255, 255, 0.9)",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        width: "350px",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>Login</h2>

        <form onSubmit={handleLogin} style={{ marginTop: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

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
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>
        </form>

        {/* ✅ Signup Option */}
        <button 
          onClick={() => navigate("/signup")} 
          style={{
            marginTop: "10px",
            background: "none",
            color: "#2F855A",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          New here? <span style={{ textDecoration: "underline" }}>Sign up</span>
        </button>

        {/* ✅ Reset Password Option */}
        <p style={{ marginTop: "10px" }}>
          <a 
            href="/reset-password" 
            style={{
              color: "#3182CE",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            Reset Password
          </a>
        </p>

        {/* ✅ Back to Home Page Button */}
        <button 
          onClick={() => navigate("/")} 
          style={{
            marginTop: "15px",
            background: "#E53E3E",
            color: "white",
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s"
          }}
        >
          Back to Home Page
        </button>

      </div>
    </div>
  );
};

export default Login;
