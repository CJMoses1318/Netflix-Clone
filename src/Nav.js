import React, { useState, useEffect } from "react";
import "./Nav.css";

function Nav() {
    const [show, handleShow] = useState(false);

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            handleShow(true);
        } else {
            handleShow(false)
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.removeEventListener("scroll", transitionNavBar)
    }, [])
  return (
    
    <div className={`nav ${show && 'nav__black'}`}>
      <div className="nav__contents">
      <img
        className="nav__logo"
        src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png"
        alt=""
      />
     
      <img
        className="nav__avatar"
        src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
        alt=""
      />
    </div>
    </div>
  );
}

export default Nav;
