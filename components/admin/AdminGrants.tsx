import React, { useEffect, useState } from 'react';
import { Card, Button } from '../ui';
import api from '../../services/api';

interface Grant {
  id: number;
  project_title: string;
  category: string;
  description: string;
  requested_amount_cfa: number;
  full_name: string;
  phone: string;
  status: string;
  id_document_path: string | null;
  created_at: string;
}

const AdminGrants: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/grants')
      .then((r) => setGrants(r.data.data || r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (g: Grant, status: string) => {
    const note = prompt('Note (optionnel) :', '') || '';
    try {
      await api.post(`/admin/grants/${g.id}/status`, { status, admin_note: note });
      setGrants((gs) => gs.map((x) => (x.id === g.id ? { ...x, status } : x)));
    } catch (e: any) {
      alert(e.response?.data?.message || 'Erreur');
    }
  };

  const publicUrl = (p: string | null) => {
    if (!p) return null;
    const base = (import.meta as any).env?.VITE_API_PUBLIC_URL || 'https://novatrust-backend-production.up.railway.app';
    return `${base}/storage/${p}`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Demandes de subventions</h1>

      <Card>
        {loading ? (
          <p className="text-slate-400 text-center py-6 sm:py-8 text-sm">Chargement...</p>
        ) : grants.length === 0 ? (
          <p className="text-slate-400 text-center py-6 sm:py-8 text-sm">Aucune demande.</p>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {grants.map((g) => (
              <li key={g.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm sm:text-base">{g.project_title}</p>
                    <p className="text-xs sm:text-sm text-pink-300">{g.category} — {g.requested_amount_cfa.toLocaleString('fr-FR')} XAF</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Par {g.full_name} ({g.phone})
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 sm:line-clamp-3">{g.description}</p>
                    {g.id_document_path && (
                      <a
                        href={publicUrl(g.id_document_path)!}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 underline mt-1 inline-block"
                      >
                        Pièce d'identité
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5 sm:gap-2 flex-shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        g.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : g.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {g.status}
                    </span>
                    {g.status === 'pending' && (
                      <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                        <Button variant="success" className="w-auto px-2 sm:px-3 py-1 text-xs" onClick={() => updateStatus(g, 'approved')}>
                          Approuver
                        </Button>
                        <Button variant="danger" className="w-auto px-2 sm:px-3 py-1 text-xs" onClick={() => updateStatus(g, 'rejected')}>
                          Rejeter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default AdminGrants;
