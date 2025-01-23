import React, { useState } from "react";
import MenuDesplegable from "./MenuDesplegable.jsx";
import './NavBar.css';

const NavBar = ({ showMenu = false, showSearch = false, onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (onSearch) {
      onSearch(value); // Envía el valor al componente padre
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
              value={searchText} // Vincula el estado con el campo de búsqueda
              onChange={handleInputChange} // Llama a la función al escribir
            />
          </div>
        )}
      </div>
      <div className="navbar-end">
        {showMenu && <MenuDesplegable />}
      </div>
    </nav>
  );
};

export default NavBar;
