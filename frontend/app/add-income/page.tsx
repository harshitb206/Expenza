'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Income {
  id: number;
  amount: number;
  date: string;
}

export default function AddIncome() {
  const [income, setIncome] = useState<Income[]>([]);
  const [form, setForm] = useState({ amount: '', date: '' });
  const BACKEND_URL = 'http://localhost:5000';

  const loadIncome = async () => {
    try {
      const res = await axios.get<Income[]>(`${BACKEND_URL}/income`);
      setIncome(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadIncome(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/income`, form);
      setForm({ amount: '', date: '' });
      loadIncome();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    try { await axios.delete(`${BACKEND_URL}/income/${id}`); loadIncome(); } catch (err) { console.error(err); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL income records?")) return;
    try { await axios.delete(`${BACKEND_URL}/income`); loadIncome(); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 lg:px-10 text-[#0F172A]">
      <h1 className="text-3xl font-bold mb-8 text-emerald-700">Add Income</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-lg max-w-md mb-8 bg-white border border-emerald-50 mx-auto">
        <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="mb-4 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        <input type="date" placeholder="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="mb-4 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
        <button type="submit" className="w-full px-6 py-3 rounded-xl font-semibold transition-transform duration-200 transform hover:scale-105 bg-emerald-600 hover:bg-emerald-700 text-white">Add Income</button>
      </form>

      {/* Delete All & Income List Container */}
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recent Income</h2>
          <button onClick={handleDeleteAll} className="px-5 py-3 rounded-xl text-base font-semibold transition-transform duration-200 transform hover:scale-105 bg-rose-600 text-white border border-rose-600/20 ring-1 ring-rose-300/40 hover:ring-2 hover:shadow-md">Delete All</button>
        </div>
        
        {/* Income List */}
        <div className="p-6 rounded-2xl shadow-lg bg-white border border-emerald-50">
          {income.length === 0 ? (
            <p className="text-center text-gray-400">No income added yet.</p>
          ) : (
            <ul className="space-y-4">
              {income.map(inc => (
                <li key={inc.id} className="flex justify-between items-center p-4 rounded-lg bg-white border border-emerald-50 transition-transform duration-200 transform hover:scale-[1.01] hover:shadow-md">
                  <div className="flex-1">
                    <span className="text-lg font-semibold text-green-600">+₹{inc.amount}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{inc.date}</span>
                    <button onClick={() => handleDelete(inc.id)} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-rose-700 border border-rose-300 transition-colors hover:bg-rose-50">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}