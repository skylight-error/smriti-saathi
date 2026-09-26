import React from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { FAMILY_MEMBERS } from '../data/familyMembers';
import { playGentleTap, playGentleChime } from '../utils/sound';
import { speakText } from '../utils/speech';
import {
  Users,
  Compass,
  Check,
  Plus,
  Droplets,
  Footprints,
  Pill,
  Image,
  Mic,
  ChevronRight
} from 'lucide-react';

export default function HomeScreen({
  language,
  _patient,
  medicines,
  onToggleMedicine,
  routineState,
  onUpdateRoutine,
  onNavigateScreen,
  notifications,
  onOpenNotifications,
  onOpenVoiceAssistant
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleMedToggle = (medId) => {
    const med = medicines.find(m => m.id === medId);
    if (!med) return;
    if (!med.taken) {
      playGentleChime();
      speakText(`${med.name} taken. Very good!`, language);
    } else {
      playGentleTap();
    }
    onToggleMedicine(medId);
  };

  const handleAddWaterQuick = () => {
    playGentleTap();
    const newCount = Math.min(routineState.waterCount + 1, 12);
    onUpdateRoutine({ waterCount: newCount });
    if (newCount === routineState.waterTarget) {
      playGentleChime();
      speakText('Wonderful! You reached 8 glasses of water today 💧', language);
    }
  };

  // Water & steps progress calculations
  const waterPct = Math.min(Math.round((routineState.waterCount / routineState.waterTarget) * 100), 100);
  const stepsPct = Math.min(Math.round((routineState.stepsCount / routineState.stepsTarget) * 100), 100);

  // Active unread notification preview
  const urgentNotification = notifications.find(n => !n.isRead) || notifications[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-32 space-y-7">
      {/* Gentle Notification Alert Banner (if any pending reminders) */}
      {urgentNotification && (
        <div
          onClick={() => {
            playGentleTap();
            onOpenNotifications();
          }}
          className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/70 transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-3xl shrink-0">{urgentNotification.icon}</span>
            <div className="min-w-0">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                Gentle Reminder
              </span>
              <p className="text-base sm:text-lg font-bold text-[#1C2421] truncate mt-0.5">
                {urgentNotification.title}
              </p>
              <p className="text-xs sm:text-sm text-[#4B5563] truncate">
                {urgentNotification.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#0D5C56] font-bold text-sm shrink-0">
            <span>View</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* ================= SECTION 1: MIND & MEMORY GAMES ================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D5C56]">
              {t.gamesTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] font-medium">
              {t.gamesSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Family Recognition Quiz */}
          <button
            onClick={() => {
              playGentleTap();
              onNavigateScreen('family-quiz');
            }}
            className="group min-touch-target p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#D4CBB5] hover:border-[#0D5C56] shadow-md hover:shadow-lg transition-all text-left flex items-start gap-4 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0 border-2 border-purple-200 group-hover:scale-105 transition-transform">
              <Users className="w-9 h-9" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
                Face & Memory
              </span>
              <h3 className="text-2xl font-bold text-[#1C2421] mt-1 group-hover:text-[#0D5C56] transition-colors">
                {t.familyQuizTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#4B5563] mt-1 leading-snug">
                {t.familyQuizDesc}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0D5C56]">
                <span>Play Now</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Card 2: Cultural Quiz */}
          <button
            onClick={() => {
              playGentleTap();
              onNavigateScreen('cultural-quiz');
            }}
            className="group min-touch-target p-5 sm:p-6 rounded-3xl bg-[#FFFDF9] border-3 border-[#D4CBB5] hover:border-[#0D5C56] shadow-md hover:shadow-lg transition-all text-left flex items-start gap-4 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-[#0D5C56] flex items-center justify-center shrink-0 border-2 border-teal-200 group-hover:scale-105 transition-transform">
              <Compass className="w-9 h-9" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D5C56] bg-teal-50 px-2 py-0.5 rounded-full">
                Bihu • Heritage • Assam
              </span>
              <h3 className="text-2xl font-bold text-[#1C2421] mt-1 group-hover:text-[#0D5C56] transition-colors">
                {t.culturalQuizTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#4B5563] mt-1 leading-snug">
                {t.culturalQuizDesc}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#0D5C56]">
                <span>Explore Quiz</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ================= SECTION 2: DAILY ROUTINE ================= */}
      <div className="bg-[#FFFDF9] border-3 border-[#D4CBB5] rounded-3xl p-5 sm:p-7 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5DEC9]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421]">
              {t.dailyRoutineTitle}
            </h2>
            <p className="text-sm text-[#4B5563]">
              {t.dailyRoutineSubtitle}
            </p>
          </div>

          <button
            onClick={() => {
              playGentleTap();
              onNavigateScreen('routine');
            }}
            className="min-touch-target px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] text-[#0D5C56] font-bold text-sm hover:bg-[#F2ECE1] cursor-pointer flex items-center gap-1"
          >
            <span>Full Routine</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Medicines Checklist */}
        <div className="space-y-3 mb-6">
          <div className="text-sm font-bold text-[#8C5036] uppercase tracking-wider">
            Medicines for Today
          </div>
          {medicines.map((med) => {
            const isTaken = med.taken;
            return (
              <div
                key={med.id}
                onClick={() => handleMedToggle(med.id)}
                className={`min-touch-target p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isTaken
                    ? 'bg-emerald-50/70 border-emerald-400'
                    : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] border-[#D4CBB5]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0D5C56] flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0D5C56] bg-teal-50 px-2 py-0.5 rounded-md">
                        {med.time}
                      </span>
                      {isTaken && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {t.taken}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#1C2421] truncate mt-0.5">
                      {med.name}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-all ${
                    isTaken
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-[#D4CBB5] bg-white text-transparent'
                  }`}
                >
                  <Check className={`w-6 h-6 stroke-[3] ${isTaken ? 'block' : 'opacity-0'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Hydration & Steps summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hydration Card */}
          <div className="bg-[#FAF7F2] border-2 border-[#E5DEC9] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-cyan-800 font-bold text-base">
                <Droplets className="w-5 h-5 text-cyan-600" />
                <span>Drinking Water</span>
              </div>
              <button
                onClick={handleAddWaterQuick}
                className="min-touch-target px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ 1 Glass</span>
              </button>
            </div>
            <div className="text-2xl font-extrabold text-[#0D5C56]">
              {routineState.waterCount} <span className="text-sm font-semibold text-[#4B5563]">/ {routineState.waterTarget} glasses</span>
            </div>
            <div className="w-full bg-white border border-[#E5DEC9] rounded-full h-3 overflow-hidden mt-2">
              <div
                className="bg-cyan-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>

          {/* Steps Card */}
          <div className="bg-[#FAF7F2] border-2 border-[#E5DEC9] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
                <Footprints className="w-5 h-5 text-amber-600" />
                <span>Gentle Steps</span>
              </div>
              <span className="text-xs font-semibold text-[#4B5563]">Garden & Veranda</span>
            </div>
            <div className="text-2xl font-extrabold text-[#8C5036]">
              {routineState.stepsCount.toLocaleString()} <span className="text-sm font-semibold text-[#4B5563]">/ {routineState.stepsTarget.toLocaleString()} steps</span>
            </div>
            <div className="w-full bg-white border border-[#E5DEC9] rounded-full h-3 overflow-hidden mt-2">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${stepsPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: FAMILY ALBUM PREVIEW ================= */}
      <div className="bg-[#FFFDF9] border-3 border-[#D4CBB5] rounded-3xl p-5 sm:p-7 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5DEC9]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Image className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421]">
                {t.familyAlbumTitle}
              </h2>
              <p className="text-sm text-[#4B5563]">
                {t.familyAlbumSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playGentleTap();
              onNavigateScreen('album');
            }}
            className="min-touch-target px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] text-[#0D5C56] font-bold text-sm hover:bg-[#F2ECE1] cursor-pointer flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Photos horizontal sneak peek */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {FAMILY_MEMBERS.slice(0, 3).map((member) => (
            <div
              key={member.id}
              onClick={() => {
                playGentleTap();
                onNavigateScreen('album');
              }}
              className="bg-[#FAF7F2] border-2 border-[#E5DEC9] rounded-2xl p-3 cursor-pointer hover:border-[#0D5C56] transition-all"
            >
              <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-200 border border-[#D4CBB5]">
                <img
                  src={member.photoPlaceholder}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2.5">
                <div className="text-lg font-bold text-[#1C2421] truncate">
                  {member.name}
                </div>
                <div className="text-xs font-semibold text-[#0D5C56] truncate">
                  {member.relationLocal[language] || member.relation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION 4: VOICE ASSISTANT BANNER ================= */}
      <div className="bg-gradient-to-r from-[#0D5C56] to-[#083E3A] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center shrink-0 animate-gentle-pulse">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.voiceAssistantTitle}
            </h3>
            <p className="text-sm sm:text-base text-teal-100 mt-1 max-w-md">
              {t.voiceAssistantSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playGentleTap();
            onOpenVoiceAssistant();
          }}
          className="min-touch-target px-8 py-4 rounded-2xl bg-white hover:bg-stone-100 text-[#0D5C56] font-extrabold text-xl shadow-lg border-2 border-white shrink-0 cursor-pointer transition-all active:scale-95"
        >
          {t.tapToTalk} 🎙️
        </button>
      </div>
    </div>
  );
}
