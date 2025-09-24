import { useNavigate } from "react-router-dom";
import { ReactComponent as PowerIcon } from "../../assets/images/boton-de-encendido-apagado.svg";
import Alert from "./Alert.jsx";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    const result = await Alert({
      Title: "Cerrar sesión",
      Detail: "¿Estás seguro de que quieres continuar?",
      Confirm: "Sí",
      Cancel: "No",
    });

    if (!result.isConfirmed) return; // No cerrar sesión si canceló

    try {
      const response = await fetch("http://localhost:8080/Proton/backend/actions/logout.php", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        navigate("/"); // Redirigir al login
      } else {
        console.error("Error al cerrar sesión:", data.message);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div>
      <a href="#" onClick={handleLogout}>
        <PowerIcon style={{ fill: "white", width: "20px", height: "20px", marginTop: "14px", cursor: "pointer" }} />
      </a>
    </div>
  );
};

export default LogOut;
