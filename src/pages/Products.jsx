import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";

const Products = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]); // Estado para almacenar los productos

  useEffect(() => {
    // Recuperar el rol del usuario desde localStorage
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    // Definir si el usuario es admin (asumiendo que el rol 4 es admin)
    setIsAdmin(userRole === 4);

    // Obtener productos desde el backend
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost/api/products.php"); // Cambia la URL si es necesario
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <NavBar showMenu showSearch />
      <SubNavBar showBack showCart />
      <section
        className="section"
        style={{ margin: "0px", padding: "1.5rem 1.5rem" }}
      >
        <div className="container" style={{ margin: "0px" }}>
          <div
            className="columns is-mobile is-multiline"
            style={{ margin: "0px" }}
          >
            {products.map((product) => (
              <div className="column is-half" key={product.id}>
                <ProductImage
                  ProductName={product.nombre_producto}
                  ProductPrice={product.precio_producto} // Pasamos el precio como prop
                  ImageUrl={product.image_url} // Pasamos la URL de la imagen como prop
                  ShowAddButton
                  {...(isAdmin
                    ? { ShowModifyButton: true }
                    : { ShowDeleteButton: true })}
                />
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </section>
    </>
  );
};

export default Products;
