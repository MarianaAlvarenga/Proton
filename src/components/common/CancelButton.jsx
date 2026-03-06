import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./CancelButton.css";

const CancelButton = ({ NameButton = "Cancelar", clearCart, className, total, onClick, End = false, confirmDiscardCart = false }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    if (NameButton === "Cancelar" && confirmDiscardCart && clearCart) {
      const result = await Swal.fire({
        title: "¿Descartar carrito?",
        text: "¿Estás seguro de que querés deshechar el carrito? Se eliminarán todos los productos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, descartar",
        cancelButtonText: "No, mantener",
        confirmButtonColor: "#6A0DAD",
      });
      if (!result.isConfirmed) return;
      clearCart();
      const userRole = localStorage.getItem("userRole");
      navigate("/Products", { state: { role: userRole } });
      return;
    }

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
