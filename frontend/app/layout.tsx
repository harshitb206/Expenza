
import Sidebar from './components/Sidebar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --background: #F3FBF6; /* soft mint */
            --foreground: #0F172A; /* slate-900 */
            --card-bg: #FFFFFF;
            --brand-600: #22C55E; /* emerald-500 */
            --brand-700: #16A34A; /* emerald-600 */
            --brand-800: #065F46; /* emerald-800 */
            --accent-yellow: #FBBF24; /* amber-400 */
            --shadow: 0 8px 24px rgba(16,24,40,0.08);
          }
        `}</style>
      </head>
      <body className="flex font-sans bg-gradient-to-br from-[#E8F5EE] via-[#F3FBF6] to-[#E6F4EA] text-[#0F172A]">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
