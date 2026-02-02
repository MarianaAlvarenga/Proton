import { useNavigate } from "react-router-dom";
import { ReactComponent as PowerIcon } from "../../assets/images/boton-de-encendido-apagado.svg";
import Alert from "./Alert.jsx";
import Swal from "sweetalert2";
import "./LogOut.css";

const LogOut = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    const result = await Alert({
      Title: "Cerrar sesión",
      Detail: "¿Estás seguro de que quieres continuar?",
      Confirm: "Sí",
      Cancel: "No",
      OnCancel: () => { Swal.close(); }
    });

    if (!result.isConfirmed) return; // No cerrar sesión si canceló

    try {
      const response = await fetch("https://strategic-detected-childhood-scholarships.trycloudflare.com/backend/actions/logout.php", {
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
    <div className="logout-button">
      <a href="#" onClick={handleLogout}>
        <PowerIcon />
      </a>
    </div>
  );
};

export default LogOut;
