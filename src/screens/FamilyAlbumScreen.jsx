import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/i18n';
import { FAMILY_MEMBERS } from '../data/familyMembers';
import { playGentleTap } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';
import { ArrowLeft, Volume2, X, Heart, MapPin } from 'lucide-react';

export default function FamilyAlbumScreen({
  language,
  onBackToHome
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleOpenPhoto = (member) => {
    playGentleTap();
    setSelectedPhoto(member);
    const caption = member.memoryCaptionLocal[language] || member.memoryCaption;
    const relation = member.relationLocal[language] || member.relation;
    speakText(`${member.name}. ${relation}. ${caption}`, language);
  };

  const handleCloseModal = () => {
    playGentleTap();
    stopSpeaking();
    setSelectedPhoto(null);
  };

  const handleSpeakMember = (member, e) => {
    e.stopPropagation();
    playGentleTap();
    const caption = member.memoryCaptionLocal[language] || member.memoryCaption;
    const relation = member.relationLocal[language] || member.relation;
    speakText(`${member.name}. ${relation}. ${caption}`, language);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
      {/* Top Header */}
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

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFFDF9] border border-[#D4CBB5] text-[#8C5036] font-bold text-sm">
          <Heart className="w-4 h-4 text-[#9B4B28] fill-[#9B4B28]" />
          <span>Physical Photo Album</span>
        </div>
      </div>

      {/* Album Page Style Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0D5C56] tracking-tight">
          {t.familyAlbumTitle}
        </h2>
        <p className="text-lg text-[#4B5563] mt-2 max-w-lg mx-auto">
          {t.familyAlbumSubtitle}
        </p>
      </div>

      {/* Grid of Physical Photo Cards (dementia-friendly album style with photo corners & gentle shadows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {FAMILY_MEMBERS.map((member) => {
          return (
            <div
              key={member.id}
              onClick={() => handleOpenPhoto(member)}
              className="group bg-[#FFFDF9] border-3 border-[#D4CBB5] rounded-3xl p-5 shadow-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Photo Frame Container */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border-2 border-[#E5DEC9] shadow-inner">
                <img
                  src={member.photoPlaceholder}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Voice button over photo */}
                <button
                  onClick={(e) => handleSpeakMember(member, e)}
                  className="min-touch-target absolute bottom-2 right-2 w-12 h-12 rounded-2xl bg-[#0D5C56]/90 hover:bg-[#0D5C56] text-white flex items-center justify-center shadow-md backdrop-blur-xs cursor-pointer"
                  title="Listen to memory"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Caption & Relation */}
              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-2xl font-bold text-[#1C2421] truncate">
                    {member.name}
                  </h3>
                  {member.location && (
                    <span className="text-xs font-semibold text-[#8C5036] flex items-center gap-1 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                      {member.location.split(',')[0]}
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold text-[#0D5C56] mt-0.5">
                  {member.relationLocal[language] || member.relation}
                </p>

                <p className="text-base text-[#4B5563] mt-2 line-clamp-2 leading-relaxed bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E5DEC9]/60 italic">
                  "{member.memoryCaptionLocal[language] || member.memoryCaption}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enlarged Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] border-3 border-[#D4CBB5] rounded-3xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="min-touch-target absolute top-4 right-4 w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#D4CBB5] flex items-center justify-center text-[#4B5563] hover:text-[#1C2421] cursor-pointer"
              aria-label="Close photo"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="aspect-4/3 rounded-2xl overflow-hidden border-2 border-[#D4CBB5] shadow-md my-4">
              <img
                src={selectedPhoto.photoPlaceholder}
                alt={selectedPhoto.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mt-4">
              <h3 className="text-3xl font-extrabold text-[#1C2421]">
                {selectedPhoto.name}
              </h3>
              <p className="text-xl font-bold text-[#0D5C56] mt-1">
                {selectedPhoto.relationLocal[language] || selectedPhoto.relation}
              </p>
              <div className="bg-[#FAF7F2] border-2 border-[#E5DEC9] rounded-2xl p-4 mt-4 text-left">
                <p className="text-lg text-[#1C2421] leading-relaxed">
                  "{selectedPhoto.memoryCaptionLocal[language] || selectedPhoto.memoryCaption}"
                </p>
                {selectedPhoto.phone && (
                  <p className="text-sm font-semibold text-[#8C5036] mt-2">
                    Caregiver Contact: {selectedPhoto.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => {
                    const caption = selectedPhoto.memoryCaptionLocal[language] || selectedPhoto.memoryCaption;
                    const relation = selectedPhoto.relationLocal[language] || selectedPhoto.relation;
                    speakText(`${selectedPhoto.name}. ${relation}. ${caption}`, language);
                  }}
                  className="min-touch-target flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0D5C56] text-white font-bold text-lg hover:bg-[#083E3A] cursor-pointer"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>Listen Again</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  className="min-touch-target px-6 py-3 rounded-2xl bg-white border-2 border-[#D4CBB5] text-[#1C2421] font-bold text-lg hover:bg-[#F2ECE1] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
