import { Link } from "react-router-dom";
import "../VirtualGarden.css";
import Logo from "../assets/VirtualGrowLogo.png"
import React from 'react';
import { UseAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, login, accessToken } = UseAuth();
  return (
    <nav className="navbar">
      <div className="logoAndName">
      <img src={Logo} alt="Virtual Garden Logo" className="logo"></img>
      <span> Virtual Grow </span>
      </div>
    
       <div className="userLogin">
        {!accessToken ? ( 
          <>
            <Link to="/">Signup</Link>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
      
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}
    
      <Link to="/aboutUs">  About Us </Link>

      <Link to="/gardenscape">  Garden Scape  </Link>

      <Link to="/gardenpicks">  Garden Picks </Link>
      </div>
    </nav>
  );
};

export default Navbar;
