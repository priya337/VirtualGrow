import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // <-- For "Go Back Home" button
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../context/authcontext"; // ✅ Import your AuthContext

// Helper function to build prompt based on checkboxes
function buildPlantPrompt(ExteriorPlants, InteriorPlants) {
  if (ExteriorPlants && InteriorPlants) {
    return "a combination of lush exterior and interior plants";
  } else if (ExteriorPlants) {
    return "beautiful exterior garden plants";
  } else if (InteriorPlants) {
    return "cozy interior house plants";
  } else {
    return "some random plants";
  }
}

// Helper function to generate Pollinations URL
function getPollinationsUrl(prompt) {
  const descriptors = ["vibrant", "serene", "colorful", "dreamy", "realistic"];
  const randomDescriptor =
    descriptors[Math.floor(Math.random() * descriptors.length)];

  const finalPrompt = `${randomDescriptor} ${prompt}`.trim();
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}`;
}

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  // Local state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form data
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    location: "",
    ExteriorPlants: false,
    InteriorPlants: false,
  });

  // For AI-generated preview
  const [previewUrl, setPreviewUrl] = useState("");

  // Build new preview when checkboxes change
  useEffect(() => {
    const prompt = buildPlantPrompt(form.ExteriorPlants, form.InteriorPlants);
    const url = getPollinationsUrl(prompt);
    setPreviewUrl(url);
  }, [form.ExteriorPlants, form.InteriorPlants]);

  // Handle changes to text/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Password length validation
    if (name === "password" && value.length > 12) {
      setMessage("⚠️ Password cannot exceed 12 characters.");
      return;
    } else {
      setMessage(""); // Clear any previous message
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      const payload = {
        ...form,
        photo: previewUrl,
      };
  
      const result = await signup(payload);
      if (result === "success") {
        // Auto-login step (if necessary) or fetch the profile to update context.
        await fetchUserProfile();
        setMessage("✅ Signed up successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMessage(`❌ Signup failed: ${result}`);
      }
    } catch (error) {
      setMessage("❌ Error signing up.");
    }
    setLoading(false);
  };
  
  

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ color: "#2F855A" }}>Sign Up</h2>
        <form onSubmit={handleSignup}>
          {/* Name Field */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Password Field with max 12 characters */}
          <input
            type="password"
            name="password"
            placeholder="Password (Max 12 characters)"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Location Field */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* Checkboxes + Preview */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "20px" }}>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  name="ExteriorPlants"
                  checked={form.ExteriorPlants}
                  onChange={handleChange}
                />{" "}
                Exterior Plants
              </label>
              <label style={{ display: "block" }}>
                <input
                  type="checkbox"
                  name="InteriorPlants"
                  checked={form.InteriorPlants}
                  onChange={handleChange}
                />{" "}
                Interior Plants
              </label>
            </div>

            {/* AI-generated image preview */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Generated Preview"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Error / Success Message */}
          {message && <p style={{ color: "red" }}>{message}</p>}

          {/* Submit Button */}
          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
        </form>

        {/* Go Back Home Button */}
        <button
          style={{ ...buttonStyle, marginTop: "10px", background: "#3182CE" }}
          onClick={() => navigate("/")}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

// Basic styling
const containerStyle = {
  background: "url('/images/nature.jpg') no-repeat center center",
  backgroundSize: "cover",
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  width: "400px",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #CBD5E0",
  outline: "none",
  marginBottom: "10px",
};

const buttonStyle = {
  width: "100%",
  background: "#38A169",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s",
  marginTop: "10px",
};

export default Signup;
