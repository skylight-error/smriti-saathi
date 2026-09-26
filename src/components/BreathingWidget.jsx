import React, { useState, useEffect } from 'react';
import { Heart, Wind, Play, Pause, RefreshCw } from 'lucide-react';
import { playGentleTap } from '../utils/sound';

export default function BreathingWidget({ onClose }) {
  const [phase, setPhase] = useState('breatheIn'); // 'breatheIn', 'hold', 'breatheOut'
  const [countdown, setCountdown] = useState(4);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (phase === 'breatheIn') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('breatheOut');
          return 6;
        } else {
          setPhase('breatheIn');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isRunning]);

  const phaseInstructions = {
    breatheIn: {
      title: 'Breathe In Gently 🌸',
      subtitle: 'Take a soft, calm breath through your nose',
      color: 'bg-teal-600 text-white',
      circleScale: 'scale-125'
    },
    hold: {
      title: 'Hold Gently 🌿',
      subtitle: 'Feel the peaceful warmth in your chest',
      color: 'bg-amber-600 text-white',
      circleScale: 'scale-120'
    },
    breatheOut: {
      title: 'Release Slowly 🍃',
      subtitle: 'Exhale gently through your mouth, letting go of worry',
      color: 'bg-teal-800 text-white',
      circleScale: 'scale-90'
    }
  };

  const current = phaseInstructions[phase];

  return (
    <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-6 shadow-md text-center max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#9B4B28] fill-[#9B4B28]" />
          <h3 className="text-xl font-bold text-[#0D5C56]">Gentle Calming Breath</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-sm font-semibold text-[#4B5563] hover:text-[#1C2421] p-1.5"
          >
            Close
          </button>
        )}
      </div>

      <p className="text-base text-[#4B5563] mb-6">
        Let's take a peaceful moment together. Breathe in rhythm with the circle.
      </p>

      {/* Visual Breathing Circle */}
      <div className="my-8 flex justify-center items-center">
        <div className="relative flex items-center justify-center w-52 h-52">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ease-in-out opacity-20 ${current.color} ${current.circleScale}`}
          />
          <div
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-1000 ease-in-out ${current.color} ${current.circleScale}`}
          >
            <Wind className="w-10 h-10 mb-1 opacity-90" />
            <span className="text-3xl font-extrabold">{countdown}</span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-90 mt-0.5">Seconds</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FAF7F2] border border-[#E5DEC9] rounded-2xl p-4 mb-5">
        <h4 className="text-xl font-bold text-[#0D5C56]">{current.title}</h4>
        <p className="text-base text-[#4B5563] mt-1">{current.subtitle}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            playGentleTap();
            setIsRunning(!isRunning);
          }}
          className="min-touch-target flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0D5C56] text-white font-bold text-base hover:bg-[#083E3A] cursor-pointer"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isRunning ? 'Pause' : 'Resume'}</span>
        </button>

        <button
          onClick={() => {
            playGentleTap();
            setPhase('breatheIn');
            setCountdown(4);
            setIsRunning(true);
          }}
          className="min-touch-target flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#0D5C56] font-bold text-base hover:bg-[#F2ECE1] cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}
