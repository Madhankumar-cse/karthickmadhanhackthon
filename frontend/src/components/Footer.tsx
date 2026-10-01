import React from 'react';
import { Sprout } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#122B20] text-[#D8E2DC] border-t border-[#2D6A4F]/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-[#52B788] flex items-center justify-center text-[#081C15]">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CropGuard AI Pro</span>
            </div>
            <p className="text-sm text-[#A3B899] max-w-md leading-relaxed">
              Predict Yield. Understand Risk. Farm Smarter. An empirical machine-learning crop yield forecasting system translating agronomic, soil, and meteorological inputs into actionable harvest forecasts.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#74C69D]">
              <span className="font-semibold text-white">SSA025</span>
              <span aria-hidden="true">·</span>
              <span>Problem Statement: Crop-Yield Forecasting System</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-white">TEAM ID: TSS002</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-[#A3B899]">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('forecast')} className="hover:text-white transition-colors">
                  Yield Forecast
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Analytics Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('history')} className="hover:text-white transition-colors">
                  Historical Records
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Governance</h4>
            <ul className="space-y-2 text-sm text-[#A3B899]">
              <li>
                <button onClick={() => setActiveTab('how-it-works')} className="hover:text-white transition-colors">
                  ML Architecture & Flow
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  About & SDG 2 Alignment
                </button>
              </li>
              <li className="text-xs text-[#74C69D]/80 pt-2 leading-relaxed">
                Empirical forecasts for agronomic planning. Does not constitute guaranteed financial or commercial harvest warranty.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2D6A4F]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8FA395]">
          <p>© 2026 CropGuard AI Pro. All rights reserved.</p>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <span>TEAM ID: TSS002</span>
            <span aria-hidden="true">·</span>
            <span>SSA025 Specification</span>
            <span aria-hidden="true">·</span>
            <span>Scikit-Learn Random Forest Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
