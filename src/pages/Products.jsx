import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";

// POR DEFECTO SE MUESTRA LA PANTALLA DE PRODUCTOS NO ADMIN (SOLO PUEDE AGREGAR Y ELIMINAR PRODUCTOS DEL CARRITO)
// ESTO SE INDICA MEDIANTE LA PROPIEDAD isAdmin
const ProductsAdmin = ({ isAdmin = false }) => {
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

export default ProductsAdmin;
