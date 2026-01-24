import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Label from "./Label";
import SubNavBar from "./SubNavBar";
import ComboBox from "./ComboBox";
import Alert from "./Alert";
import "./SignUp.css";
import usuarioPlaceholder from "../../assets/images/usuario.png";


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
    especialidad: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [showComboBox, setShowComboBox] = useState(false);
  const [roles, setRoles] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);

  const [imagenPreview, setImagenPreview] = useState(null);
  const [tempImageFile, setTempImageFile] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("https://academy-prices-stylish-nevada.trycloudflare.com/backend/actions/getRoles.php");
        const data = await res.json();
        if (!data.error) setRoles(data);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    const fetchEspecialidades = async () => {
      try {
        const res = await fetch("https://academy-prices-stylish-nevada.trycloudflare.com/backend/actions/getEspecialidades.php");
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
          especialidad: Array.isArray(userData.especialidades)
            ? userData.especialidades.map(e => Number(e.id_servicio))
            : [],
        });

        if (userData.img_url) setImagenPreview(userData.img_url);
        setIsEditMode(isEditMode || false);
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEspecialidadChange = (id) => {
    setFormData((prev) => {
      const exists = prev.especialidad.includes(id);
      return {
        ...prev,
        especialidad: exists
          ? prev.especialidad.filter((x) => x !== id)
          : [...prev.especialidad, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && formData.contrasenia !== formData.confirmarContrasenia) {
      return Alert({
        Title: "Error",
        Detail: "Las contraseñas no coinciden",
        Confirm: "Entendido",
        Cancel: null,
        icon: "error",
      });
    }

    const roleObj = roles.find((r) => r.id === parseInt(formData.rol, 10));
    const isPeluquero = roleObj && roleObj.rol.toLowerCase().includes("peluquero");

    if (isPeluquero && formData.especialidad.length === 0) {
      return Alert({
        Title: "Atención",
        Detail: "Los peluqueros deben seleccionar al menos una especialidad",
        Confirm: "Entendido",
        Cancel: null,
        icon: "warning",
      });
    }

    const endpoint = isEditMode
      ? "https://academy-prices-stylish-nevada.trycloudflare.com/backend/actions/updateUser.php"
      : "https://academy-prices-stylish-nevada.trycloudflare.com/backend/actions/auth-chatsito.php";

    const fd = new FormData();
    fd.append("action", isEditMode ? "update" : "register");
    fd.append("nombre", formData.nombre);
    fd.append("apellido", formData.apellido);
    fd.append("email", formData.email);
    fd.append("telefono", formData.telefono);
    fd.append("rol", formData.rol);
    fd.append("especialidad", JSON.stringify(formData.especialidad));

    if (!isEditMode) {
      fd.append("contrasenia", formData.contrasenia);
    }
    if (isEditMode && location.state.userData.id_usuario) {
      fd.append("id_usuario", location.state.userData.id_usuario);
    }
    if (tempImageFile) {
      fd.append("img", tempImageFile);
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: fd,
      });

      const response = await res.json();

      if (response.success) {
        return Alert({
          Title: "Éxito",
          Detail: isEditMode ? "Usuario actualizado correctamente" : "Usuario registrado exitosamente",
          Confirm: "Continuar",
          Cancel: null,
          icon: "success",
        }).then(() => {
          if (isEditMode || location.state) {
            navigate("/UsersAdmin");
          } else {
            navigate("/login");
          }
        });
      } else {
        return Alert({
          Title: "Error",
          Detail: response.message || "Error al procesar la solicitud",
          Confirm: "Entendido",
          Cancel: null,
          icon: "error",
        });
      }
    } catch (error) {
      return Alert({
        Title: "Error de conexión",
        Detail: "No se pudo conectar con el servidor",
        Confirm: "Entendido",
        Cancel: null,
        icon: "error",
      });
    }
  };

  const mostrarEspecialidad = () => {
    const roleObj = roles.find((r) => r.id === parseInt(formData.rol, 10));
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

              {/* Imagen central editable (ALTA Y EDICIÓN) */}
              {(imagenPreview !== null || !isEditMode) && (
                <label
                  style={{
                    display: "block",
                    width: "120px",
                    height: "120px",
                    margin: "0 auto 20px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={imagenPreview || usuarioPlaceholder}
                    alt="Foto de perfil"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setTempImageFile(file);
                        setImagenPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}

              <form onSubmit={handleSubmit}>
                {showComboBox && !isEditMode && (
                  <ComboBox
                    value={formData.rol}
                    onChange={(value) =>
                      setFormData({ ...formData, rol: Number(value), especialidad: [] })
                    }
                    options={roles.map((r) => ({ value: r.id, label: r.rol }))}
                    placeholder="Seleccione un rol"
                  />
                )}

                {mostrarEspecialidad() && (
                  <div style={{ margin: "15px 0" }}>
                    <label className="label">Especialidades</label>
                    {especialidades.map((e) => (
                      <div key={e.id_servicio} className="field">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            checked={formData.especialidad.includes(Number(e.id_servicio))}
                            onChange={() => handleEspecialidadChange(Number(e.id_servicio))}
                          />
                          &nbsp;{e.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
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

                  <div className="is-flex" style={{ gap: "10px", marginTop: "20px" }}>
                    <button
                      type="button"
                      className="button is-primary is-fullwidth has-text-white"
                      style={{ flex: 1 }}
                      onClick={() => navigate(-1)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="button is-primary is-fullwidth has-text-white" style={{ flex: 1 }}>
                      {isEditMode ? "Actualizar" : "Registrarse"}
                    </button>
                  </div>
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
