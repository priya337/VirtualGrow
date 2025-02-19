import { Link, useNavigate, useLocation } from "react-router-dom";
import "../VirtualGarden.css"; // Keep external styles intact
import Logo from "../assets/VirtualGrowLogo.png";
import React, { useState } from 'react';
import { UseAuth } from "../context/authcontext.jsx";
import { FaUserCircle } from "react-icons/fa"; // Import the face icon

const Navbar = () => {
  const { user, logout, accessToken } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check if on login or signup page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const isAboutUs = location.pathname === "/aboutUs";

  return (
    <nav className="navbar">
      <div className="logoAndName">
        <img 
          src={Logo} 
          alt="Virtual Garden Logo" 
          className="logo" 
          onClick={() => navigate("/")}
        />
      </div>
      
      <div className="userLogin">
        {isAuthPage ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/aboutUs">About Us</Link>
          </>
        ) : isAboutUs && !accessToken ? (
          <>
            <Link to="/">Home</Link>
            <div className="profile-dropdown">
              <FaUserCircle 
                size={28} 
                className="profile-icon" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
                </div>
              )}
            </div>
          </>
        ) : accessToken ? (
          <>
            {isAboutUs ? (
              <>
                <Link to="/gardenscapes">Gardenscapes</Link>
                <Link to="/gardenpicks">Gardenpicks</Link>
              </>
            ) : (
              <>
                <Link to="/gardenscapes">Gardenscapes</Link>
                <Link to="/gardenpicks">Gardenpicks</Link>
                <Link to="/aboutUs">About Us</Link>
              </>
            )}
            <div className="profile-dropdown">
              <FaUserCircle 
                size={28} 
                className="profile-icon" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/userprofile">User Profile</Link>
                  <Link to="/logout" onClick={logout}>Logout</Link>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/aboutUs">About Us</Link>
            <div className="profile-dropdown">
              <FaUserCircle 
                size={28} 
                className="profile-icon" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Signup</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <style>
        {`
          .profile-dropdown {
            position: relative;
            display: inline-block;
          }
          .dropdown-menu {
            position: absolute;
            right: 0;
            background: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            display: flex;
            flex-direction: column;
          }
          .dropdown-menu a {
            padding: 10px;
            text-decoration: none;
            color: black;
          }
          .dropdown-menu a:hover {
            background: lightgray;
          }
          .profile-icon {
            cursor: pointer;
            margin-left: 10px;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
