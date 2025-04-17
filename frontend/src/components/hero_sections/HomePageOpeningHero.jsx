import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { TypewriterEffectSmooth } from "../ui/Typewritter.jsx"
import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"

let VANTA

export function OpeningHero() {
  const vantaRef = useRef(null)
  const [vantaEffect, setVantaEffect] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const words = [
    { text: "Generate" },
    { text: "Perfect" },
    { text: "Hashtags" },
    { text: "Effortlessly", className: "text-pink-500 dark:text-pink-500 font-extrabold" },
  ]

  useEffect(() => {
    // Dynamically import VANTA to avoid SSR issues
    import("vanta/dist/vanta.halo.min").then((VANTA_MODULE) => {
      VANTA = VANTA_MODULE.default

      if (!vantaEffect) {
        const effect = VANTA({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 100.0,
          minWidth: 100.0,
          baseColor: 0x111122,
          backgroundColor: 0x000011,
          amplitudeFactor: 2.0,
          size: 1.0,
          
        })
        setVantaEffect(effect)
        setTimeout(() => setIsLoaded(true), 500)
      }
    })

    // Cleanup effect on unmount
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <div
      ref={vantaRef}
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden"
    >
      {/* Gradient overlay to enhance text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
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

      <motion.div
        className="relative z-10 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Glowing effect for the title */}
        <div className="relative">
          <h1 className="text-white text-5xl sm:text-7xl font-bold mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Hashtag Generator
          </h1>
          <div className="absolute -inset-1 blur-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 -z-10 rounded-full opacity-70" />
        </div>

        <motion.p
          className="text-neutral-200 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover trending hashtags tailored to your content and
          <span className="text-pink-300"> boost your social media reach</span>.
        </motion.p>

        <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 mb-8 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          <TypewriterEffectSmooth words={words} />
        </div>

        <motion.div
          className="flex flex-col sm:flex-row mt-8 space-y-3 sm:space-y-0 sm:space-x-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.button
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-medium transition duration-300 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 transform hover:-translate-y-1"
            whileTap={{ scale: 0.97 }}
          >
            Try it Now
          </motion.button>
          <motion.button
            className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-medium transition duration-300 shadow-lg transform hover:-translate-y-1"
            whileTap={{ scale: 0.97 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isLoaded ? [0.5, 1, 0.5] : 0,
          y: isLoaded ? [-5, 5, -5] : -10,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          delay: 1.5,
        }}
        onClick={scrollToContent}
      >
        <div className="flex flex-col items-center">
          <span className="text-white/70 text-sm mb-2">Scroll Down</span>
          <ChevronDown className="text-white/70 animate-bounce" />
        </div>
      </motion.div>
    </div>
  )
}
