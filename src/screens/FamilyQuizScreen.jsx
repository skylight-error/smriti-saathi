import React, { useState, useEffect } from 'react';
// other imports below...
import { TRANSLATIONS } from '../data/i18n';

import { FAMILY_MEMBERS, FAMILY_QUIZ_QUESTIONS } from '../data/familyMembers';
import { playGentleChime, playGentleTap, playGentleTryAgain } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';
import { Volume2, ArrowLeft, CheckCircle2, Heart, RotateCcw, SkipForward, HelpCircle, Sparkles } from 'lucide-react';

export default function FamilyQuizScreen({
  language,
  onBackToHome,
  onMarkGamePlayed
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [status, setStatus] = useState(null); // 'correct', 'retry', 'assisted'
  const [smilesCount, setSmilesCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [hintsCount, setHintsCount] = useState(0);
  const [gameStartTime] = useState(Date.now()); 
  const [backendQuestions, setBackendQuestions] = useState([]);

  useEffect(() => {
  fetch('http://127.0.0.1:5000/api/patients/1/personalized-questions')
    .then((response) => response.json())
    .then((data) => {
      console.log('Backend questions:', data);
      setBackendQuestions(data.data || []);
    })
    .catch((error) => {
      console.error('Backend connection error:', error);
    });
}, []);

  const currentQ = FAMILY_QUIZ_QUESTIONS[currentIndex] || FAMILY_QUIZ_QUESTIONS[0];
  const targetMember = FAMILY_MEMBERS.find(m => m.id === currentQ.targetMemberId) || FAMILY_MEMBERS[0];

  const backendAnswer = backendQuestions[0]?.correct_answer;

const backendOptions = backendAnswer
  ? FAMILY_MEMBERS.slice(0, 3).map((member) => ({
      ...member,
      isCorrect: member.name === backendAnswer
    }))
  : [];
  const handleSelectOption = (option) => {
    playGentleTap();
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      playGentleChime();
      setStatus('correct');
      setSmilesCount(prev => prev + 1);
      onMarkGamePlayed(); // Auto-tick daily routine game requirement!

      // Speak encouraging confirmation
      speakText(`${t.correctChoice}. This is ${option.name}, your loving ${option.relation}.`, language);
    } else {
      playGentleTryAgain();
      setMistakesCount(prev => prev + 1);
      setStatus('retry');
      speakText(t.tryAgainGentle, language);
    }
  };

  const handleNext = () => {
  playGentleTap();
  stopSpeaking();
  

  const isLastQuestion =
    currentIndex === FAMILY_QUIZ_QUESTIONS.length - 1;

  if (isLastQuestion) {
    sendGameResult();
  }

  setStatus(null);
  setSelectedOptionId(null);
  setCurrentIndex((prev) => (prev + 1) % FAMILY_QUIZ_QUESTIONS.length);
};

  const sendGameResult = async () => {
  const completionTime = Math.max(
    1,
    Math.round((Date.now() - gameStartTime) / 1000)
  );


  const totalQuestions = FAMILY_QUIZ_QUESTIONS.length;

const accuracy =
  totalQuestions > 0
    ? Math.round((smilesCount / totalQuestions) * 100)
    : 0;

  const resultData = {
    patient_id: 1,
    game: 'family_quiz',
    accuracy: accuracy,
    mistakes: mistakesCount,
    completion_time: completionTime,
    hints: hintsCount,
    difficulty: 'easy'
  };
  
  try {
    const response = await fetch(
      'http://127.0.0.1:5000/api/game-results',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resultData)
      }
    );

    const data = await response.json();
    if (!response.ok) {
  throw new Error(data.message || 'Failed to save game result');
}
    console.log('Game result saved:', data);
  } catch (error) {
    console.error('Game result save error:', error);
  }
};

  const handleIDontKnow = () => {
    playGentleTap();
    setStatus('assisted');
    setHintsCount(prev => prev + 1);

    const relationDesc = targetMember.relationLocal[language] || targetMember.relation;
    speakText(`${t.iDontKnowComfort}. ${targetMember.name}, ${relationDesc}.`, language);
  };

  const handleRepeat = () => {
    playGentleTap();
    speakText(`${t.whoIsThis}? ${currentQ.questionPrompt}`, language);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      {/* Top Header Bar with Prominent Return to Home */}
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

        {/* Smiles Badge */}
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#E6F3F1] border border-[#0D5C56]/30 text-[#0D5C56] font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>{smilesCount} Smiles</span>
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-6 sm:p-8 shadow-md">
        {/* Header Title & Category */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F3F1] text-[#0D5C56] text-sm font-bold mb-2">
            <Heart className="w-4 h-4 text-[#9B4B28] fill-[#9B4B28]" />
            <span>{t.familyQuizHeader}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2421]">
            {t.whoIsThis}
          </h2>
          {backendQuestions.length > 0 && (
  <p className="text-xl font-bold text-[#0D5C56] mt-3">
    {backendQuestions[0].question}
  </p>
)}

          <p className="text-base sm:text-lg text-[#4B5563] mt-1">
            Question {currentIndex + 1} of {FAMILY_QUIZ_QUESTIONS.length}
          </p>
        </div>

        {/* Family Member Portrait / Memory Card */}
        <div className="flex flex-col items-center my-6">
          <div className="relative group">
            <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 ${targetMember.ringColor} shadow-md bg-stone-100 flex items-center justify-center`}>
              <img
                src={targetMember.photoPlaceholder}
                alt={targetMember.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            {/* Audio Button on photo */}
            <button
              onClick={handleRepeat}
              className="absolute -bottom-2 -right-2 p-3 rounded-full bg-[#0D5C56] text-white shadow-md hover:bg-[#083E3A] cursor-pointer"
              title="Hear description aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-center text-sm sm:text-base text-[#8C5036] font-medium mt-3 max-w-md italic px-4">
            "{targetMember.memoryCaptionLocal[language] || targetMember.memoryCaption}"
          </p>
        </div>

        {/* 3 Large Dementia-Friendly Option Cards */}
        <div className="space-y-3.5 my-6">
          {(backendOptions.length > 0 ? backendOptions : currentQ.options).map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectAnswer = option.isCorrect;
            const showSuccess = isSelected && isCorrectAnswer;
            const showRetry = isSelected && !isCorrectAnswer && status === 'retry';

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                className={`min-touch-target w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  showSuccess
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                    : showRetry
                    ? 'bg-amber-50/70 border-amber-400'
                    : 'bg-[#FAF7F2] hover:bg-[#F2ECE1] border-[#D4CBB5]'
                }`}
              >
                {/* Circular Avatar Icon with Person Silhouette (Colors: Purple, Teal, Brown, etc.) */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-xs ${option.avatarColor} text-white font-bold text-xl`}
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-[#1C2421] truncate">
                    {option.name}
                  </div>
                  
                </div>

                {showSuccess && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-sm shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Correct</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Status Messages — Encouraging & Forgiving */}
        {status === 'correct' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center mb-6">
            <p className="text-xl font-extrabold text-emerald-800">
              {t.correctChoice}
            </p>
            <p className="text-base text-emerald-700 mt-1">
              You recognized {targetMember.name} beautifully! 🌸
            </p>
            <button
              onClick={handleNext}
              className="mt-4 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-lg cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              <span>{t.skipQuestion}</span>
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'retry' && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center mb-6">
            <p className="text-lg font-bold text-amber-900">
              {t.tryAgainGentle}
            </p>
            <p className="text-sm text-amber-800 mt-0.5">
              Take all the time you need, there is no hurry. 🌿
            </p>
          </div>
        )}

        {status === 'assisted' && (
          <div className="p-5 rounded-2xl bg-[#E6F3F1] border-2 border-[#0D5C56]/30 text-center mb-6">
            <p className="text-lg font-bold text-[#0D5C56]">
              {t.iDontKnowComfort}
            </p>
            <p className="text-xl font-extrabold text-[#1C2421] mt-2">
              {targetMember.name}
            </p>
            <p className="text-base text-[#8C5036] font-semibold">
              {targetMember.relationLocal[language] || targetMember.relation}
            </p>
            <button
              onClick={handleNext}
              className="mt-4 px-6 py-3 rounded-2xl bg-[#0D5C56] text-white font-bold text-base cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t.skipQuestion}</span>
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Controls: Repeat / Skip / "I don't know" */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5DEC9]">
          <button
            onClick={handleRepeat}
            className="min-touch-target flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] text-[#0D5C56] font-bold text-xs sm:text-sm hover:bg-[#F2ECE1] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.repeatQuestion}</span>
          </button>

          <button
            onClick={handleIDontKnow}
            className="min-touch-target flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] text-[#8C5036] font-bold text-xs sm:text-sm hover:bg-[#F2ECE1] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.iDontKnow}</span>
          </button>

          <button
            onClick={handleNext}
            className="min-touch-target flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] text-[#1C2421] font-bold text-xs sm:text-sm hover:bg-[#F2ECE1] cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            <span>{t.skipQuestion}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
