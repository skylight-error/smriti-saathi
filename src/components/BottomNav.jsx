import React from 'react';
import { Home, CalendarCheck, Image, Mic, AlertCircle } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';
import { playGentleTap } from '../utils/sound';

export default function BottomNav({ activeScreen, onChangeScreen, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'routine', label: t.navRoutine, icon: CalendarCheck },
    { id: 'voice', label: t.navVoice, icon: Mic, isVoiceSpecial: true },
    { id: 'album', label: t.navAlbum, icon: Image },
    { id: 'sos', label: t.navSos, icon: AlertCircle, isSos: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9] border-t-2 border-[#E5DEC9] px-2 py-2 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;

          // Special floating-style mic button for Baat Karein
          if (item.isVoiceSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  playGentleTap();
                  onChangeScreen(item.id);
                }}
                className={`relative -top-3 flex flex-col items-center justify-center p-2 rounded-full cursor-pointer transition-all ${
                  isActive
                    ? 'ring-4 ring-[#0D5C56]/30 scale-105'
                    : 'hover:scale-105'
                }`}
                aria-label={item.label}
              >
                <div className="w-15 h-15 rounded-full bg-[#0D5C56] text-white flex items-center justify-center shadow-lg border-3 border-white">
                  <Mic className="w-8 h-8 animate-gentle-pulse" />
                </div>
                <span className="text-xs font-bold text-[#0D5C56] mt-1 text-center max-w-[72px] truncate">
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.isSos) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  playGentleTap();
                  onChangeScreen(item.id);
                }}
                className="flex flex-col items-center justify-center min-touch-target p-2 rounded-2xl text-[#D92D20] hover:bg-red-50 cursor-pointer transition-all"
                aria-label={item.label}
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-xs font-black text-[#D92D20] mt-0.5 truncate max-w-[64px]">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                playGentleTap();
                onChangeScreen(item.id);
              }}
              className={`flex flex-col items-center justify-center min-touch-target px-2.5 py-1.5 rounded-2xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#0D5C56] text-white shadow-xs font-bold'
                  : 'text-[#4B5563] hover:bg-[#F2ECE1] font-semibold'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span className={`text-xs mt-0.5 truncate max-w-[70px] ${isActive ? 'text-white' : 'text-[#4B5563]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
