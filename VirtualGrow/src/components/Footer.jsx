import React from "react";
import Logo from "../assets/logo-github.png"
import "../VirtualGarden.css";
import { Link } from "react-router-dom"

const Footer =() => {
    return (
        <div className= "footer">
        <Link to="https://github.com/priya337/VirtualGrow">
        <img src={Logo} alt="GitHub Logo" className="git-logo"></img>
        </Link>

        </div>
    )
}
export default Footer;               