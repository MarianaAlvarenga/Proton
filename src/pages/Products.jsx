import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    setIsAdmin(userRole === 4);

    const fetchProducts = async (page) => {
      try {
        const response = await fetch(
          `http://localhost:8080/proton/backend/actions/getProducts.php?page=${page}`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="page-wrapper">
      <NavBar showMenu showSearch />
      <SubNavBar showBack currentPage="Productos" />
      <section className="products-section">
        <div className="products-container">
          <div className="columns is-mobile is-multiline">
            {products.map((product) => (
              <div className="column is-half" key={product.id}>
                <ProductImage
                  ProductName={product.nombre_producto}
                  ProductPrice={product.precio_producto}
                  ProductImage={product.image_url}
                  ShowAddButton
                  {...(isAdmin
                    ? { ShowModifyButton: true }
                    : { ShowDeleteButton: true })}
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
