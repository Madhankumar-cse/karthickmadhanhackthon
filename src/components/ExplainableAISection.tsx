import React from 'react';
import { ModelMetadata } from '../types/prediction';
import { Info, HelpCircle } from 'lucide-react';

interface Props {
  metadata: ModelMetadata | null;
  loading?: boolean;
}

export const ExplainableAISection: React.FC<Props> = ({ metadata, loading }) => {
  if (loading) {
    return (
      <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-full mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  const metrics = metadata?.evaluation_metrics;
  const hasMetrics = metrics && metrics.r2_score !== undefined;
  const featureImportances = metadata?.feature_importance || [];

  return (
    <div className="space-y-6">
      {/* Model Intelligence Card */}
      <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D6A4F]/10 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#1B4332]">Model Intelligence & Architecture</h3>
            <p className="text-xs text-[#5C6F65] mt-0.5">
              Production Scikit-Learn RandomForest Pipeline with ColumnTransformer
            </p>
          </div>
          <span className="text-xs font-mono text-[#2D6A4F] bg-[#EBF3EE] px-2.5 py-1 rounded-md font-semibold">
            v{metadata?.version || '1.0.0'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-3.5 bg-[#F8FAF8] rounded-lg border border-[#2D6A4F]/10">
            <span className="text-xs text-[#5C6F65] block mb-1">Model Architecture</span>
            <span className="text-sm font-semibold text-[#1B4332] block">
              {metadata?.model_name || 'RandomForestCropYieldRegressor'}
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-lg border border-[#2D6A4F]/10">
            <span className="text-xs text-[#5C6F65] block mb-1">Target Variable</span>
            <span className="text-sm font-semibold text-[#1B4332] block">
              Yield ({metadata?.target_unit || 'tons/hectare'})
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-lg border border-[#2D6A4F]/10">
            <span className="text-xs text-[#5C6F65] block mb-1">Training Pipeline</span>
            <span className="text-sm font-semibold text-[#1B4332] block">
              OneHot + StandardScaler
            </span>
          </div>

          <div className="p-3.5 bg-[#F8FAF8] rounded-lg border border-[#2D6A4F]/10">
            <span className="text-xs text-[#5C6F65] block mb-1">Production Calculation</span>
            <span className="text-sm font-semibold text-[#1B4332] block">
              Yield × Area (Metric Tons)
            </span>
          </div>
        </div>

        {/* Evaluation Metrics */}
        <div className="mt-4 pt-4 border-t border-[#2D6A4F]/10">
          <h4 className="text-xs font-bold text-[#1B4332] uppercase tracking-wider mb-3">
            Trained Model Evaluation Metrics
          </h4>

          {hasMetrics ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#EBF3EE] rounded-lg">
                <span className="text-xs text-[#2D6A4F] font-medium block">R² Score (Coefficient of Determination)</span>
                <span className="text-xl font-bold font-mono text-[#1B4332] mt-1 block">
                  {metrics.r2_score?.toFixed(4)}
                </span>
                <span className="text-[11px] text-[#5C6F65] mt-0.5 block">Explains variance on test split</span>
              </div>

              <div className="p-3 bg-[#EBF3EE] rounded-lg">
                <span className="text-xs text-[#2D6A4F] font-medium block">MAE (Mean Absolute Error)</span>
                <span className="text-xl font-bold font-mono text-[#1B4332] mt-1 block">
                  {metrics.mae?.toFixed(4)} <span className="text-xs font-normal">tons/ha</span>
                </span>
                <span className="text-[11px] text-[#5C6F65] mt-0.5 block">Average absolute deviation</span>
              </div>

              <div className="p-3 bg-[#EBF3EE] rounded-lg">
                <span className="text-xs text-[#2D6A4F] font-medium block">RMSE (Root Mean Squared Error)</span>
                <span className="text-xl font-bold font-mono text-[#1B4332] mt-1 block">
                  {metrics.rmse?.toFixed(4)} <span className="text-xs font-normal">tons/ha</span>
                </span>
                <span className="text-[11px] text-[#5C6F65] mt-0.5 block">Penalizes large errors</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#5C6F65] italic py-2">
              Evaluation metrics will be displayed after model validation.
            </p>
          )}
        </div>
      </div>

      {/* Explainable AI Card */}
      <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D6A4F]/10 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#1B4332]">Explainable AI & Feature Importance</h3>
            <p className="text-xs text-[#5C6F65] mt-0.5">
              Empirical Gini impurity decrease across decision tree ensembles
            </p>
          </div>
          <span className="text-xs text-[#2D6A4F] flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Interpretability Matrix</span>
          </span>
        </div>

        {/* Feature Importance Bars */}
        {featureImportances.length > 0 ? (
          <div className="space-y-3 mb-6">
            {featureImportances.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1B4332]">{item.feature}</span>
                  <span className="font-mono text-[#2D6A4F] font-medium">{item.importance.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-[#EBF3EE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D6A4F] rounded-full transition-all duration-500"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5C6F65] italic py-3">
            Feature importance will be displayed after model validation.
          </p>
        )}

        {/* Rigorous Distinction: Prediction vs Feature Importance vs Causation */}
        <div className="p-4 bg-[#F8FAF8] rounded-lg border border-[#2D6A4F]/10 text-xs text-[#36453F] space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-[#1B4332]">
            <HelpCircle className="w-4 h-4 text-[#2D6A4F]" />
            <span>Essential Methodological Distinctions</span>
          </div>
          <p className="leading-relaxed">
            <strong className="text-[#1B4332]">1. Prediction:</strong> The expected yield point-estimate calculated for a specific set of agricultural parameters.
          </p>
          <p className="leading-relaxed">
            <strong className="text-[#1B4332]">2. Feature Importance:</strong> Represents how much each feature contributed to reducing uncertainty across the decision forest during training on historical data.
          </p>
          <p className="leading-relaxed text-[#2D6A4F]">
            <strong className="text-[#1B4332]">3. Causal Effect:</strong> Statistical feature importance in a machine-learning model <span className="underline font-semibold">does not prove causation</span>. Adjusting a single input (such as increasing fertilizer or pesticide) does not guarantee a proportional change in real field yield due to complex ecological interactions, weather extremes, and micro-nutrients.
          </p>
        </div>
      </div>
    </div>
  );
};
