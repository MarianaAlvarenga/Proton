import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Hook para obtener la ubicación actual
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";
import './Products.css';

const Products = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [searchQuery, setSearchQuery] = useState(""); // Texto de búsqueda
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoría seleccionada

  const location = useLocation(); // Obtén la información de la ubicación actual

  // Extraer el parámetro de categoría de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    setSelectedCategory(category || ""); // Actualiza la categoría seleccionada
  }, [location.search]);

  // Obtener productos desde el backend
  useEffect(() => {
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    setIsAdmin(userRole === 4);

    const fetchProducts = async (page, query = "", category = "") => {
      try {
        const response = await fetch(
          `http://localhost:8080/proton/backend/actions/getProducts.php?page=${page}&search=${query}&category=${category}`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts(currentPage, searchQuery, selectedCategory); // Actualiza productos en base a búsqueda, categoría y página
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reinicia la paginación al buscar
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-wrapper">
      <NavBar showMenu showSearch onSearch={handleSearch} />
      <div><SubNavBar showBack currentPage="Productos" /></div>
      <section
        className="section"
        style={{ margin: "0px", padding: "1.5rem 1.5rem" }}
      >
        <div className="container" style={{ margin: "0px" }}>
          {console.log("Productos cargados:", products)}
          {/* Mostrar mensaje si no hay productos */}
          {products.length === 0 ? (
            <div className="no-products-message">
              <h2>Categoría sin productos actualmente</h2>
            </div>
          ) : (
            <>
              <div
                className="columns is-mobile is-multiline"
                style={{ margin: "0px" }}
              >
                {products.map((product) => (
                  <div className="column is-half" key={product.id}>
                    <ProductImage
                      ProductName={product.nombre_producto}
                      ProductPrice={product.precio_producto}
                      ProductImage={product.image_url}
                      ProductId={product.id}
                      ShowAddButton
                      {...(isAdmin
                        ? { ShowModifyButton: true, ShowDeleteButton: true }
                        : { ShowDeleteButton: false })}
                    />
                  </div>
                ))}
              </div>
              <div className="pagination-container">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
