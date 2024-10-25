import React from "react";
import NavBar from "./NavBar";
import UserImage from "./UserImage";
import Label from "./Label";

const SignUp = () => {
    return(
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px', textAlign: 'center' }}>
            <NavBar></NavBar>
            <div className="box" style={{ backgroundColor: '#D9D0F0' }}>
                <UserImage></UserImage>
                <Label labelContent="Ingrese su nombre de usuario"></Label>
                <Label labelContent="Ingrese su email"></Label>
                <Label labelContent="Número de telefono"></Label>
                <Label labelContent="Contraseña"></Label>
                <Label labelContent="Repita su contraseña"></Label>
            </div>
        </div>
    );
};

export default SignUp;