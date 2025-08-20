import React from "react";
import { useNavigate } from "react-router-dom";
import "./CancelButton.css"; 

const CancelButton = ({ NameButton = "Cancelar", clearCart, className, total, onClick, End=false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      // Si se pasa una función onClick personalizada, la usamos
      onClick();
      return;
    }

    // Comportamiento por defecto si no se pasa onClick
    if (NameButton === "Cancelar") {
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
    <div className={`center ${End ? "end" : ""}`}>
      <button
        type="button"
        className="button"
        style={{ backgroundColor: "#6A0DAD", color: "white" }}
        onClick={handleClick}
      >
        {NameButton}
      </button>
    </div>
  );
};

export default CancelButton;
