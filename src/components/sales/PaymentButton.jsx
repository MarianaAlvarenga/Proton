import React, { useState } from "react";
import axios from "axios";
import Alert from "../common/Alert";
import PaymentQRModal from "./PaymentQRModal";
import { useNavigate } from "react-router-dom";

const PaymentButton = ({ cart, userEmail, isRegistered }) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

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
          "https://dash-nonprofit-special-scoring.trycloudflare.com/backend/actions/checkEmail.php",
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

      // 👇 guardar carrito (siempre, independientemente de cómo se pague)
      await axios.post(
        "https://dash-nonprofit-special-scoring.trycloudflare.com/backend/actions/save_cart.php",
        { cart, userEmail: isRegistered ? userEmail : null },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // 👇 items para MercadoPago
      const mpItems = cart.map(item => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      }));

      // 👇 detectar rol del usuario que realiza la venta
      const storedRole = localStorage.getItem("userRole");
      const userRole = storedRole ? Number(storedRole) : null;
      const isAdminOrSeller = userRole === 4 || userRole === 2;

      // 👇 Si el admin/vendedor indica que el cliente NO está registrado,
      // mostramos un QR en lugar de redirigir directamente a Mercado Pago
      if (!isRegistered && isAdminOrSeller) {
        const purchaseRef = `ECOM-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setPaymentData({
          items: mpItems,
          cart: cart.map(i => ({ id: i.id, quantity: i.quantity, price: Number(i.price) })),
          payer: {
            name: "Cliente no registrado",
            email: "guest@noemail.com"
          },
          purchaseRef,
          seller: {
            id: user?.id_usuario ?? null,
            role: userRole,
            userEmail: null
          }
        });
        setShowQRModal(true);
        return;
      }

      // 👉 Resto de los casos: flujo clásico con redirección
      const response = await axios.post(
        "https://dash-nonprofit-special-scoring.trycloudflare.com/backend/actions/create_preference.php",
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
    <>
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

      {showQRModal && paymentData && (
        <PaymentQRModal
          paymentDataInput={paymentData}
          onClose={(wasPaid) => {
            setShowQRModal(false);

            if (wasPaid) {
              // limpiar carrito del front
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("cartUpdated"));

              const storedRole = localStorage.getItem("userRole");
              const role = storedRole ? Number(storedRole) : null;

              if (role === 4) navigate("/MenuAdmin");
              else if (role === 2) navigate("/Products");
              else navigate("/");
            }
          }}
        />
      )}
    </>
  );
};

export default PaymentButton;
