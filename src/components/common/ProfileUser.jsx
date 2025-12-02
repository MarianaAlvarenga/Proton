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

    // -----------------------
    // Cargar datos del usuario
    // -----------------------
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
                    imagen: data.user.img_url || ""   // <--- ESTE ES EL CAMPO CORRECTO
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

    // -----------------------
    // Cargar mascotas
    // -----------------------
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

                setMascotas(data || []);
                console.log("LOADINGPET FALSE");
                setLoadingPet(false);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
            }
    
        };

        fetchMascotas();
    }, [storedUser]);

    // -----------------------
    // Cargar especialidades
    // -----------------------
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

    // -----------------------
    // Navegación del carrusel
    // -----------------------
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? mascotas.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === mascotas.length - 1 ? 0 : prev + 1));
    };

    // -----------------------
    // Editar Mascota
    // -----------------------
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
            id_usuario: usuarioEdit?.id_usuario || "",
            nombre_mascota: "",
            fecha_nacimiento: "",
            raza: "",
            peso: "",
            tamanio: "",
            largo_pelo: "",
            especie: "",
            sexo: "",
            color: "",
            imagen: "http://localhost:8080/Proton/src/assets/images/perro.png"
        });
    };

    const handleCancel = () => {
        setEditandoUsuario(false);
        setEditandoMascota(false);
        setAddingMascota(false);

        setUsuarioEdit(usuario);
        setMascotaEdit(null);
    };

    // -----------------------
    // Actualizar Usuario
    // -----------------------
    const handleActualizarUsuario = async () => {
        const formData = new FormData();

        Object.keys(usuarioEdit).forEach((key) => {
            formData.append(key, usuarioEdit[key]);
        });

        if (contrasenia) {
            formData.append("contrasenia", contrasenia);
        }

        try {
            const response = await fetch("http://localhost:8080/Proton/backend/update_user.php", {
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

    // -----------------------
    // Actualizar Mascota
    // -----------------------
    const handleActualizarMascota = async () => {
        const formData = new FormData();

        Object.keys(mascotaEdit).forEach((key) => {
            formData.append(key, mascotaEdit[key]);
        });

        try {
            const response = await fetch(
                "http://localhost:8080/Proton/backend/update_mascota.php",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (result.success) {
                alert("Mascota actualizada correctamente.");
                window.location.reload();
            } else {
                alert("Error al actualizar mascota.");
            }
        } catch (error) {
            console.error("Error al actualizar mascota:", error);
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
            </div>
        </>
    );
};

export default ProfileUser;
