import React from 'react';
import { ArchitectureFlow } from '../components/ArchitectureFlow';
import { ArrowRight, CheckCircle2, ShieldAlert, Cpu, BarChart3, Database } from 'lucide-react';
import heroImg from '../assets/images/hero_smart_agriculture_1790842131032.jpg';
import labImg from '../assets/images/agronomy_lab_greenhouse_1790842145262.jpg';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#122B20] via-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-12 lg:p-16 shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-[#74C69D] font-medium mb-4">
            <span className="font-bold text-white tracking-wider">SSA025 SPECIFICATION</span>
            <span aria-hidden="true">·</span>
            <span>TEAM ID: TSS002</span>
            <span aria-hidden="true">·</span>
            <span>Scikit-Learn ML Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            CropGuard AI Pro
          </h1>

          <p className="text-xl sm:text-2xl font-light text-[#D8E2DC] mb-4">
            Predict Yield. Understand Risk. Farm Smarter.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-[#A3B899] mb-4">
            Predict Crop Yield Before You Plant.
          </h2>

          <p className="text-sm sm:text-base text-[#D8E2DC]/90 mb-8 leading-relaxed max-w-2xl">
            CropGuard AI Pro uses historical agricultural data, soil characteristics, meteorological precipitation, and precise cultivation metrics to train an empirical machine-learning model that accurately forecasts crop yield and expected harvest volume.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('forecast')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#081C15] bg-[#74C69D] rounded-xl hover:bg-[#52B788] transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-[#74C69D]/50"
            >
              <span>Generate Yield Forecast</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('how-it-works')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-150 focus:outline-none"
            >
              <span>How It Works</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Asset */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:w-5/12 rounded-xl overflow-hidden shadow-2xl border border-white/20">
          <img
            src={heroImg}
            alt="Fertile agricultural terraces and precision farming rows"
            referrerPolicy="no-referrer"
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
        </div>
      </section>

      {/* Architecture Flow Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#2D6A4F]/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1B4332]">
              Forecasting Architecture & Pipeline
            </h2>
            <p className="text-sm text-[#5C6F65] mt-1">
              End-to-end data lifecycle from empirical field inputs to harvest planning
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#5C6F65]">
            <span>Deterministic ML Inference</span>
            <span aria-hidden="true">·</span>
            <span>Zero Randomness</span>
          </div>
        </div>

        <ArchitectureFlow />
      </section>

      {/* Agronomic Rigor & Zero Target Leakage Policy */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-8 border border-[#2D6A4F]/15 shadow-sm">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2D6A4F]">
            <Cpu className="w-4 h-4" />
            <span>AGRONOMIC RIGOR & DATA INTEGRITY</span>
          </div>

          <h3 className="text-2xl font-bold text-[#1B4332] leading-tight">
            Scientific Machine Learning Designed for Agricultural Realities
          </h3>

          <p className="text-sm text-[#4A5D53] leading-relaxed">
            Many amateur crop predictors make the fatal error of including total Production as an input, creating target leakage. In CropGuard AI Pro, we strictly adhere to rigorous ML engineering principles:
          </p>

          <ul className="space-y-3 text-sm text-[#36453F]">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Target Leakage:</strong> Production is never an input feature. It is calculated post-inference as <em>Yield (tons/ha) × Area (ha)</em>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>
                <strong>Actual ML Model File:</strong> Predictions execute through the actual Scikit-Learn pipeline serialized in <code className="text-xs bg-[#EBF3EE] px-1.5 py-0.5 rounded text-[#1B4332]">ml/crop_yield_model.joblib</code>.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>
                <strong>PostgreSQL Persistence:</strong> Every historical forecast is committed to the relational database to form an immutable record.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>
                <strong>No Hallucinated Predictions:</strong> Predictions represent genuine regression values, not random or mocked numbers.
              </span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('forecast')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] transition-colors"
            >
              <span>Launch Live Forecast Tool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-[#2D6A4F]/15 shadow-md">
          <img
            src={labImg}
            alt="Agricultural science greenhouse and agronomy testing"
            referrerPolicy="no-referrer"
            className="w-full h-80 object-cover"
          />
          <div className="p-4 bg-[#F8FAF8] border-t border-[#2D6A4F]/10 flex items-center justify-between text-xs text-[#5C6F65]">
            <span>Agronomic validation environment</span>
            <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
          </div>
        </div>
      </section>

      {/* Three Pillars Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#1B4332] mb-2">Multi-Factor Analysis</h4>
          <p className="text-xs text-[#5C6F65] leading-relaxed">
            Considers historical season, agro-climatic state conditions, rainfall, chemical inputs, and land scale simultaneously to predict hectare-level yield.
          </p>
        </div>

        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#1B4332] mb-2">Explainable AI Matrix</h4>
          <p className="text-xs text-[#5C6F65] leading-relaxed">
            Empirically displays feature importance while maintaining the critical distinction between correlation, tree split importance, and biological causation.
          </p>
        </div>

        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[#1B4332] mb-2">PostgreSQL Data Vault</h4>
          <p className="text-xs text-[#5C6F65] leading-relaxed">
            All agricultural predictions are permanently recorded in the database, powering dynamic yield trends and crop comparison dashboards.
          </p>
        </div>
      </section>
    </div>
  );
};
