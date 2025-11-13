import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert.jsx";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    // Evita múltiples ejecuciones
    if (alertActive) return;
    setAlertActive(true);

    const showAlert = async () => {
      const result = await Alert({
        Title: "¡Pago aprobado!",
        Detail: "Tu compra fue procesada con éxito 🎉",
        icon: "success",
        Confirm: "Volver al inicio",
        Cancel: "Ver comprobante",
      });

      if (result.isConfirmed) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return navigate("/login");

        switch (user.role) {
          case 1:
          case 2:
          case 4:
            navigate("/Products");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        // Abre el comprobante pero mantiene la alerta visible
        window.open("https://www.mercadopago.com.ar", "_blank");
        setAlertActive(false); // reabre la alerta automáticamente
      }
    };

    showAlert();
  }, [navigate, alertActive]);

  return null; // no se muestra nada más, solo el Alert
};

export default SuccessPage;
