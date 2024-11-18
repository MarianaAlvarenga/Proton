import React, { useState } from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ComboBox from "../components/common/ComboBox";
import DateTimePicker from "../components/common/Calendar";
import "../components/common/custom-calendar.css";

// COMPONENTIZAR**************
const Shifts = () => {
  const [dates, setDates] = useState([]);

  const handleDatesChange = (newDates) => {
    setDates(newDates);
  };

  const handleSave = () => {
    // Lógica para guardar las fechas (puedes enviarlas al backend o almacenarlas localmente)
    console.log("Guardando fechas seleccionadas:", dates);
  };

  return (
    <>  
      <NavBar showMenu></NavBar>
      <SubNavBar showBack></SubNavBar>

      <div className="box" style={{ paddingTop:'0px', paddingBottom:'0px' }}>
        <div style={{padding: "1em"}}>
        <ComboBox></ComboBox>
        </div>
        <DateTimePicker onDatesChange={handleDatesChange}></DateTimePicker>
        <div style={{ marginTop: "1rem" }}>
          <button className="button button-save" onClick={handleSave}>
            Guardar
          </button>
        </div>
        {dates.length > 0 && (
          <div>
            <h2>Fechas seleccionadas:</h2>
            <ul>
              {dates.map((date, index) => (
                <li key={index}>{date}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Shifts;
