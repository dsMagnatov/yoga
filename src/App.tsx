import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, RefreshCw, ArrowLeft } from "lucide-react";
import { YogaCard } from "./components/YogaCard";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  
  // Parallax offsets
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 1) {
      setIsLoaded(true);
    }

    const handleLoadedMetadata = () => {
      setIsLoaded(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate mouse position relative to window center
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // Ranges from -1 to 1
    const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // Ranges from -1 to 1
    
    // Apply subtle smooth translation limits (e.g. max 20px)
    setParallax({ x: x * 20, y: y * 20 });
  };

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Failed to play video:", error);
        });
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowSecondScreen(true);
  };

  const handleResetToStart = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setShowSecondScreen(false);
    setIsPlaying(false);
  };

  return (
    <div 
      id="app-container" 
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden select-none"
    >
      {/* Background Video Layer with smooth parallax transition */}
      <div id="video-wrapper" className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <video
          id="background-video"
          ref={videoRef}
          src="/assets/aistudio/Uue8uKswO_5ea78443.mp4"
          style={{
            transform: `scale(1.08) translate(${parallax.x}px, ${parallax.y}px)`,
          }}
          className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out origin-center ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          controls={false}
        />
        
        {/* Ambient overlay matching the image depth */}
        <div id="ambient-overlay" className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Screen Interface Overlay */}
      <div id="ui-overlay" className="absolute inset-0 flex flex-col justify-between p-6 sm:p-12 md:p-16 z-10 pointer-events-none">
        
        {/* Top-Left Yoga Quote / Slogan */}
        <div id="top-left-slogan" className="max-w-xs sm:max-w-sm md:max-w-md pointer-events-auto overflow-hidden">
          <motion.div
            animate={isPlaying ? { y: 250, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-anton text-white text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] leading-[0.95] tracking-wide uppercase">
              FIND YOUR FOCUS,<br />
              ARRANGE PRIVATE<br />
              YOGA SESSIONS, AND LIVE<br />
              THE MINDFUL WAY
            </h2>
          </motion.div>
        </div>

        {/* Bottom Elements: Headings and Circular Button */}
        <div id="bottom-bar" className="w-full relative flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-4 mt-auto">
          
          {/* Bottom-Left Huge Title */}
          <div id="bottom-left-title" className="pointer-events-auto overflow-hidden">
            <motion.div
              animate={isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-anton text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight uppercase">
                HEY, I AM<br />
                JESSICA
              </h1>
            </motion.div>
          </div>

          {/* Bottom-Right Huge Title */}
          <div id="bottom-right-title" className="text-left md:text-right pointer-events-auto overflow-hidden">
            <motion.div
              animate={isPlaying ? { y: "150%", opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-anton text-white text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[11rem] leading-none tracking-tight uppercase">
                YOGA<br />
                COACH
              </h1>
            </motion.div>
          </div>

          {/* Center-Bottom Circular Play Button (Scale & fade transition) */}
          <div 
            id="center-btn-wrapper" 
            className="absolute left-1/2 bottom-[15%] md:bottom-2 -translate-x-1/2 z-20 pointer-events-auto"
          >
            <AnimatePresence>
              {!isPlaying && (
                <motion.button
                  id="lets-start-button"
                  onClick={handlePlayToggle}
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-black/90 hover:bg-black text-white font-anton text-xs sm:text-sm tracking-widest flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 border border-white/20 hover:border-white/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden group"
                  title="Let's start"
                >
                  <span className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 font-bold tracking-wider">
                    LET'S START
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* iPhone-style Bottom Sheet (Slide Up) */}
      <motion.div
        id="second-screen-sheet"
        initial={{ y: "100%" }}
        animate={showSecondScreen ? { y: 0 } : { y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 220 }}
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#d5effd] via-[#aedcf9] to-[#8cd0f7] z-30 flex flex-col items-center justify-start p-6 pt-24 sm:p-12 md:p-16"
      >
        {/* Centered Return Button positioned exactly 56px from top */}
        <button
          onClick={handleResetToStart}
          className="absolute top-[56px] left-1/2 -translate-x-1/2 flex items-center font-anton text-black hover:text-black/70 text-lg sm:text-xl border border-black/20 hover:border-black/40 px-8 py-3 rounded-full bg-white/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer z-40"
        >
          <span>BACK TO START</span>
        </button>

        {/* Content body layout container corresponding to screenshot reference */}
        <div className="w-full flex-1 flex flex-col items-center justify-center relative select-none mt-20 sm:mt-16">
          {/* Stylized background lettering behind cards */}
          <h1 className="font-anton select-none pointer-events-none uppercase text-[13.5vw] sm:text-[16.9vw] leading-none bg-gradient-to-b from-white via-white/70 to-white/0 bg-clip-text text-transparent transform translate-y-4 filter drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)] text-center w-full absolute z-10 whitespace-nowrap">
            COLLECTION #451
          </h1>

          {/* Overlapping Card Deck Layout */}
          <div className="flex items-center justify-center relative z-20 w-full max-w-5xl mt-6">
            {/* Left Card: Rotates further left and slides left/upwards on hover */}
            <YogaCard
              src="/assets/aistudio/2606231928_b1710aa9.mp4"
              initialRotation={-8}
              hoverOffset={{ x: -60, y: -25, rotate: -12, scale: 1.04 }}
              zIndexClass="z-20 hover:z-40"
              className="-mr-14 sm:-mr-22 md:-mr-28 lg:-mr-32"
            />

            {/* Center Card: Centered and elevated, scales up on hover */}
            <YogaCard
              src="/assets/aistudio/06231914_e9866e9b.mp4"
              initialRotation={0}
              hoverOffset={{ x: 0, y: -15, rotate: 0, scale: 1.08 }}
              zIndexClass="z-30 hover:z-40"
              className="scale-105"
            />

            {/* Right Card: Rotates further right and slides right/upwards on hover */}
            <YogaCard
              src="/assets/aistudio/02606231909_f9b28c6b.mp4"
              initialRotation={8}
              hoverOffset={{ x: 60, y: -25, rotate: 12, scale: 1.04 }}
              zIndexClass="z-20 hover:z-40"
              className="-ml-14 sm:-ml-22 md:-ml-28 lg:-ml-32"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


