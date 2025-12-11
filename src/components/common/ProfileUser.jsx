import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage.jsx";
import PetImage from "./PetImage.jsx";
import NavBar from "./NavBar.jsx";
import SubNavBar from "./SubNavBar.jsx";
import ComboBox from "./ComboBox";
import FormUser from "./FormUser.jsx";
import FormPet from "./FormPet.jsx";

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

    console.log("id_usuario: ");
    console.log(localStorage.getItem('userId'));

    const id_usuario = localStorage.getItem('userId');
    useEffect(() => {
        if (!localStorage.getItem('userId')) {
            console.log("NO TENGO USERID");
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/Proton/backend/actions/getUserById.php",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: id_usuario })
                    }
                );

                const data = await response.json();
                console.log("DATA--->");
                console.log(data.user);

                const userClean = {
                    ...data.user,
                    fecha_nacimiento:
                        data.user.fecha_nacimiento === "0000-00-00"
                            ? ""
                            : data.user.fecha_nacimiento,
                    imagen: data.user.img_url || ""
                };

                setUsuario(userClean);
                setUsuarioEdit(userClean);

                setLoading(false);
                console.log("LOADING FALSE");
            } catch (error) {
                console.error("Error al cargar usuario:", error);
            }
        };

        fetchUser();
    }, [navigate, storedUser]);

    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getPetsByClientId.php?userId=${id_usuario}`,
                    {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                    }
                );
                const data = await response.json();

                setMascotas(data.mascotas || []);  // ← ACA EL FIX

                console.log("MASCOTAS RECIBIDAS:", data.mascotas);

                setLoadingPet(false);

            } catch (error) {
                console.error("Error al cargar mascotas:", error);
            }
    
        };

        fetchMascotas();
    }, [storedUser]);

    useEffect(() => {
        console.log("MASCOTAS ACTUALIZADAS --->", mascotas);
    }, [mascotas]);

    useEffect(() => {
        const fetchEspecialidades = async () => {
                try {
                    const resEsp = await fetch("http://localhost:8080/Proton/backend/actions/getEspecialidades.php");
                    if (resEsp.ok) {
                        const data = await resEsp.json();
                        setEspecialidades(data);
                    } else {
                        console.warn("No se pudieron obtener especialidades:", resEsp.status);
                    }

                } catch (err) {
                    console.error("Error al obtener especialidades:", err);
                }
        };

        fetchEspecialidades();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? mascotas.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === mascotas.length - 1 ? 0 : prev + 1));
    };

    const handleEditarMascota = () => {
        setEditandoMascota(true);
        setAddingMascota(false);

        const mascotaActual = mascotas[currentIndex];

        setMascotaEdit({
            ...mascotaActual,
        });
    };
    
    const handleAgregarMascota = () => {
        setAddingMascota(true);
        setEditandoMascota(true);

        setMascotaEdit({
            id_usuario: userData?.id_usuario || usuarioEdit?.id_usuario || "",
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

        // index apunta al formulario vacío
        setCurrentIndex(mascotas.length);
    };

    const handleCancel = () => {
        setEditandoUsuario(false);
        setEditandoMascota(false);
        setAddingMascota(false);

        setUsuarioEdit(usuario);
        setMascotaEdit(null);
    };

    // --------------------------------------------------
    // 🔥 ACTUALIZAR USUARIO (fix contraseña + especialidades)
    // --------------------------------------------------
    const handleActualizarUsuario = async () => {

        // 🔥 FIX IMPORTANTE //
        // Agrega la contraseña al objeto usuarioEdit ANTES de enviarlo
        if (contrasenia) {
            usuarioEdit.contrasenia = contrasenia;
        }

        const formData = new FormData();

        Object.keys(usuarioEdit).forEach((key) => {
            if (key === "especialidades" && Array.isArray(usuarioEdit[key])) {
                usuarioEdit[key].forEach((id, index) => {
                    formData.append(`especialidades[${index}]`, id);
                });
            } else {
                formData.append(key, usuarioEdit[key]);
            }
        });

        try {
            const response = await fetch("http://localhost:8080/Proton/backend/actions/updateUser.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setUsuario(usuarioEdit);
                setEditandoUsuario(false);
                alert("Usuario actualizado correctamente.");
            } else {
                alert("Error al actualizar usuario.");
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
                    `http://localhost:8080/Proton/backend/actions/updatePet.php`,
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
                } else {
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
                    `http://localhost:8080/Proton/backend/actions/addPet.php`,
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
                                "http://localhost:8080/Proton/backend/actions/upload_pet_image.php",
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
                                try { err = JSON.parse(uploadText); } catch(e){ /* ignore */ }
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
                } else {
                    console.warn("addPet respondió success=false:", json);
                }
            } catch (error) {
                console.error("Error al crear mascota:", error);
            }
        }

    };

    if (loading || loadingPet) return <p>Cargando...</p>;

    return (
        <>
            <NavBar showProfileButton={false}/>
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
                />
                <div style={{ height: "50px" }}></div>
            </div>
        </>
    );
};

export default ProfileUser;
