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

  const [isEditMode, setIsEditMode] = useState(false); // Estado para verificar si es edición
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showComboBox, setShowComboBox] = useState(false);

  // Estado para almacenar los roles
  const [roles, setRoles] = useState([]);

  // Asegurarse de que isEditMode y showComboBox se actualicen correctamente al recibir los datos desde location.state
  useEffect(() => {
    // Obtener los roles del backend
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:8080/Proton/backend/actions/getRoles.php");
        const data = await response.json();
        if (data.error) {
          console.error(data.message);
        } else {
          setRoles(data); // Guardamos los roles en el estado
        }
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    // Llamamos a la función para obtener los roles
    fetchRoles();

    // Revisamos si hay datos en location.state
    if (location.state) {
      const { userData, isEditMode, showComboBox } = location.state;
      setShowComboBox(showComboBox || false);

      // Si hay datos del usuario, significa que estamos en modo edición
      if (userData) {
        setFormData({
          nombre: userData.nombre || "",
          apellido: userData.apellido || "",
          email: userData.email || "",
          telefono: userData.telefono || "",
          contrasenia: "", // La contraseña no se rellena por seguridad
          confirmarContrasenia: "", // Tampoco se rellena
          rol: userData.rol || 1,
        });

        setIsEditMode(isEditMode || false);
        setShowComboBox(showComboBox || false);
      }
    }
  }, [location]);

  // Manejador para actualizar los datos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejador para enviar los datos al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!isEditMode) {
      if (formData.contrasenia !== formData.confirmarContrasenia) {
        setErrorMessage("Las contraseñas no coinciden");
        return;
      }
    }

    const endpoint = isEditMode
      ? "http://localhost:8080/Proton/backend/actions/updateUser.php"
      : "http://localhost:8080/Proton/backend/actions/auth-chatsito.php";

    const userData = {
      ...formData,
      action: isEditMode ? "update" : "register",
      id_usuario: isEditMode ? location.state.userData.id_usuario : undefined,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage(
          isEditMode
            ? "Usuario actualizado correctamente"
            : "Usuario registrado exitosamente"
        );

        setTimeout(() => {
          navigate("/UsersAdmin");
        }, 1500);
      } else {
        setErrorMessage(result.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  // Buscar el nombre del rol por el id
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.rol : "Rol desconocido"; // Devuelve el nombre del rol o "Rol desconocido" si no se encuentra
  };

  return (
    <>
      <NavBar />
      <SubNavBar showBack currentPage={isEditMode ? "Editar Usuario" : "Registrar Usuario"} />
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
              <form onSubmit={handleSubmit}>
                <p>El valor de combobox es: {showComboBox ? 'true' : 'false'}</p>
                {showComboBox && !isEditMode && (
                  <ComboBox 
                    className="is-fullwidth"
                    onChange={(value) =>
                      setFormData({ ...formData, rol: parseInt(value, 10) })
                    }
                  />
                )}

                {!showComboBox && isEditMode && (
                  <p>Rol: {getRoleName(formData.rol)}</p> // Muestra el nombre del rol
                )}
                <section className="is-flex is-flex-direction-column">
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
                  {!isEditMode && (
                    <>
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
                    </>
                  )}
                  {errorMessage && (
                    <p className="has-text-danger">{errorMessage}</p>
                  )}
                  {successMessage && (
                    <p className="has-text-success">{successMessage}</p>
                  )}
                  <LargeButton
                    textButton={isEditMode ? "Actualizar" : "Registrarse"}
                    buttonType="submit"
                    className="is-fullwidth"
                  />
                  <p>El valor de isEditMode es: {isEditMode ? 'true' : 'false'}</p>
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
