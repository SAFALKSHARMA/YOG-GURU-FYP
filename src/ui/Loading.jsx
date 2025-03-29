import React from "react";
import { Loader2 } from "lucide-react";

const Loading = ({ isOpen, text = "Loading...", icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
        {icon ? (
          icon
        ) : (
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        )}
        <p className="text-lg font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
