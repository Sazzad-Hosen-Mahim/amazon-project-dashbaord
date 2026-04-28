// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useLoginMutation } from "@/store/rtk/api/authApi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ phoneNumber, password }).unwrap();

      const user = {
        userId: response.data.userId,
        role: response.data.role,
      };

      const token = response.data.accessToken;

      // Save to zustand + localStorage
      setAuth(user, token);

      toast.success(response.message || "Login successful!");

      // ✅ Role-based navigation
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        toast.error("Unauthorized access");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded space-y-4 w-[400px] py-12 shadow-2xl"
      >
        <h2 className="text-xl text-primary font-bold text-center">Login</h2>

        <input
          type="tel"
          placeholder="Enter your email"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-200 text-black focus:outline-none"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2.5 right-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/80 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;