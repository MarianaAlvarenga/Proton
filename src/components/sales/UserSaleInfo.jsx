import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import CancelButton from "../common/CancelButton";
import OkButton from "../common/OkButton";
import UserTypeSelector from "../common/UserTypeSelector"; // Importamos el nuevo componente

const UserSaleInfo = () => {
  const [userInfo, setUserInfo] = useState({ isRegistered: false, email: "" });
  const [cartProducts, setCartProducts] = useState([]);
  const location = useLocation();
  const total = location.state?.total || "00.00";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(storedCart);
  }, []);

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem("cart");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <SubNavBar currentPage="Información del usuario" />

      <div style={{ flexGrow: 1, padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ margin: "1rem 0", fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
          TOTAL: ${total}
        </div>

        {/* Reutilizamos el componente de selección de usuario */}
        <UserTypeSelector onUserTypeChange={setUserInfo} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <CancelButton className="cancel-button" NameButton="Cancelar" clearCart={clearCart} />
        <OkButton NameButton="Finalizar compra" cartProducts={cartProducts} clearCart={clearCart} {...userInfo} total={total} />
      </div>
    </div>
  );
};

export default UserSaleInfo;
