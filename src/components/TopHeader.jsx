import React from 'react';
import { Volume2, VolumeX, Globe, Bell, AlertTriangle } from 'lucide-react';
import { TRANSLATIONS, LANGUAGES } from '../data/i18n';
import { playGentleTap } from '../utils/sound';

export default function TopHeader({
  patient,
  language,
  onOpenLanguageModal,
  onOpenNotifications,
  unreadCount = 0,
  onOpenSos,
  isAudioSpeaking,
  onToggleSpeech
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  // Friendly date display in current locale
  const today = new Date();
  const dateFormatted = today.toLocaleDateString(
    language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN',
    { weekday: 'long', day: 'numeric', month: 'long' }
  );

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DEC9] px-4 py-3 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Greeting & Patient Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="flower">🌸</span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0D5C56] truncate tracking-tight">
              {currentLangObj.greeting}, {patient.name || 'Friend'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#4B5563] font-medium truncate mt-0.5">
            {t.todayIs} {dateFormatted}
          </p>
        </div>

        {/* Right Action Bar with Dementia-Friendly 56px+ Touch Targets */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audio Read-Aloud Toggle Button */}
          <button
            onClick={() => {
              playGentleTap();
              onToggleSpeech();
            }}
            aria-label={isAudioSpeaking ? t.stopReading : t.readAloud}
            className={`min-touch-target flex items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
              isAudioSpeaking
                ? 'bg-[#0D5C56] text-white border-[#0D5C56] ring-2 ring-[#0D5C56]/30 animate-pulse'
                : 'bg-white text-[#0D5C56] border-[#D4CBB5] hover:bg-[#F2ECE1]'
            }`}
            title={isAudioSpeaking ? t.stopReading : t.readAloud}
          >
            {isAudioSpeaking ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={() => {
              playGentleTap();
              onOpenLanguageModal();
            }}
            aria-label={t.chooseLanguage}
            className="min-touch-target flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#0D5C56] font-semibold text-sm sm:text-base hover:bg-[#F2ECE1] transition-all cursor-pointer"
            title={t.chooseLanguage}
          >
            <Globe className="w-5 h-5 text-[#0D5C56]" />
            <span className="hidden sm:inline">{currentLangObj.name}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              playGentleTap();
              onOpenNotifications();
            }}
            aria-label={t.notificationsTitle}
            className="min-touch-target relative flex items-center justify-center p-3 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#0D5C56] hover:bg-[#F2ECE1] transition-all cursor-pointer"
            title={t.notificationsTitle}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#9B4B28] text-white font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* SOS Help Button - High contrast red, clear text, universally recognized */}
          <button
            onClick={() => {
              playGentleTap();
              onOpenSos();
            }}
            aria-label={t.helpSos}
            className="min-touch-target flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#D92D20] hover:bg-[#B42318] active:scale-95 text-white font-extrabold text-base sm:text-lg shadow-md border-2 border-red-700 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
}
