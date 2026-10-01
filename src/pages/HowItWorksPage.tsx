import React from 'react';
import { ArchitectureFlow } from '../components/ArchitectureFlow';
import { Database, Server, Cpu, Layers, HelpCircle, ShieldCheck } from 'lucide-react';

interface Props {
  setActiveTab: (tab: string) => void;
}

export const HowItWorksPage: React.FC<Props> = ({ setActiveTab }) => {
  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#2D6A4F]/15 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#5C6F65] mb-1.5">
          <span className="font-semibold text-[#1B4332]">Technical Documentation</span>
          <span aria-hidden="true">·</span>
          <span>SSA025 Specification</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
          How CropGuard AI Pro Works
        </h1>
        <p className="text-sm text-[#5C6F65] mt-1">
          Complete algorithmic, software, and agronomic pipeline documentation from field observations to decision support.
        </p>
      </div>

      {/* Part 1: Agronomic Data Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#2D6A4F]" />
          <h2 className="text-xl font-bold text-[#1B4332]">
            1. Agricultural ML Pipeline
          </h2>
        </div>
        <p className="text-xs text-[#5C6F65] leading-relaxed">
          The end-to-end data transformation pipeline guarantees reproducible, scientifically grounded forecasts:
        </p>

        <ArchitectureFlow />
      </section>

      {/* Part 2: Software Architecture */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#2D6A4F]" />
          <h2 className="text-xl font-bold text-[#1B4332]">
            2. Full-Stack Software Architecture
          </h2>
        </div>
        <p className="text-xs text-[#5C6F65] leading-relaxed">
          How user requests travel through the production software layers:
        </p>

        <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10 font-mono text-xs text-[#1B4332] space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-bold">1. React Frontend</span>
            <span className="text-[#5C6F65]">Vite + TypeScript + Tailwind CSS</span>
          </div>
          <div className="text-center text-xs text-[#52B788] font-bold">↓ REST API (JSON /predict)</div>

          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-bold">2. FastAPI / Express Backend</span>
            <span className="text-[#5C6F65]">Pydantic schema validation & route handlers</span>
          </div>
          <div className="text-center text-xs text-[#52B788] font-bold">↓ In-memory ML execution (joblib.load)</div>

          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-bold">3. Trained ML Model</span>
            <span className="text-[#5C6F65]">Random Forest Regressor (ml/crop_yield_model.joblib)</span>
          </div>
          <div className="text-center text-xs text-[#52B788] font-bold">↓ Structured persistence</div>

          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-bold">4. PostgreSQL Database</span>
            <span className="text-[#5C6F65]">SQLAlchemy Prediction entity persistence</span>
          </div>
          <div className="text-center text-xs text-[#52B788] font-bold">↓ Recharts rendering & aggregation</div>

          <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-200">
            <span className="font-bold">5. Interactive Dashboard</span>
            <span className="text-[#5C6F65]">Real telemetry charts & audit history table</span>
          </div>
        </div>
      </section>

      {/* Part 3: Mathematical Formulations */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#2D6A4F]" />
          <h2 className="text-xl font-bold text-[#1B4332]">
            3. Mathematical Modeling & Zero-Leakage Formulation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#36453F]">
          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10 space-y-2">
            <span className="font-bold text-[#1B4332] block">Crop Yield Point Estimate</span>
            <p className="leading-relaxed">
              Yield is modeled as a non-linear regression function over categorical agro-ecological factors and numeric variables:
            </p>
            <div className="p-2.5 bg-white rounded-md font-mono text-[11px] text-[#2D6A4F] border border-gray-200">
              Y = f(Year, State, Crop, Season, Area, Rainfall, Fertilizer, Pesticide)
            </div>
            <p className="text-[11px] text-[#5C6F65]">
              Output unit: Metric Tons per Hectare (tons/ha).
            </p>
          </div>

          <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10 space-y-2">
            <span className="font-bold text-[#1B4332] block">Expected Total Production</span>
            <p className="leading-relaxed">
              Production is never an input feature to prevent circular target leakage. It is strictly derived post-prediction:
            </p>
            <div className="p-2.5 bg-white rounded-md font-mono text-[11px] text-[#2D6A4F] border border-gray-200">
              Expected_Production = Predicted_Yield × Area
            </div>
            <p className="text-[11px] text-[#5C6F65]">
              Output unit: Total Metric Tons across farm acreage.
            </p>
          </div>
        </div>
      </section>

      {/* Part 4: Explainable AI Methodology */}
      <section className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#2D6A4F]" />
          <h2 className="text-xl font-bold text-[#1B4332]">
            4. Explainable AI: Rigorous Interpretability Standards
          </h2>
        </div>

        <div className="p-4 bg-[#EBF3EE] rounded-xl border border-[#2D6A4F]/20 text-xs text-[#1B4332] space-y-3">
          <p className="leading-relaxed">
            CropGuard AI Pro adheres to strict ethical and scientific AI standards. We explicitly distinguish three separate analytical concepts:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-3 bg-white rounded-lg border border-[#2D6A4F]/10">
              <span className="font-bold text-[#1B4332] block mb-1">1. Prediction</span>
              <p className="text-[11px] text-[#5C6F65]">
                The regression output calculated by the ensemble model for a single parcel of land and set of conditions.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#2D6A4F]/10">
              <span className="font-bold text-[#1B4332] block mb-1">2. Feature Importance</span>
              <p className="text-[11px] text-[#5C6F65]">
                Calculated from mean decrease in impurity across all trees. Shows which variables were most informative during training.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#2D6A4F]/10">
              <span className="font-bold text-[#1B4332] block mb-1">3. Causal Effect</span>
              <p className="text-[11px] text-[#5C6F65]">
                <strong>Feature importance does not prove biological causation.</strong> Adding excessive chemical inputs does not guarantee higher yields and may degrade soil health.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setActiveTab('forecast')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-lg transition-colors"
          >
            Launch Forecast Engine
          </button>
        </div>
      </section>
    </div>
  );
};
