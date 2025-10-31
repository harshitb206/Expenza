'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ExpenseChart from './components/ExpenseChart';
import SavingsInsight from './components/SavingsInsight';

interface Expense { id: number; amount: number; category: string; }
interface Income { id: number; amount: number; }

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const BACKEND_URL = 'http://localhost:5000';

  const loadData = async () => {
    try {
      const [expRes, incRes] = await Promise.all([
        axios.get<Expense[]>(`${BACKEND_URL}/expenses`),
        axios.get<Income[]>(`${BACKEND_URL}/income`)
      ]);
      setExpenses(expRes.data);
      setIncome(incRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex min-h-screen text-[#0F172A]">
      <main className="flex-1 px-6 lg:px-10 py-8">
        <h1 className="text-4xl font-bold mb-8 text-emerald-700">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {/* Total Income Card */}
          <div className="card hover:shadow-xl">
            <h2 className="font-semibold mb-2 text-slate-500">Total Income</h2>
            <p className="text-3xl font-extrabold text-emerald-600">₹{totalIncome}</p>
          </div>

          {/* Total Expense Card */}
          <div className="card hover:shadow-xl">
            <h2 className="font-semibold mb-2 text-slate-500">Total Expense</h2>
            <p className="text-3xl font-extrabold text-rose-600">₹{totalExpense}</p>
          </div>

          {/* Savings Card */}
          <div className="card hover:shadow-xl">
            <h2 className="font-semibold mb-2 text-slate-500">Savings</h2>
            <p className="text-3xl font-extrabold text-emerald-700">₹{totalIncome - totalExpense}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Expense Chart */}
          <div className="card flex-grow">
            <h2 className="text-xl font-bold mb-4 text-emerald-700">Expenses by Category</h2>
            <ExpenseChart expenses={expenses} />
          </div>

          {/* Savings Insight */}
          <div className="card flex-grow">
            <SavingsInsight totalIncome={totalIncome} totalExpense={totalExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}