import React, { useEffect, useState } from 'react';
import { Card } from '../ui';
import { Users, ShieldCheck, Landmark, Gift, Wallet, Activity } from 'lucide-react';
import api from '../../services/api';

interface Stats {
  total_clients: number;
  activated_clients: number;
  pending_loans: number;
  pending_grants: number;
  active_scalpings?: number;
  total_balance: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then((r) => setStats(r.data))
      .catch((e) => setError(e.response?.data?.message || 'Erreur de chargement'));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-slate-400">Chargement...</p>;

  const cards = [
    { label: 'Clients inscrits', value: stats.total_clients, icon: Users, color: 'text-blue-400' },
    { label: 'Comptes activés', value: stats.activated_clients, icon: ShieldCheck, color: 'text-emerald-400' },
    { label: 'Scalpings actifs', value: stats.active_scalpings ?? 0, icon: Activity, color: 'text-cyan-400' },
    { label: 'Prêts en attente', value: stats.pending_loans, icon: Landmark, color: 'text-amber-400' },
    { label: 'Subventions en attente', value: stats.pending_grants, icon: Gift, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Vue d'ensemble</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-slate-800 border-slate-700 p-3 sm:p-4">
            <c.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${c.color} mb-2`} />
            <p className="text-xs sm:text-sm text-slate-400">{c.label}</p>
            <p className="text-lg sm:text-2xl font-bold text-white mt-1">{c.value}</p>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-500/30 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 flex-shrink-0" />
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-slate-300">Total des soldes clients</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {stats.total_balance.toLocaleString('fr-FR')} <span className="text-blue-400 text-lg sm:text-2xl">XAF</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
