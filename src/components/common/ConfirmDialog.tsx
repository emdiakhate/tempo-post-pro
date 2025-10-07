/**
 * ConfirmDialog - Composant réutilisable pour les dialogues de confirmation
 * Utilise shadcn/ui Dialog
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-600',
    confirmVariant: 'default' as const,
    confirmClassName: 'bg-blue-600 hover:bg-blue-700'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    confirmVariant: 'default' as const,
    confirmClassName: 'bg-yellow-600 hover:bg-yellow-700'
  },
  danger: {
    icon: XCircle,
    iconColor: 'text-red-600',
    confirmVariant: 'destructive' as const,
    confirmClassName: 'bg-red-600 hover:bg-red-700'
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    confirmVariant: 'default' as const,
    confirmClassName: 'bg-green-600 hover:bg-green-700'
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    confirmVariant: 'default' as const,
    confirmClassName: 'bg-blue-600 hover:bg-blue-700'
  }
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  loading = false
}) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Icon className={cn('w-6 h-6', config.iconColor)} />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
            className={cn('w-full sm:w-auto', config.confirmClassName)}
          >
            {loading ? 'Chargement...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
