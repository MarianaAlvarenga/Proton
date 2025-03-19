import React, { useState, useEffect } from "react";

const UserTypeSelector = ({ onlyRegistered = false, onUserTypeChange }) => {
  const [isRegistered, setIsRegistered] = useState(onlyRegistered);
  const [email, setEmail] = useState("");

  // Actualizar el estado del componente padre cuando cambie isRegistered o email
  useEffect(() => {
    onUserTypeChange({ isRegistered, email });
  }, [isRegistered, email]); // Solo se ejecuta cuando isRegistered o email cambian

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      padding: "1.5rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      width: "90%",
      maxWidth: "1200px",
      textAlign: "center",
      alignItems: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}>
      
      {/* Mostrar solo si no estamos en modo "onlyRegistered" */}
      {!onlyRegistered && (
        <label style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "1.2rem",
          cursor: "pointer"
        }}>
          <input
            type="checkbox"
            checked={!isRegistered}
            onChange={() => setIsRegistered(false)}
          />
          Usuario no registrado
        </label>
      )}

      <label style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "1.2rem",
        cursor: "pointer"
      }}>
        <input
          type="checkbox"
          checked={isRegistered}
          onChange={() => setIsRegistered(true)}
        />
        Usuario registrado
      </label>

      {/* Mostrar el campo de email si el usuario es registrado */}
      {isRegistered && (
        <input
          type="text"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "80%",
            padding: "0.75rem",
            fontSize: "1.2rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginTop: "1rem"
          }}
        />
      )}
    </div>
  );
};

export default UserTypeSelector;