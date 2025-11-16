# TechyHive Animation System 🐝✨

A complete set of 3 connected React animations for the TechyHive brand logo using Framer Motion.

## 🎨 Overview

The TechyHive animation system creates a cohesive brand experience with:
- **Honeycomb design** with hexagonal cells
- **Modern futuristic theme** with AI-inspired aesthetics
- **Glowing orange accents** (#ff8c00) on dark backgrounds
- **Smooth, professional transitions**

## 📦 Components

### 1. TechyHiveLoader.jsx
**Loading Animation** - Plays on app initialization

**Features:**
- Sequential hexagon cell appearance with bounce effect
- Orange glow spreading through the hive
- Text fade-in with scale animation
- Shimmer reflection across text
- Animated background particles
- Loading dots indicator

**Duration:** ~1.8 seconds

**Props:**
- `onComplete` (function): Callback fired when animation completes

**Usage:**
```jsx
import { TechyHiveLoader } from './components/animations';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <TechyHiveLoader onComplete={() => setLoading(false)} />}
      {/* Your app content */}
    </>
  );
}
```

---

### 2. TechyHiveLogo.jsx
**Hover Animation** - Interactive logo for navigation/branding

**Features:**
- Subtle default glow on hive edges
- Hexagon cells scale up on hover (1.15x)
- Central hex glows orange
- "Hive" text glows softly
- Rotating shimmer effect
- Pulsing outer ring
- Drop-shadow enhancement
- Responsive sizing

**Duration:** ~0.5 seconds

**Props:**
- `size` (string): 'small' | 'medium' | 'large' (default: 'medium')
- `className` (string): Additional CSS classes

**Usage:**
```jsx
import { TechyHiveLogo } from './components/animations';

// In navigation bar
<TechyHiveLogo size="medium" />

// Different sizes
<TechyHiveLogo size="small" />
<TechyHiveLogo size="large" className="my-4" />
```

---

### 3. TechyHiveOutro.jsx
**Exit Animation** - Power-down effect for page transitions

**Features:**
- Hexagon cells collapse sequentially
- Bright glow before collapse
- Energy particle dispersion
- Text fade-out with downward movement
- Digital flicker/glitch effect
- Pixel dissolve
- Final pulse from center

**Duration:** ~1.4 seconds

**Props:**
- `isActive` (boolean): Triggers the animation when true
- `onComplete` (function): Callback fired when animation completes

**Usage:**
```jsx
import { TechyHiveOutro } from './components/animations';
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const [showOutro, setShowOutro] = useState(false);
  const navigate = useNavigate();

  const handleExit = () => {
    setShowOutro(true);
  };

  return (
    <>
      <button onClick={handleExit}>Exit</button>
      <TechyHiveOutro 
        isActive={showOutro} 
        onComplete={() => navigate('/home')} 
      />
    </>
  );
}
```

---

## 🚀 Installation

1. Ensure you have Framer Motion installed:
```bash
npm install framer-motion
```

2. Copy the animation components to your project:
```
src/components/animations/
├── TechyHiveLoader.jsx
├── TechyHiveLogo.jsx
├── TechyHiveOutro.jsx
├── index.js
├── AnimationDemo.jsx (optional demo page)
└── README.md
```

3. Import and use:
```jsx
import { TechyHiveLoader, TechyHiveLogo, TechyHiveOutro } from './components/animations';
```

---

## 🎯 Design Specifications

### Colors
- **Primary Glow:** `#ff8c00` (Orange)
- **Background Gradient:** `#0b0f1a` → `#111827` → `#0b0f1a`
- **Text:** White for "Techy", Orange gradient for "Hive"

### Typography
- **Font Family:** 'Poppins', sans-serif (or Inter, Orbitron)
- **Font Weight:** Bold (700)
- **Tracking:** Tight

### Animation Timing
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Loader Duration:** 1.8s
- **Hover Duration:** 0.5s
- **Outro Duration:** 1.4s

### Responsiveness
- All animations scale proportionally
- SVG-based graphics for crisp rendering
- Flexible sizing options (small, medium, large)

---

## 🧩 Animation Flow

### Typical User Journey:
1. **App loads** → `TechyHiveLoader` plays
2. **User navigates** → `TechyHiveLogo` in header (with hover effects)
3. **User exits/changes page** → `TechyHiveOutro` plays before transition

### Example: Complete Integration
```jsx
import React, { useState, useEffect } from 'react';
import { TechyHiveLoader, TechyHiveLogo, TechyHiveOutro } from './components/animations';

function App() {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    // TechyHiveLoader will handle the animation
  }, []);

  const handleNavigation = (path) => {
    setExiting(true);
    // Navigation happens in onComplete callback
  };

  return (
    <>
      {/* Initial Load */}
      {loading && <TechyHiveLoader onComplete={() => setLoading(false)} />}
      
      {/* Main App */}
      {!loading && (
        <div>
          <header>
            <TechyHiveLogo size="medium" />
            {/* Navigation */}
          </header>
          <main>{/* Content */}</main>
        </div>
      )}

      {/* Exit Transition */}
      <TechyHiveOutro 
        isActive={exiting} 
        onComplete={() => {
          // Navigate to new page
          window.location.href = '/new-page';
        }} 
      />
    </>
  );
}
```

---

## 🎨 Customization

### Adjust Colors
```jsx
// In each component file, modify:
const ORANGE_GLOW = '#ff8c00'; // Change to your brand color
```

### Adjust Timing
```jsx
// In TechyHiveLoader.jsx
const ANIMATION_DURATION = 1.8; // Increase/decrease load time

// In TechyHiveLogo.jsx
const HOVER_DURATION = 0.5; // Adjust hover speed

// In TechyHiveOutro.jsx
const OUTRO_DURATION = 1.4; // Adjust exit speed
```

### Adjust Easing
```jsx
const EASE = [0.4, 0, 0.2, 1]; // cubic-bezier values
```

---

## 🐛 Troubleshooting

### Animation not playing
- Ensure Framer Motion is installed
- Check that parent component has proper dimensions
- Verify `isActive` prop is set correctly (for TechyHiveOutro)

### Text not visible
- Ensure parent has dark background
- Check font is loaded (Poppins recommended)
- Verify z-index hierarchy

### Performance issues
- Reduce particle count in TechyHiveLoader
- Disable background effects on mobile
- Use `will-change` CSS property for smoother animations

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

Part of the TechyHive project. All rights reserved.

---

## 🤝 Contributing

To modify or extend animations:
1. Maintain consistent timing and easing
2. Keep color scheme unified
3. Test across different screen sizes
4. Ensure accessibility (reduce motion support)

---

## 🎬 Demo

To see all animations in action, import and render the demo page:

```jsx
import AnimationDemo from './components/animations/AnimationDemo';

function DemoPage() {
  return <AnimationDemo />;
}
```

---

**Made with ❤️ for TechyHive**
