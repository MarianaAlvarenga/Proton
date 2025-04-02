import { useState, useEffect } from "react";
import UserImage from "./UserImage.jsx";

const ProfileUser = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const userId = localStorage.getItem('userId');
        
                if (!userId) {
                    setError("Usuario no autenticado");
                    setLoading(false);
                    return;
                }
                
                console.log("📡 Enviando solicitud a getPetsByClientId.php...");
                const response = await fetch(
                    `http://localhost:8080/Proton/backend/actions/getPetsByClientId.php?userId=${userId}`, 
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                
                console.log("📩 Respuesta recibida:", response);
        
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `HTTP error! Status: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Respuesta no es JSON: ${text}`);
                }

                const data = await response.json();
                console.log("📊 Datos recibidos:", data);

                if (data.success) {
                    setMascotas(data.mascotas || []);
                } else {
                    setError(data.message || "No se pudieron cargar las mascotas");
                }
            } catch (error) {
                console.error("❌ Error al obtener mascotas:", error);
                setError("Error al cargar las mascotas: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMascotas();
    }, []);

    // Resto del componente permanece igual...
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mascotas.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? mascotas.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            <div>
                <h1>¡HOLA FULANO!</h1>
                <UserImage />
                <hr />
            </div>
            <div>
                <label htmlFor="name">Nombre:</label>
                <input type="text" name="name" id="name" />

                <label htmlFor="LastName">Apellido:</label>
                <input type="text" name="LastName" id="LastName" />

                <label htmlFor="born">Fecha de nacimiento:</label>
                <input type="date" name="born" id="born" />

                <label htmlFor="phone">Telefono:</label>
                <input type="tel" name="phone" id="phone" />

                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" />

                <label htmlFor="pass">Contraseña:</label>
                <input type="password" name="pass" id="pass" />
            </div>
            <div>
                <hr />
                <h2>MASCOTAS</h2>
                {loading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : mascotas.length > 1 ? (
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
                            <p>Tamaño: {mascotas[currentIndex].tamaño}</p>
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
                        <p>Tamaño: {mascotas[0].tamaño}</p>
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