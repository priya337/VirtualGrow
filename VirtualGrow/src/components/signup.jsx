import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext.jsx"; // ✅ Import AuthContext
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader"; 

const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "", // ✅ Default to empty so user can type
    location: "",
    photo: "",
    ExteriorPlants: false,
    InteriorPlants: false,
  });

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Handle Photo Upload (Optional)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/users/upload-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ ...form, photo: data.photoPath }); // ✅ Save path to MongoDB
      setMessage("✅ Photo uploaded successfully (optional).");
    } catch (error) {
      setMessage("❌ Error uploading photo. Please try again.");
    }
    setLoading(false);
  };

  // ✅ Handle Signup Submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userAge = parseInt(form.age, 10);
    if (isNaN(userAge) || userAge < 18) {
      setMessage("⚠️ Age must be 18 or above.");
      setLoading(false);
      return;
    }

    try {
      const result = await signup(form);
      if (result === "success") {
        navigate("/login");
      } else {
        setMessage("❌ Signup failed. Try again.");
      }
    } catch (error) {
      setMessage("❌ Error signing up.");
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
        <h2 style={{ color: "#2F855A", fontSize: "22px" }}>Sign Up</h2>

        <form onSubmit={handleSignup} style={{ marginTop: "15px" }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* ✅ Fixed: Age field now allows entry and validation happens on form submission */}
          {/* <input
            type="number"
            name="age"
            placeholder="Age (18+ only)"
            value={form.age}
            onChange={handleChange}
            required
            min="18" // ✅ Ensures value is 18 or more
            max="100" // ✅ Sets an upper limit
            style={inputStyle}
          /> */}

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* ✅ File Upload for Profile Photo (Optional) */}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ marginBottom: "10px" }}
          />
          <p style={{ fontSize: "12px", color: "#4A5568", marginTop: "-8px", marginBottom: "10px" }}>
            (Optional)
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <label style={checkboxStyle}>
              <input type="checkbox" name="ExteriorPlants" onChange={handleChange} /> Interested in Exterior Plants
            </label>
            <label style={checkboxStyle}>
              <input type="checkbox" name="InteriorPlants" onChange={handleChange} /> Interested in Interior Plants
            </label>
          </div>

          {message && <p style={{ color: "red", marginBottom: "10px" }}>{message}</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? <ClipLoader size={20} color="white" /> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ Reusable Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #CBD5E0",
  outline: "none",
  marginBottom: "10px",
};

const checkboxStyle = {
  fontSize: "14px",
  marginBottom: "5px",
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
};

export default Signup;
