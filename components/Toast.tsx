import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce">
      <div className="bg-indigo-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-4 border border-indigo-500">
        <span className="font-medium text-lg">{message}</span>
        <button onClick={onClose} className="text-indigo-200 hover:text-white focus:outline-none transition-colors">
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;