import React from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  isPasswordShown,
  togglePasswordVisibility,
  ...props
}) => {
  return (
    <div className="relative mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={isPasswordShown && type === "password" ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-10 px-4 text-base border border-[#bfb3f2] rounded-lg focus:border-[#5F41E4] focus:ring focus:ring-[#c8aefb] focus:outline-none placeholder-[#9284c8] transition ease-in-out"
        {...props}
      />
      {type === "password" && togglePasswordVisibility && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute top-10 right-3 transform -translate-y-1/2 text-[#917DE8] cursor-pointer text-xl"
        >
          {isPasswordShown ? <EyeOff size={20} /> : <Eye size={20} />}
        </span>
      )}
    </div>
  );
};

export default InputField;
