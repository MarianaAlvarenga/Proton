import React from "react";
import axios from "axios";

const PaymentButton = ({ cart, userEmail, isRegistered }) => {
  const handlePayment = async () => {
    try {
      // 👇 solo se exige email si el usuario es registrado
      if (isRegistered && !userEmail) {
        alert("Debe ingresar un email válido para continuar.");
        return;
      }

      await axios.post(
        "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/save_cart.php",
        { cart, userEmail: isRegistered ? userEmail : null },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const mpItems = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      }));

      const response = await axios.post(
        "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/create_preference.php",
        {
          items: mpItems,
          payer: { email: isRegistered ? userEmail : "guest@noemail.com" },
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
