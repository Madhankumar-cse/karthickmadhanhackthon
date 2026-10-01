import React from 'react';
import { PredictionRecord } from '../types/prediction';
import { X, Calendar, MapPin, Sprout, CloudRain, ShieldCheck, Scale, Cpu } from 'lucide-react';

interface Props {
  record: PredictionRecord | null;
  onClose: () => void;
}

export const PredictionDetailsModal: React.FC<Props> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#2D6A4F]/20 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EBF3EE] px-2 py-0.5 rounded">
            Record #{record.id}
          </span>
          <span className="text-xs text-[#5C6F65]">
            {new Date(record.created_at).toLocaleString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#1B4332] mb-4">
          Forecast Details: {record.crop} ({record.season})
        </h3>

        {/* Highlighted Results Card */}
        <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/15 mb-5 grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-[#5C6F65] block mb-0.5">Predicted Yield</span>
            <span className="text-2xl font-bold font-mono text-[#1B4332]">
              {record.predicted_yield.toFixed(2)}
            </span>
            <span className="text-xs text-[#5C6F65] block mt-0.5">tons / hectare</span>
          </div>

          <div>
            <span className="text-xs text-[#5C6F65] block mb-0.5">Expected Production</span>
            <span className="text-2xl font-bold font-mono text-[#2D6A4F]">
              {record.expected_production.toFixed(2)}
            </span>
            <span className="text-xs text-[#5C6F65] block mt-0.5">metric tons total</span>
          </div>
        </div>

        {/* Input Parameters Grid */}
        <h4 className="text-xs font-bold text-[#1B4332] uppercase tracking-wider mb-3">
          Cultivation & Environmental Inputs
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs mb-5">
          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">Cultivation Year</span>
              <span className="font-semibold text-gray-800">{record.year}</span>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">State / Region</span>
              <span className="font-semibold text-gray-800">{record.state}</span>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">Cultivated Area</span>
              <span className="font-semibold text-gray-800">{record.area.toFixed(2)} ha</span>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">Annual Rainfall</span>
              <span className="font-semibold text-gray-800">{record.annual_rainfall.toFixed(1)} mm</span>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">Fertilizer Application</span>
              <span className="font-semibold text-gray-800">{record.fertilizer.toFixed(1)} kg</span>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <div>
              <span className="text-gray-500 block">Pesticide Application</span>
              <span className="font-semibold text-gray-800">{record.pesticide.toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {/* Formula calculation note */}
        <div className="p-3 bg-[#EBF3EE] rounded-lg border border-[#2D6A4F]/20 text-[11px] text-[#1B4332] space-y-1">
          <div className="flex items-center gap-1 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Target Calculation Integrity:</span>
          </div>
          <p className="text-gray-600">
            Expected Production = Predicted Yield ({record.predicted_yield.toFixed(2)} t/ha) × Cultivated Area ({record.area} ha) = <strong className="text-[#1B4332]">{record.expected_production.toFixed(2)} metric tons</strong>.
          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
