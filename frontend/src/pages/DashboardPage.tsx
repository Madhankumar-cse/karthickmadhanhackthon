import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PredictionRecord } from '../types/prediction';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import { TrendingUp, Sprout, Hash, Clock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPredictions();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load prediction analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Compute actual metrics from database records
  const totalPredictions = records.length;
  const avgYield = totalPredictions > 0
    ? records.reduce((acc, r) => acc + r.predicted_yield, 0) / totalPredictions
    : 0;
  const latestPrediction = totalPredictions > 0 ? records[0] : null;

  // Most predicted crop
  const cropCounts: { [key: string]: number } = {};
  const cropYieldSums: { [key: string]: { total: number; count: number } } = {};

  records.forEach((r) => {
    cropCounts[r.crop] = (cropCounts[r.crop] || 0) + 1;
    if (!cropYieldSums[r.crop]) {
      cropYieldSums[r.crop] = { total: 0, count: 0 };
    }
    cropYieldSums[r.crop].total += r.predicted_yield;
    cropYieldSums[r.crop].count += 1;
  });

  let mostPredictedCrop = 'None';
  let maxCount = 0;
  Object.entries(cropCounts).forEach(([crop, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPredictedCrop = crop;
    }
  });

  // Chart data: Prediction Count by Crop
  const cropCountData = Object.entries(cropCounts).map(([crop, count]) => ({
    crop,
    count,
  }));

  // Chart data: Crop Comparison (Average Yield per Crop)
  const cropComparisonData = Object.entries(cropYieldSums).map(([crop, data]) => ({
    crop,
    avgYield: Number((data.total / data.count).toFixed(2)),
  }));

  // Chart data: Yield Trend over records (ordered chronologically)
  const trendData = [...records].reverse().map((r, idx) => ({
    index: `#${r.id}`,
    crop: r.crop,
    yield: Number(r.predicted_yield.toFixed(2)),
    production: Number(r.expected_production.toFixed(2)),
    date: new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D6A4F]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5C6F65] mb-1.5">
            <span className="font-semibold text-[#1B4332]">SSA025 Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Real PostgreSQL Data</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
            Prediction Dashboard & Telemetry
          </h1>
          <p className="text-sm text-[#5C6F65] mt-1">
            Real-time analytics aggregated directly from stored database forecasts.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-white border border-[#2D6A4F]/20 hover:bg-[#EBF3EE] rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* When no database records exist, prompt required: "No prediction history available yet." */}
      {!loading && totalPredictions === 0 ? (
        <div className="bg-white border border-[#2D6A4F]/15 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#EBF3EE] text-[#2D6A4F] flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#1B4332] mb-2">
            No prediction history available yet.
          </h3>
          <p className="text-xs text-[#5C6F65] mb-6 leading-relaxed">
            Run your first crop forecast to generate empirical data points for analytics, trends, and crop distribution graphs.
          </p>
          <button
            onClick={() => setActiveTab('forecast')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-lg transition-colors"
          >
            <span>Generate First Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Key Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#5C6F65] mb-2">
                <span className="text-xs font-medium">Total Predictions</span>
                <Hash className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <span className="text-2xl font-bold font-mono text-[#1B4332] block">
                {totalPredictions}
              </span>
              <span className="text-[11px] text-[#5C6F65] mt-1 block">
                Committed database rows
              </span>
            </div>

            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#5C6F65] mb-2">
                <span className="text-xs font-medium">Average Predicted Yield</span>
                <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-[#1B4332]">
                  {avgYield.toFixed(2)}
                </span>
                <span className="text-xs text-[#5C6F65]">tons/ha</span>
              </div>
              <span className="text-[11px] text-[#5C6F65] mt-1 block">
                Across all recorded crops
              </span>
            </div>

            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#5C6F65] mb-2">
                <span className="text-xs font-medium">Latest Prediction</span>
                <Clock className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <span className="text-lg font-bold text-[#1B4332] truncate block">
                {latestPrediction ? `${latestPrediction.crop} (${latestPrediction.predicted_yield.toFixed(2)} t/ha)` : 'None'}
              </span>
              <span className="text-[11px] text-[#5C6F65] mt-1 block">
                {latestPrediction ? `${latestPrediction.state} · ${latestPrediction.season}` : 'No records'}
              </span>
            </div>

            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between text-[#5C6F65] mb-2">
                <span className="text-xs font-medium">Most Predicted Crop</span>
                <Sprout className="w-4 h-4 text-[#2D6A4F]" />
              </div>
              <span className="text-2xl font-bold text-[#1B4332] block">
                {mostPredictedCrop}
              </span>
              <span className="text-[11px] text-[#5C6F65] mt-1 block">
                {maxCount > 0 ? `${maxCount} prediction runs` : 'No data'}
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Predicted Yield Trend */}
            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D6A4F]/10 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B4332]">Predicted Yield Trend</h3>
                  <p className="text-xs text-[#5C6F65] mt-0.5">Chronological regression yield values (tons/ha)</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="index" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit=" t/ha" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E2922', borderColor: '#2D6A4F', color: '#FFF', borderRadius: 8, fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="yield" stroke="#2D6A4F" strokeWidth={2} fillOpacity={1} fill="url(#yieldGrad)" name="Yield (t/ha)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Prediction Count by Crop */}
            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D6A4F]/10 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B4332]">Prediction Count by Crop</h3>
                  <p className="text-xs text-[#5C6F65] mt-0.5">Frequency of forecasting runs per crop type</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropCountData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E2922', borderColor: '#2D6A4F', color: '#FFF', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="#40916C" radius={[4, 4, 0, 0]} name="Runs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Crop Comparison */}
            <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-6 shadow-xs lg:col-span-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#2D6A4F]/10 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1B4332]">Crop Comparison: Average Estimated Yield</h3>
                  <p className="text-xs text-[#5C6F65] mt-0.5">Average productivity comparison across surveyed crops</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} unit=" t/ha" />
                    <YAxis dataKey="crop" type="category" tick={{ fontSize: 11, fill: '#64748B' }} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1E2922', borderColor: '#2D6A4F', color: '#FFF', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="avgYield" fill="#1B4332" radius={[0, 4, 4, 0]} name="Avg Yield (t/ha)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
