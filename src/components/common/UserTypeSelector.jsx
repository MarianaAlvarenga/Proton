import React, { useState, useEffect } from "react";

const UserTypeSelector = ({ onlyRegistered = false, onUserTypeChange }) => {
  const [type, setType] = useState(onlyRegistered ? "registered" : "guest");
  const [email, setEmail] = useState("");

  useEffect(() => {
    onUserTypeChange({
      isRegistered: type === "registered",
      email: type === "registered" ? email : ""
    });
  }, [type, email]);

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

      {!onlyRegistered && (
        <label style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          fontSize: "1.2rem",
          cursor: "pointer"
        }}>
          <input
            type="radio"
            name="userType"
            checked={type === "guest"}
            onChange={() => setType("guest")}
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
          type="radio"
          name="userType"
          checked={type === "registered"}
          onChange={() => setType("registered")}
        />
        Usuario registrado
      </label>

      {type === "registered" && (
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
