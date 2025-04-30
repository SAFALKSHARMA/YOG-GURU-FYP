import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900 text-center">
            Payment Status
          </h1>
        </div>
        <div className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <XCircle size={48} className="text-red-600" />
            <p className="text-center text-red-600">
              Payment failed. Please try again or contact support.
            </p>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
