import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage.jsx";
import NavBar from "./NavBar.jsx";
import SubNavBar from "./SubNavBar.jsx";

const ProfileUser = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userData, setUserData] = useState(null);
    const [contrasenia, setContrasenia] = useState("");
    const [mensaje, setMensaje] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError("Usuario no autenticado");
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                const userResponse = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getUserById.php`,
                    {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({ id: userId })
                    }
                );
                if (!userResponse.ok) throw new Error(`Error usuario: ${userResponse.status}`);

                const userJson = await userResponse.json();
                if (!userJson.success) throw new Error(userJson.message || "Error al obtener datos del usuario");

                setUserData(userJson.user);
                setContrasenia("");

                const petsResponse = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getPetsByClientId.php?userId=${userId}`,
                    {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                    }
                );
                if (!petsResponse.ok) throw new Error(`Error mascotas: ${petsResponse.status}`);

                const petsJson = await petsResponse.json();
                if (!petsJson.success) throw new Error(petsJson.message || "Error al obtener mascotas");

                setMascotas(petsJson.mascotas || []);
            } catch (err) {
                console.error("Error en fetchData:", err);
                setError(err.message || "Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mascotas.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? mascotas.length - 1 : prevIndex - 1
        );
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleAceptar = async () => {
        if (!userData) return;

        const nombre = document.getElementById('name').value.trim();
        const apellido = document.getElementById('LastName').value.trim();
        const fecha_nacimiento = document.getElementById('born').value;
        const telefono = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!nombre || !apellido || !fecha_nacimiento || !telefono || !email) {
            setMensaje({ tipo: 'error', texto: "Por favor complete todos los campos." });
            return;
        }

        const payload = {
            id_usuario: userData.id_usuario,
            nombre,
            apellido,
            fecha_nacimiento,
            telefono,
            email,
            rol: userData.rol
        };

        if (contrasenia.trim() !== "") {
            payload.contrasenia = contrasenia.trim();
        }

        try {
            const response = await fetch(
                `http://localhost:8080/Proton/backend/actions/updateUser.php`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const json = await response.json();

            if (json.success) {
                setMensaje({ tipo: 'exito', texto: json.message });
                setUserData(prev => ({ ...prev, nombre, apellido, fecha_nacimiento, telefono, email }));
                setContrasenia("");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                setMensaje({ tipo: 'error', texto: json.message || "Error al actualizar" });
            }
        } catch (error) {
            setMensaje({ tipo: 'error', texto: "Error en la conexión al servidor." });
        }
    };

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <NavBar showProfileButton={false}></NavBar>
            <SubNavBar showBack></SubNavBar>
            <div className="field">
                <div className="container">
                    <div className="">
                        <h1 className="title is-2">¡HOLA {userData?.nombre ? userData.nombre.toUpperCase() : 'USUARIO'}!</h1>
                        <UserImage userId={userData?.id_usuario} />
                        <hr />
                    </div>
                    <label className="label" htmlFor="name">Nombre:</label>
                    <input className="input" type="text" name="name" id="name" defaultValue={userData?.nombre || ''} />

                    <label className="label" htmlFor="LastName">Apellido:</label>
                    <input className="input" type="text" name="LastName" id="LastName" defaultValue={userData?.apellido || ''} />

                    <label className="label" htmlFor="born">Fecha de nacimiento:</label>
                    <input className="input" type="date" name="born" id="born" defaultValue={userData?.fecha_nacimiento || ''} min="1900-01-01" />

                    <label className="label" htmlFor="phone">Teléfono:</label>
                    <input className="input" type="tel" name="phone" id="phone" defaultValue={userData?.telefono || ''} readOnly />

                    <div className="field">
                        <label className="label" htmlFor="email">Email:</label>
                        <p className="control has-icons-left has-icons-right">
                            <input
                                className="input"
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={userData?.email || ''}
                                readOnly
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-envelope"></i>
                            </span>
                            <span className="icon is-small is-right">
                                <i className="fas fa-check"></i>
                            </span>
                        </p>
                    </div>

                    <div className="field">
                        <label className="label" htmlFor="pass">Contraseña:</label>
                        <p className="control has-icons-left">
                            <input
                                className="input"
                                type="text"
                                name="pass"
                                id="pass"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                placeholder="Ingrese nueva contraseña o deje vacío para no cambiar"
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                </div>

                <div>
                    {mascotas.length > 1 ? (
                        <div className="container">
                            <hr />
                            <h2 className="title is-3 has-text-centered">MASCOTAS</h2>

                            <div className="columns is-vcentered is-mobile">
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-white carousel-prev" onClick={handlePrev}>
                                        <span className="icon is-large">
                                            <i className="fas fa-chevron-left fa-2x"></i>
                                        </span>
                                    </button>
                                </div>
                                <div className="carousel-item">
                                    <div className="column">
                                        <h3 className="title is-4">{mascotas[currentIndex].nombre_mascota}</h3>

                                        <label className="label" htmlFor="pet-name">Nombre:</label>
                                        <input className="input" type="text" name="pet-name" id="name" defaultValue={mascotas[currentIndex].nombre_mascota || ''} />

                                        <label className="label" htmlFor="pet-born">Fecha de nacimiento:</label>
                                        <input className="input" type="date" name="pet-born" id="pet-born" defaultValue={mascotas[currentIndex].fecha_nacimiento || ''} min="1900-01-01" />

                                        <label className="label" htmlFor="pet-race">Raza:</label>
                                        <input className="input" type="text" name="pet-race" id="pet-race" defaultValue={mascotas[currentIndex].raza || ''} />

                                        <label className="label" htmlFor="weight-name">Peso:</label>
                                        <input className="input" type="text" name="weight-name" id="weight-name" defaultValue={mascotas[currentIndex].peso || ''} />

                                        <label className="label" htmlFor="pet-size">Tamaño:</label>
                                        <input className="input" type="text" name="pet-size" id="pet-size" defaultValue={mascotas[currentIndex].tamanio || ''} />

                                        <label className="label" htmlFor="hair-length">Largo de pelo:</label>
                                        <input className="input" type="text" name="hair-length" id="hair-length" defaultValue={mascotas[currentIndex].largo_pelo || ''} />
                                    </div>

                                    <div className="column is-narrow has-text-centered">
                                        <button className="button is-white" onClick={handleNext}>
                                            <span className="icon is-large">
                                                <i className="fas fa-chevron-right fa-2x"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : mascotas.length === 1 ? (
                        <div>
                            <h3>{mascotas[0].nombre_mascota}</h3>
                            <p>Fecha de nacimiento: {mascotas[0].fecha_nacimiento}</p>
                            <p>Raza: {mascotas[0].raza}</p>
                            <p>Peso: {mascotas[0].peso}</p>
                            <p>Tamaño: {mascotas[0].tamanio}</p>
                            <p>Largo del pelo: {mascotas[0].largo_pelo}</p>
                        </div>
                    ) : (
                        userData?.rol === 1 ? (
            <p>No hay mascotas registradas</p>
        ) : null
                    )}
                </div>

                <hr />

                {mensaje && (
                    <p
                        style={{
                            color: mensaje.tipo === "exito" ? "green" : "red",
                            fontWeight: "bold",
                        }}
                    >
                        {mensaje.texto}
                    </p>
                )}

                <div className="field is-grouped is-grouped-right">
                    <p className="control">
                        <button className="button is-primary is-link" onClick={handleAceptar}>
                            Aceptar
                        </button>
                    </p>
                    <p className="control">
                        <button className="button is-light" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
};

export default ProfileUser;
