import React from "react";

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

          {/* Esto es necesario para que el menú móvil funcione */}
          {showMenu && (
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            style={{color:'white', backgroundColor:'#9655C5'}}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            
          </a>
              )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;

