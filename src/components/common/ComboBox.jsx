import React from "react";

const ComboBox = () => {
    return(
        <div className="field">
            <div className="select" style={{ width: '100%' }}>
                <select style={{ width: '100%' }}>
                    <option>Select dropdown</option>
                    <option>With options</option>
                </select>
            </div>
        </div>
    );
}
export default ComboBox; 