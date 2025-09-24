import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
    const navigate = useNavigate();
    return(
        <a href='/ProfileUser'>
            <img
                src={require("../../assets/images/usuarioBlanco.png")}
                alt="SearchButton"
                style={{ fill: 'white', color: 'white', height:'30px', marginTop:'2px'}}
            />
        </a>
    );
};
export default ProfileButton;