import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PredictionRecord } from '../types/prediction';
import { PredictionDetailsModal } from '../components/PredictionDetailsModal';
import { Search, Eye, RefreshCw, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

interface HistoryPageProps {
  setActiveTab: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ setActiveTab }) => {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<PredictionRecord | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getPredictions();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve prediction records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.crop.toLowerCase().includes(term) ||
      r.state.toLowerCase().includes(term) ||
      r.season.toLowerCase().includes(term) ||
      String(r.year).includes(term)
    );
  });

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D6A4F]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5C6F65] mb-1.5">
            <span className="font-semibold text-[#1B4332]">SSA025 Data Ledger</span>
            <span aria-hidden="true">·</span>
            <span>Relational Storage</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#2D6A4F]">TEAM ID: TSS002</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight">
            Prediction History & Records
          </h1>
          <p className="text-sm text-[#5C6F65] mt-1">
            Complete audit trail of all executed crop yield forecasts stored in the PostgreSQL database.
          </p>
        </div>

        <button
          onClick={fetchRecords}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-white border border-[#2D6A4F]/20 hover:bg-[#EBF3EE] rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#2D6A4F]/15 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by crop, state, season, or year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8FAF8] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2D6A4F]/30 focus:border-[#2D6A4F] outline-none"
          />
        </div>

        <div className="text-xs text-[#5C6F65] font-mono">
          Showing {filteredRecords.length} of {records.length} records
        </div>
      </div>

      {/* Table or Empty State */}
      {loading ? (
        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-[#2D6A4F]/30 border-t-[#2D6A4F] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#5C6F65]">Loading database history...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-12 text-center max-w-md mx-auto shadow-xs">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1B4332] mb-1">
            No prediction history available yet.
          </h3>
          <p className="text-xs text-[#5C6F65] mb-5 leading-relaxed">
            There are currently no prediction records in the database. Run your first forecast to start tracking.
          </p>
          <button
            onClick={() => setActiveTab('forecast')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-lg transition-colors"
          >
            <span>Run First Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl p-8 text-center text-xs text-[#5C6F65]">
          No records match "{searchTerm}". Try clearing your search query.
        </div>
      ) : (
        <div className="bg-white border border-[#2D6A4F]/15 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF8] border-b border-[#2D6A4F]/10 text-xs font-semibold text-[#1B4332]">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Crop</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Season</th>
                  <th className="py-3.5 px-4 text-right">Area (ha)</th>
                  <th className="py-3.5 px-4 text-right">Predicted Yield (t/ha)</th>
                  <th className="py-3.5 px-4 text-right">Expected Production (t)</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[#F8FAF8] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-gray-500 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#1B4332] whitespace-nowrap">
                      {r.crop}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                      {r.state}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                      {r.season}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-gray-800">
                      {r.area.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#1B4332]">
                      {r.predicted_yield.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#2D6A4F]">
                      {r.expected_production.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2D6A4F] bg-[#EBF3EE] hover:bg-[#D8E8DD] rounded-md transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Modal */}
      <PredictionDetailsModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};
