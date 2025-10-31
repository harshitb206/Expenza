'use client';
interface SavingsInsightProps { totalIncome: number; totalExpense: number; }

export default function SavingsInsight({ totalIncome, totalExpense }: SavingsInsightProps) {
  const savings = totalIncome - totalExpense;

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gray-50 text-[#262626]">
      <h2 className="text-xl font-bold mb-4 text-[#FF9900]">Savings Insight</h2>
      <p className="text-lg font-semibold">
        {savings >= 0
          ? <span className="text-green-600">Great! You have saved ₹{savings} this period.</span>
          : <span className="text-red-600">You have overspent by ₹{-savings}.</span>}
      </p>
    </div>
  );
}