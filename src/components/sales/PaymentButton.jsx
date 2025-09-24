import React from "react";
import axios from "axios";

const PaymentButton = ({ product }) => {
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:8080/Proton/backend/actions/create_preference.php" , {
        price: product.price
      });

      console.log("Respuesta del backend:", response.data);
debugger; // 👈 se va a detener aquí y podés inspeccionar en la consola
window.location.href = response.data.init_point;

      // Redirigir al checkout de MercadoPago
      window.location.href = response.data.init_point;
    } catch (error) {
      console.error("Error al generar preferencia:", error);
    }
  };


  return (
    <button className="button is-primary" onClick={handlePayment}>
      Pagar con MercadoPago
    </button>
  );
};

export default PaymentButton;
