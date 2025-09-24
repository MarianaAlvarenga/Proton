import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import CancelButton from "../common/CancelButton";
import OkButton from "../common/OkButton";
import UserTypeSelector from "../common/UserTypeSelector";
import PaymentButton from "./PaymentButton"; // 👈 importado

const UserSaleInfo = () => {
  const [userInfo, setUserInfo] = useState({ isRegistered: false, email: "" });
  const [cartProducts, setCartProducts] = useState([]);
  const [userRole, setUserRole] = useState(0);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const total = location.state?.total || "00.00";

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(storedCart);

    const storedUser = localStorage.getItem("userRole");
    console.log("Valor de localStorage (userRole):", storedUser); // Depuración

    if (storedUser) {
      setUserRole(Number(storedUser)); // Convierte a número
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("userRole actualizado:", userRole);
  }, [userRole]); // Este useEffect se ejecutará cada vez que userRole cambie

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem("cart");
  };

  // Función para actualizar el estado de userInfo
  const handleUserInfoChange = (newUserInfo) => {
    setUserInfo((prevUserInfo) => {
      if (
        prevUserInfo.isRegistered !== newUserInfo.isRegistered ||
        prevUserInfo.email !== newUserInfo.email
      ) {
        return newUserInfo;
      }
      return prevUserInfo;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <SubNavBar currentPage="Información del usuario" />

      <div
        style={{
          flexGrow: 1,
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "1rem 0",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          TOTAL: ${total}
        </div>

        {loading ? (
          <div>Cargando...</div>
        ) : (
          (userRole === 2 || userRole === 4) ? (
            <UserTypeSelector onUserTypeChange={handleUserInfoChange} />
          ) : (
            <div>Rol no permitido para mostrar UserTypeSelector</div>
          )
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          borderTop: "1px solid #ccc",
        }}
      >
        <CancelButton className="cancel-button" NameButton="Cancelar" clearCart={clearCart} />
        <OkButton
          NameButton="Finalizar compra"
          cartProducts={cartProducts}
          clearCart={clearCart}
          isRegistered={userInfo.isRegistered}
          email={userInfo.email}
          total={total}
        />
        {/* 👇 Agregado el PaymentButton */}
        <PaymentButton product={{ price: parseFloat(total) }} />
      </div>
    </div>
  );
};

export default UserSaleInfo;
