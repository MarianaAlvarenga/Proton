import React from "react";
import { useNavigate } from "react-router-dom";

const CancelButton = ({ NameButton = "Cancelar", clearCart, className, total, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      // Si se pasa una función onClick personalizada, la usamos
      onClick();
      return;
    }

    // Comportamiento por defecto si no se pasa onClick
    if (className === "cancel-button") {
      if (clearCart) {
        localStorage.removeItem("cart");
        clearCart();
      }
      const userRole = localStorage.getItem("userRole");
      navigate("/Products", { state: { role: userRole } });
    } else if (className === "button") {
      navigate("/Products", { state: { purchaseMode: true } });
    } else if (className === "end-button") {
      navigate("/UserSaleInfo", { state: { total } });
    }
  };

  return (
    <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
      <button
        type="button"
        className="button is-fullwidth"
        style={{ backgroundColor: "#6A0DAD", color: "white" }}
        onClick={handleClick}
      >
        {NameButton}
      </button>
    </div>
  );
};

export default CancelButton;
