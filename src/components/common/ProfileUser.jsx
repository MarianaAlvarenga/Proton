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

    const puedeAgregarMascota = usuario?.rol === 1;

    useEffect(() => {
        if (!id_usuario) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(
                    "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/getUserById.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: id_usuario })
                    }
                );

                const data = await response.json();

                const userClean = {
                    ...data.user,
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
                    `https://while-expertise-wed-lately.trycloudflare.com/backend/actions/getPetsByClientId.php?userId=${id_usuario}`
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
                    "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/getEspecialidades.php"
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
                formData.append("especialidades", JSON.stringify(usuarioEdit.especialidades));
            } else if (usuarioEdit[key] !== null && usuarioEdit[key] !== undefined) {
                formData.append(key, usuarioEdit[key]);
            }
        });

        if (contrasenia && contrasenia.trim() !== "") {
            formData.append("contrasenia", contrasenia);
        }

        try {
            const response = await fetch(
                "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/updateUser.php",
                { method: "POST", body: formData }
            );

            const result = await response.json();

            if (result.success) {
                setUsuario(usuarioEdit);
                setEditandoUsuario(false);
                return Alert({
                    Title: "Actualización",
                    Detail: "Usuario actualizado correctamente.",
                    icon: "success",
                    Confirm: "Ok"
                });
            } else {
                return Alert({
                    Title: "Actualización",
                    Detail: "Error al actualizar usuario.",
                    icon: "error",
                    Confirm: "Ok"
                });
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        }
    };

    const handleActualizarMascota = async () => {
        if (!mascotaEdit) return;

        if (mascotaEdit.id_mascota) {
            try {
                const response = await fetch(
                    "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/updatePet.php",
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
                        Detail: "Mascota actualizada correctamente 🐾",
                        icon: "success",
                        Confirm: "Ok"
                    });
                } else {
                    return Alert({
                        Detail: "Error al actualizar la mascota",
                        icon: "error",
                        Confirm: "Ok"
                    });
                }
            } catch (error) { }
        } else {
            try {
                const pendingFile = mascotaEdit?.pendingImageFile || null;

                const payload = {
                    ...mascotaEdit,
                    id_usuario: mascotaEdit.id_usuario || userData?.id_usuario
                };

                const response = await fetch(
                    "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/addPet.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    }
                );

                const json = await response.json();

                if (json.success) {
                    const newPet = {
                        id_mascota: json.id_mascota,
                        id_usuario: usuarioEdit.id_usuario,
                        ...payload,
                        img_url: json.img_url ?? null
                    };

                    setMascotas(prev => {
                        const updated = [...prev, newPet];
                        setCurrentIndex(updated.length - 1);
                        return updated;
                    });

                    setMascotaEdit({ ...newPet });
                    setEditandoMascota(false);
                    setAddingMascota(true);

                    Alert({
                        Title: "Mascota agregada",
                        Detail: "La mascota se agregó correctamente 🐾",
                        icon: "success",
                        Confirm: "Genial"
                    });
                } else {
                    Alert({
                        Title: "Error",
                        Detail: "No se pudo agregar la mascota.",
                        icon: "error",
                        Confirm: "Cerrar"
                    });
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
                <h1 className="title has-text-centered">Perfil del Usuario</h1>

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
                        <p className="mb-4">Este usuario no tiene mascotas registradas.</p>
                        {puedeAgregarMascota && (
                            <button className="button is-primary" onClick={handleAgregarMascota}>
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
