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
  const [sessionChecked, setSessionChecked] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const backendBase = "https://von-portable-exec-istanbul.trycloudflare.com/backend";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${backendBase}/actions/checkSession.php`, {
          credentials: "include"
        });
        if (!res.ok) {
          setSessionChecked(true);
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user?.rol !== undefined) {
          setIsAdmin(Number(data.user.rol) === 4);
        }
      } catch {
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    setSelectedCategory(category || "");

    const purchaseMode = location.state?.purchaseMode ?? false;
    if (purchaseMode) {
      setIsAdmin(false);
      return;
    }

    if (!sessionChecked) {
      const userRole = parseInt(localStorage.getItem("userRole"), 10);
      setIsAdmin(userRole === 4);
    }
  }, [location.search, location.state, sessionChecked]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${backendBase}/actions/getProducts.php?page=${currentPage}&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`
        );
        if (!response.ok) throw new Error("Error al obtener los productos");

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

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <section className="page-wrapper">
      <NavBar showSearch showMenu onSearch={handleSearch} />
      <SubNavBar showBack showCart currentPage="Productos" />

      <div className="product-scroll-wrapper">
        <div className="product-container">
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
                  ProductStock={product.stock_producto}
                  ProductReplenishment={product.punto_reposicion}
                  ShowAddButton
                  {...(isAdmin
                    ? { ShowModifyButton: true, ShowDeleteButton: true, isAdmin: true }
                    : { ShowDeleteButton: false, ShowAddButton: true, isAdmin: false })}
                />
              </div>
            ))}
          </div>
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
  );
};

export default Products;
