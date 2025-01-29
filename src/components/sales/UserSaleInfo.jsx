import React, { useState } from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import CancelButton from "../common/CancelButton";
import OkButton from "../common/OkButton";

const UserSaleInfo = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [email, setEmail] = useState(""); // Estado para el textbox

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
        }}>
            <NavBar />
            <SubNavBar currentPage="Información del usuario" />
            
            {/* Contenido principal */}
            <div style={{ 
                flexGrow: 1, 
                padding: "1rem", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center"
            }}>
                <CancelButton NameButton="Seguir comprando" />
                
                {/* Total centrado */}
                <div style={{ 
                    margin: "1rem 0", 
                    fontSize: "1.5rem", 
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    TOTAL: $00.00
                </div> 
                
                {/* Contenedor de los checkboxes */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    width: "90%",
                    maxWidth: "1200px",
                    textAlign: "center", 
                    alignItems: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                }}>
                    <label style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        fontSize: "1.2rem",
                        cursor: "pointer"
                    }}>
                        <input 
                            type="checkbox" 
                            id="Unregistred" 
                            name="Unregistred" 
                            value="1"
                            onChange={() => setIsRegistered(false)}
                        />
                        Usuario no registrado
                    </label>

                    <label style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        fontSize: "1.2rem",
                        cursor: "pointer"
                    }}>
                        <input 
                            type="checkbox" 
                            id="Registred" 
                            name="Registred" 
                            value="2"
                            onChange={(e) => setIsRegistered(e.target.checked)}
                        />
                        Usuario registrado
                    </label>

                    {/* Mostrar combo box y textbox si usuario registrado está seleccionado */}
                    {isRegistered && (
                        <>
                            <select style={{
                                width: "80%",
                                padding: "0.75rem",
                                fontSize: "1.2rem",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                cursor: "pointer"
                            }}>
                                <option value="">Seleccione una opción</option>
                                <option value="1">Opción 1</option>
                                <option value="2">Opción 2</option>
                                <option value="3">Opción 3</option>
                            </select>

                            {/* Textbox para ingresar email */}
                            <input 
                                type="text" 
                                placeholder="Nombre" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: "80%",
                                    padding: "0.75rem",
                                    fontSize: "1.2rem",
                                    borderRadius: "5px",
                                    border: "1px solid #ccc",
                                    marginTop: "1rem"
                                }}
                            />

                                <input 
                                    type="text" 
                                    placeholder="DNI" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: "80%",
                                        padding: "0.75rem",
                                        fontSize: "1.2rem",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        marginTop: "1rem"
                                }}
                                />
                        </>
                    )}
                </div>
            </div>

            {/* Footer con los botones */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem",
                borderTop: "1px solid #ccc",
            }}>
                <CancelButton />
                <OkButton NameButton="Finalizar compra" />
            </div>
        </div>
    );
};

export default UserSaleInfo;
