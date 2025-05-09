import { useState, useEffect } from "react";
import UserImage from "./UserImage.jsx";
import NavBar from "./NavBar.jsx";
import SubNavBar from "./SubNavBar.jsx";

const ProfileUser = () => {
    /************Estados*************/
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        /*****************Obtengo ID del usuario******************/
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            setError("Usuario no autenticado");
            setLoading(false);
            return;
        }
        /*******************Obtengo los datos del usuario mediante un fetch************************/
        const fetchData = async () => {
            try {
                // 1. Obtenemos datos del usuario
                const userResponse = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getUserById.php`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ id: userId })
                    }
                );
                /**************Control de errores****************/
                if (!userResponse.ok) {
                    throw new Error(`Error usuario: ${userResponse.status}`);
                }

                const userJson = await userResponse.json();
                
                if (!userJson.success) {
                    throw new Error(userJson.message || "Error al obtener datos del usuario");
                }

                setUserData(userJson.user);

                // 2. Obtenemos las mascotas
                const petsResponse = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getPetsByClientId.php?userId=${userId}`,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                /**************Control de errores****************/
                if (!petsResponse.ok) {
                    throw new Error(`Error mascotas: ${petsResponse.status}`);
                }

                const petsJson = await petsResponse.json();
                
                if (!petsJson.success) {
                    throw new Error(petsJson.message || "Error al obtener mascotas");
                }

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

    if (loading) {
        return <p>Cargando datos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <NavBar showProfileButton={false}></NavBar>
            <SubNavBar  showBack ></SubNavBar>
            <div className="field">
                <div className="container">
                    <div className="">
                        <h1 className="title is-2">¡HOLA {userData?.nombre ? userData.nombre.toUpperCase() : 'USUARIO'}!</h1>
                        <UserImage userId={userData?.id_usuario}/>
                        <hr />
                    </div>
                    <label className="label" htmlFor="name">Nombre:</label>
                    <input className="input" type="text" name="name" id="name" defaultValue={userData?.nombre || ''} />

                    <label className="label" htmlFor="LastName">Apellido:</label>
                    <input className="input" type="text" name="LastName" id="LastName" defaultValue={userData?.apellido || ''} />

                    <label className="label" htmlFor="born">Fecha de nacimiento:</label>
                    <input className="input" type="date" name="born" id="born" defaultValue={userData?.fecha_nacimiento || ''} min="1900-01-01"/>

                    <label className="label" htmlFor="phone">Teléfono:</label>
                    <input className="input" type="tel" name="phone" id="phone" defaultValue={userData?.telefono || ''} readOnly />

                    <div class="field">
                    <label className="label" htmlFor="email">Email:</label>
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" type="email" placeholder="Email" defaultValue={userData?.email || ''} />
                        <span class="icon is-small is-left">
                        <i class="fas fa-envelope"></i>
                        </span>
                        <span class="icon is-small is-right">
                        <i class="fas fa-check"></i>
                        </span>
                    </p>
                    </div>
                    <div class="field">
                    <label className="label" htmlFor="pass">Contraseña:</label>
                    <p class="control has-icons-left">
                        <input class="input" type="password" name="pass" id="pass" placeholder="••••••••" readOnly />
                        <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
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
                                        <input className="input" type="date" name="pet-born" id="pet-born" defaultValue={mascotas[currentIndex].fecha_nacimiento || ''} min="1900-01-01"/>

                                        <label className="label" htmlFor="pet-race">Raza:</label>
                                        <input className="input" type="text" name="pet-race" id="pet-race" defaultValue={mascotas[currentIndex].raza || ''} />

                                        <label className="label" htmlFor="weight-name">Peso:</label>
                                        <input className="input" type="text" name="weight-name" id="weight-name" defaultValue={mascotas[currentIndex].peso || ''} />

                                        <label className="label" htmlFor="pet-size">Tamaño:</label>
                                        <input className="input" type="text" name="pet-size" id="pet-size" defaultValue={mascotas[currentIndex].tamanio || ''} />

                                        <label className="label" htmlFor="hair-length">Largo de pelo:</label>
                                        <input className="input" type="text" name="hair-length" id="hair-length" defaultValue={mascotas[currentIndex].largo_pelo|| ''} />
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
                        <p>No hay mascotas registradas</p>
                    )}
                </div>
                <hr />
                <div class="field is-grouped is-grouped-right">
                    <p class="control">
                        <button class="button is-primary is-link">
                        Aceptar
                        </button>
                    </p>
                    <p class="control">
                        <a class="button is-light">
                        Cancel
                        </a>
                    </p>
                </div>

            </div>
        </>
    );
};

export default ProfileUser;