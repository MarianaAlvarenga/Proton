import React, { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import ProductCard from "../../components/sales/ProductCard";
import Pagination from "../common/Pagination";
import CancelButton from "../common/CancelButton";
import "./Cart.css";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(storedCart);
  }, []);

  const clearCart = () => {
    setCartProducts([]); // Limpia el estado del carrito
    localStorage.removeItem("cart"); // Borra el carrito del localStorage
  };

  return (
    <div className="page-wrapper">
      <section className="section" style={{ margin: "0px" }}>
        <NavBar showSearch showMenu />
        <SubNavBar showBack showCart currentPage="Carrito" />

        <div className="ButtonsPanel">
          <div>
            TOTAL: ${cartProducts.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </div>
          <CancelButton className="button" NameButton="Seguir comprando" />
        </div>

        <div className="products-container-wrapper">
          <div className="products-container">
            {cartProducts.length > 0 ? (
              cartProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <ProductCard
                    ProductName={product.name}
                    ProductPrice={product.price}
                    ProductImage={product.image}
                    ProductId={product.id}
                    ShowCount
                    setCartProducts={setCartProducts} 
                  />
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
        </div>

        <div className="ButtonsPanel">
          <CancelButton className="cancel-button" NameButton="Cancelar" clearCart={clearCart} />
          <CancelButton className="end-button" NameButton="Finalizar compra" />
        </div>

        <div className="pagination-container">
          <Pagination />
        </div>
      </section>
    </div>
  );
};

export default Cart;
