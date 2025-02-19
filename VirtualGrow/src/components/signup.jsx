import { useState, useContext } from "react";
import { AuthContext } from "../context/authcontext.jsx"; // ✅ Using AuthContext
import { useNavigate } from "react-router-dom";
import "./src/VirtualGarden.css"; // ✅ Import global CSS

const Signup = () => {
  const { signup } = useContext(AuthContext); // ✅ Using signup function from AuthContext
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    location: "",
    photo: "",
    ExteriorPlants: false,
    InteriorPlants: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(form); 
      if (result === "success") {
        navigate("/login");
      } else {
        console.error("❌ Signup failed:", result);
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2 className="signup-title">Sign Up</h2>
        <div className="form-fields">
          <div className="row">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          </div>
          <div className="row">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>
          <div className="row">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <div className="row">
            <label htmlFor="age">Age</label>
            <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
          </div>
          <div className="row">
            <label htmlFor="location">Location</label>
            <input type="text" name="location" placeholder="Location" onChange={handleChange} />
          </div>
          <div className="row">
            <label htmlFor="photo">Photo URL</label>
            <input type="text" name="photo" placeholder="Photo URL" onChange={handleChange} required />
          </div>
          <div className="row-checkboxes">
            <label>
              <input type="checkbox" name="ExteriorPlants" onChange={handleChange} />
              Interested in Exterior Plants
            </label>
            <label>
              <input type="checkbox" name="InteriorPlants" onChange={handleChange} />
              Interested in Interior Plants
            </label>
          </div>
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
