import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import SubNavBar from "./SubNavBar.jsx";
import FormUser from "./FormUser.jsx";
import FormPet from "./FormPet.jsx";
import Alert from "./Alert.jsx";

const ProfileUser = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [usuarioEdit, setUsuarioEdit] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const [mascotaEdit, setMascotaEdit] = useState(null);

    const [loading, setLoading] = useState(true);
    const [loadingPet, setLoadingPet] = useState(true);

    const [editandoUsuario, setEditandoUsuario] = useState(false);
    const [editandoMascota, setEditandoMascota] = useState(false);
    const [addingMascota, setAddingMascota] = useState(false);

    const [especialidades, setEspecialidades] = useState([]);
    const [contrasenia, setContrasenia] = useState("");

    const [currentIndex, setCurrentIndex] = useState(0);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedUser = userData ? userData : null;
    const id_usuario = localStorage.getItem("userId");

    // 👉 SOLO CLIENTE (rol === 1) puede agregar mascotas
    const puedeAgregarMascota = usuario?.rol === 1;

    useEffect(() => {
        if (!id_usuario) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(
                    "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/getUserById.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: id_usuario })
                    }
                );

                const data = await response.json();

                const userClean = {
                    ...data.user,
                    // 🔴 NORMALIZACIÓN CLAVE
                    especialidades: Array.isArray(data.user.especialidades)
                        ? data.user.especialidades
                        : [],
                    fecha_nacimiento:
                        data.user.fecha_nacimiento === "0000-00-00"
                            ? ""
                            : data.user.fecha_nacimiento,
                    imagen: data.user.img_url || ""
                };

                setUsuario(userClean);
                setUsuarioEdit(userClean);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar usuario:", error);
            }
        };

        fetchUser();
    }, [navigate, storedUser, id_usuario]);

    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const response = await fetch(
                    `https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/getPetsByClientId.php?userId=${id_usuario}`
                );
                const data = await response.json();
                setMascotas(data.mascotas || []);
                setLoadingPet(false);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
            }
        };

        fetchMascotas();
    }, [storedUser, id_usuario]);

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await fetch(
                    "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/getEspecialidades.php"
                );
                const data = await response.json();
                setEspecialidades(data || []);
            } catch (error) {
                console.error("Error al cargar especialidades:", error);
            }
        };

        fetchEspecialidades();
    }, []);

    const handlePrev = () => {
        setCurrentIndex(prev =>
            prev === 0 ? mascotas.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex(prev =>
            prev === mascotas.length - 1 ? 0 : prev + 1
        );
    };

    const handleEditarMascota = () => {
        setEditandoMascota(true);
        setAddingMascota(false);
        setMascotaEdit({ ...mascotas[currentIndex] });
    };

    const handleAgregarMascota = () => {
        setAddingMascota(true);
        setEditandoMascota(true);
        setMascotaEdit({
            id_usuario: usuarioEdit?.id_usuario,
            nombre_mascota: "",
            fecha_nacimiento: "",
            raza: "",
            peso: "",
            tamanio: "",
            largo_pelo: "",
            especie: "",
            sexo: "",
            color: "",
            detalle: "",
            img_url: null
        });
        setCurrentIndex(mascotas.length);
    };

    const handleCancel = () => {
        setEditandoUsuario(false);
        setEditandoMascota(false);
        setAddingMascota(false);
        setUsuarioEdit(usuario);
        setMascotaEdit(null);
    };

    const handleActualizarUsuario = async () => {

        const formData = new FormData();

        Object.keys(usuarioEdit).forEach((key) => {
            if (key === "especialidades" && Array.isArray(usuarioEdit[key])) {
                // mandar especialidades UNA sola vez como JSON
                formData.append(
                    "especialidades",
                    JSON.stringify(usuarioEdit.especialidades)
                );

            } else if (usuarioEdit[key] !== null && usuarioEdit[key] !== undefined) {
                formData.append(key, usuarioEdit[key]);
            }
        });

        // contraseña aparte (como ya lo hacías)
        if (contrasenia && contrasenia.trim() !== "") {
            formData.append("contrasenia", contrasenia);
        }

        try {
            const response = await fetch("https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/updateUser.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setUsuario(usuarioEdit);
                setEditandoUsuario(false);
                return Alert({
                    Title: "Actualización",
                    Detail: "Usuario actualizado correctamente.",
                    Confirm: "Ok",
                    Cancel: null,
                    icon: "success"
                });
            } else {
                return Alert({
                    Title: "Actualización",
                    Detail: "Error al actualizar usuario.",
                    Confirm: "Ok",
                    Cancel: null,
                    icon: "error"
                });
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    };

    const handleActualizarMascota = async () => {

        console.log("Mascota al guardar:", mascotaEdit);

        if (!mascotaEdit) return;

        // Si mascotaEdit tiene id_mascota => actualizar, sino => crear
        if (mascotaEdit.id_mascota) {
            // actualizar existente (flujo previo)
            try {
                const response = await fetch(
                    `https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/updatePet.php`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(mascotaEdit),
                    }
                );
                const json = await response.json();
                if (json.success) {
                    setMascotas(prev => {
                        const updated = [...prev];
                        updated[currentIndex] = { ...mascotaEdit };
                        return updated;
                    });
                    setEditandoMascota(false);
                    setAddingMascota(false);
                    return Alert({
                        Title: null,
                        Detail: "Mascota actualizada correctamente 🐾",
                        Confirm: "Ok",
                        Cancel: null,
                        icon: "success"
                    });
                } else {
                    return Alert({
                        Title: null,
                        Detail: "Error al actualizar la mascota",
                        Confirm: "Ok",
                        Cancel: null,
                        icon: "error"
                    });
                }
            } catch (error) {
            }
        } else {
            // crear nueva mascota
            try {
                // Capturamos si hay un archivo pendiente seleccionado antes de enviar el JSON
                const pendingFile = mascotaEdit?.pendingImageFile || null;

                // Asegurarse de que tenga el id del usuario
                const payload = { ...mascotaEdit, id_usuario: mascotaEdit.id_usuario || userData?.id_usuario };
                const response = await fetch(
                    `https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/addPet.php`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );
                const json = await response.json();

                if (json.success) {

                    // Construir nuevo objeto de mascota con id recién insertado
                    const newPet = {
                        id_mascota: json.id_mascota,
                        id_usuario: usuarioEdit.id_usuario,
                        nombre_mascota: payload.nombre_mascota || "",
                        fecha_nacimiento: payload.fecha_nacimiento || "",
                        raza: payload.raza || "",
                        peso: payload.peso || "",
                        tamanio: payload.tamanio || "",
                        largo_pelo: payload.largo_pelo || "",
                        especie: payload.especie || "",
                        sexo: payload.sexo || "",
                        color: payload.color || "",
                        detalle: payload.detalle || "",
                        img_url: json.img_url ?? null
                    };

                    // Si había un archivo pendiente (lo seleccionó antes de crear), subirlo AHORA al endpoint de upload
                    if (pendingFile) {
                        try {
                            const uploadForm = new FormData();
                            uploadForm.append("image", pendingFile);
                            uploadForm.append("petId", String(json.id_mascota));

                            const uploadResp = await fetch(
                                "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/upload_pet_image.php",
                                {
                                    method: "POST",
                                    body: uploadForm,
                                    credentials: "include"
                                }
                            );

                            const uploadText = await uploadResp.text();
                            if (!uploadResp.ok) {
                                // intentar parsear json de error
                                let err = {};
                                try { err = JSON.parse(uploadText); } catch (e) { /* ignore */ }
                                console.warn("Error al subir imagen tras crear mascota:", uploadText);
                            } else {
                                const uploadJson = JSON.parse(uploadText);
                                if (uploadJson.success) {
                                    // actualizar img_url con lo que devuelva el servidor
                                    newPet.img_url = uploadJson.img_url ?? newPet.img_url;
                                }
                            }
                        } catch (uploadError) {
                            console.error("Error subiendo imagen luego de crear mascota:", uploadError);
                        }
                    }

                    // Agregar a la lista y setear el currentIndex al nuevo elemento
                    setMascotas(prev => {
                        const updated = [...prev, newPet];
                        // actualizar índice al final (nuevo elemento)
                        setCurrentIndex(updated.length - 1);
                        return updated;
                    });

                    // setear mascotaEdit al nuevo objeto (para que el formulario refleje)
                    setMascotaEdit({ ...newPet });

                    // Si subimos la imagen, mantener edit state acorde:
                    setEditandoMascota(false);
                    setAddingMascota(true);
                    alert("Mascota agregada correctamente 🐾");
                } else {
                    alert("Error al agregar la mascota");
                }
            } catch (error) {
                console.error("Error al crear mascota:", error);
            }
        }

    };
    if (loading || loadingPet) return <p>Cargando...</p>;

    return (
        <>
            <NavBar showProfileButton={false} />
            <SubNavBar />

            <div className="container mt-5">
                <h1 className="title has-text-centered">
                    Perfil del Usuario
                </h1>

                <FormUser
                    usuario={usuario}
                    usuarioEdit={usuarioEdit}
                    setUsuarioEdit={setUsuarioEdit}
                    editandoUsuario={editandoUsuario}
                    setEditandoUsuario={setEditandoUsuario}
                    especialidades={especialidades}
                    contrasenia={contrasenia}
                    setContrasenia={setContrasenia}
                    handleActualizarUsuario={handleActualizarUsuario}
                    handleCancel={handleCancel}
                />

                {mascotas.length === 0 && !addingMascota ? (
                    <div className="has-text-centered mt-5">
                        <p className="mb-4">
                            Este usuario no tiene mascotas registradas.
                        </p>

                        {puedeAgregarMascota && (
                            <button
                                className="button is-primary"
                                onClick={handleAgregarMascota}
                            >
                                Agregar mascota
                            </button>
                        )}
                    </div>
                ) : (
                    <FormPet
                        mascotas={mascotas}
                        mascotaEdit={mascotaEdit}
                        setMascotaEdit={setMascotaEdit}
                        editandoMascota={editandoMascota}
                        addingMascota={addingMascota}
                        currentIndex={currentIndex}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                        handleEditarMascota={handleEditarMascota}
                        handleAgregarMascota={handleAgregarMascota}
                        handleActualizarMascota={handleActualizarMascota}
                        handleCancel={handleCancel}
                        puedeAgregarMascota={puedeAgregarMascota}
                    />
                )}

                <div style={{ height: "50px" }}></div>
            </div>
        </>
    );
};

export default ProfileUser;