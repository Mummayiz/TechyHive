import React, { useState, useEffect } from 'react';
import { TechyHiveLoader, TechyHiveLogo } from '../components/animations';

/**
 * Example: How to integrate TechyHive animations into your app
 * 
 * This shows a practical implementation pattern for:
 * - Initial app loading
 * - Navigation with animated logo
 */
const IntegrationExample = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization (e.g., fetching data, auth check)
    // The loader will play for ~1.8 seconds automatically
  }, []);

  return (
    <>
      {/* STEP 1: Show loader on initial app load */}
      {isLoading && (
        <TechyHiveLoader 
          onComplete={() => {
            console.log('App loaded!');
            setIsLoading(false);
          }} 
        />
      )}

      {/* STEP 2: Main app content (shows after loader completes) */}
      {!isLoading && (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Navigation with animated logo */}
          <nav className="flex items-center justify-between p-6 border-b border-orange-500/20">
            <TechyHiveLogo size="medium" />
            
            <div className="flex gap-6 text-white">
              <a href="#home" className="hover:text-orange-500 transition-colors">Home</a>
              <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
              <a href="#portfolio" className="hover:text-orange-500 transition-colors">Portfolio</a>
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a>
            </div>

            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Get Started
            </button>
          </nav>

          {/* Your page content */}
          <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to TechyHive
            </h1>
            <p className="text-gray-400">
              Your content goes here...
            </p>
          </main>
        </div>
      )}
    </>
  );
};

export default IntegrationExample;

// ============================================
// ALTERNATIVE: Using with React Router
// ============================================

/*
import { useNavigate } from 'react-router-dom';
import { TechyHiveOutro } from '../components/animations';

function NavigationWithOutro() {
  const [showOutro, setShowOutro] = useState(false);
  const [nextPath, setNextPath] = useState('');
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setNextPath(path);
    setShowOutro(true);
  };

  const handleOutroComplete = () => {
    navigate(nextPath);
    setShowOutro(false);
  };

  return (
    <>
      <button onClick={() => handleNavigation('/about')}>
        Go to About
      </button>

      <TechyHiveOutro 
        isActive={showOutro} 
        onComplete={handleOutroComplete} 
      />
    </>
  );
}
*/

// ============================================
// SIMPLE LOGO USAGE IN NAVIGATION
// ============================================

/*
import { TechyHiveLogo } from '../components/animations';

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <TechyHiveLogo size="medium" />
    </header>
  );
}
*/
