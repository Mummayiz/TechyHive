import React, { useState } from 'react';
import { TechyHiveLoader, TechyHiveLogo, TechyHiveOutro } from './index';

/**
 * Demo page showcasing all three TechyHive animations
 * Use this to test and preview the animations
 */
const AnimationDemo = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [showOutro, setShowOutro] = useState(false);

  const handleLoaderComplete = () => {
    console.log('Loader animation completed!');
    setShowLoader(false);
  };

  const handleOutroComplete = () => {
    console.log('Outro animation completed!');
    setShowOutro(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          TechyHive Animation System
        </h1>

        {/* Demo Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Loader Demo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">1.</span> Loader Animation
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Loading animation that plays when the app starts. Honeycomb cells appear sequentially with glow effects.
            </p>
            <div className="space-y-3">
              <div className="text-gray-300 text-sm">
                <strong>Duration:</strong> ~1.8s
              </div>
              <div className="text-gray-300 text-sm">
                <strong>Use case:</strong> App initialization, page load
              </div>
              <button
                onClick={() => setShowLoader(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
              >
                Show Loader
              </button>
            </div>
          </div>

          {/* Logo Hover Demo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">2.</span> Hover Animation
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Interactive logo with smooth hover effects. Hexagon cells scale and glow on interaction.
            </p>
            <div className="space-y-3">
              <div className="text-gray-300 text-sm">
                <strong>Duration:</strong> ~0.5s
              </div>
              <div className="text-gray-300 text-sm">
                <strong>Use case:</strong> Navigation, branding
              </div>
              <div className="bg-slate-900/50 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] border border-slate-700">
                <p className="text-gray-400 text-sm mb-4">Hover over the logo:</p>
                <div className="mb-6">
                  <TechyHiveLogo size="medium" />
                </div>
                <div className="flex gap-4">
                  <TechyHiveLogo size="small" />
                  <TechyHiveLogo size="large" />
                </div>
              </div>
            </div>
          </div>

          {/* Outro Demo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">3.</span> Outro Animation
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Power-down animation for page exits. Hexagon cells collapse with energy dispersion effects.
            </p>
            <div className="space-y-3">
              <div className="text-gray-300 text-sm">
                <strong>Duration:</strong> ~1.4s
              </div>
              <div className="text-gray-300 text-sm">
                <strong>Use case:</strong> Page transitions, logout
              </div>
              <button
                onClick={() => setShowOutro(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
              >
                Show Outro
              </button>
            </div>
          </div>

          {/* Usage Guide */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">📖</span> Usage Guide
            </h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <code className="bg-slate-900 px-2 py-1 rounded text-orange-400 text-xs">
                  TechyHiveLoader
                </code>
                <p className="mt-2 text-gray-400">
                  Add to your App.js for initial page load. Use the <code className="text-orange-400">onComplete</code> callback to hide it after animation.
                </p>
              </div>
              <div>
                <code className="bg-slate-900 px-2 py-1 rounded text-orange-400 text-xs">
                  TechyHiveLogo
                </code>
                <p className="mt-2 text-gray-400">
                  Use in navigation bars or headers. Supports <code className="text-orange-400">small</code>, <code className="text-orange-400">medium</code>, and <code className="text-orange-400">large</code> sizes.
                </p>
              </div>
              <div>
                <code className="bg-slate-900 px-2 py-1 rounded text-orange-400 text-xs">
                  TechyHiveOutro
                </code>
                <p className="mt-2 text-gray-400">
                  Trigger with <code className="text-orange-400">isActive=true</code> before page navigation. Use <code className="text-orange-400">onComplete</code> for routing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-orange-500/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            💻 Code Examples
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Import</h3>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-gray-300 text-sm">
{`import { 
  TechyHiveLoader, 
  TechyHiveLogo, 
  TechyHiveOutro 
} from './components/animations';`}
                </code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">Basic Usage</h3>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-gray-300 text-sm">
{`// Loader
<TechyHiveLoader onComplete={() => setLoading(false)} />

// Logo with hover
<TechyHiveLogo size="medium" />

// Outro
<TechyHiveOutro 
  isActive={showOutro} 
  onComplete={() => navigate('/home')} 
/>`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Active Animations */}
      {showLoader && <TechyHiveLoader onComplete={handleLoaderComplete} />}
      {showOutro && <TechyHiveOutro isActive={showOutro} onComplete={handleOutroComplete} />}
    </div>
  );
};

export default AnimationDemo;
