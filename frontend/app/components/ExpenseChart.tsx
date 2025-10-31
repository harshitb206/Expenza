
'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expense { id: number; amount: number; category: string; }
interface Props { expenses: Expense[]; }

export default function ExpenseChart({ expenses }: Props) {
  const dataMap: { [key: string]: number } = {};
  expenses.forEach((e) => {
    if (e.category) dataMap[e.category] = (dataMap[e.category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(dataMap),
    datasets: [
      {
        data: Object.values(dataMap),
        backgroundColor: [
          '#22C55E', // emerald-500
          '#16A34A', // emerald-600
          '#34D399', // emerald-400
          '#86EFAC', // emerald-200
          '#FBBF24', // amber-400 (highlight)
          '#10B981', // teal/emerald mix
          '#065F46', // deep emerald
        ],
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  if (!Object.keys(dataMap).length)
    return <p className="text-slate-400 text-center mt-12">No expenses to show</p>;

  return (
    <div style={{ height: '260px', maxWidth: '320px', margin: '0 auto' }}>
      <Pie data={data} />
    </div>
  );
}
