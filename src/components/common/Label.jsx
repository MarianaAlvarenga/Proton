import React from "react";

const Label = ({ labelContent = "example", inputName, inputValue, handleChange, type = "text", autoComplete = "off" }) => {
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
          autoComplete = {autoComplete}
        />
      </div>
    </div>
  );
};

export default Label;
