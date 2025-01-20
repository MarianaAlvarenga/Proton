import React, { useState, useEffect } from "react";
import axios from "axios"; // Importamos axios para hacer la solicitud
import { Link } from "react-router-dom"; // Importar Link para navegación
import "./stilaso.css"; // Incluye tu archivo CSS

const Desplegable = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([]); // Estado para las categorías

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

    // Obtener las categorías desde la base de datos
    useEffect(() => {
        // Hacemos la solicitud a getCategories.php
        axios
            .get("http://localhost:8080/Proton/backend/actions/getCategories.php")
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data); // Guardamos las categorías en el estado
                }
            })
            .catch((error) => {
                console.error("Error al obtener las categorías:", error);
            });

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
                {/* Link para la sección de agregar producto */}
                <li>
                    <Link to="/productscreate">Agregar Producto</Link>
                    <Link to="/Products" state={{ purchaseMode: true }}>Realizar compra</Link>
                    <Link to="/Products" state={{ purchaseMode: false }}>Realizar edición</Link>

                    <Link to="/products">Todos los Productos</Link>
                </li>

                {/* Lista de categorías de productos */}
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li key={category.id_categoria}>
                            {/* Actualización para pasar el parámetro de categoría en la URL */}
                            <Link to={`/products?category=${category.id_categoria}`}>
                                {category.nombre_categoria}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>No hay categorías disponibles</li> // Mensaje si no hay categorías
                )}
            </ul>
        </div>
    );
};

export default Desplegable;
