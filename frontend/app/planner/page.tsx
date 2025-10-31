'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
// Make sure the Planner component exists at this path, or update the path if needed
import Planner from '../components/Planner';

interface Expense { id: number; amount: number; }
interface Income { id: number; amount: number; }

export default function PlannerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const BACKEND_URL = 'http://localhost:5000';

  const loadData = async () => {
    try {
      const [expRes, incRes] = await Promise.all([
        axios.get<Expense[]>(`${BACKEND_URL}/expenses`),
        axios.get<Income[]>(`${BACKEND_URL}/income`),
      ]);
      setExpenses(expRes.data);
      setIncome(incRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8 text-[#0F172A]">
      <h1 className="text-3xl font-bold mb-8 text-emerald-700">Savings Planner</h1>
      <Planner totalIncome={totalIncome} totalExpense={totalExpense} />
    </div>
  );
}
