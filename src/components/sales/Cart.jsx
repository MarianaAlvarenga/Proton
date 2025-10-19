import React, { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import ProductCard from "../../components/sales/ProductCard";
import Pagination from "../common/Pagination";
import CancelButton from "../common/CancelButton";
import "./Cart.css";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);

  // 🔹 UN solo useEffect para cargar el carrito inicial
  useEffect(() => {
    const loadCart = () => {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartProducts(storedCart);
      console.log("🧩 Carrito leído al montar:", storedCart);
    };
    
    loadCart();
  }, []);

  // 🔹 UN solo useEffect para calcular el total
  useEffect(() => {
    const newTotal = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(Number(newTotal.toFixed(2)));
    console.log("💰 Total calculado:", newTotal);
  }, [cartProducts]);

  // 🔹 UN solo listener para cambios externos
  useEffect(() => {
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartProducts(updatedCart);
      console.log("🔄 Carrito actualizado por evento");
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleCartUpdated); // Por si acaso
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleCartUpdated);
    };
  }, []);

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem("cart");
    // 🔹 Disparar evento para sincronizar otros componentes
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 🔹 Función optimizada para actualizar el carrito
  const handleCartChange = (updatedCart) => {
    setCartProducts(updatedCart);
    // No necesitas guardar en localStorage aquí porque ya lo hace ProductCard
  };

  console.log("🎯 Renderizando con total:", total);

  useEffect(() => {
    console.log("📦 Estado actual del carrito:", cartProducts);
  }, [cartProducts]);
  
  return (
    <div className="page-wrapper">
      <section className="section" style={{ margin: "0px" }}>
        <NavBar showSearch showMenu />
        <SubNavBar showBack currentPage="Carrito" />
        
        {/* 🔹 Asegúrate de que este div tenga una key única forzando re-render */}
        <div key={total} className="is-flex is-justify-content-center">
          <strong>TOTAL: ${total.toFixed(2)}</strong>
        </div>

        <div className="ButtonsPanel">
          <CancelButton className="button" NameButton="Volver" End={true}/>
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
          <p className="control">            
            <CancelButton
              End={false}
              className="end-button"
              NameButton="Finalizar compra"
              total={total}
            />
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