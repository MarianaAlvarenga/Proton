import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComboBox = ({ onChange }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Proton/backend/actions/getRoles.php'); // Cambia la URL si es necesario
        const data = response.data;

        if (Array.isArray(data)) {
          setRoles(data); // Asegúrate de que el backend devuelva un array
        } else {
          setRoles([]); // Si no es un array, lo dejamos vacío
        }
      } catch (error) {
        console.error('Error al obtener los roles:', error);
        setRoles([]); // En caso de error, roles queda vacío
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className="field" style={{ margin: '1em' }}>
      <div className="select is-fullwidth">
        <select onChange={(e) => onChange(e.target.value)}>
          <option value="">Seleccione un rol</option>
          {roles.length > 0 ? (
            roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.rol}
              </option>
            ))
          ) : (
            <option disabled>No hay roles disponibles</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default ComboBox;
