import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Label } from "../ui/Label.jsx";
import api from "../../utils/api.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ onSwitchToLogin }) {
  const [firstname, setfirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (
        !firstname ||
        !lastname ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        setError("Please fill in all the fields.");
        return;
      }

      const response = await api.post(API_PATHS.AUTH.REGISTER, {
        firstname,
        lastname,
        username,
        email,
        password,
      });

      console.log("Signup Success", response.data);
      setSuccess("Account created successfully! Login in to access HashPop");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(
        "Password must be at least 8 characters and contain a number, a special character, uppercase and lowercase letter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-extrabold text-purple-500 text-center mb-2 tracking-wide">
        Hash<span className="text-white">Pop</span>
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6">
        Enter the details and dive straight into HashPop
      </p>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={onSwitchToLogin}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name" className="text-gray-300">
              First name
            </Label>
            <Input
              id="first-name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name" className="text-gray-300">
              Last name
            </Label>
            <Input
              id="last-name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-300">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-gray-300">
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2 relative">
          <Label htmlFor="signup-password" className="text-gray-300">
            Password
          </Label>
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white pr-10 placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 text-gray-400 hover:text-purple-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 relative">
          <Label htmlFor="confirm-password" className="text-gray-300">
            Confirm password
          </Label>
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white pr-10 placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute top-[38px] right-3 text-gray-400 hover:text-purple-400"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
          {success && (
            <motion.p
              className="text-sm text-green-400"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white"
        >
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
