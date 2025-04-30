import { useContext, useState } from "react";
import axios from "axios";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { AppContent } from "../context/AppContext";

const PaymentButton = ({ payment, onPaymentSuccess }) => {
  const { userData } = useContext(AppContent);
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!userData) return;
    setLoading(true);

    console.log("Sending payment request with:", {
      classId: payment.classId,
      userId: userData.userId,
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/payments/initiate",
        {
          classId: payment.classId,
          userId: userData.userId, // Now sending in body
        }
      );

      console.log("Payment response:", response.data);

      if (response.data.success) {
        window.location.href = response.data.paymentUrl;
      } else {
        console.error("Payment initiation failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || payment.paymentStatus === "paid"}
      className={`flex items-center justify-center px-4 py-2 rounded-md ${
        loading
          ? "bg-gray-400 text-white"
          : payment.paymentStatus === "paid"
          ? "bg-green-100 text-green-800 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : payment.paymentStatus === "paid" ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Paid
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Khalti
        </>
      )}
    </button>
  );
};

export default PaymentButton;
