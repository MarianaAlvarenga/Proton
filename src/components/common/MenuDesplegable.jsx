import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./stilaso.css";

const Desplegable = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [userRole, setUserRole] = useState(null);

    const toggleDropdown = (e) => {
        e.preventDefault();
        setDropdownVisible(!isDropdownVisible);
    };

    const handleOutsideClick = (e) => {
        if (!e.target.closest(".menu-container")) {
            setDropdownVisible(false);
        }
    };

    useEffect(() => {
        axios
            .get("http://localhost:8080/Proton/backend/actions/getCategories.php")
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
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

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) {
            setUserRole(parseInt(role, 10));
        }
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
                {/* Mostrar estas opciones solo si es ADMINISTRADOR (rol 4) */}
                {userRole === 4 && (
                    <>
                        <li>
                            <Link to="/productscreate">Agregar Producto</Link>
                        </li>
                        <li>
                            <Link to="/Products" state={{ purchaseMode: true }}>Realizar compra</Link>
                        </li>
                        <li>
                            <Link to="/Products" state={{ purchaseMode: false }}>Realizar edición</Link>
                        </li>
                    </>
                )}
                
                <li>
                    <Link to="/products">Todos los Productos</Link>
                </li>

                {/* Lista de categorías de productos */}
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li key={category.id_categoria}>
                            <Link to={`/products?category=${category.id_categoria}`}>
                                {category.nombre_categoria}
                            </Link>
                        </li>
                    ))
                ) : (
                    <li>No hay categorías disponibles</li>
                )}
            </ul>
        </div>
    );
};

export default Desplegable;