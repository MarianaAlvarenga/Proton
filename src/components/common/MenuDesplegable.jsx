import React, { useState } from "react";
import "./stilaso.css"; // Asegúrate de incluir el archivo CSS

const Desplegable = () => {
    // Estado para controlar si el menú desplegable está visible
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    // Función para alternar la visibilidad del menú
    const toggleDropdown = (e) => {
        e.preventDefault(); // Evita el comportamiento predeterminado del enlace
        setDropdownVisible(!isDropdownVisible);
    };

    // Función para cerrar el menú al hacer clic fuera
    const handleOutsideClick = (e) => {
        if (
            !e.target.closest(".dropdown") // Verifica si el clic no fue dentro del dropdown
        ) {
            setDropdownVisible(false);
        }
    };

    // Agregar el event listener para detectar clics fuera del menú
    React.useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <nav className="navbar">
            <ul className="nav-menu">
                <li className="dropdown">
                    <a
                        href="#productos"
                        className="dropdown-toggle"
                        onClick={toggleDropdown}
                    >
                        ☰
                    </a>
                    <ul className={`dropdown-menu ${isDropdownVisible ? "show" : ""}`}>
                        <li>
                            <a href="#Perfil">Perfil</a>
                        </li>
                        <li>
                            <a href="#Peluqueria">Peluqueria</a>
                        </li>
                        <li>
                            <a href="#Productos">Productos</a>
                        </li>
                        <li>
                            <a href="#Cerrar">Cerrar Sesion</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default Desplegable;
