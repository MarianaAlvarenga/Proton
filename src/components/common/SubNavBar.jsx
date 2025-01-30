import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const SubNavBar = ({ showBack = false, showCart = false, links = [], currentPage = "" }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-brand-custom">
      {/* Verificación de 'showBack' para mostrar el botón de 'Back' */}
      {showBack && (
        <div className="navbar-item-back">
          <div role="button" onClick={() => navigate(-1)}>
            <img
              src={require("../../assets/images/atras.png")}  // Asegúrate de que el path sea correcto
              alt="BackButton"
            />
          </div>
        </div>
      )}

      {/* Si hay enlaces, mostrarlos, sino mostrar el texto de la página actual */}
      {links.length > 0 ? (
        <div style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          {links.map((link, index) => (
            <a
              key={index}
              onClick={() => navigate(link.path)}
              className="navbar-link"
              style={{ margin: "0 10px", color: "white", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : (
        <span className="current-page">{currentPage}</span>
      )}

      {/* Verificación de 'showCart' para mostrar el carrito */}
      {showCart && (
        <div className="navbar-item-cart">
          <div role="button" onClick={() => navigate('/Cart')}>
            
            <img
              src={require("../../assets/images/carrito.png")}
              alt="CartButton"
              className="cart"
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubNavBar;
