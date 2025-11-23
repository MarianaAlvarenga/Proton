import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert.jsx";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    if (alertActive) return;
    setAlertActive(true);

    // Intento recuperar el user directamente desde localStorage.
    const stored = localStorage.getItem("user");

    // Si no hay user en localStorage -> no podemos continuar; ir a login.
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
      // Si está corrupto, borrarlo y mandar a login.
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      return;
    }

    console.log("USER EN SUCCESSPAGE:", user);

    // Asegurarnos de que el rol sea NUMBER -> evitar problemas con '4' vs 4
    const rolNumber = Number(user.rol);

    const showAlert = async () => {
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
        // Debug: confirmar tipos y contenido
        console.log("Rol raw:", user.rol, "Rol number:", rolNumber);

        // Navegar según rol ya convertido a número.
        switch (rolNumber) {
          case 1:
          case 2:
            navigate("/Products", { replace: true });
            break;
          case 4:
            navigate("/MenuAdmin", { replace: true });
            break;
          default:
            // Por seguridad, si rol no está claro, quedate en la landing pero no borres nada.
            console.warn("SuccessPage: rol desconocido, navegando a / (landing).");
            navigate("/", { replace: true });
        }
      } else {
        // Si canceló (Ver comprobante), no navegamos automáticamente.
        // Podés agregar lógica si querés abrir un comprobante específico.
        console.log("Usuario eligió ver comprobante.");
      }
    };

    showAlert();
  }, [navigate, alertActive]);

  return null;
};

export default SuccessPage;
