import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { playGentleTap, playGentleChime } from '../utils/sound';
import { User, ShieldCheck, HeartHandshake, Sparkles, KeyRound } from 'lucide-react';

export default function PatientLogin({
  language,
  initialProfile,
  onSaveProfile
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Form states with friendly defaults so the app is instantly demoable with zero friction
  const [patientId] = useState(initialProfile.id || 'SM-NER-8421');
  const [name, setName] = useState(initialProfile.name || 'Bhaben Baruah');
  const [age, setAge] = useState(initialProfile.age || '74');
  const [caregiverCode, setCaregiverCode] = useState(initialProfile.caregiverCode || 'CARE-GUW-909');
  
  // Simulated Main Caregiver Concept:
  // In the Smritisathi architecture, the "Main Caregiver" (Primary Admin) owns the unique link code
  // and has supervisory rights to register secondary caregivers (family members/nurses).
  // On the patient device, entering this caregiverCode automatically pairs with Ananya Baruah.
  const mainCaregiver = {
    name: 'Ananya Baruah',
    relation: 'Daughter & Primary Caregiver',
    code: 'CARE-GUW-909',
    phone: '+91 98640 12345',
    location: 'Guwahati, Assam',
    hasAdminRights: true
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }

    playGentleChime();
    onSaveProfile({
      id: patientId,
      name: name.trim(),
      age: age.trim() || '74',
      caregiverCode: caregiverCode.trim() || 'CARE-GUW-909',
      mainCaregiver: mainCaregiver,
      setupCompleted: true
    });
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-8 max-w-xl mx-auto">
      {/* Friendly Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E6F3F1] border-2 border-[#0D5C56]/30 mb-3 shadow-xs">
          <Sparkles className="w-8 h-8 text-[#0D5C56]" />
        </div>
        <h1 className="text-3xl sm:text-3xl font-extrabold text-[#0D5C56]">
          {t.patientSetupTitle}
        </h1>
        <p className="text-base sm:text-lg text-[#4B5563] mt-2 px-3">
          {t.patientSetupSubtitle}
        </p>
      </div>

      <div className="w-full bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl p-6 sm:p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient ID (Read-only styled badge) */}
          <div className="bg-[#FAF7F2] border border-[#E5DEC9] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-[#8C5036]">
                {t.patientIdLabel}
              </label>
              <div className="text-lg font-mono font-bold text-[#1C2421]">
                {patientId}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6F3F1] text-[#0D5C56]">
              <ShieldCheck className="w-4 h-4" />
              <span>Assigned</span>
            </div>
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-lg font-bold text-[#1C2421] mb-2">
              {t.patientNameLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.patientNamePlaceholder}
                className="w-full min-touch-target px-4 py-3 text-xl font-medium rounded-2xl border-2 border-[#D4CBB5] bg-white text-[#1C2421] focus:border-[#0D5C56] focus:bg-[#FFFDF9] transition-all placeholder:text-gray-400"
                required
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Patient Age */}
          <div>
            <label className="block text-lg font-bold text-[#1C2421] mb-2">
              {t.patientAgeLabel}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t.patientAgePlaceholder}
              min="40"
              max="120"
              className="w-full min-touch-target px-4 py-3 text-xl font-medium rounded-2xl border-2 border-[#D4CBB5] bg-white text-[#1C2421] focus:border-[#0D5C56] focus:bg-[#FFFDF9] transition-all"
            />
          </div>

          {/* Caregiver ID Linking */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-lg font-bold text-[#1C2421]">
                {t.caregiverIdLabel}
              </label>
              <span className="text-xs text-[#8C5036] font-semibold">Shared by Caregiver</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={caregiverCode}
                onChange={(e) => setCaregiverCode(e.target.value)}
                placeholder={t.caregiverIdPlaceholder}
                className="w-full min-touch-target px-4 py-3 text-xl font-mono uppercase font-bold rounded-2xl border-2 border-[#D4CBB5] bg-white text-[#0D5C56] focus:border-[#0D5C56] focus:bg-[#FFFDF9] transition-all"
              />
              <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>

            {/* Linked Main Caregiver badge card */}
            <div className="mt-3 p-3.5 rounded-2xl bg-[#E6F3F1] border border-[#0D5C56]/20 flex items-start gap-3">
              <HeartHandshake className="w-6 h-6 text-[#0D5C56] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-[#0D5C56]">
                  {t.caregiverNote}
                </div>
                <div className="text-xs text-[#4B5563] mt-0.5">
                  Phone: {mainCaregiver.phone} • Status: Connected & Monitoring
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              {errorMsg}
            </p>
          )}

          {/* Continue / Start Button */}
          <button
            type="submit"
            onClick={() => playGentleTap()}
            className="min-touch-target w-full py-4 px-6 rounded-2xl bg-[#0D5C56] hover:bg-[#083E3A] active:scale-98 text-white font-bold text-xl shadow-lg border-2 border-[#0D5C56] transition-all flex items-center justify-center gap-3 cursor-pointer mt-4"
          >
            <span>{t.startApp}</span>
            <span className="text-2xl">🌿</span>
          </button>
        </form>
      </div>
    </div>
  );
}
