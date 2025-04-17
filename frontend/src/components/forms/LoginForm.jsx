import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Label } from "../ui/Label.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Login Success", token);
        navigate("/home");
      } else {
        throw new Error("Token not found in response");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      {/* Logo or Title */}
      <h2 className="text-4xl font-extrabold text-purple-500 text-center mb-2 tracking-wide">
        Hash<span className="text-white">Pop</span>
      </h2>

      <p className="text-center text-sm text-gray-400 mb-8">
        Welcome back! Please enter your credentials.
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 mt-1"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <button
              type="button"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // 👈 Toggle type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} // 👈 Toggle visibility
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-purple-400"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-sm text-red-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Switch to Signup */}
      <div className="mt-6 text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
