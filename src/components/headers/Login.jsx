import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../ui/InputField";
import { AppContent } from "../../context/AppContext";
import Button from "../../ui/button";
import Loading from "../../ui/Loading";
import icon from "../../assets/meditation.gif";
import OAuth from "../OAuth";
import { message } from "antd";

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

    // Basic client-side validation
    if (!email || !password) {
      message.warning("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        message.success("Login successful! Redirecting...");
        setIsLoggedin(true);
        await getUserData();
        setTimeout(() => navigate("/"), 2000);
      } else {
        // Handle specific error cases
        if (data.message.toLowerCase().includes("banned")) {
          message.error({
            content: data.message,
            duration: 5, // Show for longer duration
          });
        } else {
          message.error(
            data.message || "Invalid credentials. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-[#efeff2] bg-image-login">
        <div className="w-full max-w-[410px] p-6 rounded-lg bg-white shadow-lg">
          <h2 className="text-left text-[2rem] font-semibold mb-5 text-black">
            Login
          </h2>

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

          <OAuth />

          <p className="text-center text-base font-medium mt-7 mb-1">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#5F41E4] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      <Loading
        isOpen={isLoading}
        text="Logging in..."
        icon={<img src={icon} alt="Loading" className="w-16 h-16" />}
      />
    </>
  );
};

export default Login;
