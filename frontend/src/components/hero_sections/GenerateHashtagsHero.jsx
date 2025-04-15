import { useEffect, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { API_PATHS } from "../../utils/apiPaths.js";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function HashtagForm() {
  const [formData, setFormData] = useState({
    platform: "",
    postType: "",
    location: "",
    topic: "",
    vibe: "",
    description: "",
    count: 10,
  });

  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Adjust based on your storage strategy

      const response = await axios.post(API_PATHS.HASHTAGS.GENERATE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHashtags(response?.data?.data?.join(" ") || "No hashtags generated.");
    } catch (error) {
      setHashtags("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Aurora Background Animation Logic
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen py-24 px-4 sm:px-10 text-white overflow-hidden"
    >
      {/* Star Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

      {/* Form Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h2
          className="text-center text-4xl sm:text-5xl font-bold mb-12 text-white drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ✨ AI Hashtag Generator
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <FormRow label="Platform">
            <StyledSelect
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            >
              <option value="">Select platform</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>LinkedIn</option>
              <option>Facebook</option>
              <option>YouTube</option>
            </StyledSelect>
          </FormRow>

          <FormRow label="Post Type">
            <StyledSelect
              name="postType"
              value={formData.postType}
              onChange={handleChange}
              required
            >
              <option value="">Choose type</option>
              <option>Reel</option>
              <option>Story</option>
              <option>Post</option>
              <option>Short</option>
              <option>Tweet</option>
            </StyledSelect>
          </FormRow>

          <FormRow label="Location (optional)">
            <StyledInput
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Delhi"
            />
          </FormRow>

          <FormRow label="Topic">
            <StyledInput
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              placeholder="e.g. Travel, Fashion"
            />
          </FormRow>

          <FormRow label="Vibe">
            <StyledInput
              type="text"
              name="vibe"
              value={formData.vibe}
              onChange={handleChange}
              required
              placeholder="e.g. Chill, Aesthetic"
            />
          </FormRow>

          <FormRow label="Description (optional)">
            <StyledTextarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your post..."
            />
          </FormRow>

          <FormRow label={`Hashtag Count (${formData.count})`}>
            <input
              type="range"
              name="count"
              min="1"
              max="30"
              value={formData.count}
              onChange={handleChange}
              className="w-full accent-pink-500"
            />
          </FormRow>

          <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-700 hover:to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-pink-600/40 transition-all"
            >
              {loading ? "Generating..." : "Generate Hashtags"}
            </motion.button>
          </div>
        </motion.form>

        {hashtags && (
          <motion.div
            className="mt-10 p-6 bg-white/5 border border-white/10 rounded-xl text-white text-lg shadow-inner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pink-400 font-semibold mb-2">
              Generated Hashtags:
            </p>
            <p className="text-white break-words">{hashtags}</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}

// Label-Input Row
function FormRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <label className="w-full sm:w-40 text-pink-300 font-bold text-md">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// Styled Components
function StyledInput(props) {
  return (
    <input
      {...props}
      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition-all"
    />
  );
}

function StyledTextarea(props) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition-all"
    />
  );
}

function StyledSelect(props) {
  return (
    <select
      {...props}
      className="w-full px-4 py-2 bg-black/50 text-white border border-white/20 rounded-xl outline-none focus:ring-2 focus:ring-pink-400 transition-all"
    />
  );
}
