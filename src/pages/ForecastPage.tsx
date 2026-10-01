import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PredictionInput, PredictionResult, ModelMetadata } from '../types/prediction';
import { ExplainableAISection } from '../components/ExplainableAISection';
import { Sprout, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import soilImg from '../assets/images/crop_soil_inspection_1790842158244.jpg';

interface ForecastPageProps {
  setActiveTab: (tab: string) => void;
}

const DEFAULT_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];

const DEFAULT_CROPS = [
  'Barley', 'Chickpea', 'Cotton', 'Groundnut', 'Maize',
  'Millet', 'Rice', 'Soybean', 'Sugarcane', 'Wheat'
];

const DEFAULT_SEASONS = [
  'Autumn', 'Kharif', 'Rabi', 'Summer', 'Whole Year', 'Winter'
];

export const ForecastPage: React.FC<ForecastPageProps> = ({ setActiveTab }) => {
  const [formData, setFormData] = useState<PredictionInput>({
    Year: 2024,
    State: 'Tamil Nadu',
    Crop: 'Rice',
    Season: 'Kharif',
    Area: 2.5,
    Annual_Rainfall: 950,
    Fertilizer: 450,
    Pesticide: 90,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [metaLoading, setMetaLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadMeta() {
      try {
        setMetaLoading(true);
        const meta = await api.getModelMetadata();
        setMetadata(meta);
      } catch (e) {
        console.warn('Metadata load note:', e);
      } finally {
        setMetaLoading(false);
      }
    }
    loadMeta();
  }, []);

  const states = metadata?.supported_states || DEFAULT_STATES;
  const crops = metadata?.supported_crops || DEFAULT_CROPS;
  const seasons = metadata?.supported_seasons || DEFAULT_SEASONS;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleApplyDemo = () => {
    setFormData({
      Year: 2020,
      State: 'Tamil Nadu',
      Crop: 'Rice',
      Season: 'Kharif',
      Area: 2.5,
      Annual_Rainfall: 900,
      Fertilizer: 500,
      Pesticide: 100,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate
      if (!formData.Year || !formData.State || !formData.Crop || !formData.Season) {
        throw new Error('Please fill in all categorical parameters.');
      }
      if (formData.Area <= 0) {
        throw new Error('Cultivated Area must be greater than 0.');
      }
      if (formData.Annual_Rainfall < 0 || formData.Fertilizer < 0 || formData.Pesticide < 0) {
        throw new Error('Rainfall, fertilizer, and pesticide quantities cannot be negative.');
      }

      const res = await api.predict(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Prediction failed. Please check network connection.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#2D6A4F]/15 pb-6">
        <div className="flex items-center gap-2 text-xs text-[#5C6F65] mb-2">
          <span className="font-semibold text-[#1B4332]">SSA025 Specification</span>
          <span aria-hidden="true">·</span>
          <span>Deterministic Scikit-Learn Model</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
          Yield Forecasting Engine
        </h1>
        <p className="text-sm text-[#5C6F65] mt-1 max-w-3xl">
          Enter farm acreage, regional soil/climate state, crop variety, and chemical inputs to compute genuine regression yield estimates backed by our trained machine-learning model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 sm:p-8 shadow-sm">
            {/* Illustrative Demo Banner */}
            <div className="mb-6 p-4 rounded-xl bg-[#EBF3EE] border border-[#2D6A4F]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#1B4332] block">
                  Illustrative Demo Scenario
                </span>
                <p className="text-xs text-[#4A5D53] mt-0.5">
                  Year 2020 · Tamil Nadu · Rice · Kharif · 2.5 ha · 900mm rain · 500kg fert · 100kg pest
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-white border border-[#2D6A4F]/30 rounded-lg hover:bg-[#F3F6F3] transition-colors whitespace-nowrap shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Try Demo Scenario</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Year"
                    min="1990"
                    max="2035"
                    value={formData.Year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none font-mono"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="State"
                    value={formData.State}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none"
                  >
                    {states.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Crop */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Crop <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="Crop"
                    value={formData.Crop}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none"
                  >
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>
                        {cr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Season <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="Season"
                    value={formData.Season}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none"
                  >
                    {seasons.map((sn) => (
                      <option key={sn} value={sn}>
                        {sn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Cultivated Area (Hectares) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    name="Area"
                    value={formData.Area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none font-mono"
                  />
                </div>

                {/* Annual Rainfall */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Annual Rainfall (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="Annual_Rainfall"
                    value={formData.Annual_Rainfall}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none font-mono"
                  />
                </div>

                {/* Fertilizer */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Fertilizer Applied (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="Fertilizer"
                    value={formData.Fertilizer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none font-mono"
                  />
                </div>

                {/* Pesticide */}
                <div>
                  <label className="block text-xs font-semibold text-[#1B4332] mb-1.5">
                    Pesticide Applied (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="Pesticide"
                    value={formData.Pesticide}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2 text-sm bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none font-mono"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-sm font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] active:bg-[#081C15] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-150 shadow-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/40"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Executing Model Inference...</span>
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4" />
                      <span>Generate Forecast</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Prediction Results Column */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-white border-2 border-[#2D6A4F] rounded-2xl p-6 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D6A4F]/15 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-[#2D6A4F] font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Forecast Generated & Stored</span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">
                  Record #{result.id}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#F8FAF8] rounded-xl border border-[#2D6A4F]/10">
                  <span className="text-xs font-medium text-[#5C6F65] block mb-1">
                    Predicted Crop Yield
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold font-mono text-[#1B4332]">
                      {result.predicted_yield.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-[#5C6F65]">
                      {result.unit || 'tons/hectare'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#EBF3EE] rounded-xl border border-[#2D6A4F]/20">
                  <span className="text-xs font-medium text-[#2D6A4F] block mb-1">
                    Expected Total Production
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-[#1B4332]">
                      {result.expected_production.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-[#2D6A4F]">
                      metric tons
                    </span>
                  </div>
                  <div className="text-[11px] text-[#4A5D53] mt-2 pt-2 border-t border-[#2D6A4F]/15">
                    Calculated as: {result.predicted_yield.toFixed(2)} tons/ha × {formData.Area} hectares
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-[#2D6A4F] hover:text-[#1B4332] flex items-center gap-1 transition-colors"
                  >
                    <span>View in History Table</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="text-xs font-semibold text-[#2D6A4F] hover:text-[#1B4332] flex items-center gap-1 transition-colors"
                  >
                    <span>View Dashboard Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center mb-3">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1B4332] mb-1">
                Awaiting Forecast Request
              </h3>
              <p className="text-xs text-[#5C6F65] max-w-xs leading-relaxed mb-4">
                Select your parameters on the left or click "Try Demo Scenario" to run the Scikit-Learn Random Forest model.
              </p>
              <div className="rounded-xl overflow-hidden border border-[#2D6A4F]/10 w-full max-w-xs shadow-xs">
                <img
                  src={soilImg}
                  alt="Healthy crops and fertile soil"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>
          )}

          {/* Quick Notice */}
          <div className="p-4 bg-white border border-[#2D6A4F]/15 rounded-xl text-xs text-[#5C6F65] space-y-1.5 shadow-xs">
            <span className="font-bold text-[#1B4332] block">Empirical Model Integrity</span>
            <p className="leading-relaxed">
              Every prediction is computed dynamically by the loaded Random Forest model (<code className="text-[#2D6A4F]">ml/crop_yield_model.joblib</code>) and immediately committed to the persistent database.
            </p>
          </div>
        </div>
      </div>

      {/* Model Intelligence and Explainable AI Section */}
      <ExplainableAISection metadata={metadata} loading={metaLoading} />
    </div>
  );
};
