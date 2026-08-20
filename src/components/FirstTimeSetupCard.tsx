import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { RATE_PER_UNIT, getTodayDateString, getOneMonthAgoDateString, formatINR, formatUnits } from '../types';

interface FirstTimeSetupCardProps {
  onCalculate: (data: {
    prevDate: string;
    prevReading: number;
    currDate: string;
    currReading: number;
  }) => void;
}

export const FirstTimeSetupCard: React.FC<FirstTimeSetupCardProps> = ({ onCalculate }) => {
  const [prevDate, setPrevDate] = useState<string>(getOneMonthAgoDateString());
  const [prevReadingStr, setPrevReadingStr] = useState<string>('');
  const [currDate, setCurrDate] = useState<string>(getTodayDateString());
  const [currReadingStr, setCurrReadingStr] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prevNum = parseFloat(prevReadingStr);
  const currNum = parseFloat(currReadingStr);
  const hasValidPrev = !isNaN(prevNum) && prevNum >= 0;
  const hasValidCurr = !isNaN(currNum) && currNum >= 0;

  let liveUnitsConsumed: number | null = null;
  let liveBill: number | null = null;

  if (hasValidPrev && hasValidCurr && currNum >= prevNum) {
    liveUnitsConsumed = parseFloat((currNum - prevNum).toFixed(2));
    liveBill = parseFloat((liveUnitsConsumed * RATE_PER_UNIT).toFixed(2));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation 1: Required dates
    if (!prevDate.trim()) {
      setErrorMessage('Please provide the previous reading date.');
      return;
    }
    if (!currDate.trim()) {
      setErrorMessage('Please provide the current reading date.');
      return;
    }

    // Validation 2: Required readings
    if (prevReadingStr.trim() === '') {
      setErrorMessage('Please enter the previous meter reading in units.');
      return;
    }
    if (currReadingStr.trim() === '') {
      setErrorMessage('Please enter the current meter reading in units.');
      return;
    }

    // Validation 3: Numeric checks
    if (isNaN(prevNum) || prevNum < 0) {
      setErrorMessage('Previous meter reading must be a valid positive number.');
      return;
    }
    if (isNaN(currNum) || currNum < 0) {
      setErrorMessage('Current meter reading must be a valid positive number.');
      return;
    }

    // Validation 4: Current cannot be lower than previous
    if (currNum < prevNum) {
      setErrorMessage(
        `Current meter reading (${formatUnits(currNum)} units) cannot be lower than previous reading (${formatUnits(prevNum)} units). Please verify your meter display.`
      );
      return;
    }

    onCalculate({
      prevDate,
      prevReading: prevNum,
      currDate,
      currReading: currNum,
    });
  };

  const handleFillSample = () => {
    setPrevDate('2026-07-15');
    setPrevReadingStr('1250');
    setCurrDate('2026-08-15');
    setCurrReadingStr('1340');
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
      {/* Left Column: First-time Instructions & Pricing Tier */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Setup Guide
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Step 1 of 2
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Since this is your first time, enter both your <strong>previous baseline</strong> and <strong>current reading</strong>.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Automatic Persistence</span>
            </div>
            <p className="text-[11px] text-slate-500">
              The current reading will be automatically saved as your baseline for all next visits.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFillSample}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fill Sample Data (1250 → 1340)</span>
          </button>
        </div>

        {/* Pricing Tier Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pricing Tier
            </h2>
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <p className="text-3xl font-light mb-1 font-mono-num">
            ₹{RATE_PER_UNIT}.00 <span className="text-lg text-slate-400">/ Unit</span>
          </p>
          <p className="text-xs text-slate-400">
            Standard domestic flat rate applied
          </p>
        </div>
      </div>

      {/* Right Column: Initial Setup Form */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Initial Meter Entry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide previous cycle baseline and today&apos;s meter values
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
              Setup Mode
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-900">Validation Error</p>
                  <p className="text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Section 1: Previous Reading Fields */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Previous Reading (Baseline)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="prev-date-input"
                    className="text-xs font-semibold text-slate-500 uppercase ml-1"
                  >
                    Previous Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prev-date-input"
                    type="date"
                    required
                    value={prevDate}
                    onChange={(e) => {
                      setPrevDate(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 transition-all font-mono-num"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="prev-units-input"
                    className="text-xs font-semibold text-slate-500 uppercase ml-1"
                  >
                    Previous Units (kWh) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prev-units-input"
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="e.g. 1250"
                    value={prevReadingStr}
                    onChange={(e) => {
                      setPrevReadingStr(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 transition-all font-mono-num"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Current Reading Fields */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Current Reading (Today)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="curr-date-input"
                    className="text-xs font-semibold text-slate-500 uppercase ml-1"
                  >
                    Current Date <span className="text-rose-500">*</span>
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

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="curr-units-input"
                    className="text-xs font-semibold text-slate-500 uppercase ml-1"
                  >
                    Current Units (kWh) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="curr-units-input"
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="e.g. 1340"
                    value={currReadingStr}
                    onChange={(e) => {
                      setCurrReadingStr(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden font-medium text-slate-900 transition-all font-mono-num"
                  />
                </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              id="calculate-bill-initial-btn"
              className="mt-4 w-full py-3.5 sm:py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <span>Calculate Initial Bill & Save Baseline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
