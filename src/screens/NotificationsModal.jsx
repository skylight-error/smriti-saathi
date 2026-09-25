import React from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { playGentleTap, playGentleChime } from '../utils/sound';
import { speakText } from '../utils/speech';
import { X, Bell, CheckCircle2, Clock, Volume2 } from 'lucide-react';

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  language,
  onTakeMedicine
}) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleReadNotification = (notif) => {
    playGentleTap();
    speakText(`${notif.title}. ${notif.message}`, language);
  };

  const handleAction = (notif) => {
    if (notif.actionType === 'take-med' && notif.medId) {
      playGentleChime();
      onTakeMedicine(notif.medId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DEC9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F3F1] text-[#0D5C56] flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#1C2421]">
                {t.notificationsTitle}
              </h3>
              <p className="text-sm text-[#4B5563]">
                Warm reminders for your peaceful day
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playGentleTap();
              onClose();
            }}
            className="min-touch-target w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] flex items-center justify-center text-[#4B5563] hover:text-[#1C2421] cursor-pointer"
            aria-label="Close notifications"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="py-4 space-y-3.5 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-[#4B5563]">
              <CheckCircle2 className="w-12 h-12 mx-auto text-[#0D5C56] mb-2 opacity-80" />
              <p className="text-lg font-bold text-[#1C2421]">All caught up!</p>
              <p className="text-sm mt-1">You are having a wonderfully peaceful day.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isReminder = n.type === 'reminder' || n.type === 'hydration';
              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isReminder
                      ? 'bg-amber-50/60 border-amber-300'
                      : 'bg-[#FAF7F2] border-[#E5DEC9]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{n.icon}</span>
                      <div>
                        <div className="text-lg font-bold text-[#1C2421]">
                          {n.title}
                        </div>
                        <p className="text-base text-[#4B5563] mt-1 leading-snug">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#8C5036]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{n.time}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadNotification(n)}
                      className="p-2.5 rounded-xl bg-white border border-[#D4CBB5] text-[#0D5C56] hover:bg-[#F2ECE1] cursor-pointer shrink-0"
                      title="Read aloud"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  {n.actionType === 'take-med' && (
                    <div className="mt-3 pt-3 border-t border-amber-200 flex justify-end">
                      <button
                        onClick={() => handleAction(n)}
                        className="px-4 py-2 rounded-xl bg-[#0D5C56] text-white font-bold text-sm hover:bg-[#083E3A] cursor-pointer"
                      >
                        {t.markTaken} 💊
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E5DEC9]">
          <button
            onClick={() => {
              playGentleTap();
              onClose();
            }}
            className="min-touch-target w-full py-3.5 rounded-2xl bg-[#0D5C56] text-white font-bold text-lg hover:bg-[#083E3A] cursor-pointer"
          >
            Close Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
