import React from 'react';
import { RotateCcw, History, HelpCircle, Zap } from 'lucide-react';
import { RATE_PER_UNIT } from '../types';

interface HeaderProps {
  hasSavedData: boolean;
  historyCount: number;
  onOpenResetModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenGuideModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hasSavedData,
  historyCount,
  onOpenResetModal,
  onOpenHistoryModal,
  onOpenGuideModal,
}) => {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>⚡</span>
            <span>Electricity Bill Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Calculate your monthly consumption and billing cost
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Rate Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
            <span>₹{RATE_PER_UNIT}.00 / Unit</span>
          </div>

          {/* Guide button */}
          <button
            type="button"
            onClick={onOpenGuideModal}
            title="How to read meter & billing formula"
            className="p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* History Button */}
          {historyCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistoryModal}
              title="View Calculation History"
              className="relative p-2 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">History</span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono-num ml-0.5">
                {historyCount}
              </span>
            </button>
          )}

          {/* Reset Data Button */}
          {hasSavedData && (
            <button
              type="button"
              id="header-reset-btn"
              onClick={onOpenResetModal}
              title="Reset Saved Meter Reading"
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Data</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

