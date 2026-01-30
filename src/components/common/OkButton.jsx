import React from "react";
import { useNavigate } from "react-router-dom";

const OkButton = ({ NameButton = "Agregar", cartProducts = [], clearCart, isRegistered, email, total }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (NameButton === "Finalizar compra") {
      try {
        // Obtener el ID y el rol del usuario actual desde el localStorage
        const currentUserId = localStorage.getItem("userId"); // ID del usuario
        const currentUserRole = localStorage.getItem("userRole"); // Rol del usuario

        // Verificar si los valores están disponibles
        if (!currentUserId || !currentUserRole) {
          alert("Error: No se pudo obtener la información del usuario actual. Por favor, inicia sesión nuevamente.");
          navigate("/login"); // Redirige al usuario a la página de inicio de sesión
          return;
        }

        // Verificar si el correo electrónico está registrado (solo si el usuario está registrado)
        if (isRegistered) {
          const checkEmailResponse = await fetch("https://dover-calculate-alternate-plaintiff.trycloudflare.com/backend/actions/checkEmail.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const checkEmailResult = await checkEmailResponse.json();

          if (!checkEmailResult.exists) {
            alert("El correo electrónico no está registrado.");
            return;
          }
        }

        // Si el correo electrónico está registrado o el usuario no está registrado, proceder con la compra
        const purchaseResponse = await fetch("https://dover-calculate-alternate-plaintiff.trycloudflare.com/backend/actions/completePurchase.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cartProducts, // Productos del carrito
            isRegistered, // Estado del checkbox (usuario registrado o no)
            email: isRegistered ? email : null, // Correo electrónico (solo si el usuario está registrado)
            total, // Total de la compra
            currentUserId: Number(currentUserId), // Convertir a número
            currentUserRole: Number(currentUserRole), // Convertir a número
          }),
        });

        const purchaseResult = await purchaseResponse.json();
        console.log(purchaseResult); // Verifica lo que recibes como respuesta

        if (purchaseResult.success) {
          alert("Compra realizada con éxito");
          clearCart(); // Vacía el carrito
          navigate("/Products"); // Redirige a la página de productos
        } else {
          alert("Error al procesar la compra: " + purchaseResult.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar la compra. Intenta nuevamente.");
      }
    }
  };

  return (
    <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
      <button
        className="button is-fullwidth"
        style={{ backgroundColor: "#6A0DAD", color: "white" }}
        onClick={handleClick}
      >
        {NameButton}
      </button>
    </div>
  );
};

export default OkButton;