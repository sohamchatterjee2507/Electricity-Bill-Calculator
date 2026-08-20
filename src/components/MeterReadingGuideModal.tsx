import React from 'react';
import { X, HelpCircle, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { RATE_PER_UNIT } from '../types';

interface MeterReadingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeterReadingGuideModal: React.FC<MeterReadingGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">How to Read Your Meter</h3>
              <p className="text-xs text-slate-500">Guide & Billing Calculation Rules</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700">
          {/* Section 1: Digital Meter */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              1. Digital Electronic Meters (LCD/LED)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Look for the number followed by <strong className="text-slate-900">kWh</strong> (Kilowatt-Hour).
              Digital meters cycle through several screens (Date, Time, Voltage, kWh). Record the <strong>cumulative kWh reading</strong>.
            </p>
            <div className="bg-slate-900 text-blue-400 font-mono-num font-bold text-base p-3 rounded-lg text-center tracking-widest border border-slate-800">
              0 1 3 4 0 . 5 <span className="text-xs text-slate-400">kWh</span>
            </div>
          </div>

          {/* Section 2: The Formula */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Zap className="w-4 h-4 text-blue-600 fill-current" />
              2. How Your Bill is Calculated
            </div>
            <div className="space-y-1.5 text-xs text-slate-800">
              <div className="p-2.5 bg-white rounded-lg border border-blue-100 font-mono-num flex justify-between">
                <span>Units Consumed</span>
                <strong>= Current Reading − Previous Reading</strong>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-blue-100 font-mono-num flex justify-between">
                <span>Electricity Bill</span>
                <strong>= Units Consumed × ₹{RATE_PER_UNIT}.00</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Important Tips */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Quick Tips
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Take readings around the same date every month for consistent cycles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Decimals (partial units) are supported and billed with two-decimal precision.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>If your meter was replaced by the utility provider, click &quot;Change Previous Reading&quot; to reset the baseline.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
