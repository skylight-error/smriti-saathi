// Text-to-Speech utility for dementia-accessible voice readout
// Designed with slower pace (0.86x) and gentle cadence for elderly comprehension

let _currentUtterance = null;

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    _currentUtterance = null;
  }
}

export function speakText(text, lang = 'en', onEndCallback = null) {
  if (!isSpeechSynthesisSupported() || !text) return;

  // Cancel any existing speech
  window.speechSynthesis.cancel();

  // Clean text from emojis for speech synthesis clarity
  const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  _currentUtterance = utterance;

  // Map language codes to BCP 47
  const langMap = {
    en: 'en-IN',
    as: 'as-IN',
    bn: 'bn-IN',
    hi: 'hi-IN',
    brx: 'hi-IN',
    mni: 'hi-IN'
  };

  utterance.lang = langMap[lang] || 'en-IN';
  utterance.rate = 0.86; // Slower, clearer cadence for elderly listeners
  utterance.pitch = 1.0;

  // Try to pick a natural regional voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(utterance.lang) || 
      v.lang.includes('IN') || 
      v.name.toLowerCase().includes('india')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
  }

  utterance.onend = () => {
    _currentUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = () => {
    _currentUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
}
