export interface MeterReading {
  date: string; // YYYY-MM-DD
  reading: number; // units in kWh
  note?: string;
}

export interface BillRecord {
  id: string;
  prevDate: string;
  prevReading: number;
  currDate: string;
  currReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  totalBill: number;
  daysBetween?: number;
  createdAt: number;
}

export const RATE_PER_UNIT = 9; // ₹9 per unit as specified in prompt
export const STORAGE_KEY_LATEST_READING = 'electricity_latest_reading_v1';
export const STORAGE_KEY_BILL_HISTORY = 'electricity_bill_history_v1';

export function formatINR(amount: number): string {
  // Format accurately to Indian Rupees
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
  return `₹${formatted}`;
}

export function formatUnits(units: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: units % 1 === 0 ? 0 : (units * 10) % 1 === 0 ? 1 : 2,
  }).format(units);
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getOneMonthAgoDateString(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
