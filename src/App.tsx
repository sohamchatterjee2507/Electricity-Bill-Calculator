import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { FirstTimeSetupCard } from './components/FirstTimeSetupCard';
import { ReturningUserCard } from './components/ReturningUserCard';
import { ResultCard } from './components/ResultCard';
import { ChangePreviousModal } from './components/ChangePreviousModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { BillHistoryModal } from './components/BillHistoryModal';
import { MeterReadingGuideModal } from './components/MeterReadingGuideModal';
import {
  MeterReading,
  BillRecord,
  RATE_PER_UNIT,
  STORAGE_KEY_LATEST_READING,
  STORAGE_KEY_BILL_HISTORY,
  calculateDaysBetween,
} from './types';
import { Zap } from 'lucide-react';

export default function App() {
  const [savedReading, setSavedReading] = useState<MeterReading | null>(null);
  const [history, setHistory] = useState<BillRecord[]>([]);
  const [currentBill, setCurrentBill] = useState<BillRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isChangePrevOpen, setIsChangePrevOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const storedReading = localStorage.getItem(STORAGE_KEY_LATEST_READING);
      if (storedReading) {
        const parsed = JSON.parse(storedReading);
        if (parsed && typeof parsed.reading === 'number' && parsed.date) {
          setSavedReading(parsed);
        }
      }

      const storedHistory = localStorage.getItem(STORAGE_KEY_BILL_HISTORY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch {
      // LocalStorage access issues fallback gracefully
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save latest reading to localStorage
  const persistLatestReading = (reading: MeterReading) => {
    setSavedReading(reading);
    try {
      localStorage.setItem(STORAGE_KEY_LATEST_READING, JSON.stringify(reading));
    } catch {
      // Ignore
    }
  };

  // Save history to localStorage
  const appendHistory = (newBill: BillRecord) => {
    const updated = [newBill, ...history].slice(0, 50); // keep last 50
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY_BILL_HISTORY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Trigger calculation from First-Time Setup (State 1) or Returning User (State 2)
  const handleCalculateBill = (data: {
    prevDate: string;
    prevReading: number;
    currDate: string;
    currReading: number;
  }) => {
    const units = parseFloat((data.currReading - data.prevReading).toFixed(2));
    const billAmount = parseFloat((units * RATE_PER_UNIT).toFixed(2));
    const days = calculateDaysBetween(data.prevDate, data.currDate);

    const newBillRecord: BillRecord = {
      id: `bill_${Date.now()}`,
      prevDate: data.prevDate,
      prevReading: data.prevReading,
      currDate: data.currDate,
      currReading: data.currReading,
      unitsConsumed: units,
      ratePerUnit: RATE_PER_UNIT,
      totalBill: billAmount,
      daysBetween: days,
      createdAt: Date.now(),
    };

    // 1. Set current bill for prominent display
    setCurrentBill(newBillRecord);

    // 2. Persist current reading as the new baseline
    persistLatestReading({
      date: data.currDate,
      reading: data.currReading,
    });

    // 3. Add to history
    appendHistory(newBillRecord);

    // 4. Trigger celebratory confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // Confetti fallback
    }

    // Scroll to results smoothly if needed
    const resultElement = document.getElementById('bill-result-section');
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Handle baseline update from ChangePreviousModal
  const handleUpdatePreviousBaseline = (updated: MeterReading) => {
    persistLatestReading(updated);
  };

  // Handle complete reset
  const handleResetData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_LATEST_READING);
    } catch {
      // Ignore
    }
    setSavedReading(null);
    setCurrentBill(null);
  };

  // Handle history clear
  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_BILL_HISTORY);
    } catch {
      // Ignore
    }
    setHistory([]);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <Zap className="w-5 h-5 text-blue-600 animate-spin" />
          <span>Loading Electricity Bill Calculator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] flex flex-col font-sans antialiased">
      {/* App Header */}
      <Header
        hasSavedData={savedReading !== null}
        historyCount={history.length}
        onOpenResetModal={() => setIsResetConfirmOpen(true)}
        onOpenHistoryModal={() => setIsHistoryOpen(true)}
        onOpenGuideModal={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Calculation Input & Baseline Setup */}
        {savedReading === null ? (
          <FirstTimeSetupCard onCalculate={handleCalculateBill} />
        ) : (
          <ReturningUserCard
            previousReading={savedReading}
            onCalculate={handleCalculateBill}
            onOpenChangePreviousModal={() => setIsChangePrevOpen(true)}
          />
        )}

        {/* Results Card */}
        {currentBill && (
          <div id="bill-result-section" className="w-full">
            <ResultCard
              bill={currentBill}
              onResetToForm={() => {
                const el = document.getElementById('curr-units-returning-input') || document.getElementById('curr-units-input');
                el?.focus();
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6 mt-8 no-print text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="font-semibold text-slate-700">Electricity Bill Calculator</span>
            <span>•</span>
            <span>Domestic Slab: ₹{RATE_PER_UNIT}.00 / Unit</span>
          </div>

          <div className="flex items-center gap-4">
            {savedReading && (
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="text-slate-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
              >
                Reset Saved Baseline
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors cursor-pointer"
            >
              Meter Reading Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {savedReading && (
        <ChangePreviousModal
          isOpen={isChangePrevOpen}
          currentPrevious={savedReading}
          onClose={() => setIsChangePrevOpen(false)}
          onSave={handleUpdatePreviousBaseline}
        />
      )}

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirmReset={handleResetData}
      />

      <BillHistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={handleClearHistory}
        onSelectBill={(selectedBill) => setCurrentBill(selectedBill)}
      />

      <MeterReadingGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
