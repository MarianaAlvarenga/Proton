import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

      localStorage.removeItem("cart");
      localStorage.removeItem("total");

      document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "total=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // ================================
    // ⚠️ CONTROL DE USUARIO
    // ================================
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }

    let user = null;
    try {
      user = JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    const rolNumber = Number(user.rol);

    const redirectByRol = () => {
      switch (rolNumber) {
        case 1:
        case 2:
          navigate("/Products", { replace: true });
          break;

        case 4:
          navigate("/MenuAdmin", { replace: true });
          break;

        default:
          navigate("/", { replace: true });
      }
    };

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
        },
      });

      if (result.isConfirmed) {
        redirectByRol();
        return;
      }

      // ❌ Cruz del modal
      if (result.isDismissed && result.dismiss === Swal.DismissReason.close) {
        redirectByRol();
      }
    };

    showSuccessModal();
  }, [navigate, alertActive]);

  return null;
};

export default SuccessPage;
