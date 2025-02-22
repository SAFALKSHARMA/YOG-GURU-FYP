import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../ui/InputField";
import Button from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";
import ToastComponent from "../ui/ToastComponent";
// import "./styles.css";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("OTP has been sent to your email.");
        setStep(2);
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }
    toast.success("OTP verified successfully! Proceeding to password reset.");
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Your password has been reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-image-login">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent className="text-center">
          <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
          {step === 1 && (
            <>
              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="w-full mt-4"
                onClick={handleSendOtp}
                text="Send OTP"
              />
            </>
          )}
          {step === 2 && (
            <>
              <InputField
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                className="w-full mt-4"
                onClick={handleVerifyOtp}
                text="Verify OTP"
              />
            </>
          )}
          {step === 3 && (
            <>
              <InputField
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                className="w-full mt-4"
                onClick={handleResetPassword}
                text="Reset Password"
              />
            </>
          )}
        </CardContent>
      </Card>
      <ToastComponent />
    </div>
  );
}
