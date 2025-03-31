import { useState, useEffect } from "react";
import UserImage from "./UserImage.jsx";

const ProfileUser = () => {
    const [mascotas, setMascotas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // Índice de la mascota actual

    useEffect(() => {
        const fetchMascotas = async () => {
          try {
            // Obtener el userId desde localStorage
            const userId = localStorage.getItem('userId');
      
            if (!userId) {
              setError("Usuario no autenticado");
              return;
            }
            console.log(userId);
            console.log("📡 Enviando solicitud a getPetsByClientId.php...");
            const response = await fetch(`http://localhost:8080/Proton/backend/actions/getPetsByClientId.php`, {
                method: "GET",
                credentials: "include",
              });
              
            console.log("📩 Respuesta recibida:", response);
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            // Leer la respuesta como texto
            const responseBody = await response.text();
            console.log("Cuerpo de la respuesta:", responseBody);

            // Intentar parsear la respuesta como JSON
            try {
              const data = JSON.parse(responseBody);
              console.log("📊 Datos recibidos:", data);

              if (data.success) {
                setMascotas(data.mascotas);
              } else {
                setError(data.message);
              }
            } catch (error) {
              console.error("❌ Error al parsear JSON:", error);
              setError("Error al procesar la respuesta");
            }
          } catch (error) {
            console.error("❌ Error al obtener mascotas:", error);
            setError("Error al cargar las mascotas");
          } finally {
            setLoading(false);
          }
        };
      
        fetchMascotas();
      }, []);
    
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
                ) : (
                    mascotas.map((mascota, index) => (
                        <div key={index}>
                            <h3>{mascota.nombre_mascota}</h3>
                            <p>Fecha de nacimiento: {mascota.fecha_nacimiento}</p>
                            <p>Raza: {mascota.raza}</p>
                            <p>Peso: {mascota.peso}</p>
                            <p>Tamaño: {mascota.tamaño}</p>
                            <p>Largo del pelo: {mascota.largo_pelo}</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default ProfileUser;
