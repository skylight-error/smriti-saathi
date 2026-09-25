import React from 'react';
import { LANGUAGES, TRANSLATIONS } from '../data/i18n';
import { playGentleTap, playGentleChime } from '../utils/sound';
import { Check, Heart } from 'lucide-react';

export default function LanguageSelect({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
  isModalMode = false,
  onCloseModal
}) {
  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const handleLanguagePick = (langId) => {
    playGentleTap();
    onSelectLanguage(langId);
  };

  const handleProceed = () => {
    playGentleChime();
    if (isModalMode && onCloseModal) {
      onCloseModal();
    } else {
      onContinue();
    }
  };

  return (
    <div className={`min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 max-w-xl mx-auto ${isModalMode ? 'p-2' : ''}`}>
      {/* App Branding & Welcome Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E6F3F1] border-2 border-[#0D5C56]/30 mb-4 shadow-sm">
          <span className="text-4xl" role="img" aria-label="blossom">🌸</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D5C56] tracking-tight">
          {t.appName}
        </h1>
        <p className="text-lg sm:text-xl text-[#8C5036] font-semibold mt-2 px-2">
          {t.appTagline}
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DEC9] text-sm text-[#4B5563]">
          <Heart className="w-4 h-4 text-[#9B4B28] fill-[#9B4B28]" />
          <span>Dementia-Friendly Senior Care • North East India</span>
        </div>
      </div>

      {/* Main Instruction Prompt */}
      <div className="w-full bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-6 sm:p-8 shadow-md">
        <h2 className="text-2xl sm:text-2xl font-bold text-[#1C2421] text-center mb-2">
          {t.chooseLanguage}
        </h2>
        <p className="text-base sm:text-lg text-[#4B5563] text-center mb-6">
          {t.chooseLanguageSubtitle}
        </p>

        {/* 6 Large Native Script Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleLanguagePick(lang.id)}
                className={`min-touch-target flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#0D5C56] text-white border-[#0D5C56] shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#1C2421] border-[#D4CBB5]'
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className={`text-2xl font-bold tracking-normal ${isSelected ? 'text-white' : 'text-[#0D5C56]'}`}>
                    {lang.name}
                  </div>
                  <div className={`text-sm font-medium mt-0.5 ${isSelected ? 'text-teal-100' : 'text-[#4B5563]'}`}>
                    {lang.englishName} • <span className="opacity-90">{lang.region}</span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ml-2 ${
                    isSelected
                      ? 'bg-white text-[#0D5C56] border-white'
                      : 'border-[#D4CBB5] bg-white text-transparent'
                  }`}
                >
                  {isSelected && <Check className="w-5 h-5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Big Continue / Start Button */}
        <button
          onClick={handleProceed}
          className="min-touch-target w-full py-4 px-6 rounded-2xl bg-[#0D5C56] hover:bg-[#083E3A] active:scale-98 text-white font-bold text-xl shadow-lg border-2 border-[#0D5C56] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>{isModalMode ? 'Confirm Language' : t.continue}</span>
          <span className="text-2xl">→</span>
        </button>
      </div>
    </div>
  );
}
