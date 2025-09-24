import React from 'react';

const ComboBox = ({ options = [], value, onChange, placeholder, multiple = false }) => {
  return (
    <div className="field" style={{ margin: '1em 0' }}>
      <div className="select is-fullwidth" {...(multiple ? { multiple: true } : {})}>
        <select
          value={value || (multiple ? [] : '')}
          onChange={(e) => {
            if (multiple) {
              const selectedValues = Array.from(e.target.selectedOptions, opt => parseInt(opt.value, 10));
              onChange(selectedValues);
            } else {
              const val = e.target.value;
              if (val === '') {
                onChange('');
              } else {
                onChange(parseInt(val, 10));
              }
            }
          }}
          multiple={multiple}
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
