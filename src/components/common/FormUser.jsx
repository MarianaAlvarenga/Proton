// src/components/FormUser.jsx
import ComboBox from "./ComboBox";
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
            <label className="label" htmlFor="name">Nombre:</label>
            <input
                className="input"
                type="text"
                id="name"
                value={usuarioEdit?.nombre || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, nombre: e.target.value }))
                }
            />

            {/* Apellido */}
            <label className="label" htmlFor="LastName">Apellido:</label>
            <input
                className="input"
                type="text"
                id="LastName"
                value={usuarioEdit?.apellido || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, apellido: e.target.value }))
                }
            />

            {/* Especialidades solo si existe el campo en el usuario */}
            {usuarioEdit?.rol === 3 && (
                    <div className="field mt-3">
                        <label className="label">Especialidades:</label>

                        {editandoUsuario ? (
                            <div className="control">
                                {especialidades.map((e) => {
                                    const espId = Number(e.id_servicio);
                                    const actuales = usuarioEdit.especialidades || [];
                                    const isChecked = actuales.includes(espId);

                                    return (
                                        <label key={espId} className="checkbox mr-3">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(ev) => {
                                                    setUsuarioEdit(prev => {
                                                        const actuales = prev.especialidades || [];
                                                        if (ev.target.checked) {
                                                            return {
                                                                ...prev,
                                                                especialidades: [...actuales, espId],
                                                            };
                                                        } else {
                                                            return {
                                                                ...prev,
                                                                especialidades: actuales.filter(id => id !== espId),
                                                            };
                                                        }
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
                                {usuarioEdit.especialidades.length > 0 ? (
                                    usuarioEdit.especialidades.map(id => {
                                        const esp = especialidades.find(e => Number(e.id_servicio) === Number(id));
                                        return <li key={id}>{esp?.nombre || "Especialidad"}</li>;
                                    })
                                ) : (
                                    <p>No tiene especialidades registradas</p>
                                )}
                            </ul>
                        )}
                    </div>
                )}

            {/* Fecha de nacimiento */}
            <label className="label" htmlFor="born">Fecha de nacimiento:</label>
            <input
                className="input"
                type="date"
                id="born"
                value={usuarioEdit?.fecha_nacimiento || ""}
                min="1900-01-01"
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, fecha_nacimiento: e.target.value }))
                }
            />

            {/* Teléfono */}
            <label className="label" htmlFor="phone">Teléfono:</label>
            <input
                className="input"
                type="tel"
                id="phone"
                value={usuarioEdit?.telefono || ""}
                readOnly={!editandoUsuario}
                onChange={(e) =>
                    setUsuarioEdit(prev => ({ ...prev, telefono: e.target.value }))
                }
            />

            {/* Email */}
            <div className="field">
                <label className="label" htmlFor="email">Email:</label>
                <p className="control has-icons-left has-icons-right">
                    <input
                        className="input"
                        type="email"
                        id="email"
                        value={usuarioEdit?.email || ""}
                        readOnly={!editandoUsuario}
                        onChange={(e) =>
                            setUsuarioEdit(prev => ({ ...prev, email: e.target.value }))
                        }
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-envelope"></i>
                    </span>
                </p>
            </div>

            {/* Contraseña */}
            <div className="field">
                <label className="label" htmlFor="pass">Contraseña:</label>
                <p className="control has-icons-left">
                    <input
                        className="input"
                        type="password"   // ← SOLO ESTO CAMBIÉ
                        id="pass"
                        value={contrasenia}
                        readOnly={!editandoUsuario}
                        onChange={(e) => setContrasenia(e.target.value)}
                        placeholder="Ingrese nueva contraseña o deje vacío"
                    />
                    <span className="icon is-small is-left">
                        <i className="fas fa-lock"></i>
                    </span>
                </p>
            </div>

            {/* Botones */}
            {editandoUsuario && (
                <div className="field is-grouped is-grouped-right">
                    <p className="control">
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
                    </p>
                    <p className="control">
                        <button className="button is-light" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default FormUser;
