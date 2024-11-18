import React from "react";

const OkButton = ({ NameButton = "Agregar" }) => {
    return (
        <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
            <button
                className="button is-fullwidth"
                style={{ backgroundColor: "#6A0DAD", color: "white" }}
            >
                {NameButton}
            </button>
        </div>
    );
};

export default OkButton;