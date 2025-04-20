// src/components/Signup.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../ui/InputField";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";
import ToastComponent from "../../ui/ToastComponent";
import Button from "../../ui/button";
import Loading from "../../ui/Loading";
import icon from "../../assets/meditation.gif";
import OAuth from "../OAuth";

const Signup = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContent);

  const togglePasswordVisibility = () => setIsPasswordShown((prev) => !prev);

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Validate password (at least 6 characters)
  const validatePassword = (password) => password.length >= 6;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Signup successful! Sending OTP...");
        await sendOtp(data.userId);
        // setIsLoggedin(true)
        // getUserData();
      } else {
        toast.error(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (userId) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("OTP sent! Check your email.");
        setTimeout(() => navigate("/email-verification"), 2000);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP sending error:", error);
      toast.error("Failed to send OTP. Try again.");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen bg-[#efeef1] bg-image-login">
        <div className="w-full max-w-[410px] p-6 rounded-lg bg-white shadow-lg">
          <h2 className="text-left text-[2rem] font-semibold mb-5 text-black">
            Sign Up
          </h2>
          <p className="text-left text-lg font-medium text-gray-700 mb-6"></p>

          <form onSubmit={handleSignup} className="signup-form">
            <InputField
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="name"
              label="Full Name"
              type="text"
              placeholder="Full Name"
              required
            />
            <InputField
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              label="Email"
              type="email"
              placeholder="Email address"
              required
            />
            <InputField
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="password"
              label="Password"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              isPasswordShown={isPasswordShown}
              togglePasswordVisibility={togglePasswordVisibility}
              required
            />
            <Button
              text={isLoading ? "Signing Up..." : "Sign Up"}
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            />
          </form>

          <OAuth />

          <p className="text-center text-base font-medium mt-5 mb-1">
            Already have an account?{" "}
            <a href="/login" className="text-[#5F41E4] hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
      {/* Loading Modal */}
      <Loading
        isOpen={isLoading}
        text="Signing you up..."
        icon={<img src={icon} alt="Loading" className="w-16 h-16" />}
      />
      {/* Use ToastComponent for toast notifications */}
      <ToastComponent />
    </>
  );
};

export default Signup;
