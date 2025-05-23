import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle, Info } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Verifying your payment..."
  );
  const [statusType, setStatusType] = useState("info");

  const verifyPayment = useCallback(async () => {
    const pidx = searchParams.get("pidx");
    const purchase_order_id = searchParams.get("purchase_order_id");

    if (!pidx || !purchase_order_id) {
      setStatusMessage("Missing payment information. Please contact support.");
      setStatusType("error");
      return;
    }

    if (verifyingPayment) return;

    setVerifyingPayment(true);
    setStatusType("info");
    setStatusMessage("Verifying your payment...");

    try {
      const response = await axios.post(
        `http://localhost:3000/api/payments/verify`,
        { pidx, purchase_order_id },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.classId) {
          // Class payment
          setStatusMessage(
            response.data.message || "Payment successful! You are now enrolled."
          );
          setStatusType("success");
          setTimeout(() => {
            navigate("/profile?tab=enrolled", { replace: true });
          }, 3000);
        } else {
          // Cart payment
          setStatusMessage(
            response.data.message ||
              "Payment successful! Your order has been placed."
          );
          setStatusType("success");
          setTimeout(() => {
            navigate("/orders", { replace: true });
          }, 3000);
        }
      } else {
        setStatusMessage(
          response.data.message || "Payment verification failed."
        );
        setStatusType("error");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details?.message ||
        "Payment verification failed. Please check your bookings or contact support.";
      setStatusMessage(errorMessage);
      setStatusType("error");
    } finally {
      setVerifyingPayment(false);
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const renderStatusIcon = () => {
    switch (statusType) {
      case "success":
        return <CheckCircle2 size={24} className="text-green-600" />;
      case "error":
        return <XCircle size={24} className="text-red-600" />;
      default:
        return <Info size={24} className="text-blue-600" />;
    }
  };

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
            {verifyingPayment ? (
              <>
                <Loader2 className="animate-spin text-gray-400" size={48} />
                <p className="text-gray-600">{statusMessage}</p>
              </>
            ) : (
              <>
                {renderStatusIcon()}
                <p
                  className={`text-center ${
                    statusType === "success"
                      ? "text-green-600"
                      : statusType === "error"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {statusMessage}
                </p>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={verifyingPayment}
            >
              Go to Homepage
            </button>
            {statusType === "error" && (
              <button
                onClick={verifyPayment}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={verifyingPayment}
              >
                Retry Verification
              </button>
            )}
            {statusType === "success" && (
              <button
                onClick={() =>
                  navigate(
                    statusMessage.includes("enrolled")
                      ? "/profile?tab=enrolled"
                      : "/orders"
                  )
                }
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                {statusMessage.includes("enrolled")
                  ? "View My Bookings"
                  : "View Orders"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
