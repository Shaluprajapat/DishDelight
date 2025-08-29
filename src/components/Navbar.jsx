import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ toggleDarkMode, darkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DishDelight</Link>
      </div>

      <div className="navbar-items">
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        <button className="darkmode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
