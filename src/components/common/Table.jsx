import React, { useEffect, useState } from "react";
import './custom-bulma.css';

const Table = () => {
  const [users, setUsers] = useState([]); // Estado para almacenar los datos de los usuarios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const [selectedCheckbox, setSelectedCheckbox] = useState(null); // Estado para manejar el checkbox seleccionado
  
  useEffect(() => {
    // Función para obtener los datos de los usuarios desde el backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/Proton/backend/actions/getUsers.php"); // Cambia la URL si es necesario
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
  
  const handleCheckboxChange = (id) => {
    setSelectedCheckbox(id === selectedCheckbox ? null : id); // Permite deseleccionar si el mismo checkbox se marca
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
        {users.map((user) => (
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
