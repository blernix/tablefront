'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { UserPlus, Loader2, X, Check } from 'lucide-react';

export default function AdminCommercialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const [commercials, setCommercials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommercials = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/commercials`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCommercials(data.users || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCommercials(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Remplis tous les champs'); return; }
    try {
      setSaving(true);
      await apiClient.admin.createCommercialUser(email, password);
      toast.success('Compte commercial créé');
      setEmail('');
      setPassword('');
      setShowForm(false);
      fetchCommercials();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-[#2A2A2A]">Comptes commerciaux</h1>
          <p className="text-sm text-gray-400 mt-1">{commercials.length} compte{commercials.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#0066FF] hover:bg-[#0052CC]" disabled={showForm}>
          <UserPlus className="h-4 w-4 mr-2" /> Nouveau commercial
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Créer un compte commercial</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label className="text-xs">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="commercial@tablemaster.fr" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Mot de passe</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
                <Button type="submit" disabled={saving} className="bg-[#0066FF] hover:bg-[#0052CC]">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Création...</> : 'Créer le compte'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>
      ) : commercials.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-10">
            <UserPlus className="h-10 w-10 mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Aucun compte commercial créé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {commercials.map((c: any) => (
            <Card key={c._id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0066FF]/10 rounded-full flex items-center justify-center">
                      <UserPlus className="h-4 w-4 text-[#0066FF]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{c.email}</div>
                      <div className="text-xs text-gray-400">Créé le {new Date(c.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">{c.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
