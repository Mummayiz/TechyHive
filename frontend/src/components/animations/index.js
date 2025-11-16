// Export all TechyHive animation components
export { default as TechyHiveLoader } from './TechyHiveLoader';
export { default as TechyHiveLogo } from './TechyHiveLogo';
export { default as TechyHiveOutro } from './TechyHiveOutro';

// Animation constants for consistent usage across the app
export const ANIMATION_CONFIG = {
  colors: {
    primary: '#ff8c00',      // Orange glow
    background: {
      from: '#0b0f1a',
      via: '#111827',
      to: '#0b0f1a',
    },
  },
  timing: {
    loader: 1.8,           // seconds
    hover: 0.5,            // seconds
    outro: 1.4,            // seconds
  },
  easing: [0.4, 0, 0.2, 1], // cubic-bezier
};
