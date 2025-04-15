import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { useNavigate } from 'react-router-dom';
import { Label } from "../ui/Label.jsx";
import api from "../../utils/api.js";
import { API_PATHS } from "../../utils/apiPaths.js";

export default function LoginForm({ onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("Login Success", response.data);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={onSwitchToSignup}
        >
          Sign up
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handlelogin}>
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
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
        </div>
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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
        </div>

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

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{" "}
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
