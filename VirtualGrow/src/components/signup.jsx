import { useState } from "react";
import API from "../components/api/api"; // Ensure correct import path
import { useNavigate } from "react-router-dom";

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
      await API.post("/users/signup", form);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error.response?.data);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} />
      <input type="text" name="photo" placeholder="Photo URL" onChange={handleChange} required />
      
      <label>
        <input type="checkbox" name="ExteriorPlants" onChange={handleChange} />
        Interested in Exterior Plants
      </label>
      <label>
        <input type="checkbox" name="InteriorPlants" onChange={handleChange} />
        Interested in Interior Plants
      </label>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
