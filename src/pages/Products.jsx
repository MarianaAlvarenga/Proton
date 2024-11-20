import React, { useEffect, useState } from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";

const Products = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Recuperar el rol del usuario desde localStorage
    const userRole = parseInt(localStorage.getItem("userRole"), 10);
    // Definir si el usuario es admin (asumiendo que el rol 4 es admin)
    setIsAdmin(userRole === 4);
  }, []);

  return (
    <>
      <NavBar showMenu showSearch />
      <SubNavBar showBack showCart />
      <section className="section" style={{ margin: "0px", padding: "1.5rem 1.5rem" }}>
        <div className="container" style={{ margin: "0px" }}>
          <div className="columns is-mobile is-multiline" style={{ margin: "0px" }}>
            <div className="column is-half">
              <ProductImage
                ProductName="Correa"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
            <div className="column is-half">
              <ProductImage
                ProductName="Cepillo"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
            <div className="column is-half">
              <ProductImage
                ProductName="Buzo"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
            <div className="column is-half">
              <ProductImage
                ProductName="Hueso"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
            <div className="column is-half">
              <ProductImage
                ProductName="Gallina"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
            <div className="column is-half">
              <ProductImage
                ProductName="Pelota"
                ShowAddButton
                {...(isAdmin ? { ShowModifyButton: true } : { ShowDeleteButton: true })}
              />
            </div>
          </div>
          <Pagination />
        </div>
      </section>
    </>
  );
};

export default Products;
