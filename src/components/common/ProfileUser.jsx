import { useState, useEffect } from "react";
import UserImage from "./UserImage.jsx";

const ProfileUser = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            setError("Usuario no autenticado");
            setLoading(false);
            return;
        }

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
            <div>
                <h1>¡HOLA {userData?.nombre ? userData.nombre.toUpperCase() : 'USUARIO'}!</h1>
                <UserImage />
                <hr />
            </div>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    defaultValue={userData?.nombre || ''} 
                    readOnly 
                />

                <label htmlFor="LastName">Apellido:</label>
                <input 
                    type="text" 
                    name="LastName" 
                    id="LastName" 
                    defaultValue={userData?.apellido || ''} 
                    readOnly 
                />

                <label htmlFor="born">Fecha de nacimiento:</label>
                <input 
                    type="date" 
                    name="born" 
                    id="born" 
                    defaultValue={userData?.fecha_nacimiento || ''} 
                    readOnly 
                />

                <label htmlFor="phone">Teléfono:</label>
                <input 
                    type="tel" 
                    name="phone" 
                    id="phone" 
                    defaultValue={userData?.telefono || ''} 
                    readOnly 
                />

                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    defaultValue={userData?.email || ''} 
                    readOnly 
                />

                <label htmlFor="pass">Contraseña:</label>
                <input 
                    type="password" 
                    name="pass" 
                    id="pass" 
                    placeholder="••••••••" 
                    readOnly 
                />
            </div>
            <div>
                <hr />
                <h2>MASCOTAS</h2>
                {mascotas.length > 1 ? (
                    <div className="carousel">
                        <button className="carousel-prev" onClick={handlePrev}>
                            <span className="icon is-small">
                                <i className="fas fa-chevron-left"></i>
                            </span>
                        </button>

                        <div className="carousel-item">
                            <h3>{mascotas[currentIndex].nombre_mascota}</h3>
                            <p>Fecha de nacimiento: {mascotas[currentIndex].fecha_nacimiento}</p>
                            <p>Raza: {mascotas[currentIndex].raza}</p>
                            <p>Peso: {mascotas[currentIndex].peso}</p>
                            <p>Tamaño: {mascotas[currentIndex].tamanio}</p>
                            <p>Largo del pelo: {mascotas[currentIndex].largo_pelo}</p>
                        </div>

                        <button className="carousel-next" onClick={handleNext}>
                            <span className="icon is-small">
                                <i className="fas fa-chevron-right"></i>
                            </span>
                        </button>
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
        </>
    );
};

export default ProfileUser;