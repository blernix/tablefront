'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { User, Key, Loader2, Check } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const fetchProfile = () => { apiClient.commercial.getProfile().then((d: any) => { setProfile(d.user); setFirstName(d.user?.firstName || ''); setLastName(d.user?.lastName || ''); setPhone(d.user?.phone || ''); setPhotoUrl(d.user?.photoUrl || ''); }).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => { try { setSaving(true); await apiClient.commercial.updateProfile({ firstName, lastName, phone, photoUrl }); toast.success('Profil mis à jour ✓'); fetchProfile(); } catch (e: any) { toast.error(e?.message); } finally { setSaving(false); } };
  const changePassword = async () => { if (!currentPassword || !newPassword || newPassword.length < 6) { toast.error('6 caractères minimum'); return; } try { setChangingPw(true); await apiClient.commercial.changePassword(currentPassword, newPassword); toast.success('Mot de passe changé ✓'); setCurrentPassword(''); setNewPassword(''); } catch (e: any) { toast.error(e?.message); } finally { setChangingPw(false); } };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-slate-200 rounded-lg w-32 animate-pulse" />
      <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4 md:space-y-6">
      <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Profil</h1>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5 space-y-5">
          <div className="flex items-center gap-4">
            {photoUrl ? <img src={photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-[#E5E5EA]" /> : (
              <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 flex items-center justify-center"><User className="h-7 w-7 text-[#0066FF]" /></div>
            )}
            <div>
              <p className="text-[17px] font-semibold text-[#000000] md:text-lg">{firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'Sans nom'}</p>
              <p className="text-[13px] text-[#8E8E93] md:text-sm">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Prénom</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nom</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Téléphone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Photo de profil</label>
            <ImageUpload currentImageUrl={photoUrl} onUpload={async (file: File) => { const r = await apiClient.commercial.uploadProfilePhoto(file) as any; setPhotoUrl(r.user?.photoUrl || ''); toast.success('Photo mise à jour ✓'); }} aspectRatio="square" />
          </div>

          <Button onClick={saveProfile} disabled={saving} className="w-full h-11 rounded-xl text-[15px] font-medium md:h-10 md:w-auto md:text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}{saving ? 'Enregistrement...' : 'Valider'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#0066FF]/10 flex items-center justify-center"><Key className="h-4 w-4 text-[#0066FF]" /></div>
            <h3 className="text-[15px] font-semibold text-[#000000] md:text-base">Changer le mot de passe</h3>
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Mot de passe actuel</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Nouveau mot de passe</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm" />
          </div>
          <Button variant="outline" onClick={changePassword} disabled={changingPw} className="w-full h-11 rounded-xl text-[15px] font-medium md:h-10 md:w-auto md:text-sm">
            {changingPw ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{changingPw ? 'Changement...' : 'Changer le mot de passe'}
          </Button>
        </div>
      </div>
    </div>
  );
}
