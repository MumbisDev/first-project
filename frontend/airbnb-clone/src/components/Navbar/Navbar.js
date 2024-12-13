import React from 'react';
import './navbar.css';
import logo from '../../assests/logo.png'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Airbnb</h1>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search for homes, experiences, etc..." />
      </div>
      <div className="user-menu">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;