import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import InputField from "../../ui/InputField";
import ToastComponent from "../../ui/ToastComponent";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";
// import "../components/styles.css";
import Button from "../../ui/button";

const Login = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const togglePasswordVisibility = () =>
    setIsPasswordShown((prevState) => !prevState);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ Send credentials (token)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful! Redirecting...");
        setIsLoggedin(true);

        // ✅ Ensure we fetch user data AFTER login
        await getUserData();

        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect the user to the backend Google OAuth endpoint
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen bg-[#5F41E4] bg-image-login">
        <div className="w-full max-w-[410px] p-6 rounded-lg bg-white shadow-lg">
          <h2 className="text-left text-[2rem] font-semibold mb-5 text-black">
            Login
          </h2>
          <p className="text-left text-lg font-medium text-gray-700 mb-6">
            Enter your email below to login to your account
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <InputField
              id="password"
              label="Password"
              type={isPasswordShown ? "text" : "password"}
              placeholder="Password"
              isPasswordShown={isPasswordShown}
              togglePasswordVisibility={togglePasswordVisibility}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <a
              href="/forget-password"
              className="block text-right text-[#007bff] text-sm hover:underline"
            >
              Forgot password?
            </a>

            <Button
              text={isLoading ? "Logging in..." : "Log In"}
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            />
          </form>

          <button
            type="button"
            className="w-full h-12 mt-4 text-white font-medium text-lg rounded-lg bg-[#DB4437] hover:bg-[#C1351D] transition ease-in-out flex items-center justify-center"
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 488 512"
              className="h-5 w-5 mr-3"
            >
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
            </svg>
            Login with Google
          </button>

          <p className="text-center text-base font-medium mt-7 mb-1">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#5F41E4] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
      <ToastComponent />
    </>
  );
};

export default Login;
