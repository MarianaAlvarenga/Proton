import React, { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import ProductCard from "../../components/sales/ProductCard";
import Pagination from "../common/Pagination";
import CancelButton from "../common/CancelButton";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(storedCart);
  }, []);

  useEffect(() => {
    const newTotal = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(Number(newTotal.toFixed(2)));
  }, [cartProducts]);

  useEffect(() => {
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartProducts(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCartChange = (updatedCart) => {
    setCartProducts(updatedCart);
  };

  return (
    <div className="page-wrapper">
      <section className="section" style={{ margin: "0px" }}>
        <NavBar showSearch showMenu />
        <SubNavBar showBack currentPage="Carrito" />

        <div key={total} className="is-flex is-justify-content-center">
          <strong>TOTAL: ${total.toFixed(2)}</strong>
        </div>

        <div className="ButtonsPanel">
          <CancelButton className="button" NameButton="Volver" End={true} />
          <hr />
        </div>

        <div className="products-container-wrapper">
          <div className="products-container">
            {cartProducts.length > 0 ? (
              cartProducts.map((product) => (
                <div className="product-card" key={`${product.id}-${product.quantity}`}>
                  <ProductCard
                    ListMode={true}
                    ProductName={product.name}
                    ProductPrice={product.price}
                    ProductImage={product.image}
                    ProductId={product.id}
                    ProductStock={product.stock} // 🟢 agregado
                    ProductReplenishment={product.replenishment_point}
                    ShowCount={true}
                    cartProducts={cartProducts}
                    setCartProducts={setCartProducts}
                    onCartChange={handleCartChange}
                  />
                </div>
              ))
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
        </div>

        <div className="field is-grouped is-grouped-right">
          <p className="control">
            <CancelButton
              End={false}
              className="cancel-button button is-primary"
              NameButton="Cancelar"
              clearCart={clearCart}
            />
          </p>

          {/* 🔥 BOTÓN REEMPLAZADO AQUÍ 🔥 */}
          <p className="control">
            <button
              className="button"
              style={{
                backgroundColor: "#6A0DAD",
                color: "white",
                transition: "transform 0.15s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              onClick={() => {
  if (cartProducts.length === 0) {
    Alert({
      Title: "Carrito vacío",
      Detail: "Agregá al menos un producto al carrito para poder finalizar la compra.",
      icon: "info",
      Confirm: "Entendido"
    });
    return;
  }

  navigate("/usersaleinfo", { state: { total } });
}}

            >
              Finalizar compra
            </button>
          </p>
        </div>

        <div className="pagination-container">
          <Pagination />
        </div>
      </section>
    </div>
  );
};

export default Cart;
