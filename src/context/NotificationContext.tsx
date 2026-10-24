// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'info' | 'success' | 'error';

interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (message: string, type: NotificationType = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
              n.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : n.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};