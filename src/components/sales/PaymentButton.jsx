// PaymentButton.jsx
import React from "react";
import axios from "axios";

const PaymentButton = ({ product }) => {
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/Proton/backend/actions/create_preference.php",
        {
          items: [
            {
              title: "Compra en Proton",
              quantity: 1,
              unit_price: Number(product.price || 0),
              currency_id: "ARS"
            }
          ],
          payer: {
            name: "Cliente de prueba",
            email: "test_user@example.com"
          }
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("Respuesta del backend:", response.data);

      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        console.error("No se recibió 'init_point':", response.data);
        alert("Hubo un problema al iniciar el pago. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al generar preferencia:", error);
      alert("Error al conectar con el servidor de pagos.");
    }
  };

  return (
    <button
      className="button is-primary center"
      style={{
        backgroundColor: "#6A0DAD",
        color: "white",
        transition: "transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      onClick={handlePayment}
    >
      Confirmar compra
    </button>
  );
};

export default PaymentButton;
