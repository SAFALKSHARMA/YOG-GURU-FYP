// InputComponents.js
import {
  Tag,
  FileText,
  Layers,
  DollarSign,
  Package,
  Trash2,
} from "lucide-react";

export const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon = Tag,
  required = false,
  type = "text",
  textarea = false,
}) => {
  const Icon = icon;

  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center text-sm font-medium text-gray-700 mb-1"
      >
        <Icon className="mr-2 text-indigo-500" size={16} /> {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows="4"
          className={`w-full px-3 py-2 border rounded-lg ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          placeholder={placeholder}
        ></textarea>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-lg ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          placeholder={placeholder}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <Trash2 size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  icon = Layers,
}) => {
  const Icon = icon;

  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center text-sm font-medium text-gray-700 mb-1"
      >
        <Icon className="mr-2 text-indigo-500" size={16} /> {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
      >
        <option value="">Select a {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <Trash2 size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export const NumberInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  icon = Package,
  required = false,
  currency = false,
  min = "0",
  step = "1",
}) => {
  const Icon = icon;

  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center text-sm font-medium text-gray-700 mb-1"
      >
        <Icon className="mr-2 text-indigo-500" size={16} /> {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {currency && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">$</span>
          </div>
        )}
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          step={step}
          className={`w-full ${
            currency ? "pl-8" : "pl-3"
          } pr-3 py-2 border rounded-lg ${
            error ? "border-red-500 bg-red-50" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <Trash2 size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
