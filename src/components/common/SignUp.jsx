import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import UserImage from "./UserImage";
import Label from "./Label";
import LargeButton from "./LargeButton";
import SubNavBar from "./SubNavBar";
import ComboBox from "./ComboBox";
import './SignUp.css';

const SignUp = ({IsAdmin = true}) => {
  // Estados para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  // Simulación de una llamada para obtener el rol del usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:8080/Proton/backend/actions/getUserRole.php");
        const data = await response.json();
        setUserRole(data.role); // Supongamos que el backend devuelve { role: 4 } o un número diferente
        setLoading(false);
      } catch (error) {
        setErrorMessage("Error al obtener el rol del usuario");
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Manejador para actualizar los datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejador para enviar los datos al backend
  const handleRegister = async (e) => {
    e.preventDefault(); // Evitar el envío por defecto del formulario
    setErrorMessage(""); // Limpiar mensajes anteriores
    setSuccessMessage("");

    // Validaciones básicas
    if (formData.contrasenia !== formData.confirmarContrasenia) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    // Crear el payload para enviar al backend
    const userData = {
      action: "register",
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      contrasenia: formData.contrasenia,
    };

    try {
      const response = await fetch("http://localhost:8080/Proton/backend/actions/auth-chatsito.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage("Usuario registrado exitosamente");
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          contrasenia: "",
          confirmarContrasenia: "",
        });
      } else {
        setErrorMessage(result.message || "Error al registrar el usuario");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <NavBar />
      <SubNavBar showBack currentPage="" />
        <div
        className="container"
        style={{
          maxWidth: "400px",
          margin: "0 auto", // Centrar horizontalmente todo el contenedor
          textAlign: "center",
          minHeight: "100vh", // Asegura que ocupe al menos toda la pantalla
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "10px",
          boxSizing: "border-box",
          overflowY: "auto", // Permite scroll si el contenido excede la altura
        }}
      >
        <div
          style={{
            margin: "0",
            padding: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centra la imagen horizontalmente
          }}
        >
          <UserImage
            style={{
              margin: "10px 0", // Menos espacio arriba y abajo
              padding: "0",
            }}
          />
          <form onSubmit={handleRegister} style={{ marginBottom: "20px" }}>
            {IsAdmin && <ComboBox className="is-fullwidth" />}
            <section className="is-flex is-flex-direction-column is-justify-content-center">
              {/* Campos visibles para todos */}
              <Label
                labelContent="Ingrese su nombre"
                inputName="nombre"
                inputValue={formData.nombre}
                handleChange={handleChange}
              />
              <Label
                labelContent="Ingrese su apellido"
                inputName="apellido"
                inputValue={formData.apellido}
                handleChange={handleChange}
              />
              <Label
                labelContent="Ingrese su email"
                inputName="email"
                inputValue={formData.email}
                handleChange={handleChange}
                type="email"
              />
              {/* Campos visibles solo si el rol no es 4 */}
              {userRole !== 4 && (
                <>
                  <Label
                    labelContent="Número de teléfono"
                    inputName="telefono"
                    inputValue={formData.telefono}
                    handleChange={handleChange}
                    type="tel"
                  />
                  <Label
                    labelContent="Contraseña"
                    inputName="contrasenia"
                    inputValue={formData.contrasenia}
                    handleChange={handleChange}
                    type="password"
                  />
                  <Label
                    labelContent="Repita su contraseña"
                    inputName="confirmarContrasenia"
                    inputValue={formData.confirmarContrasenia}
                    handleChange={handleChange}
                    type="password"
                  />
                </>
              )}
            </section>
            <LargeButton textButton="Registrar" className="is-fullwidth" />
          </form>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
      </div>



    </>
  );
};

export default SignUp;
