import { useEffect, useState, useCallback, useMemo } from "react";
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
import debounce from "lodash.debounce";

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

  const cleanFormData = {
    ...formData,
    platform: formData.platform.trim(),
    postType: formData.postType.trim(),
    location: formData.location?.trim() || "",
    topic: formData.topic.trim(),
    vibe: formData.vibe.trim(),
    description: formData.description?.trim() || "",
  };

  const [hashtags, setHashtags] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [latency, setLatency] = useState(null);
  const [servedFromCache, setServedFromCache] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    debouncedUpdateForm(name, value);
  };

  const debouncedUpdateForm = useMemo(
    () =>
      debounce((name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }, 300),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCopied(false);

    const start = performance.now();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        API_PATHS.HASHTAGS.GENERATE,
        cleanFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const end = performance.now();
      setLatency((end - start).toFixed(2));
      console.log(`⏱️ API Latency: ${(end - start).toFixed(2)} ms`);
      setHashtags(response?.data?.data?.join(" ") || "No hashtags generated.");
      setServedFromCache(response?.data?.cached ?? null);
    } catch (error) {
      setHashtags("❌ Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hashtags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Aurora background animation
  const color = useMotionValue(COLORS_TOP[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative min-h-screen py-24 px-4 sm:px-10 text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>

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
            <StyledSelect name="platform" onChange={handleChange} required>
              <option value="">Select platform</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>Facebook</option>
              <option>YouTube</option>
            </StyledSelect>
          </FormRow>

          <FormRow label="Post Type">
            <StyledSelect name="postType" onChange={handleChange} required>
              <option value="">Choose type</option>
              <option>Reel</option>
              <option>Story</option>
              <option>Video</option>
              <option>Post</option>
              <option>Short</option>
              <option>Tweet</option>
            </StyledSelect>
          </FormRow>

          <FormRow label="Location (optional)">
            <StyledInput
              type="text"
              name="location"
              placeholder="e.g. Delhi"
              onChange={handleChange}
            />
          </FormRow>

          <FormRow label="Topic">
            <StyledInput
              type="text"
              name="topic"
              required
              placeholder="e.g. Travel, Fashion"
              onChange={handleChange}
            />
          </FormRow>

          <FormRow label="Vibe">
            <StyledInput
              type="text"
              name="vibe"
              required
              placeholder="e.g. Chill, Aesthetic"
              onChange={handleChange}
            />
          </FormRow>

          <FormRow label="Description (optional)">
            <StyledTextarea
              name="description"
              rows={3}
              placeholder="Describe your post..."
              onChange={handleChange}
            />
          </FormRow>

          <FormRow label={`Hashtag Count (${formData.count})`}>
            <input
              type="range"
              name="count"
              min="1"
              max="30"
              defaultValue={10}
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
            className="mt-10 p-6 bg-white/5 border border-white/10 rounded-xl text-white text-lg shadow-inner text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-pink-400 text-xl font-extrabold mb-2">
              Generated Hashtags
            </p>
            {latency && (
              <p className="text-sm text-gray-400 mt-2">
                API responded in {latency} ms
              </p>
            )}

            <p
              className="cursor-pointer font-bold text-2xl text-white break-words"
              onClick={handleCopy}
              title="Click to copy hashtags"
            >
              {hashtags}
            </p>
            <p className="text-sm text-pink-300 mt-2">
              {copied ? "✅ Copied!" : "(Click to copy hashtags)"}
            </p>

            {servedFromCache !== null && (
              <p className="text-sm text-gray-400 mt-1">
                🔁{" "}
                {servedFromCache
                  ? "Served from Cache"
                  : "Generated via AI"}
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>© 2025 HashPop. All rights reserved.</p>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">
            ✨ Generating...
          </div>
        </div>
      )}
    </motion.section>
  );
}

// Subcomponents (unchanged except layout tweaks)
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
