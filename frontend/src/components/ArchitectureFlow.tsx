import React from 'react';
import { Database, Filter, Cpu, TrendingUp, Boxes, ShieldCheck } from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Agricultural Data',
      subtitle: 'Historical crop, soil, rainfall & inputs',
      icon: Database,
    },
    {
      num: '02',
      title: 'Data Preprocessing',
      subtitle: 'Standardization & OneHot encoding',
      icon: Filter,
    },
    {
      num: '03',
      title: 'Machine Learning',
      subtitle: 'Trained Random Forest Regressor',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Yield Forecast',
      subtitle: 'Predicted metric tons / hectare',
      icon: TrendingUp,
    },
    {
      num: '05',
      title: 'Expected Production',
      subtitle: 'Yield × Cultivated Area (tons)',
      icon: Boxes,
    },
    {
      num: '06',
      title: 'Farmer Decision Support',
      subtitle: 'Risk mitigation & resource planning',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white border border-[#2D6A4F]/15 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:border-[#2D6A4F]/40 hover:shadow-sm relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#52B788]">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-[#1B4332] leading-snug mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-[#5C6F65] leading-relaxed">
                  {step.subtitle}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#74C69D] text-xs font-bold pointer-events-none">
                  →
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
