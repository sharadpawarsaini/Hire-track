'use client';

import { useEffect, useState } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };

let toastListeners: ((t: Toast) => void)[] = [];

export function showToast(message: string, type: Toast['type'] = 'info') {
  toastListeners.forEach((fn) => fn({ id: Date.now(), message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== listener); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-xl transition-panel animate-page"
          style={{
            color:
              t.type === 'success' ? 'hsl(142,71%,60%)'
              : t.type === 'error' ? 'hsl(0,72%,65%)'
              : 'hsl(210,40%,92%)',
            borderColor:
              t.type === 'success' ? 'hsl(142,71%,45%,0.3)'
              : t.type === 'error' ? 'hsl(0,72%,51%,0.3)'
              : 'hsl(217,32%,22%)',
          }}
        >
          {t.type === 'success' && <span>✓</span>}
          {t.type === 'error' && <span>✕</span>}
          {t.type === 'info' && <span>·</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}
