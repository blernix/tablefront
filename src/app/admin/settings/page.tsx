'use client';

import { useState } from 'react';
import { User, Shield, Bell, Mail, Lock, Smartphone, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useChangeEmail, useChangePassword } from '@/hooks/api/useAuth';
import TwoFactorManagement from '@/components/admin/TwoFactorManagement';
import { toast } from 'sonner';

type Tab = 'profile' | 'security' | 'notifications';

const tabs = [
  { id: 'profile' as Tab, label: 'Profil', icon: User },
  { id: 'security' as Tab, label: 'Sécurité', icon: Shield },
  { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-12">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuthStore();
  const changeEmailMutation = useChangeEmail();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !currentPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (newEmail === user?.email) {
      toast.error('Le nouvel email doit être différent de l\'email actuel');
      return;
    }

    try {
      await changeEmailMutation.mutateAsync({ currentPassword, newEmail });
      setCurrentPassword('');
      setNewEmail('');
      setIsEditing(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Adresse email
          </CardTitle>
          <CardDescription>
            Votre adresse email utilisée pour vous connecter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email actuel</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                 Modifier l&apos;email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Nouvel email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="nouveau@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPasswordEmail">Mot de passe actuel</Label>
                <Input
                  id="currentPasswordEmail"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Votre mot de passe actuel"
                  required
                />
                <p className="text-xs text-gray-500">
                  Pour des raisons de sécurité, veuillez confirmer votre mot de passe
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={changeEmailMutation.isPending}
                >
                  {changeEmailMutation.isPending ? 'Modification...' : 'Confirmer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNewEmail('');
                    setCurrentPassword('');
                  }}
                  disabled={changeEmailMutation.isPending}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const changePasswordMutation = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Mot de passe
          </CardTitle>
          <CardDescription>
            Modifiez votre mot de passe de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Votre mot de passe actuel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retapez le nouveau mot de passe"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Authentification à deux facteurs (2FA)
          </CardTitle>
          <CardDescription>
            Ajoutez une couche de sécurité supplémentaire à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Protection renforcée
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  La 2FA nécessite un code unique de votre téléphone en plus de votre mot de passe
                </p>
              </div>
            </div>

            <TwoFactorManagement />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reservationAlerts, setReservationAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleSave = () => {
    toast.success('Préférences de notifications sauvegardées');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Préférences de notification
          </CardTitle>
          <CardDescription>
            Gérez comment vous souhaitez être notifié
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Notifications par email</p>
              <p className="text-xs text-gray-500">
                Recevoir les notifications importantes par email
              </p>
            </div>
            <Button
              variant={emailNotifications ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              {emailNotifications ? 'Activé' : 'Désactivé'}
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Alertes de réservation</p>
                <p className="text-xs text-gray-500">
                  Être notifié lors de nouvelles réservations ou modifications
                </p>
              </div>
              <Button
                variant={reservationAlerts ? 'default' : 'outline'}
                size="sm"
                onClick={() => setReservationAlerts(!reservationAlerts)}
              >
                {reservationAlerts ? 'Activé' : 'Désactivé'}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Rapports hebdomadaires</p>
                <p className="text-xs text-gray-500">
                  Recevoir un résumé hebdomadaire des statistiques
                </p>
              </div>
              <Button
                variant={weeklyReports ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWeeklyReports(!weeklyReports)}
              >
                {weeklyReports ? 'Activé' : 'Désactivé'}
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button onClick={handleSave}>
              Sauvegarder les préférences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
