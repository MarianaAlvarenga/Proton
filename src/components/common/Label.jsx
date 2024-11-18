import React, { useState } from "react";

const Label = ({ labelContent = "example" }) => {
  // Estado para almacenar el valor del input
  const [inputValue, setInputValue] = useState("");

  // Manejador para actualizar el estado cuando cambia el valor del input
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="field" style={{ margin: "1em" }}>
      <div className="control">
        <input
          className="input"
          type="email"
          placeholder={labelContent}
          value={inputValue} // Vincula el estado al valor del input
          onChange={handleChange} // Escucha los cambios y actualiza el estado
        />
      </div>
      {/* Mostrar el valor ingresado (solo para pruebas, puedes eliminarlo) */}
      <p>Valor ingresado: {inputValue}</p>
    </div>
  );
};

export default Label;
