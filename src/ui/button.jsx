import React from "react";
import PropTypes from "prop-types";

const Button = ({
  text = "Button",
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseClass = "px-6 py-3 font-semibold rounded-lg shadow-md ";
  const variantClass =
    variant === "primary"
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : "border border-purple-900 text-purple-600 hover:bg-purple-700 hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
};

export default Button;
