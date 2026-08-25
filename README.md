# Electricity Bill Calculator

A simple, responsive electricity bill calculator built with React and TypeScript.

The application helps users calculate their electricity consumption and estimated bill from meter readings, while keeping track of previous readings and bill history locally in the browser.

## Features

- Calculate electricity consumption from meter readings
- Calculate estimated bill amount
- Indian Rupee (₹) currency formatting
- Track the number of days between meter readings
- Persist the latest meter reading using `localStorage`
- Maintain a local history of previous bills
- Update the saved previous meter reading
- Reset saved readings and clear bill history
- Built-in meter reading guide
- Responsive interface
- Visual feedback after successful calculations

## How It Works

The application uses the difference between the previous and current meter readings to determine electricity consumption:

```text
Current Reading - Previous Reading
              │
              ▼
       Units Consumed
              │
              ▼
     Units × Rate per Unit
              │
              ▼
       Estimated Bill

## Project Structure
src/
├── components/
│   ├── BillHistoryModal.tsx
│   ├── ChangePreviousModal.tsx
│   ├── FirstTimeSetupCard.tsx
│   ├── Header.tsx
│   ├── MeterReadingGuideModal.tsx
│   ├── ResetConfirmModal.tsx
│   ├── ResultCard.tsx
│   └── ReturningUserCard.tsx
│
├── App.tsx
├── types.ts
└── main.tsx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
