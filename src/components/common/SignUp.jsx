import React from "react";
import NavBar from "./NavBar";
import UserImage from "./UserImage";
import Label from "./Label";
import LargeButton from "./LargeButton";

const SignUp = () => {
    return(
        <>
            <NavBar></NavBar>
            <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
                
                <div className="box" style={{ backgroundColor: '#D9D0F0', height:'100vh', borderRadius:'0%'}}>
                    <UserImage></UserImage>
                    <section className="is-flex is-flex-direction-column is-justify-content-center">
                        <Label labelContent="Ingrese su nombre de usuario"></Label>
                        <Label labelContent="Ingrese su email"></Label>
                        <Label labelContent="Número de telefono"></Label>
                        <Label labelContent="Contraseña"></Label>
                        <Label labelContent="Repita su contraseña"></Label>
                    </section>
                    <LargeButton></LargeButton>
                </div>
            </div>
        </>
    );
};

export default SignUp;