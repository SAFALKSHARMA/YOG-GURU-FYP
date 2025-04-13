import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  X,
} from "lucide-react";

// Reusable Confirmation Modal Component
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant,
  confirmButtonColor,
  cancelButtonColor,
  icon,
}) {
  // Calculate button colors based on variant
  const getButtonColors = () => {
    const colors = {
      question: {
        confirm: "bg-blue-500 hover:bg-blue-600",
        cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
      },
      warning: {
        confirm: "bg-yellow-500 hover:bg-yellow-600",
        cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
      },
      success: {
        confirm: "bg-green-500 hover:bg-green-600",
        cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
      },
      error: {
        confirm: "bg-red-500 hover:bg-red-600",
        cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
      },
    };

    if (!variant || !colors[variant]) {
      return {
        confirm: confirmButtonColor || "bg-blue-500 hover:bg-blue-600",
        cancel:
          cancelButtonColor || "bg-gray-300 hover:bg-gray-400 text-gray-800",
      };
    }

    return {
      confirm: confirmButtonColor || colors[variant].confirm,
      cancel: cancelButtonColor || colors[variant].cancel,
    };
  };

  // Get icon based on variant
  const getIcon = () => {
    if (icon) return icon;

    const icons = {
      question: <HelpCircle className="w-12 h-12 text-blue-500" />,
      warning: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      success: <CheckCircle className="w-12 h-12 text-green-500" />,
      error: <AlertCircle className="w-12 h-12 text-red-500" />,
    };

    return variant && icons[variant] ? (
      icons[variant]
    ) : (
      <HelpCircle className="w-12 h-12 text-blue-500" />
    );
  };

  const buttonColors = getButtonColors();

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-fade-in">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex gap-5 items-center">
          <div className="shrink-0">{getIcon()}</div>
          <div className="text-gray-700">{message}</div>
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          {cancelText && (
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${buttonColors.cancel}`}
            >
              {cancelText}
            </button>
          )}
          {confirmText && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white focus:outline-none transition-colors ${buttonColors.confirm}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
