import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";

const Products = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  useEffect(() => {
    // Recuperar el rol del usuario desde localStorage
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    setIsAdmin(userRole === 4); // Definir si el usuario es admin (rol 4)

    // Obtener productos desde el backend
    const fetchProducts = async (page) => {
      try {
        const response = await fetch(
          `http://localhost:8080/proton/backend/actions/getProducts.php?page=${page}` // Solicitud con el número de página
        );
        const data = await response.json();

        // Actualizar estado con los datos recibidos
        setProducts(data.products); // Productos actuales
        setTotalPages(data.pagination.totalPages); // Total de páginas
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts(currentPage); // Cargar productos de la página actual
  }, [currentPage]); // Se vuelve a ejecutar cuando cambia la página actual

  // Manejar cambio de página desde el componente Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cambiar página actual
  };

  return (
    <>
      <NavBar showMenu showSearch />
      <SubNavBar showBack currentPage="Productos" />
      <section
        className="section"
        style={{ margin: "0px", padding: "1.5rem 1.5rem" }}
      >
        <div className="container" style={{ margin: "0px" }}>
        {console.log("Productos cargados:", products)}
          <div
            className="columns is-mobile is-multiline"
            style={{ margin: "0px" }}
          >
            {products.map((product) => (
              <div className="column is-half" key={product.id}>
                <ProductImage
                  ProductName={product.nombre_producto}
                  ProductPrice={product.precio_producto} // Pasamos el precio como prop
                  ProductImage={product.image_url} // Pasamos la URL de la imagen como prop
                  ProductId={product.id}
                  ShowAddButton
                  {...(isAdmin
                    ? { ShowModifyButton: true, ShowDeleteButton: true }
                    : { ShowDeleteButton: true })}
                />
              </div>
            ))}
          </div>
          {/* Renderizar el componente Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange} // Pasamos la función para cambiar de página
          />
        </div>
      </section>
    </>
  );
};

export default Products;
