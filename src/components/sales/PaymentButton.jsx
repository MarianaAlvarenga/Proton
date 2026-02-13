import React from "react";
import axios from "axios";
import Alert from "../common/Alert";

const PaymentButton = ({ cart, userEmail, isRegistered }) => {
  const handlePayment = async () => {
    try {
      // 👇 si es usuario registrado, el email es obligatorio
      if (isRegistered && !userEmail) {
        Alert({
          Title: "Email requerido",
          Detail: "Debe ingresar un email válido para continuar.",
          icon: "warning",
          Confirm: "Entendido"
        });
        return;
      }

      // 👇 verificar email en la BD si es usuario registrado
      if (isRegistered) {
        const checkEmailResponse = await fetch(
          "https://independent-intent-telephone-printer.trycloudflare.com/backend/actions/checkEmail.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail }),
          }
        );

        const checkEmailResult = await checkEmailResponse.json();

        if (!checkEmailResult.exists) {
          Alert({
            Title: "Email no registrado",
            Detail: "El correo electrónico ingresado no pertenece a un usuario registrado.",
            icon: "error",
            Confirm: "Entendido"
          });
          return;
        }
      }

      // 👇 guardar carrito
      await axios.post(
        "https://independent-intent-telephone-printer.trycloudflare.com/backend/actions/save_cart.php",
        { cart, userEmail: isRegistered ? userEmail : null },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // 👇 items para MercadoPago
      const mpItems = cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      }));

      const response = await axios.post(
        "https://independent-intent-telephone-printer.trycloudflare.com/backend/actions/create_preference.php",
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
        Alert({
          Title: "Error",
          Detail: "Hubo un problema al iniciar el pago.",
          icon: "error",
          Confirm: "Entendido"
        });
      }

    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Alert({
        Title: "Error de conexión",
        Detail: "No se pudo conectar con el servidor.",
        icon: "error",
        Confirm: "Entendido"
      });
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
