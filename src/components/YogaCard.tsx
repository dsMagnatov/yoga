import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

interface YogaCardProps {
  src: string;
  initialRotation: number;
  hoverOffset: { x: number; y: number; rotate: number; scale: number };
  zIndexClass: string;
  className?: string;
}

export const YogaCard: React.FC<YogaCardProps> = ({
  src,
  initialRotation,
  hoverOffset,
  zIndexClass,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered) {
      video.play().catch((err) => {
        // Safe play fail catcher
        console.log("Card video play interrupted:", err);
      });
    } else {
      video.pause();
      // Reset to first frame (stop-frame representation)
      video.currentTime = 0;
    }
  }, [isHovered]);

  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden aspect-[9/16] w-72 sm:w-[21rem] md:w-[24rem] bg-white border-[6px] sm:border-[8px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.22)] cursor-pointer origin-bottom select-none ${zIndexClass} ${className}`}
      initial={{ rotate: initialRotation, x: 0, y: 0, scale: 1 }}
      whileHover={{
        rotate: hoverOffset.rotate,
        x: hoverOffset.x,
        y: hoverOffset.y,
        scale: hoverOffset.scale,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover rounded-2xl pointer-events-none"
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Decorative premium shadow inner ring overlay */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none" />
    </motion.div>
  );
};
