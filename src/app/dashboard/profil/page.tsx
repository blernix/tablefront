'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ArrowLeft, Key, Loader2, Camera, User } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const isServer = user?.role === 'server';

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

  const fetchProfile = () => {
    apiClient.commercial.getProfile().then((d: any) => {
      setProfile(d.user);
      setFirstName(d.user?.firstName || '');
      setLastName(d.user?.lastName || '');
      setPhone(d.user?.phone || '');
      setPhotoUrl(d.user?.photoUrl || '');
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async () => {
    try {
      setSaving(true);
      await apiClient.commercial.updateProfile({ firstName, lastName, phone, photoUrl });
      toast.success('Profil mis à jour');
      fetchProfile();
    } catch (err: any) {
      toast.error(err?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      toast.error('6 caractères minimum pour le nouveau mot de passe');
      return;
    }
    try {
      setChangingPw(true);
      await apiClient.commercial.changePassword(currentPassword, newPassword);
      toast.success('Mot de passe changé');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur');
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-400 py-10 text-center">Chargement...</div>;

  const backHref = isServer ? '/dashboard' : '/dashboard/settings';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={backHref}><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-light text-[#2A2A2A]">Mon profil</h1>
          {profile?.trackingId && (
            <p className="text-xs text-gray-400">ID : {profile.trackingId}</p>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#0066FF]/10 flex items-center justify-center">
                <User className="h-7 w-7 text-[#0066FF]" />
              </div>
            )}
            <div>
              <div className="font-medium text-[#2A2A2A]">
                {firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : profile?.email}
              </div>
              <div className="text-xs text-gray-400">{profile?.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Prénom</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Nom</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" className="mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Téléphone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">Photo de profil</Label>
            <div className="mt-1">
              <ImageUpload
                currentImageUrl={photoUrl}
                onUpload={async (file: File) => {
                  const result = await apiClient.commercial.uploadProfilePhoto(file) as any;
                  setPhotoUrl(result.user?.photoUrl || '');
                  toast.success('Photo mise à jour');
                }}
                aspectRatio="square"
              />
            </div>
          </div>

          <Button onClick={saveProfile} disabled={saving} className="bg-[#0066FF] hover:bg-[#0052CC]">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enregistrement...</> : 'Enregistrer'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-sm font-medium text-[#2A2A2A] flex items-center gap-2">
            <Key className="h-4 w-4" /> Changer le mot de passe
          </h3>
          <div>
            <Label className="text-xs">Mot de passe actuel</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Nouveau mot de passe</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1" />
          </div>
          <Button variant="outline" onClick={changePassword} disabled={changingPw}>
            {changingPw ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Changement...</> : 'Changer le mot de passe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
