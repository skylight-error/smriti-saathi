import React from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { playGentleChime, playGentleTap } from '../utils/sound';
import { speakText } from '../utils/speech';
import { Check, Plus, Minus, ArrowLeft, Footprints, Droplets, Pill, Sparkles, Heart } from 'lucide-react';

export default function DailyRoutineScreen({
  language,
  medicines,
  onToggleMedicine,
  routineState,
  onUpdateRoutine,
  onBackToHome
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleMedicineToggle = (medId) => {
    const med = medicines.find(m => m.id === medId);
    if (!med) return;
    const willBeTaken = !med.taken;
    if (willBeTaken) {
      playGentleChime();
      speakText(`${med.name} marked as taken. Well done!`, language);
    } else {
      playGentleTap();
    }
    onToggleMedicine(medId);
  };

  const handleAddWater = () => {
    playGentleTap();
    const newCount = Math.min(routineState.waterCount + 1, 12);
    onUpdateRoutine({ waterCount: newCount });
    if (newCount === routineState.waterTarget) {
      playGentleChime();
      speakText('Wonderful! You reached your 8 glasses of water today 💧', language);
    }
  };

  const handleRemoveWater = () => {
    playGentleTap();
    const newCount = Math.max(routineState.waterCount - 1, 0);
    onUpdateRoutine({ waterCount: newCount });
  };

  const handleAddWalkSteps = () => {
    playGentleChime();
    const newSteps = routineState.stepsCount + 200;
    onUpdateRoutine({ stepsCount: newSteps });
    speakText('Added 200 steps from your garden walk! 🌿', language);
  };

  const handleToggleGame = () => {
    playGentleChime();
    onUpdateRoutine({ gamePlayed: !routineState.gamePlayed });
  };

  // Water percentage
  const waterPct = Math.min(Math.round((routineState.waterCount / routineState.waterTarget) * 100), 100);
  // Steps percentage
  const stepsPct = Math.min(Math.round((routineState.stepsCount / routineState.stepsTarget) * 100), 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      {/* Top Header with Return to Home */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => {
            playGentleTap();
            onBackToHome();
          }}
          className="min-touch-target flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#0D5C56] font-bold text-base hover:bg-[#F2ECE1] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>{t.backToHome}</span>
        </button>

        <div className="text-right">
          <span className="text-sm font-bold text-[#8C5036]">
            {t.routineChecklist}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* ================= 1. MEDICINES SCHEDULE ================= */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E5DEC9]">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F3F1] text-[#0D5C56] flex items-center justify-center">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1C2421]">
                {t.medicinesHeader}
              </h2>
              <p className="text-sm text-[#4B5563]">
                Scheduled with love by your caregiver
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {medicines.map((med) => {
              const isTaken = med.taken;
              return (
                <div
                  key={med.id}
                  onClick={() => handleMedicineToggle(med.id)}
                  className={`min-touch-target p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isTaken
                      ? 'bg-emerald-50/70 border-emerald-400'
                      : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] border-[#D4CBB5]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 text-[#0D5C56] font-bold text-xs uppercase tracking-wider">
                        {med.time}
                      </span>
                      {isTaken && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {t.taken}
                        </span>
                      )}
                    </div>
                    {/* Notice: No strikethrough styling! Dementia-friendly positive affirmation */}
                    <div className="text-xl font-bold text-[#1C2421] mt-1">
                      {med.name}
                    </div>
                    <div className="text-sm text-[#4B5563] mt-0.5">
                      {med.dosageLocal[language] || med.dosage}
                    </div>
                  </div>

                  {/* 56px+ Touch Target Checkbox */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-all ${
                      isTaken
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-[#D4CBB5] bg-white text-transparent'
                    }`}
                  >
                    <Check className={`w-7 h-7 stroke-[3] ${isTaken ? 'block' : 'opacity-0'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 2. HYDRATION (WATER COUNTER) ================= */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E5DEC9]">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplets className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-[#1C2421]">
                {t.hydrationHeader}
              </h2>
              <div className="text-sm text-[#4B5563]">
                {t.targetGlasses} • Fresh, clean water
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
            <div className="text-center sm:text-left">
              <div className="text-4xl font-extrabold text-[#0D5C56]">
                {routineState.waterCount} <span className="text-2xl font-semibold text-[#4B5563]">/ {routineState.waterTarget}</span>
              </div>
              <div className="text-base text-[#4B5563] font-medium mt-1">
                {t.glassesCount}
              </div>
            </div>

            {/* Stepper Buttons (56px+ touch target) */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRemoveWater}
                disabled={routineState.waterCount === 0}
                className="min-touch-target w-14 h-14 rounded-2xl bg-white border-2 border-[#D4CBB5] hover:bg-[#F2ECE1] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#1C2421] text-2xl font-bold cursor-pointer"
                title={t.removeGlass}
              >
                <Minus className="w-6 h-6 stroke-[3]" />
              </button>

              <button
                onClick={handleAddWater}
                className="min-touch-target px-6 h-14 rounded-2xl bg-[#0D5C56] hover:bg-[#083E3A] active:scale-98 text-white font-extrabold text-lg flex items-center gap-2 shadow-sm cursor-pointer"
                title={t.addGlass}
              >
                <Plus className="w-6 h-6 stroke-[3]" />
                <span>{t.addGlass}</span>
              </button>
            </div>
          </div>

          {/* Gentle Progress Bar */}
          <div className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-full h-4 overflow-hidden mt-3">
            <div
              className="bg-cyan-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${waterPct}%` }}
            />
          </div>
        </div>

        {/* ================= 3. STEPS TRACKER ================= */}
        <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E5DEC9]">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Footprints className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-[#1C2421]">
                {t.stepsHeader}
              </h2>
              <div className="text-sm text-[#4B5563]">
                {t.targetSteps}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-3">
            <div>
              <div className="text-4xl font-extrabold text-[#8C5036]">
                {routineState.stepsCount.toLocaleString()} <span className="text-2xl font-semibold text-[#4B5563]">/ {routineState.stepsTarget.toLocaleString()}</span>
              </div>
              <div className="text-sm text-[#4B5563] mt-1">
                Gentle pacing throughout the morning and afternoon
              </div>
            </div>

            <button
              onClick={handleAddWalkSteps}
              className="min-touch-target px-5 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border-2 border-[#D4CBB5] text-[#8C5036] font-bold text-base flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-5 h-5 text-[#9B4B28]" />
              <span>{t.addStepsWalk}</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#FAF7F2] border border-[#E5DEC9] rounded-full h-4 overflow-hidden mt-2">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${stepsPct}%` }}
            />
          </div>
        </div>

        {/* ================= 4. GAME PLAYED CHECK ================= */}
        <div
          onClick={handleToggleGame}
          className={`min-touch-target p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-md ${
            routineState.gamePlayed
              ? 'bg-emerald-50/70 border-emerald-400'
              : 'bg-[#FFFDF9] border-[#D4CBB5] hover:bg-[#F2ECE1]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#1C2421]">
                {t.gameCompletedStatus}
              </div>
              <div className="text-sm text-[#4B5563]">
                {routineState.gamePlayed
                  ? 'Completed today! Your mind is active and smiling.'
                  : 'Play a quick Family or Cultural Quiz today'}
              </div>
            </div>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
              routineState.gamePlayed
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-[#D4CBB5] bg-white text-transparent'
            }`}
          >
            <Check className={`w-7 h-7 stroke-[3] ${routineState.gamePlayed ? 'block' : 'opacity-0'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
