// Products.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductCard from "../components/sales/ProductCard";
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


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    setSelectedCategory(category || "");

    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    const purchaseMode = location.state?.purchaseMode ?? false;

    if (purchaseMode) {
      setIsAdmin(false);
    } else {
      setIsAdmin(userRole === 4);
    }
  }, [location.search, location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/getProducts.php?page=${currentPage}&search=${searchQuery}&category=${selectedCategory}`
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="section" style={{ margin: "0px" }}>
      <NavBar showSearch showMenu onSearch={handleSearch} />
      <SubNavBar showBack showCart currentPage="Productos" />
      <div className="product-container" style={{ margin: "0px" }}>
        <div className="columns is-mobile is-multiline">
          {products.map((product) => (
            <div
              className="column is-full-mobile is-half-tablet is-one-quarter-desktop"
              key={product.id}
            >
              <ProductCard
                ProductName={product.nombre_producto}
                ProductPrice={product.precio_producto}
                ProductImage={product.image_url}
                ProductId={product.id}
                ShowAddButton
                {...(isAdmin
                  ? { ShowModifyButton: true, ShowDeleteButton: true }
                  : { ShowDeleteButton: false, ShowAddButton: true })
                } />
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-container">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} />
      </div>
    </section>
  );
};

export default Products;
