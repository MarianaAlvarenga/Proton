// src/components/FormPet.jsx
import PetImage from "./PetImage.jsx";
import "./FormPet.css";
import ComboBox from "./ComboBox";

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
    handleEditarMascota,
    handleActualizarMascota,
    handleCancel,
    puedeAgregarMascota // 👈 NUEVO
}) => {

    const mascotaActual = mascotas[currentIndex] || {};
    const mostrarMascota = editandoMascota ? mascotaEdit : mascotaActual;

    const opcionesSexo = [
        { value: "Macho", label: "Macho" },
        { value: "Hembra", label: "Hembra" }
    ];

    const opcionesEspecie = [
        { value: "Perro", label: "Perro" },
        { value: "Gato", label: "Gato" },
        { value: "Hurón", label: "Hurón" },
        { value: "Conejo", label: "Conejo" },
        { value: "Chinchilla", label: "Chinchilla" },
        { value: "Cobayo", label: "Cobayo / Chanchito de la India" },
        { value: "Erizo", label: "Erizo" },
        { value: "Ave", label: "Ave" },
        { value: "Reptil", label: "Reptil" },
        { value: "Otro", label: "Otro" }
    ];

    return (
        <div className="container mt-5">
            <h2 className="title is-2">Mascotas</h2>

            {/* ───── CARRUSEL (NO TOCAR) ───── */}
            {!editandoMascota && mascotas.length > 1 && (
                <div className="columns is-vcentered mb-4">
                    <div className="column is-one-quarter has-text-centered">
                        <span className="arrow" onClick={handlePrev}>{"<"}</span>
                    </div>

                    <div className="column has-text-centered title is-4">
                        <strong>{mascotaActual?.nombre_mascota}</strong>
                    </div>

                    <div className="column is-one-quarter has-text-centered">
                        <span className="arrow" onClick={handleNext}>{">"}</span>
                    </div>
                </div>
            )}

            {/* ───── IMAGEN + BOTONES EDITAR / AGREGAR ───── */}
            <div className="mb-4">
                <PetImage
                    petId={mostrarMascota?.id_mascota}
                    mascotaEdit={mascotaEdit}
                    setMascotaEdit={setMascotaEdit}
                    size={180}
                />

                {!editandoMascota && (
                    <div className="field is-grouped mt-3">
                        <p className="control">
                            <button
                                className="button is-primary is-link"
                                onClick={handleEditarMascota}
                            >
                                Editar mascota
                            </button>
                        </p>

                        {puedeAgregarMascota && (
                            <p className="control">
                                <button
                                    className="button is-light"
                                    onClick={handleAgregarMascota}
                                >
                                    Agregar mascota
                                </button>
                            </p>
                        )}
                    </div>
                )}
            </div>

            <label className="label">Nombre:</label>
            <input
                className="input"
                type="text"
                readOnly={!editandoMascota}
                value={mostrarMascota?.nombre_mascota || ""}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, nombre_mascota: e.target.value }))
                }
            />

            <label className="label">Especie:</label>
            <ComboBox
                disabled={!editandoMascota}
                value={
                    mostrarMascota?.especie === "Perro" ? 1 :
                    mostrarMascota?.especie === "Gato" ? 2 :
                    mostrarMascota?.especie === "Hurón" ? 3 :
                    mostrarMascota?.especie === "Conejo" ? 4 :
                    mostrarMascota?.especie === "Cobayo" ? 5 :
                    mostrarMascota?.especie === "Chinchilla" ? 6 :
                    ""
                }
                onChange={(valNum) => {
                    const mapa = {
                        1: "Perro",
                        2: "Gato",
                        3: "Hurón",
                        4: "Conejo",
                        5: "Cobayo",
                        6: "Chinchilla",
                    };
                    setMascotaEdit(prev => ({ ...prev, especie: mapa[valNum] || "" }));
                }}
                options={[
                    { value: 1, label: "Perro" },
                    { value: 2, label: "Gato" },
                    { value: 3, label: "Hurón" },
                    { value: 4, label: "Conejo" },
                    { value: 5, label: "Cobayo" },
                    { value: 6, label: "Chinchilla" }
                ]}
            />

            <label className="label">Sexo:</label>
            <ComboBox
                disabled={!editandoMascota}
                value={
                    mostrarMascota?.sexo === "Macho" ? 1 :
                    mostrarMascota?.sexo === "Hembra" ? 2 :
                    ""
                }
                onChange={(valNum) => {
                    const mapa = {
                        1: "Macho",
                        2: "Hembra",
                    };
                    setMascotaEdit(prev => ({ ...prev, sexo: mapa[valNum] || "" }));
                }}
                options={[
                    { value: 1, label: "Macho" },
                    { value: 2, label: "Hembra" }
                ]}
            />

            <label className="label" htmlFor="born">Fecha de nacimiento:</label>
            <input
                className="input"
                type="date"
                id="born"
                value={mostrarMascota?.fecha_nacimiento || ""}
                min="1900-01-01"
                readOnly={!editandoMascota}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, fecha_nacimiento: e.target.value }))
                }
            />

            <label className="label">Raza:</label>
            <input
                className="input"
                type="text"
                readOnly={!editandoMascota}
                value={mostrarMascota?.raza || ""}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, raza: e.target.value }))
                }
            />

            <label className="label">Peso (gr):</label>
            <input
                className="input"
                type="number"
                readOnly={!editandoMascota}
                value={mostrarMascota?.peso || ""}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, peso: e.target.value }))
                }
            />

            <label className="label">Tamaño:</label>
            <ComboBox
                value={
                    mostrarMascota?.tamanio === "Pequeño" ? 1 :
                    mostrarMascota?.tamanio === "Mediano" ? 2 :
                    mostrarMascota?.tamanio === "Grande" ? 3 :
                    mostrarMascota?.tamanio === "Muy grande" ? 4 : ""
                }
                onChange={(valNum) => {
                    const mapa = {
                        1: "Pequeño",
                        2: "Mediano",
                        3: "Grande",
                        4: "Muy grande",
                    };
                    setMascotaEdit(prev => ({ ...prev, tamanio: mapa[valNum] || "" }));
                }}
                options={[
                    { value: 1, label: "Pequeño" },
                    { value: 2, label: "Mediano" },
                    { value: 3, label: "Grande" },
                    { value: 4, label: "Muy grande" }
                ]}
            />

            <label className="label">Largo de pelo:</label>
            <ComboBox
                disabled={!editandoMascota}
                value={
                    mostrarMascota?.largo_pelo === "Corto" ? 1 :
                    mostrarMascota?.largo_pelo === "Medio" ? 2 :
                    mostrarMascota?.largo_pelo === "Largo" ? 3 :
                    ""
                }
                onChange={(valNum) => {
                    const mapa = {
                        1: "Corto",
                        2: "Medio",
                        3: "Largo",
                    };
                    setMascotaEdit(prev => ({ ...prev, largo_pelo: mapa[valNum] || "" }));
                }}
                options={[
                    { value: 1, label: "Corto" },
                    { value: 2, label: "Medio" },
                    { value: 3, label: "Largo" }
                ]}
            />

            <label className="label">Color:</label>
            <input
                className="input"
                type="text"
                readOnly={!editandoMascota}
                value={mostrarMascota?.color || ""}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, color: e.target.value }))
                }
            />

            <label className="label">Detalles:</label>
            <textarea
                className="textarea"
                readOnly={!editandoMascota}
                value={mostrarMascota?.detalle || ""}
                onChange={(e) =>
                    setMascotaEdit(prev => ({ ...prev, detalle: e.target.value }))
                }
            />

            {editandoMascota && (
                <div className="field is-grouped is-grouped-right mt-4">
                    <p className="control">
                        <button className="button is-light" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </p>
                    <p className="control">
                        <button
                            className="button is-primary is-link"
                            onClick={handleActualizarMascota}
                        >
                            Guardar
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default FormPet;
