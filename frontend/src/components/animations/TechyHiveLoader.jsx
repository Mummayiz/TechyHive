import React from 'react';
import { motion } from 'framer-motion';

// Shared animation constants
const ANIMATION_DURATION = 1.8;
const ORANGE_GLOW = '#ff8c00';
const EASE = [0.4, 0, 0.2, 1];

// Hexagon cell positions (honeycomb pattern)
const hexagonCells = [
  { id: 0, x: 0, y: 0, delay: 0 },      // Center
  { id: 1, x: -60, y: -35, delay: 0.1 }, // Top-left
  { id: 2, x: 60, y: -35, delay: 0.15 }, // Top-right
  { id: 3, x: -60, y: 35, delay: 0.2 },  // Bottom-left
  { id: 4, x: 60, y: 35, delay: 0.25 },  // Bottom-right
  { id: 5, x: 0, y: -70, delay: 0.3 },   // Top
  { id: 6, x: 0, y: 70, delay: 0.35 },   // Bottom
];

const TechyHiveLoader = ({ onComplete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-[#0b0f1a] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Honeycomb Logo Container */}
        <motion.div
          className="relative w-64 h-64 flex items-center justify-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Hexagon cells */}
          <svg
            width="200"
            height="200"
            viewBox="-100 -100 200 200"
            className="absolute"
          >
            {hexagonCells.map((cell) => (
              <motion.g
                key={cell.id}
                initial={{ scale: 0, opacity: 0, rotate: 180 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotate: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: cell.delay,
                  ease: EASE,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                {/* Hex shape */}
                <motion.path
                  d="M 20,0 L 10,17.32 L -10,17.32 L -20,0 L -10,-17.32 L 10,-17.32 Z"
                  transform={`translate(${cell.x}, ${cell.y})`}
                  fill="none"
                  stroke={ORANGE_GLOW}
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: cell.delay + 0.2,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Glow effect */}
                <motion.path
                  d="M 20,0 L 10,17.32 L -10,17.32 L -20,0 L -10,-17.32 L 10,-17.32 Z"
                  transform={`translate(${cell.x}, ${cell.y})`}
                  fill={cell.id === 0 ? ORANGE_GLOW : "transparent"}
                  opacity={cell.id === 0 ? 0.3 : 0.1}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: cell.id === 0 ? [0, 0.5, 0.3] : [0, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: cell.delay + 0.4,
                    ease: "easeInOut",
                  }}
                />

                {/* Connecting nodes */}
                <motion.circle
                  cx={cell.x}
                  cy={cell.y}
                  r="3"
                  fill={ORANGE_GLOW}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1], 
                    opacity: [0, 1, 0.8],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: cell.delay + 0.3,
                    ease: EASE,
                  }}
                />
              </motion.g>
            ))}

            {/* Central graduation cap icon */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: EASE,
                type: "spring",
                stiffness: 200,
              }}
            >
              {/* Graduation cap */}
              <path
                d="M -15,-5 L 0,-12 L 15,-5 L 15,0 L 0,7 L -15,0 Z"
                fill={ORANGE_GLOW}
                opacity="0.8"
              />
              <rect
                x="-2"
                y="0"
                width="4"
                height="15"
                fill={ORANGE_GLOW}
                opacity="0.6"
              />
              <circle cx="0" cy="17" r="3" fill={ORANGE_GLOW} />
            </motion.g>

            {/* Outer glow ring */}
            <motion.circle
              cx="0"
              cy="0"
              r="90"
              fill="none"
              stroke={ORANGE_GLOW}
              strokeWidth="1"
              opacity="0.3"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.1, 1], 
                opacity: [0, 0.5, 0.2],
              }}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: EASE,
              }}
            />
          </svg>
        </motion.div>

        {/* TechyHive Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: EASE,
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 500);
            }
          }}
        >
          <motion.h1 
            className="text-5xl font-bold tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="text-white">Techy</span>
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(255, 140, 0, 0)',
                  '0 0 20px rgba(255, 140, 0, 0.5)',
                  '0 0 10px rgba(255, 140, 0, 0.3)',
                ],
              }}
              transition={{
                duration: 1,
                delay: 1.4,
                ease: "easeInOut",
              }}
            >
              Hive
            </motion.span>
          </motion.h1>

          {/* Shimmer effect on text */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 1,
              delay: 1.5,
              ease: "easeInOut",
            }}
          />

          {/* Tagline */}
          <motion.p
            className="text-gray-400 text-sm mt-2 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            Transforming Ideas into Digital Solutions
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div 
          className="flex justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-orange-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2 + 1.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TechyHiveLoader;
