import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserImage from "./UserImage.jsx";
import PetImage from "./PetImage.jsx";
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
    const [editandoMascota, setEditandoMascota] = useState(false);
    const [mascotaEdit, setMascotaEdit] = useState(null);
    const [editandoUsuario, setEditandoUsuario] = useState(false);
    const [usuarioEdit, setUsuarioEdit] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (mascotas.length > 0) {
            setMascotaEdit({ ...mascotas[currentIndex] });
        }
    }, [currentIndex, mascotas]);

    useEffect(() => {
        if (userData) {
            setUsuarioEdit({ ...userData });
        }
    }, [userData]);

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

    const handleActualizarUsuario = async () => {
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
            } else {
                setMensaje({ tipo: 'error', texto: json.message || "Error al actualizar" });
            }
        } catch (error) {
            setMensaje({ tipo: 'error', texto: "Error en la conexión al servidor." });
        }
    };

    const handleActualizarMascota = async () => {
        if (!mascotaEdit) return;

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
                setMensaje({ tipo: 'exito', texto: json.message });
                setMascotas(prev => {
                    const updated = [...prev];
                    updated[currentIndex] = { ...mascotaEdit };
                    return updated;
                });
            } else {
                setMensaje({ tipo: 'error', texto: json.message || 'Error al actualizar mascota' });
            }
        } catch (error) {
            setMensaje({ tipo: 'error', texto: 'Error en la conexión al servidor.' });
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
                        <p className="control">
                            <button className={`${editandoUsuario ? "button is-primary is-link" : "button is-light"}`} onClick={() => setEditandoUsuario(true)}>
                                Editar perfil
                            </button>
                        </p>
                    </div>
                    <label className="label" htmlFor="name">Nombre:</label>
                    <input className="input" type="text" name="name" id="name" defaultValue={userData?.nombre || ''} 
                           readOnly={!editandoUsuario}/>

                    <label className="label" htmlFor="LastName">Apellido:</label>
                    <input className="input" type="text" name="LastName" id="LastName" defaultValue={userData?.apellido || ''} 
                           readOnly={!editandoUsuario}/>

                    <label className="label" htmlFor="born">Fecha de nacimiento:</label>
                    <input className="input" type="date" name="born" id="born" defaultValue={userData?.fecha_nacimiento || ''} min="1900-01-01" 
                           readOnly={!editandoUsuario}/>

                    <label className="label" htmlFor="phone">Teléfono:</label>
                    <input className="input" type="tel" name="phone" id="phone" defaultValue={userData?.telefono || ''} 
                           readOnly={!editandoUsuario} />

                    <div className="field">
                        <label className="label" htmlFor="email">Email:</label>
                        <p className="control has-icons-left has-icons-right">
                            <input
                                className="input"
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={userData?.email || ''}
                                readOnly={!editandoUsuario}
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
                                readOnly={!editandoUsuario}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field is-grouped is-grouped-right mb-2">
                        <p className="control">
                            <button className="button is-primary is-link" onClick={handleActualizarUsuario}>
                                Actualizar
                            </button>
                        </p>
                        <p className="control">
                            <button className="button is-light" onClick={handleCancel}>
                                Cancelar
                            </button>
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
                                <div className="column is-narrow has-text-centered">
                                    <button className="button is-white" onClick={handleNext}>
                                        <span className="icon is-large">
                                            <i className="fas fa-chevron-right fa-2x"></i>
                                        </span>
                                    </button>
                                </div>
                                <div className="carousel-item">
                                    
                                    <div className="column">
                                        <h3 className="title is-2">{mascotas[currentIndex].nombre_mascota}</h3>
                                        <p className="control">
                                            <button className={`${editandoMascota ? "button is-primary is-link" : "button is-light"}`} onClick={() => setEditandoMascota(true)}>
                                                Editar mascota
                                            </button>
                                        </p>
                                        <PetImage petId={mascotas[currentIndex].id_mascota} />
                                        <label className="label" htmlFor="pet-name">Nombre:</label>
                                        <input className="input" type="text" name="pet-name" id="pet-name" value={mascotaEdit?.nombre_mascota || ''} 
                                               onChange={(e) => setMascotaEdit(prev => ({ ...prev, nombre_mascota: e.target.value }))} 
                                               readOnly={!editandoMascota}/>

                                        <label className="label" htmlFor="pet-born">Fecha de nacimiento:</label>
                                        <input className="input" type="date" name="pet-born" id="pet-born" value={mascotaEdit?.fecha_nacimiento || ''} min="1900-01-01" 
                                               onChange={(e) => setMascotaEdit(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                                               readOnly={!editandoMascota}/>

                                        <label className="label" htmlFor="pet-species">Especie:</label>
                                        <div className="select is-fullwidth">
                                            <select
                                                id="pet-species"
                                                name="pet-species"
                                                value={mascotaEdit?.especie || ''}   
                                                onChange={(e) => 
                                                setMascotaEdit(prev => ({ ...prev, especie: e.target.value }))
                                                }
                                                disabled={!editandoMascota}          
                                            >
                                                <option value="gato">Gato</option>
                                                <option value="perro">Perro</option>
                                                <option value="huron">Hurón</option>
                                                <option value="conejito-de-la-india">Conejito de la india</option>
                                                <option value="conejo">Conejo</option>
                                                <option value="pez">Pez</option>
                                                <option value="ave">Ave</option>
                                            </select>
                                        </div>

                                        <label className="label" htmlFor="pet-race">Raza:</label>
                                        <input className="input" type="text" name="pet-race" id="pet-race" value={mascotaEdit?.raza || ''} 
                                               onChange={(e) => setMascotaEdit(prev => ({ ...prev, raza: e.target.value }))}
                                               readOnly={!editandoMascota}/>

                                        <label className="label" htmlFor="pet-sex">Sexo:</label>
                                        <div className="select is-fullwidth">
                                            <select
                                                id="pet-sex"
                                                name="pet-sex"
                                                value={mascotaEdit?.sexo || ''}   
                                                onChange={(e) => 
                                                setMascotaEdit(prev => ({ ...prev, sexo: e.target.value }))
                                                }
                                                disabled={!editandoMascota}          
                                            >
                                                <option value="macho">Macho</option>
                                                <option value="hembra">Hembra</option>
                                            </select>
                                        </div>

                                        <label className="label" htmlFor="weight-name">Peso:</label>
                                        <input className="input" type="text" name="weight-name" id="weight-name" value={mascotaEdit?.peso || ''} 
                                               onChange={(e) => setMascotaEdit(prev => ({ ...prev, peso: e.target.value }))}
                                               readOnly={!editandoMascota}/>

                                        <label className="label" htmlFor="pet-size">Tamaño:</label>
                                        <div className="select is-fullwidth">
                                            <select
                                                id="tamanio"
                                                name="tamanio"
                                                value={mascotaEdit?.tamanio || ''}   
                                                onChange={(e) => 
                                                setMascotaEdit(prev => ({ ...prev, tamanio: e.target.value }))
                                                }
                                                disabled={!editandoMascota}          
                                            >
                                                <option value="pequenio">Pequeño</option>
                                                <option value="mediano">Mediano</option>
                                                <option value="grande">Grande</option>
                                            </select>
                                        </div>

                                        <label className="label" htmlFor="hair-length">Largo de pelo:</label>
                                        <div className="select is-fullwidth">
                                            <select
                                                id="largo_pelo"
                                                name="largo_pelo"
                                                value={mascotaEdit?.largo_pelo || ''}   
                                                onChange={(e) => 
                                                setMascotaEdit(prev => ({ ...prev, largo_pelo: e.target.value }))
                                                }
                                                disabled={!editandoMascota}          
                                            >
                                                <option value="muy corto">Muy corto</option>
                                                <option value="corto">Corto</option>
                                                <option value="largo">Largo</option>
                                                <option value="muy largo">Muy largo</option>
                                            </select>
                                        </div>
                                    
                                        
                                        <label className="label" htmlFor="pet-color">Color:</label>
                                        <input className="input" type="text" name="pet-color" id="pet-color" value={mascotaEdit?.color || ''} 
                                               onChange={(e) => setMascotaEdit(prev => ({ ...prev, color: e.target.value }))}
                                               readOnly={!editandoMascota}/>

                                        <label className="label" for="pet-detail">Información médica relevante:</label>
                                        <textarea className="textarea" id="pet-detail" name="pet-detail" rows="5" cols="30"
                                                  onChange={(e) => setMascotaEdit(prev => ({ ...prev, detalle: e.target.value }))}
                                                  readOnly={!editandoMascota}>{mascotaEdit?.detalle || ''}</textarea>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    ) : mascotas.length === 1 ? (
                        <div>
                            <div className="columns is-vcentered is-mobile">
                                <div className="column">
                                    <h3 className="title is-2">{mascotas[0].nombre_mascota}</h3>
                                    <p className="control">
                                        <button className={`${editandoMascota ? "button is-primary is-link" : "button is-light"}`} onClick={() => setEditandoMascota(true)}>
                                            Editar mascota
                                        </button>
                                    </p>
                                    <PetImage petId={mascotas[0].id_mascota} />
                                    <label className="label" htmlFor="pet-name">Nombre:</label>
                                    <input className="input" type="text" name="pet-name" id="name" value={mascotaEdit?.nombre_mascota || ''} 
                                            onChange={(e) => setMascotaEdit(prev => ({ ...prev, nombre_mascota: e.target.value }))}
                                            readOnly={!editandoMascota}/>

                                    <label className="label" htmlFor="pet-born">Fecha de nacimiento:</label>
                                    <input className="input" type="date" name="pet-born" id="pet-born" value={mascotaEdit?.fecha_nacimiento || ''} min="1900-01-01" 
                                           onChange={(e) => setMascotaEdit(prev => ({ ...prev, fecha_nacimiento: e.target.value }))}
                                           readOnly={!editandoMascota}/>

                                    <label className="label" htmlFor="pet-species">Especie:</label>
                                    <div className="select is-fullwidth">
                                        <select
                                            id="pet-species"
                                            name="pet-species"
                                            value={mascotaEdit?.especie || ''}   
                                            onChange={(e) => 
                                            setMascotaEdit(prev => ({ ...prev, especie: e.target.value }))
                                            }
                                            disabled={!editandoMascota}          
                                        >
                                            <option value="gato">Gato</option>
                                            <option value="perro">Perro</option>
                                            <option value="huron">Hurón</option>
                                            <option value="conejito-de-la-india">Conejito de la india</option>
                                            <option value="conejo">Conejo</option>
                                            <option value="pez">Pez</option>
                                            <option value="ave">Ave</option>
                                        </select>
                                    </div>

                                    <label className="label" htmlFor="pet-race">Raza:</label>
                            
                                    <input className="input" type="text" name="pet-race" id="pet-race" value={mascotaEdit?.raza || ''} 
                                           onChange={(e) => setMascotaEdit(prev => ({ ...prev, raza: e.target.value }))}
                                           readOnly={!editandoMascota}/>

                                    <label className="label" htmlFor="pet-sex">Sexo:</label>
                                    <div className="select is-fullwidth">
                                        <select
                                            id="pet-sex"
                                            name="pet-sex"
                                            value={mascotaEdit?.sexo || ''}   
                                            onChange={(e) => 
                                            setMascotaEdit(prev => ({ ...prev, sexo: e.target.value }))
                                            }
                                            disabled={!editandoMascota}          
                                        >
                                            <option value="macho">Macho</option>
                                            <option value="hembra">Hembra</option>
                                        </select>
                                    </div>

                                    <label className="label" htmlFor="weight-name">Peso:</label>
                                    <input className="input" type="text" name="weight-name" id="weight-name" value={mascotaEdit?.peso || ''} 
                                           onChange={(e) => setMascotaEdit(prev => ({ ...prev, peso: e.target.value }))}
                                           readOnly={!editandoMascota}/>

                                    <label className="label" htmlFor="pet-size">Tamaño:</label>
                                    <div className="select is-fullwidth">
                                        <select
                                            id="tamanio"
                                            name="tamanio"
                                            value={mascotaEdit?.tamanio || ''}   
                                            onChange={(e) => 
                                            setMascotaEdit(prev => ({ ...prev, tamanio: e.target.value }))
                                            }
                                            disabled={!editandoMascota}          
                                        >
                                            <option value="pequenio">Pequeño</option>
                                            <option value="mediano">Mediano</option>
                                            <option value="grande">Grande</option>
                                        </select>
                                    </div>

                                    <label className="label" htmlFor="largo_pelo">Largo de pelo:</label>
                                    <div className="select is-fullwidth">
                                        <select
                                            id="largo_pelo"
                                            name="largo_pelo"
                                            value={mascotaEdit?.largo_pelo || ''}   
                                            onChange={(e) => 
                                            setMascotaEdit(prev => ({ ...prev, largo_pelo: e.target.value }))
                                            }
                                            disabled={!editandoMascota}          
                                        >
                                            <option value="muy corto">Muy corto</option>
                                            <option value="corto">Corto</option>
                                            <option value="largo">Largo</option>
                                            <option value="muy largo">Muy largo</option>
                                        </select>
                                    </div>
                                
                                    
                                    <label className="label" htmlFor="pet-color">Color:</label>
                                    <input className="input" type="text" name="pet-color" id="pet-color" value={mascotaEdit?.color || ''} 
                                           onChange={(e) => setMascotaEdit(prev => ({ ...prev, color: e.target.value }))}
                                           readOnly={!editandoMascota}/>

                                    <label className="label" for="pet-detail">Información médica relevante:</label>
                                    <textarea className="textarea" id="pet-detail" name="pet-detail" rows="5" cols="30"
                                              onChange={(e) => setMascotaEdit(prev => ({ ...prev, detalle: e.target.value }))}
                                              readOnly={!editandoMascota}>{mascotaEdit?.detalle || ''}</textarea>

                                </div>
                            </div>
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

                <div className="field is-grouped is-grouped-right mb-2">
                    <p className="control">
                        <button className="button is-primary is-link" onClick={handleActualizarMascota}>
                            Actualizar
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
