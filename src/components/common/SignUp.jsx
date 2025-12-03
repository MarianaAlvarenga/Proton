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
    especialidad: [], // ahora siempre es array de IDs
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showComboBox, setShowComboBox] = useState(false);
  const [roles, setRoles] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const [imagenPreview, setImagenPreview] = useState(null);
  const [tempImageFile, setTempImageFile] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/getRoles.php");
        const data = await res.json();
        if (!data.error) setRoles(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    const fetchEspecialidades = async () => {
      try {
        const res = await fetch("https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/getEspecialidades.php");
        const data = await res.json();
        setEspecialidades(data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };

    fetchRoles();
    fetchEspecialidades();

    if (location.state) {
      const { userData, isEditMode, showComboBox } = location.state;
      setShowComboBox(showComboBox || false);

      if (userData) {
        setFormData({
          nombre: userData.nombre || "",
          apellido: userData.apellido || "",
          email: userData.email || "",
          telefono: userData.telefono || "",
          contrasenia: "",
          confirmarContrasenia: "",
          rol: userData.rol || 1,
          especialidad: userData.especialidad ? [].concat(userData.especialidad.map(id => Number(id))) : [],
        });
        if (userData.img_url) setImagenPreview(userData.img_url);
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

    if (!isEditMode && formData.contrasenia !== formData.confirmarContrasenia) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    const roleObj = roles.find(r => r.id === parseInt(formData.rol, 10));
    const isPeluquero = roleObj && roleObj.rol.toLowerCase().includes("peluquero");

    if (isPeluquero && formData.especialidad.length === 0) {
      setErrorMessage("Los peluqueros deben seleccionar al menos una especialidad");
      return;
    }

    const endpoint = isEditMode
      ? "https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/updateUser.php"
      : "https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/auth-chatsito.php";

    const userData = {
      ...formData,
      action: isEditMode ? "update" : "register",
      id_usuario: isEditMode ? location.state.userData.id_usuario : undefined,
      especialidad: formData.especialidad.map(id => Number(id)), // enviamos IDs numéricos
    };

    // 👇 agregado el console.log
    console.log("Datos enviados al backend:", userData);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const responseText = await res.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Respuesta no JSON del servidor:", responseText);
        setErrorMessage("Error inesperado del servidor. Verifica la consola para más detalles.");
        return;
      }

      if (result.success) {
        if (!isEditMode && tempImageFile && result.id_usuario) {
          try {
            const formDataImg = new FormData();
            formDataImg.append("image", tempImageFile);
            formDataImg.append("userId", String(result.id_usuario));

            const imgRes = await fetch(
              "https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/upload_user_image.php",
              { method: "POST", body: formDataImg, credentials: "include" }
            );

            const imgResult = await imgRes.json();
            if (!imgResult.success) {
              setSuccessMessage("Usuario registrado correctamente (pero la imagen no se pudo subir)");
            } else {
              setSuccessMessage("Usuario registrado exitosamente con imagen");
            }
          } catch (err) {
            setSuccessMessage("Usuario registrado correctamente (error subiendo imagen)");
          }
        } else {
          setSuccessMessage(isEditMode ? "Usuario actualizado correctamente" : "Usuario registrado exitosamente");
        }
        setTimeout(() => navigate("/UsersAdmin"), 2000);
      } else {
        setErrorMessage(result.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorMessage("Error de conexión con el servidor: " + error.message);
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.rol : "Rol desconocido";
  };

  const mostrarEspecialidad = () => {
    const roleObj = roles.find(r => r.id === parseInt(formData.rol, 10));
    return roleObj && roleObj.rol.toLowerCase().includes("peluquero");
  };

  return (
    <>
      <NavBar showHomeButton={false} showProfileButton={false} />
      <SubNavBar showBack currentPage={isEditMode ? "Editar Usuario" : "Registrar Usuario"} />
      <div className="container">
        <div className="columns is-centered is-vcentered" style={{ minHeight: "100vh", padding: "10px" }}>
          <div className="column is-12-mobile is-8-tablet is-6-desktop is-5-widescreen">
            <div className="box" style={{ padding: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              {!showComboBox && isEditMode && <p>{getRoleName(formData.rol)}</p>}

              {isEditMode && imagenPreview ? (
                <img src={imagenPreview} alt="Foto de perfil" style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "50%", margin: "0 auto 20px", display: "block" }} />
              ) : (
                <UserImage
                  userId={isEditMode && location.state?.userData?.id_usuario ? location.state.userData.id_usuario : null}
                  onTempImageSelected={(file) => setTempImageFile(file)}
                  style={{ margin: "0 auto 20px", display: "block" }}
                />
              )}

              <form onSubmit={handleSubmit}>
                {showComboBox && !isEditMode && (
                  <ComboBox
                    value={formData.rol}
                    onChange={(value) => setFormData({ ...formData, rol: Number(value), especialidad: [] })}
                    options={roles.map((r) => ({ value: r.id, label: r.rol }))}
                    placeholder="Seleccione un rol"
                  />
                )}

                {mostrarEspecialidad() && (
                  <ComboBox
                    value={formData.especialidad}
                    onChange={(value) => setFormData({ ...formData, especialidad: [Number(value)] })}
                    options={especialidades.map((e) => ({ value: e.id_servicio, label: e.nombre }))}
                    placeholder="Seleccione una especialidad"
                  />
                )}

                <section className="is-flex is-flex-direction-column">
                  <Label labelContent="Ingrese su nombre" inputName="nombre" inputValue={formData.nombre} handleChange={handleChange} />
                  <Label labelContent="Ingrese su apellido" inputName="apellido" inputValue={formData.apellido} handleChange={handleChange} />
                  <Label labelContent="Ingrese su email" inputName="email" inputValue={formData.email} handleChange={handleChange} autoComplete="off" />
                  <Label labelContent="Número de teléfono" inputName="telefono" inputValue={formData.telefono} handleChange={handleChange} type="tel" />
                  {!isEditMode && (
                    <>
                      <Label labelContent="Contraseña" inputName="contrasenia" inputValue={formData.contrasenia} handleChange={handleChange} type="password" autoComplete="new-password" />
                      <Label labelContent="Confirmar contraseña" inputName="confirmarContrasenia" inputValue={formData.confirmarContrasenia} handleChange={handleChange} type="password" autoComplete="new-password" />
                    </>
                  )}

                  {errorMessage && <p className="has-text-danger">{errorMessage}</p>}
                  {successMessage && <p className="has-text-success">{successMessage}</p>}
                  <LargeButton textButton={isEditMode ? "Actualizar" : "Registrarse"} buttonType="submit" className="is-fullwidth" />
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
