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
      if (isRegistered && !userEmail) {
        Alert({
          Title: "Email requerido",
          Detail: "Debe ingresar un email válido para continuar.",
          icon: "warning",
          Confirm: "Entendido"
        });
        return;
      }

      if (isRegistered) {
        const checkEmailResponse = await fetch(
          "https://finite-yrs-dover-therapist.trycloudflare.com/backend/actions/checkEmail.php",
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

      await axios.post(
        "https://finite-yrs-dover-therapist.trycloudflare.com/backend/actions/saveCart.php",
        { cart, userEmail: isRegistered ? userEmail : null },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      const mpItems = cart.map(item => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "ARS",
      }));

      const storedRole = localStorage.getItem("userRole");
      const userRole = storedRole ? Number(storedRole) : null;
      // Admin (4) o Vendedor (2)
      const isAdminOrSeller = userRole === 4 || userRole === 2;

      // COMPORTAMIENTO ESPERADO: Si es Staff (Admin/Vendedor), SIEMPRE QR
      if (isAdminOrSeller) {
        const purchaseRef = `ECOM-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setPaymentData({
          items: mpItems,
          cart: cart.map(i => ({ id: i.id, quantity: i.quantity, price: Number(i.price) })),
          payer: {
            name: isRegistered ? "Cliente Registrado" : "Cliente no registrado",
            email: isRegistered ? userEmail : "guest@noemail.com"
          },
          purchaseRef,
          seller: {
            id: user?.id_usuario ?? null,
            role: userRole,
            userEmail: isRegistered ? userEmail : null
          }
        });
        setShowQRModal(true);
        return;
      }

      // Si es CLIENTE (no es admin ni vendedor), Redirección directa
      const response = await axios.post(
        "https://finite-yrs-dover-therapist.trycloudflare.com/backend/actions/createPreference.php",
        {
          items: mpItems,
          payer: { email: userEmail || "guest@noemail.com" },
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.init_point) {
        window.location.href = response.data.init_point;
      } else {
        throw new Error("No se obtuvo init_point");
      }

    } catch (error) {
      console.error("Error al procesar la compra:", error);
      Alert({
        Title: "Error",
        Detail: "No se pudo procesar el pago.",
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
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("cartUpdated"));
              const role = Number(localStorage.getItem("userRole"));
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