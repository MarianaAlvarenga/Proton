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

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
    rol: 1,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showComboBox, setShowComboBox] = useState(false);
  const [roles, setRoles] = useState([]);

  // Estado para vista previa de imagen
  const [imagenPreview, setImagenPreview] = useState(null);

  // Guardamos el id de usuario cuando estemos en edición
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("https://allocated-license-collectibles-supporting.trycloudflare.com/backend/actions/getRoles.php");
        const data = await response.json();
        if (data.error) {
          console.error(data.message);
        } else {
          setRoles(data);
        }
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    fetchRoles();

    if (location.state) {
      const { userData, isEditMode, showComboBox } = location.state;
      setShowComboBox(showComboBox || false);

      if (userData) {
        setFormData({
          nombre: userData.nombre || "",
          apellido: userData.apellido || "",
          email: "",
          telefono: userData.telefono || "",
          contrasenia: "",
          confirmarContrasenia: "",
          rol: userData.rol || 1,
        });

        // Si hay imagen del usuario, guardarla como preview
        if (userData.img_url) {
          setImagenPreview(
            `http://localhost:8080/Proton/backend/uploads/${userData.img_url}`
          );
        }

        setUserId(userData.id_usuario || null);
        setIsEditMode(isEditMode || false);
        setShowComboBox(showComboBox || false);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      ? "https://allocated-license-collectibles-supporting.trycloudflare.com/backend/actions/updateUser.php"
      : "https://allocated-license-collectibles-supporting.trycloudflare.com/backend/actions/auth-chatsito.php";

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

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.rol : "Rol desconocido";
  };

  return (
    <>
      <NavBar showHomeButton={false} showProfileButton={false} />
      <SubNavBar showBack currentPage={isEditMode ? "Editar Usuario" : "Registrar Usuario"} />
      <div className="container">
        <div
          className="columns is-centered is-vcentered"
          style={{ minHeight: "100vh", padding: "10px" }}
        >
          <div className="column is-12-mobile is-8-tablet is-6-desktop is-5-widescreen">
            <div className="box" style={{ padding: "20px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>

              {!showComboBox && isEditMode && (
                <p>{getRoleName(formData.rol)}</p>
              )}

              {/* Imagen del usuario */}
              {isEditMode && userId ? (
                <UserImage
                  userId={userId}
                  style={{
                    margin: "0 auto 20px",
                    display: "block",
                  }}
                />
              ) : (
                <img
                  src={imagenPreview || "/default-user.png"}
                  alt="Foto de perfil"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    margin: "0 auto 20px",
                    display: "block",
                  }}
                />
              )}

              <form onSubmit={handleSubmit}>
                {showComboBox && !isEditMode && (
                  <ComboBox
                    className="is-fullwidth"
                    onChange={(value) =>
                      setFormData({ ...formData, rol: parseInt(value, 10) })
                    }
                  />
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
                    autoComplete="off"
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
                        autoComplete="new-password"
                      />
                      <Label
                        labelContent="Confirmar contraseña"
                        inputName="confirmarContrasenia"
                        inputValue={formData.confirmarContrasenia}
                        handleChange={handleChange}
                        type="password"
                        autoComplete="new-password"
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
