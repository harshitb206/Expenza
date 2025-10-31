'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const path = usePathname();
  const links = [
    { name: 'Dashboard', href: '/' },
    { name: 'Add Expense', href: '/add-expense' },
    { name: 'Add Income', href: '/add-income' },
    { name: 'Planner', href: '/planner' },
    { name: 'Expenses', href: '/expenses' }
  ];

  return (
    <div className="w-64 h-screen p-8 flex flex-col sidebar">
      <h1 className="text-3xl font-extrabold mb-10 tracking-wide">Tracker</h1>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${
              path === link.href
                ? 'active'
                : ''
            }`}
          >
            <span className="flex items-center gap-4 py-3 px-5 rounded-xl">{link.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}