import { useNavigate } from "react-router-dom";

const HomeButton = () => {
    const navigate = useNavigate();
    
    const handleHomeClick = () => {
        const userRole = parseInt(localStorage.getItem('userRole'), 10);
        
        switch(userRole) {
            case 1: // Cliente
                navigate('/MenuClient');
                break;
            case 2: // Vendedor
                navigate('/Products');
                break;
            case 3: // Peluquero
                navigate('/MenuGroomer');
                break;
            case 4: // Administrador
                navigate('/MenuAdmin');
                break;
            default:
                navigate('/'); // Redirigir a página por defecto si no hay rol
                break;
        }
    };

    return(
        <a onClick={handleHomeClick} style={{ cursor: 'pointer' }}>
            <img
                src={require("../../assets/images/home.png")}
                alt="HomeButton"
                style={{ fill: 'white', color: 'white', height:'35px', marginTop:'-2px'}}
            />
        </a>
    );
};
export default HomeButton;