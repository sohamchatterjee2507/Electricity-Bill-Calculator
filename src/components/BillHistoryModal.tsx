import React from 'react';
import { X, History, Trash2, Download, Calendar, Gauge } from 'lucide-react';
import {
  BillRecord,
  formatDateDisplay,
  formatINR,
  formatUnits,
} from '../types';

interface BillHistoryModalProps {
  isOpen: boolean;
  history: BillRecord[];
  onClose: () => void;
  onClearHistory: () => void;
  onSelectBill: (bill: BillRecord) => void;
}

export const BillHistoryModal: React.FC<BillHistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onClearHistory,
  onSelectBill,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Calculated At', 'Previous Date', 'Previous Reading (kWh)', 'Current Date', 'Current Reading (kWh)', 'Units Consumed', 'Rate (INR/kWh)', 'Total Bill (INR)'];
    const rows = history.map((b) => [
      new Date(b.createdAt).toLocaleString('en-IN'),
      b.prevDate,
      b.prevReading,
      b.currDate,
      b.currReading,
      b.unitsConsumed,
      b.ratePerUnit,
      b.totalBill,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `electricity_bill_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Past Electricity Calculations</h3>
              <p className="text-xs text-slate-500">Stored locally in your browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50/50">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
              <p className="text-sm font-medium text-slate-600">No calculation records yet.</p>
              <p className="text-xs text-slate-400">Your calculated bills will appear here.</p>
            </div>
          ) : (
            history.map((record) => (
              <div
                key={record.id}
                onClick={() => {
                  onSelectBill(record);
                  onClose();
                }}
                className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 bg-white transition-all cursor-pointer space-y-2 shadow-2xs group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {formatDateDisplay(record.prevDate)} → {formatDateDisplay(record.currDate)}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 font-mono-num group-hover:text-blue-600 transition-colors">
                    {formatINR(record.totalBill)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono-num">
                      {formatUnits(record.prevReading)} → {formatUnits(record.currReading)} kWh
                    </span>
                  </div>
                  <div className="font-semibold text-slate-700 font-mono-num">
                    {formatUnits(record.unitsConsumed)} Units
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
