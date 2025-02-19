import { useState } from "react";
import axios from "axios"; // ✅ Using axios directly
import { useNavigate } from "react-router-dom";

// ✅ Hardcoded backend URL
const BACKEND_URL = "https://virtualgrow-server.onrender.com";

const Signup = () => {
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
      await axios.post(`${BACKEND_URL}/users/signup`, form);
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="register-area">
      <form className="signup" onSubmit={handleSignup}>
        <h2>Sign up</h2>
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

      {/* Embedded CSS */}
      <style>
        {`
          .register-area {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('/assets/background.jpg'); 
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .signup {
            background: rgba(255, 255, 255, 0.8);
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .form-fields {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .row {
            display: flex;
            flex-direction: column;
            text-align: left;
          }

          .row-checkboxes {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
          }

          .signup-button {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            width: 80%;
          }

          .signup-button:hover {
            background-color: #218838;
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
