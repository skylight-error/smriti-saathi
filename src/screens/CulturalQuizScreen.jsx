import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { CULTURAL_CATEGORIES, CULTURAL_QUESTIONS } from '../data/culturalQuestions';
import { playGentleChime, playGentleTap, playGentleTryAgain } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';
import { ArrowLeft, Volume2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function CulturalQuizScreen({
  language,
  onBackToHome,
  onMarkGamePlayed
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answeredState, setAnsweredState] = useState(null); // 'correct', 'retry'
  const [score, setScore] = useState(0);

  // Filter questions based on selected category
  const filteredQuestions = activeCategory === 'all'
    ? CULTURAL_QUESTIONS
    : CULTURAL_QUESTIONS.filter(q => q.category === activeCategory);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0] || CULTURAL_QUESTIONS[0];

  const handleCategoryChange = (catId) => {
    playGentleTap();
    setActiveCategory(catId);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnsweredState(null);
  };

  const handleSelectOption = (option) => {
    playGentleTap();
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      playGentleChime();
      setAnsweredState('correct');
      setScore(prev => prev + 1);
      onMarkGamePlayed(); // Auto-tick daily routine

      speakText(`${t.correctAnswerBadge}. ${currentQ.funFact}`, language);
    } else {
      playGentleTryAgain();
      setAnsweredState('retry');
      speakText(t.tryAgainGentle, language);
    }
  };

  const handleNext = () => {
    playGentleTap();
    stopSpeaking();
    setSelectedOptionId(null);
    setAnsweredState(null);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handleReadQuestion = () => {
    playGentleTap();
    const qText = (currentQ.questionLocal && currentQ.questionLocal[language]) || currentQ.question;
    speakText(qText, language);
  };

  const activeQuestionText = (currentQ.questionLocal && currentQ.questionLocal[language]) || currentQ.question;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => {
            playGentleTap();
            stopSpeaking();
            onBackToHome();
          }}
          className="min-touch-target flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#0D5C56] font-bold text-base hover:bg-[#F2ECE1] cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>{t.backToHome}</span>
        </button>

        {/* Score tracker */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#E6F3F1] border border-[#0D5C56]/30 text-[#0D5C56] font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>{score} Stars</span>
        </div>
      </div>

      {/* Category Pills Slider / Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {CULTURAL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`min-touch-target shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-sm sm:text-base border-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0D5C56] text-white border-[#0D5C56] shadow-xs'
                  : 'bg-white text-[#4B5563] border-[#D4CBB5] hover:bg-[#F2ECE1]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Cultural Question Card */}
      <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-6 sm:p-8 shadow-md">
        {/* Category Chip Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E6F3F1] text-[#0D5C56] font-extrabold text-sm border border-[#0D5C56]/20">
            <span>{currentQ.badgeIcon}</span>
            <span>{currentQ.categoryLabel}</span>
          </span>

          <span className="text-sm font-semibold text-[#8C5036]">
            {currentIndex + 1} of {filteredQuestions.length}
          </span>
        </div>

        {/* Large Centered Question */}
        <div className="my-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421] leading-relaxed">
            "{activeQuestionText}"
          </h2>

          {/* Voice Read Question Button */}
          <button
            onClick={handleReadQuestion}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#D4CBB5] text-[#0D5C56] font-bold text-sm hover:bg-[#F2ECE1] cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read Question</span>
          </button>
        </div>

        {/* Vertically Stacked Large Answer Option Bars (Full-Width Rounded Rectangles) */}
        <div className="space-y-3.5 my-6">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;
            const showSuccess = isSelected && isCorrect;
            const showRetry = isSelected && !isCorrect && answeredState === 'retry';

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className={`min-touch-target w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  showSuccess
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                    : showRetry
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] border-[#D4CBB5]'
                }`}
              >
                <span className="text-xl sm:text-2xl font-bold text-[#1C2421]">
                  {option.text}
                </span>

                {showSuccess ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0 ml-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{t.correctAnswerBadge}</span>
                  </span>
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Fun Fact / Encouragement after correct answer */}
        {answeredState === 'correct' && (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center mb-6">
            <div className="inline-flex items-center gap-2 text-emerald-800 font-extrabold text-xl">
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span>{t.correctAnswerBadge}</span>
            </div>
            <p className="text-base sm:text-lg text-emerald-900 mt-2 font-medium">
              {currentQ.funFact}
            </p>

            <button
              onClick={handleNext}
              className="mt-4 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <span>{t.nextQuestion}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {answeredState === 'retry' && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center mb-6">
            <p className="text-lg font-bold text-amber-900">
              {t.tryAgainGentle}
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Give it another gentle thought! 🌿
            </p>
          </div>
        )}

        {/* Bottom Navigation between questions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5DEC9]">
          <span className="text-sm text-[#4B5563] font-medium">
            Assam & North East Traditions
          </span>

          <button
            onClick={handleNext}
            className="min-touch-target px-5 py-2.5 rounded-2xl bg-[#0D5C56] text-white font-bold text-base hover:bg-[#083E3A] cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t.nextQuestion}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
