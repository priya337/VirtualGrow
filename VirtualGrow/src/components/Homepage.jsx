import React from "react";
import "../VirtualGarden.css";
import Logo from "../assets/VirtualGrowLogo-enhance.png"

const Homepage =() => {
    return (
        <div className= "home">

       <h1 className= "slogan">A garden, where everything is possible</h1>  
       <img src={Logo} alt="Virtual Garden Logo" className="homepage-logo"></img>
    </div>
);
};



export default Homepage;