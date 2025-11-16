import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared animation constants
const OUTRO_DURATION = 1.4;
const ORANGE_GLOW = '#ff8c00';
const EASE = [0.4, 0, 0.2, 1];

// Hexagon cell positions (honeycomb pattern)
const hexagonCells = [
  { id: 6, x: 0, y: 70, delay: 0 },      // Bottom - collapses first
  { id: 3, x: -60, y: 35, delay: 0.08 }, // Bottom-left
  { id: 4, x: 60, y: 35, delay: 0.08 },  // Bottom-right
  { id: 1, x: -60, y: -35, delay: 0.16 }, // Top-left
  { id: 2, x: 60, y: -35, delay: 0.16 }, // Top-right
  { id: 5, x: 0, y: -70, delay: 0.24 },  // Top
  { id: 0, x: 0, y: 0, delay: 0.32 },    // Center - collapses last
];

const TechyHiveOutro = ({ isActive = false, onComplete }) => {
  const [showFlicker, setShowFlicker] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Start flicker effect near the end
      const flickerTimeout = setTimeout(() => {
        setShowFlicker(true);
      }, (OUTRO_DURATION - 0.4) * 1000);

      // Complete animation
      const completeTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, OUTRO_DURATION * 1000);

      return () => {
        clearTimeout(flickerTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-[#0b0f1a] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glitch overlay effect */}
        {showFlicker && (
          <motion.div
            className="absolute inset-0 bg-slate-900"
            animate={{
              opacity: [0, 0.5, 0, 0.7, 0, 0.3, 0],
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
              ease: "linear",
            }}
          />
        )}

        <div className="relative">
          {/* Honeycomb Logo Container */}
          <motion.div
            className="relative w-64 h-64 flex items-center justify-center mb-8"
            animate={{
              scale: [1, 1.05, 0.95, 0.9],
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: OUTRO_DURATION,
              times: [0, 0.3, 0.7, 1],
              ease: EASE,
            }}
          >
            {/* Expanding energy pulse before collapse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${ORANGE_GLOW}40 0%, transparent 70%)`,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 2.5, 3],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />

            {/* Hexagon cells */}
            <svg
              width="200"
              height="200"
              viewBox="-100 -100 200 200"
              className="absolute"
            >
              {hexagonCells.map((cell) => (
                <motion.g key={cell.id}>
                  {/* Bright glow before collapse */}
                  <motion.path
                    d="M 20,0 L 10,17.32 L -10,17.32 L -20,0 L -10,-17.32 L 10,-17.32 Z"
                    transform={`translate(${cell.x}, ${cell.y})`}
                    fill={ORANGE_GLOW}
                    animate={{
                      opacity: [0.3, 1, 0],
                      scale: [1, 1.2, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: cell.delay,
                      ease: EASE,
                    }}
                  />

                  {/* Hex stroke */}
                  <motion.path
                    d="M 20,0 L 10,17.32 L -10,17.32 L -20,0 L -10,-17.32 L 10,-17.32 Z"
                    transform={`translate(${cell.x}, ${cell.y})`}
                    fill="none"
                    stroke={ORANGE_GLOW}
                    strokeWidth="2"
                    animate={{
                      pathLength: [1, 1, 0],
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: cell.delay,
                      ease: EASE,
                    }}
                  />

                  {/* Collapsing effect */}
                  <motion.path
                    d="M 20,0 L 10,17.32 L -10,17.32 L -20,0 L -10,-17.32 L 10,-17.32 Z"
                    transform={`translate(${cell.x}, ${cell.y})`}
                    fill={ORANGE_GLOW}
                    animate={{
                      scale: [1, 1.3, 0.3, 0],
                      opacity: [0.5, 0.8, 0.3, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      delay: cell.delay + 0.1,
                      ease: EASE,
                    }}
                  />

                  {/* Energy particles dispersing */}
                  {[...Array(6)].map((_, i) => (
                    <motion.circle
                      key={`particle-${cell.id}-${i}`}
                      cx={cell.x}
                      cy={cell.y}
                      r="2"
                      fill={ORANGE_GLOW}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                      }}
                      animate={{
                        x: Math.cos((i * Math.PI) / 3) * 50,
                        y: Math.sin((i * Math.PI) / 3) * 50,
                        opacity: [1, 0.5, 0],
                        scale: [1, 0.5, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: cell.delay + 0.2,
                        ease: "easeOut",
                      }}
                    />
                  ))}

                  {/* Connecting nodes */}
                  <motion.circle
                    cx={cell.x}
                    cy={cell.y}
                    r="3"
                    fill={ORANGE_GLOW}
                    animate={{
                      scale: [1, 2, 0],
                      opacity: [0.8, 1, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: cell.delay,
                      ease: EASE,
                    }}
                  />
                </motion.g>
              ))}

              {/* Central graduation cap - last to disappear */}
              <motion.g
                animate={{
                  scale: [1, 1.2, 0.8, 0],
                  opacity: [1, 1, 0.5, 0],
                  y: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.5,
                  ease: EASE,
                }}
              >
                <path
                  d="M -15,-5 L 0,-12 L 15,-5 L 15,0 L 0,7 L -15,0 Z"
                  fill={ORANGE_GLOW}
                  opacity="0.9"
                />
                <rect
                  x="-2"
                  y="0"
                  width="4"
                  height="15"
                  fill={ORANGE_GLOW}
                  opacity="0.7"
                />
                <circle cx="0" cy="17" r="3" fill={ORANGE_GLOW} />
              </motion.g>

              {/* Final pulse from center */}
              <motion.circle
                cx="0"
                cy="0"
                r="5"
                fill={ORANGE_GLOW}
                animate={{
                  scale: [1, 15, 20],
                  opacity: [1, 0.3, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: "easeOut",
                }}
              />

              {/* Outer ring collapse */}
              <motion.circle
                cx="0"
                cy="0"
                r="90"
                fill="none"
                stroke={ORANGE_GLOW}
                strokeWidth="2"
                animate={{
                  scale: [1, 0.8, 0.3],
                  opacity: [0.5, 0.8, 0],
                  strokeWidth: [2, 4, 0],
                }}
                transition={{
                  duration: 0.8,
                  ease: EASE,
                }}
              />
            </svg>
          </motion.div>

          {/* TechyHive Text - fades and moves down */}
          <motion.div
            className="text-center"
            animate={{
              y: [0, 20, 30],
              opacity: [1, 0.5, 0],
              scale: [1, 0.95, 0.9],
            }}
            transition={{
              duration: OUTRO_DURATION * 0.6,
              delay: 0.3,
              ease: EASE,
            }}
          >
            <motion.h1
              className="text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              animate={{
                filter: showFlicker
                  ? [
                      'brightness(1)',
                      'brightness(0.3)',
                      'brightness(1)',
                      'brightness(0.5)',
                      'brightness(0)',
                    ]
                  : 'brightness(1)',
              }}
              transition={{
                duration: 0.3,
                times: [0, 0.2, 0.4, 0.6, 1],
              }}
            >
              <span className="text-white">Techy</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Hive
              </span>
            </motion.h1>

            {/* Digital scanline effect */}
            {showFlicker && (
              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, repeat: 2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-full h-0.5 bg-orange-500"
                    style={{ top: `${i * 25}%` }}
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 0.15,
                      delay: i * 0.03,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Power-down indicator */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            animate={{
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-orange-500 rounded-full"
                animate={{
                  scale: [1, 0.5, 0],
                  opacity: [1, 0.5, 0],
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + i * 0.1,
                  ease: EASE,
                }}
              />
            ))}
          </motion.div>

          {/* Pixel dissolve effect */}
          {showFlicker && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-orange-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [1, 0.5, 0],
                    y: [0, Math.random() * 50 - 25],
                    x: [0, Math.random() * 50 - 25],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Screen fade to black */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: OUTRO_DURATION - 0.5,
            ease: "easeIn",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TechyHiveOutro;
