import React from "react";
import NavBar from "../components/common/NavBar";
const Menu = () => {
    return(
        <>
        <div className="container" style={{ maxWidth: '400px', height:'100vh', textAlign: 'center', backgroundColor: 'white'}}>
            <NavBar showMenu></NavBar>
            <div class="columns" style={{margin:'1em'}}>
                <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{height:'11em', backgroundColor:'#EEE6FF', marginBottom:'1em'}}>
                    <a role="button">
                        <img
                            src={require("../../assets/images/peluqueria.png")}
                            alt="shiftsIcon"
                            style={{width:'5em'}}
                        />
                        <h2 className="title is-2">Turnos</h2>
                    </a>
                </div>

                <div class="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"  style={{height:'11em', backgroundColor:'#EEE6FF', marginBottom:'1em'}}>
                    <a role="button">
                        <img
                            src={require("../../assets/images/ventas.png")}
                            alt="salesIcon"
                            style={{width:'5em'}}
                        />  
                        <h2 className="title is-2">Ventas</h2> 
                    </a>
                </div>
                <div class="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{height:'11em', backgroundColor:'#EEE6FF', marginBottom:'1em'}}>
                    <a role="button">
                        <img
                            src={require("../../assets/images/usuarios.png")}
                            alt="usersIcon"
                            style={{width:'5em'}}
                        />   
                        <h2 className="title is-2">Usuarios</h2>
                    </a> 
                </div>
            </div>
        </div>
        </>
    );
};

export default Menu;