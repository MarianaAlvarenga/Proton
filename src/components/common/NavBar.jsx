import React, { useState } from "react";
import MenuDesplegable from "./MenuDesplegable.jsx";
import './NavBar.css';
import LogOut from "./LogOut.jsx";


const NavBar = ({ showMenu = false, showSearch = false, onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation" style={{ backgroundColor: '#9655C5' }}>
      <div className="navbar-brand">
        {showSearch && (
          <div className="navbar-item">
            <a>
              <img
                src={require("../../assets/images/SearchIcon.png")}
                alt="SearchButton"
                style={{ fill: 'white', color: 'white' }}
              />
            </a>
            <input
              type="text"
              className="input-text"
              placeholder="Buscar..."
              value={searchText}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      <div className="navbar-end">
        <LogOut/>
        {showMenu && <MenuDesplegable />}
      </div>
    </nav>
  );
};

export default NavBar;
