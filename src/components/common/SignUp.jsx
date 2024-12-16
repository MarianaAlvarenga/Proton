import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import UserImage from "./UserImage";
import Label from "./Label";
import LargeButton from "./LargeButton";
import SubNavBar from "./SubNavBar";
import ComboBox from "./ComboBox";
import "./SignUp.css";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
    rol: 1, // Por defecto, rol de cliente
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showComboBox, setShowComboBox] = useState(false);

  useEffect(() => {
    // Lee el estado de navegación para decidir si mostrar el ComboBox
    if (location.state?.showComboBox) {
      setShowComboBox(location.state.showComboBox);
    }
  }, [location]);

  // Manejador para actualizar los datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejador para actualizar el rol seleccionado en el ComboBox
  const handleComboBoxChange = (value) => {
    setFormData({ ...formData, rol: parseInt(value, 10) });
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
      rol: formData.rol, // Se incluye el rol seleccionado
    };

    try {
      const response = await fetch(
        "http://localhost:8080/Proton/backend/actions/auth-chatsito.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

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
          rol: 1, // Restablecer al rol por defecto
        });
      } else {
        setErrorMessage(result.message || "Error al registrar el usuario");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <NavBar />
      <SubNavBar showBack currentPage="" />
      <div className="container">
        <div
          className="columns is-centered is-vcentered"
          style={{
            minHeight: "100vh",
            padding: "10px",
          }}
        >
          <div className="column is-12-mobile is-8-tablet is-6-desktop is-5-widescreen">
            <div
              className="box"
              style={{
                padding: "20px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <UserImage
                style={{
                  margin: "0 auto 20px",
                  display: "block",
                }}
              />
              <form onSubmit={handleRegister}>
                {/* Mostrar ComboBox solo si está habilitado */}
                {showComboBox && (
                  <ComboBox
                    className="is-fullwidth"
                    onChange={handleComboBoxChange} // Pasa la función para actualizar el rol
                  />
                )}
                <section className="is-flex is-flex-direction-column">
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
                    labelContent="Confirmar contraseña"
                    inputName="confirmarContrasenia"
                    inputValue={formData.confirmarContrasenia}
                    handleChange={handleChange}
                    type="password"
                  />
                  {/* Mostrar mensajes de error o éxito */}
                  {errorMessage && (
                    <p className="has-text-danger">{errorMessage}</p>
                  )}
                  {successMessage && (
                    <p className="has-text-success">{successMessage}</p>
                  )}
                  <LargeButton
                    textContent="Registrarse"
                    buttonType="submit"
                    className="is-fullwidth"
                  />
                </section>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
