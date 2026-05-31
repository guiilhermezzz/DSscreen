import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const icons = {
    success: <CheckCircle size={18} className="text-green-400" />,
    error: <XCircle size={18} className="text-red-400" />,
    info: <Info size={18} className="text-blue-400" />,
  };

  const colors = {
    success: 'border-green-500/30 bg-green-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-blue-500/30 bg-blue-500/10',
  };

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[9999] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ${colors[type]} ${
        visible ? 'opacity-100 translate-x-[-50%] translate-y-0' : 'opacity-0 translate-x-[-50%] translate-y-4'
      }`}
      style={{ minWidth: '280px', maxWidth: '380px' }}
    >
      {icons[type]}
      <span className="flex-1 text-sm font-medium text-white">{message}</span>
      <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}
