import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getTypographyClass } from '@/lib/typography';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        <div className={`relative w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left shadow-xl transition-all ${className}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={getTypographyClass('header')}>
            {title}
          </h2>
            <Button
              variant="ghost"
            onClick={onClose}
              className="absolute right-4 top-4"
          >
              <X className="h-4 w-4" />
            </Button>
        </div>
          {children}
        </div>
      </div>
    </div>
  );
} 