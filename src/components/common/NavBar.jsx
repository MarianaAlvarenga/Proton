import React from "react";
import MenuDesplegable from "C:/xampp/htdocs/Proton/src/components/common/MenuDesplegable"
const NavBar = ({ showMenu = false, showSearch = false }) => {
  return (
    <>
      <nav className="navbar" role="navigation" aria-label="main navigation" style={{backgroundColor:'#9655C5'}}>
        <div className="navbar-brand">
          {/* Sección de búsqueda a la izquierda */}
          {showSearch && (
            <div className="navbar-item">
              <a>
                <img
                  src={require("../../assets/images/SearchIcon.png")}
                  alt="SearchButton"
                  style={{ fill: 'white', color:'white'}}
                />
              </a>
            </div>
          )}
          <div className="navbar-end">
          <div className="navbar-item">
            <MenuDesplegable/>
          </div>
        </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

