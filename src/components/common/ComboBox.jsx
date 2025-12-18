import React from 'react';

const ComboBox = ({ options = [], value = [], onChange, placeholder, multiple = false }) => {
  return (
    <div className="field" style={{ margin: '1em 0' }}>
      <div className="control">
        <select
          className="input"
          value={value}
          onChange={(e) => {
            if (multiple) {
              const selected = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value, 10));
              onChange(selected);
            } else {
              onChange(parseInt(e.target.value, 10));
            }
          }}
          multiple={multiple}
        >
          {!multiple && (
            <option value="" disabled hidden>
              {placeholder || "Seleccione..."}
            </option>
          )}

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ComboBox;
