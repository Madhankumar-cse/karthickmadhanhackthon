import React from 'react';
import { Sprout, Target, Shield, Award, AlertCircle } from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#2D6A4F]/15 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#5C6F65] mb-1.5">
          <span className="font-semibold text-[#1B4332]">SSA025 Project Overview</span>
          <span aria-hidden="true">·</span>
          <span>Agricultural Decision-Support Platform</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
          About CropGuard AI Pro
        </h1>
        <p className="text-sm text-[#5C6F65] mt-1">
          Predict Yield. Understand Risk. Farm Smarter.
        </p>
      </div>

      {/* Mission Statement */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-[#1B4332]">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold">Platform Purpose & Scope</h2>
        </div>

        <p className="text-sm text-[#36453F] leading-relaxed">
          CropGuard AI Pro is an AI-powered agricultural decision-support platform focused on crop-yield forecasting. By synthesizing historical agronomic yield data with geographic soil parameters, annual precipitation, seasonal timing, and cultivation input factors, the system assists farmers, agricultural officers, and cooperative planners in anticipating harvest outcomes prior to planting.
        </p>

        <p className="text-sm text-[#36453F] leading-relaxed">
          The project addresses problem statement <strong>SSA025</strong>: building a crop-yield forecasting system that estimates expected yield from historical crop, soil, weather, and cultivation information, while rigorously identifying the factors influencing the prediction.
        </p>
      </section>

      {/* Sustainable Development Goals: SDG 2 Zero Hunger */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-[#1B4332]">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold">SDG 2 – Zero Hunger Alignment</h2>
        </div>

        <p className="text-sm text-[#36453F] leading-relaxed">
          CropGuard AI Pro directly supports the United Nations Sustainable Development Goal <strong>SDG 2: End hunger, achieve food security and improved nutrition and promote sustainable agriculture</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10">
            <span className="text-xs font-bold text-[#1B4332] block mb-1">
              SDG Target 2.3: Agricultural Productivity
            </span>
            <p className="text-xs text-[#5C6F65] leading-relaxed">
              Provides small-scale cultivators with empirical yield expectations, enabling prudent seed, fertilizer, and resource budgeting to reduce post-sowing shock.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10">
            <span className="text-xs font-bold text-[#1B4332] block mb-1">
              SDG Target 2.4: Sustainable Production Systems
            </span>
            <p className="text-xs text-[#5C6F65] leading-relaxed">
              Encourages balanced chemical input management by demonstrating that extreme pesticide or fertilizer applications suffer from diminishing yield returns.
            </p>
          </div>
        </div>
      </section>

      {/* Team Specification and Attribution */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-[#1B4332]">
          <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold">Project Attribution & Metadata</h2>
        </div>

        <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C6F65]">Assigned Team Identifier:</span>
            <span className="font-mono font-bold text-[#1B4332] bg-[#EBF3EE] px-2.5 py-1 rounded">
              TEAM ID: TSS002
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
            <span className="text-[#5C6F65]">Problem Statement:</span>
            <span className="font-semibold text-[#1B4332]">
              SSA025 – Crop-Yield Forecasting System
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
            <span className="text-[#5C6F65]">ML Architecture:</span>
            <span className="font-mono text-[#2D6A4F]">
              Random Forest Regressor (joblib.load)
            </span>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-2">
            <span className="text-[#5C6F65]">Database Engine:</span>
            <span className="font-mono text-[#2D6A4F]">
              PostgreSQL Relational Ledger
            </span>
          </div>
        </div>
      </section>

      {/* Scientific & Agronomic Disclaimers */}
      <section className="bg-[#FFFDF7] border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <h3 className="text-base font-bold">Scientific & Agronomic Disclaimers</h3>
        </div>

        <p className="text-xs text-amber-900/90 leading-relaxed">
          CropGuard AI Pro provides probabilistic statistical estimations based on historical training distributions. While the model achieves strong mathematical validation on test subsets, <strong>it does not claim or guarantee yield improvement, guaranteed profit, or guaranteed food security</strong>. Real farm yields are governed by real-time micro-climate variability, unmodeled pest outbreaks, irrigation consistency, seed germination rates, and physical soil conditions.
        </p>

        <p className="text-xs text-amber-900/90 leading-relaxed">
          Forecast outputs must serve as supplemental decision-support advisory, not as guaranteed financial or agronomic warranties.
        </p>
      </section>

      <div className="pt-2 flex justify-center">
        <button
          onClick={() => setActiveTab('forecast')}
          className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-lg transition-colors"
        >
          Try the Forecasting Tool
        </button>
      </div>
    </div>
  );
};
