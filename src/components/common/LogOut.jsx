import { useNavigate } from "react-router-dom";
import { ReactComponent as PowerIcon } from "../../assets/images/boton-de-encendido-apagado.svg";


const LogOut = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/Proton/backend/actions/logout.php", {
        method: "POST",
        credentials: "include", // Importante para enviar cookies de sesión
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
        <PowerIcon style={{ fill: "white", width: "20px", height: "20px", marginTop: "7px", cursor: "pointer" }} />
      </a>
    </div>
  );
};

export default LogOut;
