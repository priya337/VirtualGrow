import { Link } from "react-router-dom";
import "../VirtualGarden.css";
import React from 'react';
import { useAuth } from "../context/authcontext";

const Navbar = () => {
  const { user, logout, login, accessToken } = useAuth();
  return (
    <nav className="navbar">
      <div className="logoAndName">
      <img src="" alt="Virtual Garden Logo" className="logo"></img>
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
    
      </div>
      <div className="MoreLinks">
      <Link to="/aboutUs">  About Us </Link>

      <Link to="/gardenscape">  Garden Scape  </Link>

      <Link to="/gardenpicks">  Garden Picks </Link>
      </div>
    </nav>
  );
};

export default Navbar;
