// src/components/FormPet.jsx
import PetImage from "./PetImage.jsx";

const FormPet = ({
    mascotas,
    currentIndex,
    handlePrev,
    handleNext,
    mascotaEdit,
    setMascotaEdit,
    editandoMascota,
    addingMascota,
    handleAgregarMascota,
    handleActualizarMascota,
    handleCancel,
}) => {
    const mascotaActual = mascotas[currentIndex] || {};

    const mostrarMascota = editandoMascota ? mascotaEdit : mascotaActual;

    return (
        <div className="box mt-5">
            <h2 className="title is-4">Mascotas</h2>

            {/* Carrusel */}
            {!editandoMascota && mascotas.length > 1 && (
                <div className="columns is-vcentered mb-4">
                    <div className="column is-one-quarter has-text-centered">
                        <button className="button" onClick={handlePrev}>
                            ◀
                        </button>
                    </div>

                    <div className="column has-text-centered">
                        <strong>{mascotaActual.nombre_mascota}</strong>
                    </div>

                    <div className="column is-one-quarter has-text-centered">
                        <button className="button" onClick={handleNext}>
                            ▶
                        </button>
                    </div>
                </div>
            )}

            {/* Imagen */}
            <div className="has-text-centered mb-4">
                <PetImage imageUrl={mostrarMascota?.imagen} size={180} />
            </div>

            {/* Formulario */}
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label">Nombre</label>
                        <input
                            className="input"
                            type="text"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.nombre_mascota || ""}
                            onChange={(e) =>
                                setMascotaEdit({
                                    ...mostrarMascota,
                                    nombre_mascota: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="field">
                        <label className="label">Especie</label>
                        <input
                            className="input"
                            type="text"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.especie || ""}
                            onChange={(e) =>
                                setMascotaEdit({
                                    ...mostrarMascota,
                                    especie: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="field">
                        <label className="label">Sexo</label>
                        <input
                            className="input"
                            type="text"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.sexo || ""}
                            onChange={(e) =>
                                setMascotaEdit({
                                    ...mostrarMascota,
                                    sexo: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="column">
                    <div className="field">
                        <label className="label">Raza</label>
                        <input
                            className="input"
                            type="text"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.raza || ""}
                            onChange={(e) =>
                                setMascotaEdit({ ...mostrarMascota, raza: e.target.value })
                            }
                        />
                    </div>

                    <div className="field">
                        <label className="label">Peso</label>
                        <input
                            className="input"
                            type="number"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.peso || ""}
                            onChange={(e) =>
                                setMascotaEdit({ ...mostrarMascota, peso: e.target.value })
                            }
                        />
                    </div>

                    <div className="field">
                        <label className="label">Color</label>
                        <input
                            className="input"
                            type="text"
                            disabled={!editandoMascota}
                            value={mostrarMascota?.color || ""}
                            onChange={(e) =>
                                setMascotaEdit({ ...mostrarMascota, color: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Botones */}
            {!editandoMascota ? (
                <div className="buttons mt-3">
                    <button
                        className="button is-warning"
                        onClick={() => setMascotaEdit(mascotaActual) || handleAgregarMascota()}
                    >
                        Agregar Mascota
                    </button>
                    <button
                        className="button is-info"
                        onClick={() => setMascotaEdit(mascotaActual) || handleAgregarMascota()}
                    >
                        Editar Mascota
                    </button>
                </div>
            ) : (
                <div className="buttons mt-3">
                    <button className="button is-success" onClick={handleActualizarMascota}>
                        Guardar
                    </button>
                    <button className="button is-danger" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FormPet;