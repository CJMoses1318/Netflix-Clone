import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Nav.css";


function Nav() {
    const [show, handleShow] = useState(false);
    const navigate = useNavigate();

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            handleShow(true);
        } else {
            handleShow(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.removeEventListener("scroll", transitionNavBar)
    }, [])
  return (
    
    <div className={`nav ${show && 'nav__black'}`}>
      <div className="nav__contents">
      <img
        onClick={() => navigate("/")}
        className="nav__logo"
        src="https://www.clipartmax.com/png/middle/205-2059157_elegant-colorful-iphone-backgrounds-netflix-logo-netflix-netflix.png"
        alt=""
      />
     
      <img
        onClick={() => navigate("/profile")}
        className="nav__avatar"
        src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
        alt=""
      />
    </div>
    </div>
  );
}

export default Nav;
