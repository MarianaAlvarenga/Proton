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
        OnCancel: () => {
          window.open("https://www.mercadopago.com.ar", "_blank");
          return false;
        }   
      });

      if (result.isConfirmed) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return navigate("/login");
console.log("USER EN SUCCESSPAGE:", user);

        switch (user.rol) {
  case 1:
  case 2:
    navigate("/Products");
    break;
  case 4:
    navigate("/MenuAdmin");
    break;
  default:
    navigate("/");
}

      }
    };

    showAlert();
  }, [navigate, alertActive]);

  return null; // no se muestra nada más, solo el Alert
};

export default SuccessPage;
