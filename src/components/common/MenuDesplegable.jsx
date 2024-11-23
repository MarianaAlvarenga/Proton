import React, { useState, useEffect } from "react";
import "./stilaso.css"; // Incluye tu archivo CSS

const Desplegable = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    // Función para alternar la visibilidad del menú
    const toggleDropdown = (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado
        setDropdownVisible(!isDropdownVisible);
    };

    // Cierra el menú si se hace clic fuera de él
    const handleOutsideClick = (e) => {
        if (!e.target.closest(".menu-container")) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className="menu-container">
            <a
                href="#menu"
                className="menu-icon"
                onClick={toggleDropdown}
            >
                ☰
            </a>
            <ul className={`dropdown-menu ${isDropdownVisible ? "show" : ""}`}>
                <li>
                    <a href="#Perfil">Perfil</a>
                </li>
                <li>
                    <a href="#Peluqueria">Peluquería</a>
                </li>
                <li>
                    <a href="#Productos">Productos</a>
                </li>
                <li>
                    <a href="#Cerrar">Cerrar Sesión</a>
                </li>
            </ul>
        </div>
    );
};

export default Desplegable;
