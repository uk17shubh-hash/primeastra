import React, { useState, useEffect } from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  Sparkles,
  Scissors,
  FileText,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Trash2,
  Film,
  FileCheck,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'tools' | 'security' | 'system';
  timestamp: string;
  isRead: boolean;
  actionKey?: 'invoice' | 'clipper' | 'resume' | 'mkv' | 'profile';
  icon: string;
  badge?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-zip',
    title: '📦 Full Project Source Code Archive (.ZIP) Ready!',
    description:
      'Download complete PrimeAstra project files, including GST Tax Invoice Pro, AI Video Clipper with MKV Audio, Full Resume Maker, and Firebase configurations.',
    category: 'system',
    timestamp: 'Just now',
    isRead: false,
    actionKey: 'profile',
    icon: '📦',
    badge: 'DOWNLOAD',
  },
  {
    id: 'notif-1',
    title: 'GST Tax Invoice Generator Pro Live!',
    description:
      'Official Indian tax invoice layout with HSN summary, IGST/CGST breakdown, instant UPI QR code, and A4 print PDF export.',
    category: 'tools',
    timestamp: 'Just now',
    isRead: false,
    actionKey: 'invoice',
    icon: '🧾',
    badge: 'NEW TOOL',
  },
  {
    id: 'notif-2',
    title: 'AI Video Clipper: MKV Audio & Face Tracking Ready',
    description:
      'Full Face Tracking with Gimbal 3-Axis Stabilization and Web Audio decoder for MKV/MP4 files. Generate up to 5 viral shorts with crystal sound.',
    category: 'tools',
    timestamp: '10m ago',
    isRead: false,
    actionKey: 'clipper',
    icon: '🎬',
    badge: 'UPDATE',
  },
  {
    id: 'notif-3',
    title: 'AI Resume Maker 2.0 with Full Scrollable Form',
    description:
      'Comprehensive resume builder featuring Personal Details, Work Experiences, Education, Projects, Certifications, Soft Skills, and Live PDF export.',
    category: 'tools',
    timestamp: '1h ago',
    isRead: false,
    actionKey: 'resume',
    icon: '✨',
    badge: 'UPGRADE',
  },
  {
    id: 'notif-4',
    title: 'MKV to MP4 Audio Converter Enabled',
    description:
      'Instant browser-based container converter to repackage MKV videos into universal MP4 with zero audio desync.',
    category: 'tools',
    timestamp: '2h ago',
    isRead: false,
    actionKey: 'mkv',
    icon: '🔄',
  },
  {
    id: 'notif-5',
    title: 'Firebase Password & Profile Photo Controls Active',
    description:
      'Update your password securely on Firebase Auth and upload custom profile photos or restore your Google default photo.',
    category: 'security',
    timestamp: 'Yesterday',
    isRead: true,
    actionKey: 'profile',
    icon: '🔐',
    badge: 'SECURITY',
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTool: (key: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onOpenTool,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('pa_notifications');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return DEFAULT_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'tools' | 'security'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('pa_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#121216] border border-[rgba(226,192,114,0.3)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[rgba(226,192,114,0.15)] flex items-center justify-between bg-[#181820]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[rgba(226,192,114,0.15)] border border-[rgba(226,192,114,0.3)] flex items-center justify-center text-[#e2c072]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                Notifications Center
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#e2c072] text-[#070707] text-[10px] font-black rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400">All alerts &amp; platform updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[10px] text-[#e2c072] hover:underline font-bold px-2 py-1"
                title="Mark all as read"
              >
                Mark Read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#20202a] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-[rgba(226,192,114,0.1)] bg-[#121216] text-xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              activeFilter === 'all'
                ? 'bg-[#e2c072] text-[#070707]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('tools')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              activeFilter === 'tools'
                ? 'bg-[#e2c072] text-[#070707]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tools &amp; AI
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('security')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition ${
              activeFilter === 'security'
                ? 'bg-[#e2c072] text-[#070707]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Security &amp; Auth
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 form-scroll">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl text-slate-600 block">🔔</span>
              <p className="text-xs font-bold text-white">No notifications here</p>
              <p className="text-[10px] text-slate-400">You are all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.actionKey) {
                    onOpenTool(n.actionKey);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition text-left cursor-pointer relative group ${
                  n.isRead
                    ? 'bg-[#181820]/60 border-[rgba(226,192,114,0.1)] hover:border-[rgba(226,192,114,0.25)]'
                    : 'bg-[#181820] border-[rgba(226,192,114,0.3)] hover:border-[#e2c072] shadow-sm'
                }`}
              >
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-[#e2c072] absolute top-3.5 right-3 animate-pulse" />
                )}

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1c1c24] border border-[rgba(226,192,114,0.2)] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
                    {n.icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white group-hover:text-[#e2c072] transition truncate">
                        {n.title}
                      </h4>
                      {n.badge && (
                        <span className="px-1.5 py-0.2 bg-[rgba(226,192,114,0.15)] text-[#e2c072] text-[8.5px] font-black rounded tracking-wider">
                          {n.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
                      {n.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[rgba(226,192,114,0.08)] text-[9.5px]">
                      <span className="text-slate-500 font-medium">{n.timestamp}</span>

                      <div className="flex items-center gap-2">
                        {n.actionKey && (
                          <span className="text-[#e2c072] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                            Open Tool &rarr;
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => dismissNotification(n.id, e)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                          title="Dismiss"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-[rgba(226,192,114,0.1)] bg-[#181820] flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-500">
              Showing {filteredNotifications.length} of {notifications.length}
            </span>
            <button
              type="button"
              onClick={clearAllNotifications}
              className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
