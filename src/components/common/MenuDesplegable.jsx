import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./stilaso.css";

const Desplegable = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [activeOption, setActiveOption] = useState("");
    const location = useLocation();
    const isProductsPage = location.pathname.toLowerCase().startsWith("/products");


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
            .get("https://strategic-detected-childhood-scholarships.trycloudflare.com/backend/actions/getCategories.php")
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

    useEffect(() => {
        const currentPath = location.pathname + location.search;
        setActiveOption(currentPath);
        setDropdownVisible(false);
    }, [location]);

    return (
        <div className="menu-container">
            <a href="#menu" className="menu-icon" onClick={toggleDropdown}>
                ☰
            </a>

            <ul className={`dropdown-menu ${isDropdownVisible ? "show" : ""}`}>
                {isProductsPage && userRole === 4 && (
                <>
                    <li className="admin-option">
                    <Link to="/Products" state={{ purchaseMode: true }}>
                        Realizar compra
                    </Link>
                    </li>
                    <li className="admin-option">
                    <Link to="/Products" state={{ purchaseMode: false }}>
                        Realizar edición
                    </Link>
                    </li>
                </>
                )}
                <li
                className={`mobile-only all-products ${
                    activeOption === "/products" ? "disabled" : ""
                }`}
                >
                <Link to="/products">Todos los Productos</Link>
                </li>
                {categories.length > 0 ? (
                categories.map((category) => {
                    const path = `/products?category=${category.id_categoria}`;
                    return (
                    <li
                        key={category.id_categoria}
                        className={`mobile-only category-item ${
                        activeOption === path ? "disabled" : ""
                        }`}
                    >
                        <Link to={path}>{category.nombre_categoria}</Link>
                    </li>
                    );
                })
                ) : (
                <li className="mobile-only">No hay categorías disponibles</li>
                )}
            </ul>
        </div>
    );
};

export default Desplegable;
