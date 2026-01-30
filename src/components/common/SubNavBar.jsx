import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const SubNavBar = ({ showBack = false, showCart = false, links = [], currentPage = "" }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar-brand-custom">

      {/* TÍTULO (siempre renderizado) */}
      <span className="current-page">{currentPage}</span>

      {/* LINKS */}
      {links.length > 0 && (
        <div className="subnav-links" style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          {links.map((link, index) => (
            <a
              key={index}
              onClick={(e) => {
                e.preventDefault();
                if (link.onClick) link.onClick();
                else if (link.path) navigate(link.path);
              }}
              className="navbar-link"
              style={{ margin: "0 10px", color: "white", textDecoration: "none" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

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
