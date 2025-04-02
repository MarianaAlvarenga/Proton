import React from "react";

const LargeButton = ({textButton='Registrarse'}) => {
    return (
        <button className="button is-fullwidth" style={{marginTop:'2em', backgroundColor:'#9655C5', color:'white'}}>{textButton}</button>
    );
} 

export default LargeButton;