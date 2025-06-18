import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '../common';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center p-4 sm:p-6">
          <CheckCircle className="w-12 sm:w-16 h-12 sm:h-16 text-green-500 dark:text-green-400 mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        <div className="flex justify-center p-4 sm:p-6 pt-2 sm:pt-4">
          <Button
            variant="primary"
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto min-w-[120px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}; 