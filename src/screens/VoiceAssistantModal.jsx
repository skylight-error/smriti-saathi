import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { playGentleTap } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';
import { Mic, MicOff, Send, X, Sparkles, Volume2 } from 'lucide-react';
import BreathingWidget from '../components/BreathingWidget';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  language,
  patient,
  medicines,
  routineState,
  onNavigateScreen
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [state, setState] = useState('idle'); // 'idle', 'listening', 'thinking', 'speaking'
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [speechSupported] = useState(() => typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window));

  const recognitionRef = useRef(null);

  // Fallback responses rotating through 5 varied gentle phrases (as required by prompt)
  const FALLBACK_RESPONSES = [
    {
      en: `I am here right beside you, ${patient.name || 'Friend'}. Let's take a calm breath together or look at photos of Ananya and Aarav.`,
      as: `মই আপোনাৰ ওচৰতেই আছোঁ, ${patient.name || 'দেউতা'}। আহক আমি শান্ত মনেৰে অলপ জিৰণি লওঁ বা অনন্যা আৰু আৰভৰ ফটো চাওঁ।`,
      hi: `मैं आपके साथ ही हूँ, ${patient.name || 'जी'}। आइए हम शांत मन से बैठें या अनन्य और आरव की सुंदर तस्वीरें देखें।`,
      bn: `আমি আপনার পাশেই আছি। আসুন আমরা শান্তভাবে একটু বসি বা অনন্যার মিষ্টি ছবিগুলো দেখি।`
    },
    {
      en: `That is a lovely thought. The afternoon is peaceful. Would you like me to guide you to today's Cultural Quiz?`,
      as: `বৰ সুন্দৰ কথা। আজিৰ দিনটো বৰ শান্ত। আপুনি উত্তৰ-পূবৰ কৃষ্টি কুইজটো খেলিব বিচাৰিব নেকি?`,
      hi: `यह बहुत अच्छी बात है। दिन बहुत सुहावना है। क्या आप पूर्वोत्तर की कोई ज्ञान पहेली खेलना चाहेंगे?`,
      bn: `দারুণ কথা। আজকের দিনটি খুব সুন্দর। আপনি কি আমাদের সংস্কৃতি কুইজ খেলতে চান?`
    },
    {
      en: `Your words bring warmth to my heart. How about sipping a glass of fresh water and listening to some gentle music?`,
      as: `আপোনাৰ কথা শুনি মনটো ভাল লাগিল। অলপ পানী এক গিলাচ খাই জুৰ ল’ব নেকি?`,
      hi: `आपकी बातें सुनकर बहुत सुकून मिला। एक गिलास ताज़ा पानी पीजिए और आराम कीजिए।`,
      bn: `আপনার কথা শুনে ভালো লাগলো। এক গ্লাস পরিষ্কার জল খেয়ে একটু বিশ্রাম নিন।`
    },
    {
      en: `I may not have understood every word, but I am always listening with care. Would you like to check your daily routine?`,
      as: `মই সকলো কথা হয়তো স্পষ্টকৈ বুজি পোৱা নাই, কিন্তু মৰমেৰে সদায় শুনি আছোঁ। আপোনাৰ নিয়মবোৰ এবাৰ চাওঁ নেকি?`,
      hi: `मैं हर बात पूरी तरह नहीं समझ सका, पर प्यार से सुन रहा हूँ। क्या आप अपनी दिनचर्या देखना चाहेंगे?`,
      bn: `সব কথা হয়তো ধরতে পারিনি, তবে আমি মনোযোগ দিয়ে শুনছি। আপনার প্রতিদিনের রুটিন দেখবেন?`
    },
    {
      en: `You are safe, loved, and cared for. Ananya is always keeping an eye on your comfort.`,
      as: `আপুনি একেবাৰে সুৰক্ষিত আৰু আদৰত আছে। অনন্যাই আপোনাৰ সকলো যত্ন লৈ আছে।`,
      hi: `आप पूरी तरह सुरक्षित हैं। अनन्या आपके स्वास्थ्य और सुख का पूरा ध्यान रख रही है।`,
      bn: `আপনি নিশ্চিন্তে থাকুন। অনন্যা সবসময় আপনার যত্ন রাখছে।`
    }
  ];

  // Safe, routine-aware, dementia-friendly intelligence logic
  const processUserInput = (input) => {
    setState('thinking');
    const lower = input.toLowerCase();

    setTimeout(() => {
      let reply = '';
      let isBreathingSuggested = false;

      // 1. Strict Medical Boundary Guardrail: NEVER give medical diagnosis or dosage advice!
      if (
        lower.includes('dose') ||
        lower.includes('dosage') ||
        lower.includes('increase') ||
        lower.includes('decrease') ||
        lower.includes('pain') ||
        lower.includes('chest') ||
        lower.includes('fever') ||
        lower.includes('doctor') ||
        lower.includes('prescribe') ||
        lower.includes('দৰৱ বঢ়াম') ||
        lower.includes('ডাক্তৰ') ||
        lower.includes('ঔষধের মাত্রা')
      ) {
        reply = language === 'as'
          ? 'মই আপোনাক বৰ ভাল পাওঁ, কিন্তু কোনো দৰৱৰ মাত্ৰা বা চিকিৎসাৰ পৰামৰ্শ মই দিব নোৱাৰোঁ। অনুগ্ৰহ কৰি আপোনাৰ কন্যা অনন্যা (+91 98640 12345) বা চিকিৎসকৰ সৈতে কথা পাতক।'
          : 'I care deeply about your health, but I cannot give medical advice or change dosages. Please speak with your primary caregiver Ananya (+91 98640 12345) or your family doctor.';
      }

      // 2. Aware of Daily Routine — Medicines
      else if (
        lower.includes('medicine') ||
        lower.includes('medication') ||
        lower.includes('pill') ||
        lower.includes('দৰৱ') ||
        lower.includes('দাওয়াই') ||
        lower.includes('दवाई') ||
        lower.includes('ওষুধ')
      ) {
        const morningMed = medicines.find(m => m.id === 'med-morning');
        
        if (morningMed && morningMed.taken) {
          reply = language === 'as'
            ? `আপুনি পুৱা ৮ বজাৰ দৰৱ খাইছে। দুপৰীয়া ১:৩০ বজাত আপোনাৰ ভিটামিন লোৱাৰ সময় হ’ব।`
            : `Yes! You already took your 8:00 AM Morning Medicine. Your next medicine is Calcium & Vitamin D3 scheduled at 1:30 PM after lunch.`;
        } else {
          reply = language === 'as'
            ? `আপোনাৰ পুৱাৰ দৰৱ খোৱা হোৱা নাই। অনুগ্ৰহ কৰি এগিলাচ কুহুমীয়া পানীৰে এতিয়াই খাই লওক।`
            : `Your morning medicine is still waiting. Please take 1 tablet with warm water after your breakfast.`;
        }
      }

      // 3. Aware of Daily Routine — Hydration & Water
      else if (
        lower.includes('water') ||
        lower.includes('drink') ||
        lower.includes('hydrat') ||
        lower.includes('পানী') ||
        lower.includes('জল') ||
        lower.includes('पानी')
      ) {
        reply = language === 'as'
          ? `আজি আপুনি ${routineState.waterCount} গিলাচ পানী খাইছে। ৮ গিলাচৰ লক্ষ্য পূৰণ হ’বলৈ আৰু অলপ বাকী আছে। একাপ পানী খাই লওক 💧`
          : `You have enjoyed ${routineState.waterCount} out of 8 glasses of water today. Drinking one more fresh glass will keep you energized! 💧`;
      }

      // 4. Cultural facts / Festival
      else if (
        lower.includes('festival') ||
        lower.includes('bihu') ||
        lower.includes('আজ কি উৎসব') ||
        lower.includes('আজি কি উৎসৱ') ||
        lower.includes('त्योहार') ||
        lower.includes('উৎসৱ') ||
        lower.includes('উৎসব')
      ) {
        reply = language === 'as'
          ? 'আমাৰ ৰঙালী বিহু বসন্তৰ আগমন আৰু অসমীয়া নৱবৰ্ষৰ উৎসৱ! ঢোল, পেঁপা আৰু কুলিৰ মাতত সমগ্ৰ প্ৰকৃতি আনন্দময় হৈ পৰে।'
          : 'Rongali Bihu is Assam\'s joyous spring festival welcoming the new year with dhol beats, pepa music, and fresh Kopou orchids blooming in the valleys.';
      }

      // 5. Anxious, sad, or lonely feelings -> Calming comfort & breathing exercise
      else if (
        lower.includes('anxious') ||
        lower.includes('sad') ||
        lower.includes('lonely') ||
        lower.includes('fear') ||
        lower.includes('worried') ||
        lower.includes('scared') ||
        lower.includes('মন বেয়া') ||
        lower.includes('অস্থিৰ') ||
        lower.includes('ভয়') ||
        lower.includes('घबराहट') ||
        lower.includes('उदास')
      ) {
        reply = language === 'as'
          ? 'শান্ত হওক দেউতা, আপোনাৰ ওচৰত অনন্যা আৰু সকলো পৰিয়াল আছে। আপুনি নিৰাপদ। আহক আমি শান্ত মনে ৪ চেকেণ্ড উশাহ লওঁ আৰু এৰি দিওঁ।'
          : 'Please rest easy. You are completely safe and surrounded by love. Ananya is just a call away. Let us do a gentle calming breathing exercise together.';
        isBreathingSuggested = true;
      }

      // 6. Navigation to Games
      else if (
        lower.includes('game') ||
        lower.includes('quiz') ||
        lower.includes('play') ||
        lower.includes('খেল') ||
        lower.includes('খেলা')
      ) {
        reply = language === 'as'
          ? 'বৰ ভাল কথা! আহক আমি পৰিয়ালৰ চিনাকি কুইজ খেলোঁ।'
          : 'Wonderful idea! Let us open the Family Recognition Quiz now.';
        setTimeout(() => {
          onClose();
          onNavigateScreen('family-quiz');
        }, 2000);
      }

      // 7. Rotating 4-5 varied gentle fallback responses
      else {
        const fallbackSet = FALLBACK_RESPONSES[fallbackIndex % FALLBACK_RESPONSES.length];
        reply = fallbackSet[language] || fallbackSet.en;
        setFallbackIndex(prev => prev + 1);
      }

      setAssistantResponse(reply);
      setState('speaking');
      if (isBreathingSuggested) {
        setShowBreathing(true);
      }

      speakText(reply, language, () => {
        setState('idle');
      });
    }, 1000);
  };

  // Initialize SpeechRecognition if available in the browser
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'as' ? 'as-IN' : language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';

      recognition.onstart = () => {
        setState('listening');
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processUserInput(text);
      };

      recognition.onerror = () => {
        setState('idle');
      };

      recognition.onend = () => {
        setState((current) => (current === 'listening' ? 'idle' : current));
      };

      recognitionRef.current = recognition;
    }

    // Greet user when opened
    const welcome = language === 'as' 
      ? `নমস্কাৰ ${patient.name || 'দেউতা'}, মই আপোনাৰ স্মৃতিসাথী। কিবা ক’ব নেকি?`
      : `Namaste ${patient.name || 'Friend'}, I am your Smritisathi voice companion. How are you feeling today?`;
    setAssistantResponse(welcome);
    speakText(welcome, language, () => setState('idle'));
    setState('speaking');

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    playGentleTap();
    stopSpeaking();
    setShowBreathing(false);

    if (recognitionRef.current && speechSupported) {
      try {
        recognitionRef.current.start();
        setState('listening');
        return;
      } catch {
        // Fallback to simulated prompt
      }
    }

    // Simulated listening experience
    setState('listening');
    setTimeout(() => {
      setState('thinking');
      setTimeout(() => {
        processUserInput(t.quickMedicine);
      }, 1200);
    }, 1800);
  };

  const handleStopListening = () => {
    playGentleTap();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setState('idle');
  };

  const handleQuickPrompt = (promptText) => {
    playGentleTap();
    setTranscript(promptText);
    processUserInput(promptText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] border-3 border-[#D4CBB5] rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5DEC9]">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0D5C56] text-white flex items-center justify-center shadow-xs">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-[#0D5C56]">
                {t.voiceAssistantTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#8C5036] font-medium">
                Your gentle, caring companion
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playGentleTap();
              stopSpeaking();
              onClose();
            }}
            className="min-touch-target w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] flex items-center justify-center text-[#4B5563] hover:text-[#1C2421] cursor-pointer"
            aria-label="Close voice assistant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Central Pulsing Animated Voice Orb */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48">
            {/* Outer animated rings */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 ${
                state === 'listening'
                  ? 'bg-red-500/20 scale-125 animate-ping'
                  : state === 'speaking'
                  ? 'bg-amber-500/20 scale-115 animate-gentle-pulse'
                  : state === 'thinking'
                  ? 'bg-purple-500/20 scale-110 animate-pulse'
                  : 'bg-teal-600/10'
              }`}
            />

            {/* Inner Core Mic Button */}
            <button
              onClick={state === 'listening' ? handleStopListening : handleStartListening}
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center shadow-xl border-4 transition-all cursor-pointer ${
                state === 'listening'
                  ? 'bg-red-600 border-red-200 text-white animate-pulse'
                  : state === 'speaking'
                  ? 'bg-[#0D5C56] border-emerald-200 text-white ring-4 ring-[#0D5C56]/30'
                  : state === 'thinking'
                  ? 'bg-[#8C5036] border-amber-200 text-white'
                  : 'bg-[#0D5C56] hover:bg-[#083E3A] border-white text-white'
              }`}
              title={state === 'listening' ? t.tapToStop : t.tapToTalk}
            >
              {state === 'listening' ? (
                <>
                  <MicOff className="w-10 h-10 mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10 mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {state === 'speaking' ? 'Speaking' : state === 'thinking' ? 'Thinking' : 'Tap to Talk'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* State Text Indicator */}
          <div className="mt-4 text-center">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-base font-bold ${
                state === 'listening'
                  ? 'bg-red-100 text-red-700'
                  : state === 'thinking'
                  ? 'bg-purple-100 text-purple-800'
                  : state === 'speaking'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-teal-50 text-[#0D5C56]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {state === 'listening'
                  ? t.listening
                  : state === 'thinking'
                  ? t.thinking
                  : state === 'speaking'
                  ? t.speaking
                  : 'Ready to listen'}
              </span>
            </span>
          </div>
        </div>

        {/* Assistant Response Card with Audio Readout */}
        <div className="bg-[#FAF7F2] border-2 border-[#E5DEC9] rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C5036]">
                Smritisathi Response
              </span>
              <p className="text-lg sm:text-xl font-medium text-[#1C2421] mt-1 leading-relaxed">
                "{assistantResponse}"
              </p>
            </div>
            <button
              onClick={() => speakText(assistantResponse, language)}
              className="p-2.5 rounded-xl bg-white border border-[#D4CBB5] text-[#0D5C56] hover:bg-[#F2ECE1] cursor-pointer shrink-0"
              title="Speak response again"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guided Breathing Widget if patient feels anxious/sad */}
        {showBreathing && (
          <div className="mb-5">
            <BreathingWidget onClose={() => setShowBreathing(false)} />
          </div>
        )}

        {/* Quick Suggestion Chips (Tappable for easy dementia interaction) */}
        <div className="space-y-2 mb-4">
          <p className="text-xs sm:text-sm font-bold text-[#4B5563]">
            {t.askMeAnything}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickPrompt(t.quickMedicine)}
              className="min-touch-target p-3 text-left rounded-xl bg-white border border-[#D4CBB5] hover:bg-[#F2ECE1] text-[#0D5C56] font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>💊</span>
              <span className="truncate">{t.quickMedicine}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt(t.quickFestival)}
              className="min-touch-target p-3 text-left rounded-xl bg-white border border-[#D4CBB5] hover:bg-[#F2ECE1] text-[#0D5C56] font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>🌸</span>
              <span className="truncate">{t.quickFestival}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt(t.quickAnxious)}
              className="min-touch-target p-3 text-left rounded-xl bg-white border border-[#D4CBB5] hover:bg-[#F2ECE1] text-[#8C5036] font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>🌿</span>
              <span className="truncate">{t.quickAnxious}</span>
            </button>

            <button
              onClick={() => handleQuickPrompt(t.quickGame)}
              className="min-touch-target p-3 text-left rounded-xl bg-white border border-[#D4CBB5] hover:bg-[#F2ECE1] text-[#0D5C56] font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <span>✨</span>
              <span className="truncate">{t.quickGame}</span>
            </button>
          </div>
        </div>

        {/* Fallback Text Input */}
        <div className="pt-2 border-t border-[#E5DEC9]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (transcript.trim()) {
                processUserInput(transcript.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={t.typePlaceholder}
              className="flex-1 min-touch-target px-4 py-2.5 rounded-2xl border-2 border-[#D4CBB5] bg-white text-base focus:border-[#0D5C56]"
            />
            <button
              type="submit"
              className="min-touch-target px-5 py-2.5 rounded-2xl bg-[#0D5C56] text-white font-bold text-base hover:bg-[#083E3A] cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-5 h-5" />
              <span>{t.send}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
