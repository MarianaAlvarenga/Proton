import { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../common/Alert.jsx";
import NavBar from "../common/NavBar.jsx";
import SubNavBar from "../common/SubNavBar.jsx";

const Services = () => {
    const [servicios, setServicios] = useState([]);
    const [serviciosEdit, setServiciosEdit] = useState([]);
    const [editando, setEditando] = useState(false);

    // 🔹 Obtener especialidades
    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const res = await axios.post(
                "https://unless-scene-secrets-burst.trycloudflare.com/backend/actions/getEspecialidades.php"
            );

            setServicios(res.data);
            setServiciosEdit(res.data);
        } catch (error) {
            console.error("Error al obtener especialidades:", error);
        }
    };

    // 🔹 Editar solo precio
    const handlePrecioChange = (id, nuevoPrecio) => {
        setServiciosEdit(prev =>
            prev.map(s =>
                Number(s.id_servicio) === Number(id)
                    ? { ...s, precio: nuevoPrecio }
                    : s
            )
        );
    };

    // 🔹 Cancelar edición
    const handleCancel = () => {
        setServiciosEdit(servicios);
        setEditando(false);
    };

    // 🔹 Actualizar precios
    const handleActualizar = async () => {
        try {
            await axios.post(
                "https://unless-scene-secrets-burst.trycloudflare.com/backend/actions/updatePreciosEspecialidades.php",
                {
                    servicios: serviciosEdit,
                }
            );

            setServicios(serviciosEdit);
            setEditando(false);
        } catch (error) {
            console.error("Error al actualizar precios:", error);
        }
    };

    return (
        <div>
            <NavBar showProfileButton={false} />
            <SubNavBar currentPage="Servicios" />
            <div className="container mt-5">
                <h1 className="title is-2">Servicios</h1>
                {/* Botón editar */}
                <div className="field is-grouped mb-4">
                    <p className="control">
                        <button
                            className={`button ${editando ? "is-light" : "is-primary is-link"
                                }`}
                            onClick={() => setEditando(true)}
                        >
                            Editar precios
                        </button>
                    </p>
                </div>

                {/* Lista de servicios */}
                <div className="box">
                    {serviciosEdit.map(servicio => (
                        <div
                            key={servicio.id_servicio}
                            className="columns is-vcentered mb-2"
                        >
                            <div className="column is-7">
                                <strong>{servicio.nombre}</strong>
                            </div>

                            <div className="column is-5">
                                {editando ? (
                                    <input
                                        className="input"
                                        type="number"
                                        min="0"
                                        value={servicio.precio || ""}
                                        onChange={e =>
                                            handlePrecioChange(
                                                servicio.id_servicio,
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : (
                                    <span>${servicio.precio}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botones actualizar / cancelar */}
                {editando && (
                    <div className="field is-grouped is-grouped-right mt-4">
                        <button
                            className="button is-light is-fullwidth"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>

                        <button
                            className="button is-primary is-link is-fullwidth"
                            onClick={handleActualizar}
                        >
                            Actualizar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
