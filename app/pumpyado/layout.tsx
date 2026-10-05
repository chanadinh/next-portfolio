import type { Metadata } from 'next';
import GameFrame from '../../components/portfolio/GameFrame';

export const metadata: Metadata = { title: 'Pumpy Ado | Chan Dinh', alternates: { canonical: '/pumpyado' } };

export default function PumpyAdoLayout({ children }: { children: React.ReactNode }) {
  return <GameFrame title="Pumpy Ado"><div className="min-h-screen bg-blue-400">{children}</div></GameFrame>;
}
