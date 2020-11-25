import React from "react";
import { Input } from "antd";

export const TextArea = props => {
  const { value, placeholder, error } = props;
  return (
    <div className="text_field">
      {value && <label>{placeholder}</label>}
      <Input.TextArea {...props} />
      {error && <div className="Prof_error_txt">{error}</div>}
    </div>
  );
};

export const TextInput = props => {
  const { value, placeholder, error } = props;
  return (
    <div className="text_field">
      {value && <label>{placeholder}</label>}
      <Input {...props} />
      {error && <div className="Prof_error_txt">{error}</div>}
    </div>
  );
};
