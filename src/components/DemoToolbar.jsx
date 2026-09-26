import React, { useState } from 'react';
import { Sliders, Wifi, WifiOff, Clock, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { playGentleTap } from '../utils/sound';

export default function DemoToolbar({
  simulatedHour,
  simulatedPeriod,
  onSetSimulatedTime,
  isOffline,
  onToggleOffline,
  onResetApp,
  isLargeText,
  onToggleTextSize
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Hackathon Simulation Controls" className="fixed top-18 right-3 z-40">
      <div className="bg-[#FAF7F2] border-2 border-[#0D5C56]/40 rounded-2xl shadow-lg overflow-hidden transition-all duration-200">
        <button
          onClick={() => {
            playGentleTap();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0D5C56] text-white text-xs font-bold rounded-t-2xl hover:bg-[#083E3A] cursor-pointer w-full justify-between"
          title="Demo & Hackathon Evaluator Simulation Bar"
        >
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Judge Demo Tools</span>
          </div>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isOpen && (
          <div className="p-3 bg-white space-y-3 text-xs w-64 border-t border-[#E5DEC9]">
            {/* Time shift to test notifications */}
            <div>
              <div className="flex items-center gap-1 font-bold text-[#0D5C56] mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Simulate Time of Day:</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onSetSimulatedTime(8, 'AM')}
                  className={`px-2 py-1.5 rounded-lg border font-medium ${
                    simulatedHour === 8 && simulatedPeriod === 'AM'
                      ? 'bg-[#0D5C56] text-white border-[#0D5C56]'
                      : 'bg-[#FAF7F2] text-[#1C2421] border-[#E5DEC9]'
                  }`}
                >
                  8:00 AM (Morning)
                </button>
                <button
                  onClick={() => onSetSimulatedTime(1, 'PM')}
                  className={`px-2 py-1.5 rounded-lg border font-medium ${
                    simulatedHour === 1 && simulatedPeriod === 'PM'
                      ? 'bg-[#0D5C56] text-white border-[#0D5C56]'
                      : 'bg-[#FAF7F2] text-[#1C2421] border-[#E5DEC9]'
                  }`}
                >
                  1:30 PM (Vitamin)
                </button>
                <button
                  onClick={() => onSetSimulatedTime(5, 'PM')}
                  className={`px-2 py-1.5 rounded-lg border font-medium ${
                    simulatedHour === 5 && simulatedPeriod === 'PM'
                      ? 'bg-[#9B4B28] text-white border-[#9B4B28]'
                      : 'bg-[#FAF7F2] text-[#1C2421] border-[#E5DEC9]'
                  }`}
                >
                  5:00 PM (Water Alert)
                </button>
                <button
                  onClick={() => onSetSimulatedTime(8, 'PM')}
                  className={`px-2 py-1.5 rounded-lg border font-medium ${
                    simulatedHour === 8 && simulatedPeriod === 'PM'
                      ? 'bg-[#0D5C56] text-white border-[#0D5C56]'
                      : 'bg-[#FAF7F2] text-[#1C2421] border-[#E5DEC9]'
                  }`}
                >
                  8:30 PM (Bedtime)
                </button>
              </div>
            </div>

            {/* Offline simulation toggle */}
            <div className="pt-2 border-t border-[#E5DEC9]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1C2421]">Internet Connectivity:</span>
                <button
                  onClick={onToggleOffline}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    isOffline
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
                  <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Toggle offline to verify SOS fallback call screen without internet!
              </p>
            </div>

            {/* Font size booster */}
            <div className="pt-2 border-t border-[#E5DEC9] flex items-center justify-between">
              <span className="font-bold text-[#1C2421]">Text Size:</span>
              <button
                onClick={onToggleTextSize}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D4CBB5] text-[#0D5C56] font-bold text-xs"
              >
                {isLargeText ? 'Super Large (22px)' : 'Standard (19px)'}
              </button>
            </div>

            {/* Reset App to onboarding */}
            <div className="pt-2 border-t border-[#E5DEC9]">
              <button
                onClick={onResetApp}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Onboarding / Language</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
