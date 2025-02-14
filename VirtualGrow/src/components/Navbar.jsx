import { Link, useNavigate } from "react-router-dom";
import "../VirtualGarden.css";
import Logo from "../assets/VirtualGrowLogo.png"
import React from 'react';
import { UseAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, login, accessToken } = UseAuth();
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logoAndName">
      <img src={Logo} alt="Virtual Garden Logo" className="logo" onClick={() => navigate("/")}></img>
      
      </div>
    
       <div className="userLogin">
        {!accessToken ? ( 
          <>
            
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/userprofile">My space</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}
    
      <Link to="/aboutUs">  About Us </Link>

      <Link to="/gardenscapes">  Garden Scape  </Link>

      <Link to="/gardenpicks">  Garden Picks </Link>
      </div>
    </nav>
  );
};

export default Navbar;
