import { Link, useNavigate, useLocation } from "react-router-dom";
import "../VirtualGarden.css"; // Keep external styles intact
import Logo from "../assets/VirtualGrowLogo.png";
import React from 'react';
import { UseAuth } from "../context/authcontext.jsx";
import { FaUserCircle } from "react-icons/fa"; // Import the face icon

const Navbar = () => {
  const { user, logout, login, accessToken } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current path

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
        {!accessToken ? ( 
          <>
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/userprofile">My Space</Link>
            <Link to="/logout" onClick={logout}>Logout</Link>
          </>
        )}

        <Link to="/aboutUs">About Us</Link>

        {/* Restrict these pages to logged-in users */}
        {accessToken && (
          <>
            <Link to="/gardenscapes">Garden Scape</Link>
            <Link to="/gardenpicks">Garden Picks</Link>
          </>
        )}

        {/* Show user face icon on the home page when logged in */}
        {location.pathname === "/" && accessToken && (
          <Link to="/userprofile" className="profile-icon">
            <FaUserCircle size={28} />
          </Link>
        )}
      </div>

      {/* Embedded CSS to only handle profile icon */}
      <style>
        {`
          .profile-icon {
            color: black;
            margin-left: 10px;
            transition: color 0.3s ease;
          }

          .profile-icon:hover {
            color: gray;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
