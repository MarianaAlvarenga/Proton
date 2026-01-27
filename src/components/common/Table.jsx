import React, { useEffect, useState } from "react";
import './custom-bulma.css';

const Table = ({ searchQuery, onSelectUser }) => { // 👈 agregado onSelectUser
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://sheffield-dogs-fiscal-cancelled.trycloudflare.com/backend/actions/getUsers.php");
        if (!response.ok) {
          throw new Error("Error al obtener los datos.");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (id) => {
    const newValue = id === selectedCheckbox ? null : id;
    setSelectedCheckbox(newValue);
    onSelectUser(newValue); // 👈 ahora notifico arriba
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th><abbr title="nombre">Nombre</abbr></th>
          <th><abbr title="apellido">Apellido</abbr></th>
          <th><abbr title="rol">Rol</abbr></th>
          <th><abbr title="seleccionar">Sel</abbr></th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.map((user) => (
          <tr key={user.id_usuario}>
            <td>{user.id_usuario}</td>
            <td>{user.nombre}</td>
            <td>{user.apellido}</td>
            <td>{user.rol}</td>
            <td>
              <input
                type="checkbox"
                name="uniqueCheckbox"
                id={`checkbox-${user.id_usuario}`}
                checked={selectedCheckbox === user.id_usuario}
                onChange={() => handleCheckboxChange(user.id_usuario)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
