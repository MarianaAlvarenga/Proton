import React, { useState, useEffect } from "react";
import MenuDesplegable from "./MenuDesplegable.jsx";
import './NavBar.css';
import LogOut from "./LogOut.jsx";
import ProfileButton from "./profileButton.jsx";
import HomeButton from "./HomeButton.jsx";

const NavBar = ({ showMenu = false, showSearch = false, onSearch, showProfileButton = true, showHomeButton = true }) => {
  const [searchText, setSearchText] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(parseInt(role, 10));
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  // No mostrar el menú si el rol es 3 (Peluquero)
  const shouldShowMenu = showMenu && userRole !== 3;

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation" style={{ backgroundColor: '#9655C5' }}>
      <div className="navbar-brand">
        {showHomeButton && <HomeButton/>}
        {showProfileButton && <ProfileButton/>}
        {showSearch && (
          <div className="navbar-item search-container">
            <a className="search-icon">
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
        {shouldShowMenu && <MenuDesplegable />}
      </div>
    </nav>
  );
};

export default NavBar;