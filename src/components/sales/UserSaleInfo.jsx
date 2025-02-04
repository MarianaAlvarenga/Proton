import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import CancelButton from "../common/CancelButton";
import OkButton from "../common/OkButton";

const UserSaleInfo = () => {
  const [isRegistered, setIsRegistered] = useState(false); // Estado para el checkbox de usuario registrado
  const [email, setEmail] = useState(""); // Estado para el textbox
  const [cartProducts, setCartProducts] = useState([]);
  const location = useLocation(); // Usar useLocation para obtener el estado
  const total = location.state?.total || "00.00"; // Obtener el TOTAL del estado

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartProducts(storedCart);
  }, []);

  const clearCart = () => {
    setCartProducts([]); // Limpia el estado del carrito
    localStorage.removeItem("cart"); // Borra el carrito del localStorage
  };

  // Función para manejar el cambio en el checkbox de usuario no registrado
  const handleUnregisteredChange = () => {
    setIsRegistered(false); // Deselecciona el checkbox de usuario registrado
  };

  // Función para manejar el cambio en el checkbox de usuario registrado
  const handleRegisteredChange = () => {
    setIsRegistered(true); // Deselecciona el checkbox de usuario no registrado
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      <NavBar />
      <SubNavBar currentPage="Información del usuario" />

      {/* Contenido principal */}
      <div style={{
        flexGrow: 1,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>

        {/* Total centrado */}
        <div style={{
          margin: "1rem 0",
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          TOTAL: ${total} {/* Mostrar el TOTAL recibido */}
        </div>

        {/* Contenedor de los checkboxes */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.5rem",
          borderRadius: "8px",
          backgroundColor: "#f8f9fa",
          width: "90%",
          maxWidth: "1200px",
          textAlign: "center",
          alignItems: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "1.2rem",
            cursor: "pointer"
          }}>
            <input
              type="checkbox"
              id="Unregistred"
              name="Unregistred"
              checked={!isRegistered} // Checkbox de usuario no registrado
              onChange={handleUnregisteredChange} // Maneja el cambio
            />
            Usuario no registrado
          </label>

          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "1.2rem",
            cursor: "pointer"
          }}>
            <input
              type="checkbox"
              id="Registred"
              name="Registred"
              checked={isRegistered} // Checkbox de usuario registrado
              onChange={handleRegisteredChange} // Maneja el cambio
            />
            Usuario registrado
          </label>

          {/* Mostrar combo box y textbox si usuario registrado está seleccionado */}
          {isRegistered && (
            <>
              <input
                type="text"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "80%",
                  padding: "0.75rem",
                  fontSize: "1.2rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "1rem"
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Footer con los botones */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        borderTop: "1px solid #ccc",
      }}>
        <CancelButton className="cancel-button" NameButton="Cancelar" clearCart={clearCart} />
        <OkButton
          NameButton="Finalizar compra"
          cartProducts={cartProducts}
          clearCart={clearCart}
          isRegistered={isRegistered} // Pasar el estado del checkbox
          email={email} // Pasar el correo electrónico
          total={total} // Pasar el total de la compra
        />
      </div>
    </div>
  );
};

export default UserSaleInfo;