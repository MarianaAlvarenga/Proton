// src/components/FormUser.jsx
import UserImage from "./UserImage.jsx";

const FormUser = ({
    usuarioEdit,
    setUsuarioEdit,
    editandoUsuario,
    setEditandoUsuario,
    especialidades,
    contrasenia,
    setContrasenia,
    handleActualizarUsuario,
    handleCancel,
}) => {

    const especialidadesUsuario = Array.isArray(usuarioEdit?.especialidades)
        ? usuarioEdit.especialidades
              .map(esp => {
                  // ✅ Caso 1: viene como objeto { id_servicio, nombre }
                  if (typeof esp === "object" && esp !== null && esp.id_servicio) {
                      return Number(esp.id_servicio);
                  }

                  // ✅ Caso 2: viene como número o string numérico
                  if (!Number.isNaN(Number(esp))) {
                      return Number(esp);
                  }

                  // ✅ Caso 3: viene como string con nombre
                  const encontrada = especialidades.find(
                      e =>
                          e.nombre.toLowerCase() ===
                          String(esp).toLowerCase()
                  );

                  return encontrada ? Number(encontrada.id_servicio) : null;
              })
              .filter(id => id !== null)
        : [];

    return (
        <div className="container mt-5">
            <h1 className="title is-2">
                ¡HOLA {usuarioEdit?.nombre ? usuarioEdit.nombre.toUpperCase() : "USUARIO"}!
            </h1>

            {/* Imagen + botón editar */}
            <div className="mb-4">
                <UserImage userId={usuarioEdit?.id_usuario} size={180} />

                <p className="control mt-3">
                    <button
                        className={`button ${
                            editandoUsuario ? "is-primary is-link" : "is-light"
                        }`}
                        onClick={() => setEditandoUsuario(true)}
                    >
                        Editar perfil
                    </button>
                </p>
            </div>

            {/* Nombre */}
            <label className="label">Nombre:</label>
            <input
                className="input"
                value={usuarioEdit?.nombre || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, nombre: e.target.value }))
                }
            />

            {/* Apellido */}
            <label className="label">Apellido:</label>
            <input
                className="input"
                value={usuarioEdit?.apellido || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, apellido: e.target.value }))
                }
            />

            {/* Especialidades */}
            {usuarioEdit?.rol === 3 && (
                <div className="field mt-3">
                    <label className="label">Especialidades:</label>

                    {editandoUsuario ? (
                        <div className="control">
                            {especialidades.map(e => {
                                const espId = Number(e.id_servicio);
                                const isChecked = especialidadesUsuario.includes(espId);

                                return (
                                    <label key={espId} className="checkbox mr-3">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(ev) => {
                                                setUsuarioEdit(prev => {
                                                    const actuales = especialidadesUsuario;
                                                    return {
                                                        ...prev,
                                                        especialidades: ev.target.checked
                                                            ? [...actuales, espId]
                                                            : actuales.filter(id => id !== espId),
                                                    };
                                                });
                                            }}
                                        />
                                        {e.nombre}
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <ul>
                            {especialidadesUsuario.length > 0 ? (
                                especialidadesUsuario.map(id => {
                                    const esp = especialidades.find(
                                        e => Number(e.id_servicio) === id
                                    );
                                    return <li key={id}>{esp?.nombre}</li>;
                                })
                            ) : (
                                <p>No tiene especialidades registradas</p>
                            )}
                        </ul>
                    )}
                </div>
            )}

            {/* Fecha nacimiento */}
            <label className="label">Fecha de nacimiento:</label>
            <input
                className="input"
                type="date"
                value={usuarioEdit?.fecha_nacimiento || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, fecha_nacimiento: e.target.value }))
                }
            />

            {/* Teléfono */}
            <label className="label">Teléfono:</label>
            <input
                className="input"
                value={usuarioEdit?.telefono || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, telefono: e.target.value }))
                }
            />

            {/* Email */}
            <label className="label">Email:</label>
            <input
                className="input"
                type="email"
                value={usuarioEdit?.email || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, email: e.target.value }))
                }
            />

            {/* Contraseña */}
            <label className="label">Contraseña:</label>
            <input
                className="input"
                type="password"
                value={contrasenia}
                readOnly={!editandoUsuario}
                onChange={(e) => setContrasenia(e.target.value)}
                placeholder="Ingrese nueva contraseña o deje vacío"
            />

            {/* Botones */}
            {editandoUsuario && (
                <div className="field is-grouped is-grouped-right mt-4">
                    <button className="button is-light" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button
                        className="button is-primary is-link"
                        onClick={() =>
                            handleActualizarUsuario({
                                ...usuarioEdit,
                                contrasenia: contrasenia || null,
                            })
                        }
                    >
                        Actualizar
                    </button>
                </div>
            )}
        </div>
    );
};

export default FormUser;
