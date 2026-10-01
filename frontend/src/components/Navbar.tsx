import React from 'react';
import { Sprout } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Yield Forecast' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'Prediction History' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8FAF8]/95 backdrop-blur-md border-b border-[#2D6A4F]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single Wordmark */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] flex items-center justify-center text-white shadow-sm transition-transform duration-150 group-hover:scale-105">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1B4332]">
              CropGuard AI Pro
            </span>
          </button>

          {/* Zone 2: Navigation Links (Clean Text with subtle underline) */}
          <nav className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors relative py-1 focus:outline-none ${
                  activeTab === item.id
                    ? 'text-[#1B4332] font-semibold'
                    : 'text-[#4A5D53] hover:text-[#1B4332]'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D6A4F] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('forecast')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] active:bg-[#081C15] transition-colors whitespace-nowrap shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/30"
            >
              Forecast Yield
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center overflow-x-auto py-2.5 space-x-4 border-t border-[#2D6A4F]/10 scrollbar-none text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-1 py-1 font-medium transition-colors ${
                activeTab === item.id
                  ? 'text-[#1B4332] border-b-2 border-[#2D6A4F]'
                  : 'text-[#4A5D53] hover:text-[#1B4332]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
