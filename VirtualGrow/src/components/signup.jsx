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
   <div className="register-area">
     <form className="signup" onSubmit={handleSignup}>
      <h2>Sign up</h2>
      <div className="form-fields">
        <div className="row">
          <div className="col-label">
            <label htmlFor="name">Name </label>
          </div>
          
           <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            onChange={handleChange} 
            required 
            id="field"
           />
         
        </div>
        <div className="row">
         <div className="col-label">
            <label htmlFor="email">Email </label>
          </div>
          
           <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            id="field"
           />
         
        </div>
        <div className="row">
         <div className="col-label">
            <label htmlFor="password">Password </label>
         </div>
         
           <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            id="field"
           />
        
       </div>
       <div className="row">
        <div className="col-label">
          <label htmlFor="age">Age </label>
        </div>
       
         <input 
           type="number" 
           name="age" 
           placeholder="Age" 
           onChange={handleChange} 
           required 
           id="field"
          />
      
       </div>
       <div className="row">
        <div className="col-label">
         <label htmlFor="location">Location </label>
        </div>
        
         <input 
           type="text" 
           name="location" 
           placeholder="Location" 
           onChange={handleChange} 
           id="field"
          />
        
       </div>
       <div className="row">
        <div className="col-label">
         <label htmlFor="photo">Photo-Url </label>
        </div>
        
         <input 
           type="text" 
           name="photo" 
           placeholder="Photo URL" 
           onChange={handleChange} 
           required 
           id="field"
          />
        
       </div>
       <div className="row-checkboxes">
        <div className="col-label">
         <label>
          <input 
            className="interested"
            type="checkbox" 
            name="ExteriorPlants" 
            onChange={handleChange} 
            />
            Interested in Exterior Plants
          </label>
         </div>
  
        <div className="col-label">
        <label>
         <input 
           className="interested"
           type="checkbox" 
           name="InteriorPlants" 
          onChange={handleChange} 
         />
         Interested in Interior Plants
        </label>
        </div>
       </div>

       <button type="submit">Sign Up</button>
      
      </div>
     </form>
    </div>
  );
};

export default Signup;
