import { useState, useEffect } from 'react';
import { XCircle, X } from 'lucide-react';

export default function Alert({
  message,
  type,
  autoDismiss = false,
  duration = 3000,
}: {
  message: string;
  type: 'success' | 'error';
  autoDismiss?: boolean;
  duration?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration]);

  if (!visible) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-100 border-green-400 text-green-700'
      : 'bg-red-100 border-red-400 text-red-700';

  return (
    <div
      className={`${bgColor} border px-4 py-3 rounded flex items-center justify-between space-x-2`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2">
        <XCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
      <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
