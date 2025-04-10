import React from "react";

export default function TextInput({ id, label, value, onChange, type = "text", required = true }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
