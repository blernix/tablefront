'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isLoading?: boolean;
}

const ChangePasswordModal = ({
  isOpen,
  onClose,
  onChangePassword,
  isLoading = false,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'La confirmation est requise';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onChangePassword(currentPassword, newPassword);
      // Reset form on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Changer le mot de passe"
      size="sm"
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Entrez votre mot de passe actuel"
              className={errors.currentPassword ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Entrez le nouveau mot de passe"
              className={errors.newPassword ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le nouveau mot de passe"
              className={errors.confirmPassword ? 'border-destructive' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;