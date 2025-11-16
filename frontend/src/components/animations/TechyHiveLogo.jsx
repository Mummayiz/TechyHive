import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Shared animation constants
const ORANGE_GLOW = '#ff8c00';
const EASE = [0.4, 0, 0.2, 1];
const HOVER_DURATION = 0.5;

// Hexagon cell positions (honeycomb pattern)
const hexagonCells = [
  { id: 0, x: 0, y: 0 },      // Center
  { id: 1, x: -30, y: -17.5 }, // Top-left
  { id: 2, x: 30, y: -17.5 },  // Top-right
  { id: 3, x: -30, y: 17.5 },  // Bottom-left
  { id: 4, x: 30, y: 17.5 },   // Bottom-right
  { id: 5, x: 0, y: -35 },     // Top
  { id: 6, x: 0, y: 35 },      // Bottom
];

const TechyHiveLogo = ({ size = 'medium', className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: { container: 80, svg: 100, text: 'text-xl', scale: 0.6 },
    medium: { container: 160, svg: 200, text: 'text-3xl', scale: 1.2 },
    large: { container: 200, svg: 250, text: 'text-4xl', scale: 1.5 },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <motion.div
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: HOVER_DURATION, ease: EASE }}
    >
      {/* Honeycomb Logo */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: config.container, height: config.container }}
        animate={{
          filter: isHovered
            ? 'drop-shadow(0 0 20px rgba(255, 140, 0, 0.6))'
            : 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.3))',
        }}
        transition={{ duration: HOVER_DURATION, ease: EASE }}
      >
        <svg
          width={config.svg}
          height={config.svg}
          viewBox="-50 -50 100 100"
          className="absolute"
        >
          {/* Outer glow ring */}
          <motion.circle
            cx="0"
            cy="0"
            r="45"
            fill="none"
            stroke={ORANGE_GLOW}
            strokeWidth="0.5"
            opacity="0.2"
            animate={{
              scale: isHovered ? 1.1 : 1,
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{ duration: HOVER_DURATION, ease: EASE }}
          />

          {/* Hexagon cells */}
          {hexagonCells.map((cell, index) => (
            <motion.g key={cell.id}>
              {/* Hex shape */}
              <motion.path
                d="M 10,0 L 5,8.66 L -5,8.66 L -10,0 L -5,-8.66 L 5,-8.66 Z"
                transform={`translate(${cell.x}, ${cell.y})`}
                fill={cell.id === 0 ? ORANGE_GLOW : "transparent"}
                stroke={ORANGE_GLOW}
                strokeWidth="1.5"
                opacity={cell.id === 0 ? 0.3 : 0.6}
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  opacity: isHovered ? (cell.id === 0 ? 0.6 : 0.8) : (cell.id === 0 ? 0.3 : 0.6),
                }}
                transition={{
                  duration: HOVER_DURATION,
                  delay: index * 0.03,
                  ease: EASE,
                }}
              />

              {/* Inner glow for center cell */}
              {cell.id === 0 && (
                <motion.path
                  d="M 10,0 L 5,8.66 L -5,8.66 L -10,0 L -5,-8.66 L 5,-8.66 Z"
                  transform={`translate(${cell.x}, ${cell.y})`}
                  fill={ORANGE_GLOW}
                  animate={{
                    opacity: isHovered ? 0.5 : 0.2,
                    scale: isHovered ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              )}

              {/* Connecting nodes */}
              <motion.circle
                cx={cell.x}
                cy={cell.y}
                r="2"
                fill={ORANGE_GLOW}
                animate={{
                  scale: isHovered ? [1, 1.5, 1.2] : 1,
                  opacity: isHovered ? [0.6, 1, 0.8] : 0.6,
                }}
                transition={{
                  duration: HOVER_DURATION,
                  delay: index * 0.04,
                  ease: EASE,
                }}
              />
            </motion.g>
          ))}

          {/* Central graduation cap icon */}
          <motion.g
            animate={{
              scale: isHovered ? 1.1 : 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: HOVER_DURATION, ease: EASE }}
          >
            {/* Graduation cap */}
            <path
              d="M -7.5,-2.5 L 0,-6 L 7.5,-2.5 L 7.5,0 L 0,3.5 L -7.5,0 Z"
              fill={ORANGE_GLOW}
              opacity="0.9"
            />
            <rect
              x="-1"
              y="0"
              width="2"
              height="7.5"
              fill={ORANGE_GLOW}
              opacity="0.7"
            />
            <circle cx="0" cy="8.5" r="1.5" fill={ORANGE_GLOW} />
          </motion.g>

          {/* Rotating shimmer effect on hover */}
          {isHovered && (
            <motion.g>
              <motion.line
                x1="-40"
                y1="-40"
                x2="40"
                y2="40"
                stroke="url(#shimmerGradient)"
                strokeWidth="2"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, rotate: 360 }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
              />
              <defs>
                <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor={ORANGE_GLOW} stopOpacity="0.8" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </motion.g>
          )}

          {/* Pulsing outer ring on hover */}
          {isHovered && (
            <motion.circle
              cx="0"
              cy="0"
              r="48"
              fill="none"
              stroke={ORANGE_GLOW}
              strokeWidth="1"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{
                scale: [0.9, 1.15, 0.9],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </svg>
      </motion.div>

      {/* TechyHive Text */}
      <motion.div className="flex flex-col">
        <motion.h1
          className={`font-bold tracking-tight leading-none ${config.text}`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <span className="text-white">Techy</span>
          <motion.span
            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
            animate={{
              textShadow: isHovered
                ? [
                    '0 0 10px rgba(255, 140, 0, 0.3)',
                    '0 0 25px rgba(255, 140, 0, 0.6)',
                    '0 0 15px rgba(255, 140, 0, 0.4)',
                  ]
                : '0 0 10px rgba(255, 140, 0, 0)',
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            Hive
          </motion.span>
        </motion.h1>

        {/* Shimmer line under text on hover */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-1"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 0.8 : 0,
          }}
          transition={{ duration: HOVER_DURATION, ease: EASE }}
        />
      </motion.div>

      {/* Hover glow effect behind entire logo */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-orange-500/20 to-transparent rounded-full blur-2xl -z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.5 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: HOVER_DURATION, ease: EASE }}
        />
      )}
    </motion.div>
  );
};

export default TechyHiveLogo;
