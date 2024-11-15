import React from "react";
import "./styles.css"

const SubNavBar = ({ showBack = false, showCart = false }) => {
    return (
        <nav
            className="navbar is-flex is-justify-content-space-between px-3 navbar-brand-custom"
            style={{ backgroundColor: 'black' }}
        >
            <div className="navbar-item">
                <a>
                    {showBack && (
                        <div role="button">
                            <img
                                src={require("../../assets/images/atras.png")}
                                alt="BackButton"
                                style={{ filter: 'invert(100%)', width: '16px', height: '16px' }}
                            />
                        </div>
                    )}
                </a>
            </div>

            <div className="navbar-item">
                <a>
                    {showCart && (
                        <div role="button">
                            <img
                                src={require("../../assets/images/carrito.png")}
                                alt="CartButton"
                                style={{ filter: 'invert(100%)', width: '16px', height: '16px' }}
                            />
                        </div>
                    )}
                </a>
            </div>
        </nav>
    );
};

export default SubNavBar;

