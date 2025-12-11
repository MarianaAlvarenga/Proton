import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert.jsx";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    if (alertActive) return;
    setAlertActive(true);

    // ================================
    // 🧹 LIMPIAR CARRITO SI ok=1
    // ================================
    const params = new URLSearchParams(window.location.search);
    const ok = params.get("ok");

    if (ok === "1") {
      console.log("SuccessPage: compra OK → limpiando carrito.");

      // → localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");

      // → cookies
      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "total=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // → si tenés context, descomentá esto:
      // setCart([]);
      // setTotal(0);
    }

    // ================================
    // ⚠️ CONTROL DE USUARIO
    // ================================
    const stored = localStorage.getItem("user");
    if (!stored) {
      console.warn("SuccessPage: no hay 'user' en localStorage. Redirigiendo a /login.");
      navigate("/login", { replace: true });
      return;
    }

    let user = null;
    try {
      user = JSON.parse(stored);
    } catch (err) {
      console.error("SuccessPage: error parseando localStorage user:", err);
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    console.log("USER EN SUCCESSPAGE:", user);
    const rolNumber = Number(user.rol);

    // ================================
    // 🟢 MOSTRAR ALERTA
    // ================================
    const showSuccessModal = async () => {
      const result = await Alert({
        Title: "¡Pago aprobado!",
        Detail: "Tu compra fue procesada con éxito 🎉",
        icon: "success",
        Confirm: "Volver al inicio",
        Cancel: "Ver comprobante",
        OnCancel: () => {
          window.open("https://www.mercadopago.com.ar", "_blank");
          return false;
        },
      });

      if (result.isConfirmed) {
        switch (rolNumber) {
          case 1:
          case 2:
            navigate("/Products", { replace: true });
            break;

          case 4:
            navigate("/MenuAdmin", { replace: true });
            break;

          default:
            console.warn("SuccessPage: rol desconocido → landing.");
            navigate("/", { replace: true });
        }
      } else {
        console.log("Usuario eligió ver comprobante.");
      }
    };

    showSuccessModal();
  }, [navigate, alertActive]);

  return null;
};

export default SuccessPage;
