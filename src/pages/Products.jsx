import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";
import "./Products.css";

const Products = () => {

  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Configurar estado inicial según parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    setSelectedCategory(category || "");
  
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
  
    // Asignar valor por defecto solo si location.state es null
    const purchaseMode = location.state?.purchaseMode ?? false; // Si null o undefined, usa false
    console.log("location.state:", location.state);
    console.log("purchaseMode:", purchaseMode);
    console.log("userRole:", userRole);
  
    if (purchaseMode) {
      setIsAdmin(false);
    } else {
      setIsAdmin(userRole === 4);
    }
  }, [location.search, location.state]);
  

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/proton/backend/actions/getProducts.php?page=${currentPage}&search=${searchQuery}&category=${selectedCategory}`
        );

        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }

        const data = await response.json();
        setProducts(data.products || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory]);

  // Manejo de búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Manejo de paginación
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    
    <div className="page-wrapper">
      <section className="section" style={{ margin: "0px" }}>
            <NavBar showSearch showMenu/>
            <SubNavBar showBack currentPage="Productos"/>
          <div className="container" style={{ margin: "0px" }}>
            <div className="columns is-mobile is-multiline products-container">
              {products.map((product) => (
                <div className="column is-full-mobile is-half-tablet is-one-quarter-desktop" key={product.id}>
                  <ProductImage
                    ProductName={product.nombre_producto}
                    ProductPrice={product.precio_producto}
                    ProductImage={product.image_url}
                    ProductId={product.id}
                    ShowAddButton
                    {...(isAdmin
                      ? { ShowModifyButton: true, ShowDeleteButton: true }
                      : { ShowDeleteButton: true, ShowAddButton: true })}
                  />
                </div>
              ))}
            </div>  
          </div>

          <div className="pagination-container">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
      </section>
    </div>
  );
};

export default Products;