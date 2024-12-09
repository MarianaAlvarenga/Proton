import React from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const SubNavBar = ({ showBack = false, showCart = false, links = [] }) => {
    const navigate = useNavigate();

    return (
        <nav
            className="navbar is-flex is-justify-content-space-between px-3 navbar-brand-custom"
            style={{ backgroundColor: "black" }}
        >
            {/* Espacio izquierdo para el botón 'Volver' */}
            <div className="navbar-item">
                {showBack && (
                    <div className="navbar-item">
                    <a>
                        {showBack && (
                            <div role="button" onClick={() => navigate(-1)}>
                                <img
                                    src={require("../../assets/images/atras.png")}
                                    alt="BackButton"
                                    style={{ filter: 'invert(100%)', width: '16px', height: '16px' }}
                                />
                            </div>
                        )}
                    </a>
                </div>
                )}
            </div>

            {/* Links de navegación */}
            <div
                className="navbar-item is-flex is-align-items-center"
                style={{
                    gap: "1em", // Espacio reducido entre los links
                }}
            >
                {links.map((link, index) => (
                    <a
                        key={index}
                        onClick={() => navigate(link.path)}
                        className="navbar-link"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Espacio derecho para el carrito */}
            <div className="navbar-item">
                {showCart && (
                    <div role="button">
                        <img
                            src={require("../../assets/images/carrito.png")}
                            alt="CartButton"
                            style={{
                                filter: "invert(100%)",
                                width: "16px",
                                height: "16px",
                            }}
                        />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default SubNavBar;
