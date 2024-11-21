import React from "react";
import "./styles.css"
import { useNavigate } from "react-router-dom";  // Importa useNavigate


const SubNavBar = ({ showBack = false, showCart = false, currentPage='Cargando...' }) => {
    
    const navigate = useNavigate();  // Inicializa el hook de navegación
    
    const backForward = () => {
        const userRole = localStorage.getItem('userRole'); // Obtén el rol desde localStorage
      
        // Verifica si el rol es administrador (rol nro 4)
        if (userRole === "4") {
          navigate("/menuadmin"); // Si es administrador, redirige a /menuadmin.jsx
        } else {
          navigate("/menuclient"); // Si no es administrador, redirige a /menuclient.jsx
        }
      };

    return (
        <nav
            className="navbar is-flex is-justify-content-space-between px-3 navbar-brand-custom"
            style={{ backgroundColor: 'black' }}
        >
            <div className="navbar-item">
                <a>
                    {showBack && (
                        <div role="button" onClick={backForward}>
                            <img
                                src={require("../../assets/images/atras.png")}
                                alt="BackButton"
                                style={{ filter: 'invert(100%)', width: '16px', height: '16px' }}
                            />
                        </div>
                    )}
                </a>
            </div>
            <h1 style={{justifySelf:'center', alignSelf:'center', color:'white'}}>{currentPage}</h1>
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

