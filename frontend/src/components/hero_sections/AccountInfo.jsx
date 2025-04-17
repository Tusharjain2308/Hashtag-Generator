import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_PATHS } from "../../utils/apiPaths";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Calendar,
  Hash,
  Clock,
  Layers,
  MessageSquare,
  Zap,
  ChevronLeft,
  ChevronRight,
  Copy,
  CheckCircle2,
} from "lucide-react";
import * as THREE from "three";

let VANTA;

const AccountInfo = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const vantaRef = useRef(null);
  const itemsPerPage = 1; // Show one history item per page

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_PATHS.HASHTAGS.ACCOUNT_INFO, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAccountData(res.data);
      } catch (err) {
        console.error("Error details:", err);
        if (err.response) {
          // use the `error` field that your API returns
          setError(
            `Backend error: ${err.response.data.error || "Unknown error"}`
          );
        } else {
          setError("Failed to load account information.");
        }
      } finally {
        setLoading(false);
        // Add a small delay before showing animations
        setTimeout(() => setIsLoaded(true), 300);
      }
    };

    fetchAccountInfo();

    if (!vantaEffect) {
      import("vanta/dist/vanta.halo.min").then((VANTA_MODULE) => {
        VANTA = VANTA_MODULE.default;

        if (!vantaEffect && vantaRef.current) {
          const effect = VANTA({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            baseColor: 0x111122,
            backgroundColor: 0x000011,
            amplitudeFactor: 1.5,
            size: 1.0,
            opacity: 0.3,
          });
          setVantaEffect(effect);
        }
      });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const history = accountData?.history || [];

  const totalPages = Math.ceil(history.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const paginatedHistory = history.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (loading)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-red-500/30 text-red-400 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Error</h3>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#ff5fcb] via-[#7f00ff] to-[#1a001f]/90
 relative py-16 px-4"
    >

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-8 max-w-5xl mx-auto relative z-10"
      >
        {/* Account Information Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl mt-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 opacity-80" />
          <div className="absolute inset-[1px] bg-[#0a0a1a]/80 rounded-2xl backdrop-blur-md" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Account Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Name</p>
                  <p className="font-medium">{accountData.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Username</p>
                  <p className="font-medium">{accountData.username || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-pink-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Email</p>
                  <p className="font-medium">{accountData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400">Joined</p>
                  <p className="font-medium">
                    {new Date(accountData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hashtag History Card with Slider */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20 " />
          <div className="absolute inset-[1px] bg-[#0a0a1a]/80 rounded-2xl backdrop-blur-md" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Hashtag History
                </h2>
              </div>

              {history.length > 0 && (
                <div className="flex items-center gap-2 text-white/70">
                  <span className="text-sm">
                    {currentPage + 1} of {totalPages}
                  </span>
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <div className="backdrop-blur-sm bg-white/5 rounded-xl p-6 text-center">
                <p className="text-neutral-400">No hashtag generations yet.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {paginatedHistory.map((item) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden relative"
                      >
                        {/* Subtle gradient background */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-xl" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Layers className="w-4 h-4 text-pink-400" />
                            </div>
                            <div>
                              <p className="text-xs text-neutral-400">Topic</p>
                              <p className="font-medium text-neutral-200">
                                {item.topic}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-pink-400" />
                            </div>
                            <div>
                              <p className="text-xs text-neutral-400">
                                Platform
                              </p>
                              <p className="font-medium text-neutral-200">
                                {item.platform}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-pink-400" />
                            </div>
                            <div>
                              <p className="text-xs text-neutral-400">Vibe</p>
                              <p className="font-medium text-neutral-200">
                                {item.vibe}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-pink-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-400">
                                Post Type
                              </p>
                              <p className="font-medium text-neutral-200">
                                {item.postType}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-white mb-3">
                            Generated Hashtags
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.hashtags.map((tag, tagIndex) => (
                              <motion.div
                                key={tagIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 0.05 * tagIndex,
                                  duration: 0.2,
                                }}
                                className="group relative"
                              >
                                <span className="inline-flex items-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-300 text-sm font-medium px-3 py-1 rounded-full border border-pink-500/20">
                                  #{tag}
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        tag,
                                        `${item._id}-${tagIndex}`
                                      )
                                    }
                                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    {copiedId === `${item._id}-${tagIndex}` ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-pink-300/70 hover:text-pink-300" />
                                    )}
                                  </button>
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Clock className="w-3 h-3" />
                          <p>
                            Generated on:{" "}
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Navigation controls */}
                {history.length > 1 && (
                  <div className="flex justify-between mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevPage}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>

                    {/* Pagination dots */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentPage === index
                              ? "bg-pink-500 w-4"
                              : "bg-white/30 hover:bg-white/50"
                          }`}
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextPage}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-pink-500/30"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: ["0%", "100%"],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: Math.random() * 5,
              }}
              style={{
                width: Math.random() * 4 + 1 + "px",
                height: Math.random() * 4 + 1 + "px",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AccountInfo;
