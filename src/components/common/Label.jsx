import React from "react";

const Label = ({ labelContent = "example", inputName, inputValue, handleChange, type = "text" }) => {
  return (
    <div className="field" style={{ margin: "1em" }}>
      <div className="control">
        <input
          className="input"
          type={type}
          placeholder={labelContent}
          name={inputName}
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Label;
