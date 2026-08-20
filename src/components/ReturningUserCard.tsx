import React, { useState } from 'react';
import { Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import {
  RATE_PER_UNIT,
  MeterReading,
  getTodayDateString,
  formatDateDisplay,
  formatINR,
  formatUnits,
  calculateDaysBetween,
} from '../types';

interface ReturningUserCardProps {
  previousReading: MeterReading;
  onCalculate: (data: {
    prevDate: string;
    prevReading: number;
    currDate: string;
    currReading: number;
  }) => void;
  onOpenChangePreviousModal: () => void;
}

export const ReturningUserCard: React.FC<ReturningUserCardProps> = ({
  previousReading,
  onCalculate,
  onOpenChangePreviousModal,
}) => {
  const [currDate, setCurrDate] = useState<string>(getTodayDateString());
  const [currReadingStr, setCurrReadingStr] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prevNum = previousReading.reading;
  const currNum = parseFloat(currReadingStr);
  const hasValidCurr = !isNaN(currNum) && currNum >= 0;

  const daysElapsed = calculateDaysBetween(previousReading.date, currDate);

  let liveUnitsConsumed: number | null = null;
  let liveBill: number | null = null;

  if (hasValidCurr && currNum >= prevNum) {
    liveUnitsConsumed = parseFloat((currNum - prevNum).toFixed(2));
    liveBill = parseFloat((liveUnitsConsumed * RATE_PER_UNIT).toFixed(2));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Required date
    if (!currDate.trim()) {
      setErrorMessage('Please provide the current reading date.');
      return;
    }

    // Validation 2: Required reading
    if (currReadingStr.trim() === '') {
      setErrorMessage('Please enter the current meter reading in units.');
      return;
    }

    // Validation 3: Numeric checks
    if (isNaN(currNum) || currNum < 0) {
      setErrorMessage('Current meter reading must be a valid positive number.');
      return;
    }

    // Validation 4: Current reading cannot be lower than previous
    if (currNum < prevNum) {
      setErrorMessage(
        `Current meter reading (${formatUnits(currNum)} units) is lower than the saved previous reading (${formatUnits(prevNum)} units). If your meter was replaced or the saved reading is outdated, click "Change Previous Reading".`
      );
      return;
    }

    onCalculate({
      prevDate: previousReading.date,
      prevReading: previousReading.reading,
      currDate,
      currReading: currNum,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
      {/* Left Column: Baseline Record & Pricing Tier */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        {/* Baseline Record Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Baseline Record
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Active Baseline
            </span>
          </div>

          {/* Previous Reading Date item */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Previous Reading Date</p>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">
                {formatDateDisplay(previousReading.date)}
              </p>
            </div>
          </div>

          {/* Previous Reading Value item */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Previous Reading Value</p>
              <p className="font-semibold text-slate-900 font-mono-num text-sm sm:text-base">
                {formatUnits(previousReading.reading)} Units
              </p>
            </div>
          </div>

          {daysElapsed > 0 && (
            <p className="text-[11px] text-slate-400 mb-4 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{daysElapsed} days since last recorded reading</span>
            </p>
          )}

          {/* Change Baseline Button */}
          <button
            type="button"
            id="change-previous-reading-btn"
            onClick={onOpenChangePreviousModal}
            className="w-full py-3 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Change Previous Reading
          </button>
        </div>

        {/* Pricing Tier Dark Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pricing Tier
          </h2>
          <p className="text-3xl font-light mb-1 font-mono-num">
            ₹{RATE_PER_UNIT}.00 <span className="text-lg text-slate-400">/ Unit</span>
          </p>
          <p className="text-xs text-slate-400">
            Standard domestic rate applied as of {new Date().toLocaleString('en-IN', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right Column: New Meter Entry Form */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Meter Entry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your latest meter reading to calculate consumption
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              Current Cycle
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-900">Reading Conflict</p>
                  <p className="text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Current Date */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="curr-date-input"
                  className="text-xs font-semibold text-slate-500 uppercase ml-1"
                >
                  Current Date
                </label>
                <input
                  id="curr-date-input"
                  type="date"
                  required
                  value={currDate}
                  onChange={(e) => {
                    setCurrDate(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 transition-all font-mono-num"
                />
              </div>

              {/* Current Units */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="curr-units-returning-input"
                  className="text-xs font-semibold text-slate-500 uppercase ml-1"
                >
                  Current Units (kWh)
                </label>
                <input
                  id="curr-units-returning-input"
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder={`e.g. ${Math.round(previousReading.reading + 90)}`}
                  value={currReadingStr}
                  onChange={(e) => {
                    setCurrReadingStr(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 transition-all font-mono-num"
                />
              </div>
            </div>

            {/* Live Preview Bar if valid */}
            {liveUnitsConsumed !== null && liveBill !== null && (
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in duration-150">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Consumption:</span>
                  <span className="text-blue-400 font-bold font-mono-num">
                    {formatUnits(liveUnitsConsumed)} Units
                  </span>
                  <span className="text-slate-500">({formatUnits(currNum)} − {formatUnits(prevNum)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Estimated Total:</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono-num">
                    {formatINR(liveBill)}
                  </span>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              id="calculate-bill-btn"
              className="mt-4 w-full py-3.5 sm:py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <span>Calculate Final Bill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
