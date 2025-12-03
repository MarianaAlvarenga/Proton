import React from "react";
import axios from "axios";

const PaymentButton = ({ cart, userEmail }) => {
  const handlePayment = async () => {
    try {
      if (!userEmail) {
        alert("Debe ingresar un email válido para continuar.");
        return;
      }

      // 1) Guardar carrito + email en sesión en el backend
      await axios.post(
        "https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/save_cart.php",
        { cart, userEmail }, // ⚡ ahora mandamos email también
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // 2) Crear preferencia de MercadoPago
      const mpItems = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      }));

      const response = await axios.post(
        "https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/create_preference.php",
        {
          items: mpItems,
          payer: { email: userEmail, name: "Cliente" },
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          maxRedirects: 0,
        }
      );

      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        console.error("No se recibió 'init_point':", response.data);
        alert("Hubo un problema al iniciar el pago.");
      }

    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Error al conectar con el servidor.");
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
      onMouseEnter={e => (e.target.style.transform = "scale(1.05)")}
      onMouseLeave={e => (e.target.style.transform = "scale(1)")}
      onClick={handlePayment}
    >
      Confirmar compra
    </button>
  );
};

export default PaymentButton;
