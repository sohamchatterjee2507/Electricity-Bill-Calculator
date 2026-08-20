import React, { useState } from 'react';
import { X, AlertTriangle, Check, Calendar, Gauge } from 'lucide-react';
import { MeterReading, formatDateDisplay, formatUnits } from '../types';

interface ChangePreviousModalProps {
  isOpen: boolean;
  currentPrevious: MeterReading;
  onClose: () => void;
  onSave: (updated: MeterReading) => void;
}

export const ChangePreviousModal: React.FC<ChangePreviousModalProps> = ({
  isOpen,
  currentPrevious,
  onClose,
  onSave,
}) => {
  const [newDate, setNewDate] = useState(currentPrevious.date);
  const [newReadingStr, setNewReadingStr] = useState(currentPrevious.reading.toString());
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const readingNum = parseFloat(newReadingStr);

  const handleValidateAndPromptConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newDate.trim()) {
      setError('Please select a valid date.');
      return;
    }

    if (newReadingStr.trim() === '' || isNaN(readingNum) || readingNum < 0) {
      setError('Please enter a valid non-negative meter reading.');
      return;
    }

    // If no changes were made
    if (newDate === currentPrevious.date && readingNum === currentPrevious.reading) {
      onClose();
      return;
    }

    setShowConfirm(true);
  };

  const handleFinalConfirm = () => {
    onSave({
      date: newDate,
      reading: readingNum,
    });
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Change Previous Reading</h3>
              <p className="text-xs text-slate-500">Update baseline record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!showConfirm ? (
          <form onSubmit={handleValidateAndPromptConfirm} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Manually update your saved baseline if your electric meter was replaced, rolled over, or had an incorrect entry.
            </p>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium">
                {error}
              </div>
            )}

            {/* Current Value Display */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex justify-between items-center">
              <span>Current saved baseline:</span>
              <span className="font-bold text-slate-900 font-mono-num">
                {formatUnits(currentPrevious.reading)} Units ({formatDateDisplay(currentPrevious.date)})
              </span>
            </div>

            {/* Edit Date */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="modal-prev-date-input"
                className="text-xs font-semibold text-slate-500 uppercase ml-1"
              >
                Previous Reading Date
              </label>
              <input
                id="modal-prev-date-input"
                type="date"
                required
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setError(null);
                }}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 font-mono-num text-sm"
              />
            </div>

            {/* Edit Units */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="modal-prev-units-input"
                className="text-xs font-semibold text-slate-500 uppercase ml-1"
              >
                Previous Meter Reading (Units)
              </label>
              <input
                id="modal-prev-units-input"
                type="number"
                step="any"
                min="0"
                required
                value={newReadingStr}
                onChange={(e) => {
                  setNewReadingStr(e.target.value);
                  setError(null);
                }}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 font-mono-num text-sm"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Update Baseline
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation Step */
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Confirm Baseline Overwrite?
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Are you sure you want to overwrite your saved previous meter reading?
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Old Baseline:</span>
                <span className="font-mono-num text-slate-600 line-through">
                  {formatUnits(currentPrevious.reading)} Units ({formatDateDisplay(currentPrevious.date)})
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span className="text-blue-600">New Baseline:</span>
                <span className="font-mono-num text-blue-700">
                  {formatUnits(readingNum)} Units ({formatDateDisplay(newDate)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Yes, Overwrite Baseline</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
