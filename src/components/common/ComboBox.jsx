import React from 'react';

const ComboBox = ({ options = [], value, onChange, placeholder }) => {
  return (
    <div className="field" style={{ margin: '1em 0' }}>
      <div className="select is-fullwidth">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled hidden>
            {placeholder || 'Seleccione...'}
          </option>
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
