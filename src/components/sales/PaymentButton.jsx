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
              title: "Compra en Proton", // 👈 nombre genérico del pedido
              quantity: 1,
              currency_id: "ARS",
              unit_price: parseFloat(product.price),
            },
          ],
        }
      );

      console.log("Respuesta del backend:", response.data);

      // ✅ Asegurarse de que la respuesta tenga el campo 'init_point'
      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        console.error("No se recibió 'init_point' en la respuesta:", response.data);
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
