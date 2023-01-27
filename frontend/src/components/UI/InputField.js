import React from "react";

const InputField = ({
  onFocus,
  onBlur,
  onChange,
  type,
  name,
  placeholder,
  value,
}) => {
  return (
    <input
      style={{
        width: "100%",
        marginTop: "2rem",
        padding: "0.7rem",
        borderRadius: "10px",
        outline: "none",
        border: "1px solid #4997c7",
        color: "black",
      }}
      className={"focus:border-skyblue focus:border-4"}
      onFocus={onFocus ? onFocus : ""}
      onBlur={onBlur ? onFocus : ""}
      onChange={onChange}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default InputField;
