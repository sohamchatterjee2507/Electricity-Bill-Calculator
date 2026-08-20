import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  Calendar,
  Gauge,
  ArrowRight,
} from 'lucide-react';
import {
  BillRecord,
  formatDateDisplay,
  formatINR,
  formatUnits,
  calculateDaysBetween,
} from '../types';

interface ResultCardProps {
  bill: BillRecord;
  onResetToForm?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ bill, onResetToForm }) => {
  const [copied, setCopied] = useState(false);

  const days = calculateDaysBetween(bill.prevDate, bill.currDate);

  const handleCopy = async () => {
    const text = `⚡ Electricity Bill Summary\n` +
      `-------------------------\n` +
      `Previous Reading: ${formatUnits(bill.prevReading)} Units (${formatDateDisplay(bill.prevDate)})\n` +
      `Current Reading: ${formatUnits(bill.currReading)} Units (${formatDateDisplay(bill.currDate)})\n` +
      `Consumption: ${formatUnits(bill.unitsConsumed)} Units\n` +
      `Calculation: (${formatUnits(bill.currReading)} - ${formatUnits(bill.prevReading)}) × ₹${bill.ratePerUnit}.00\n` +
      `Total Amount Due: ${formatINR(bill.totalBill)}\n` +
      `-------------------------\n` +
      `Calculated via Electricity Bill Calculator`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100 relative overflow-hidden animate-in fade-in duration-300">
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Calculation Results
        </h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          Cycle Billed
        </span>
      </div>

      {/* Main Breakdown Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div className="space-y-4 w-full md:w-auto">
          {/* Consumption */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Consumption</span>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-num">
              {formatUnits(bill.unitsConsumed)}{' '}
              <small className="text-sm font-normal text-slate-500">Units</small>
            </span>
          </div>

          {/* Formula calculation */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Calculation</span>
            <span className="text-sm font-medium text-slate-600 font-mono-num">
              ({formatUnits(bill.currReading)} − {formatUnits(bill.prevReading)}) × ₹{bill.ratePerUnit}.00
            </span>
          </div>

          {/* Dates reference */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDateDisplay(bill.prevDate)} → {formatDateDisplay(bill.currDate)}</span>
            </div>
            {days > 0 && <span>({days} days)</span>}
          </div>
        </div>

        {/* Total Amount Due Display */}
        <div className="text-left md:text-right w-full md:w-auto p-4 sm:p-0 bg-slate-50 sm:bg-transparent rounded-xl">
          <span className="text-xs text-blue-600 font-bold uppercase tracking-widest block">
            Total Amount Due
          </span>
          <div className="text-4xl sm:text-6xl font-black text-slate-900 mt-1 tracking-tighter font-mono-num">
            {formatINR(bill.totalBill)}
          </div>
        </div>
      </div>

      {/* Itemized Detail Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 mb-6 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px] uppercase">Prev Reading</span>
          <span className="font-semibold text-slate-800 font-mono-num flex items-center gap-1 mt-0.5">
            <Gauge className="w-3 h-3 text-slate-400" />
            {formatUnits(bill.prevReading)} u
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] uppercase">Curr Reading</span>
          <span className="font-semibold text-slate-800 font-mono-num flex items-center gap-1 mt-0.5">
            <Gauge className="w-3 h-3 text-blue-500" />
            {formatUnits(bill.currReading)} u
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] uppercase">Tariff Rate</span>
          <span className="font-semibold text-slate-800 font-mono-num mt-0.5 block">
            ₹{bill.ratePerUnit}.00 / u
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px] uppercase">Avg / Day</span>
          <span className="font-semibold text-slate-800 font-mono-num mt-0.5 block">
            {days > 0 ? `${(bill.unitsConsumed / days).toFixed(1)} u/d` : '—'}
          </span>
        </div>
      </div>

      {/* Dashed divider & Status Footer */}
      <div className="border-t border-dashed border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Ready for next cycle</span>
        </div>

        <p className="text-xs text-slate-400">
          Data automatically saved to Local Storage
        </p>

        {/* Action Buttons */}
        <div className="no-print flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print</span>
          </button>

          {onResetToForm && (
            <button
              type="button"
              onClick={onResetToForm}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
