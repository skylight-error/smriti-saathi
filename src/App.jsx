import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './data/i18n';
import { INITIAL_MEDICINES, INITIAL_ROUTINE_STATE, getSimulatedNotifications } from './data/initialRoutine';
import TopHeader from './components/TopHeader';
import BottomNav from './components/BottomNav';
import DemoToolbar from './components/DemoToolbar';
import LanguageSelect from './screens/LanguageSelect';
import PatientLogin from './screens/PatientLogin';
import HomeScreen from './screens/HomeScreen';
import FamilyQuizScreen from './screens/FamilyQuizScreen';
import CulturalQuizScreen from './screens/CulturalQuizScreen';
import DailyRoutineScreen from './screens/DailyRoutineScreen';
import FamilyAlbumScreen from './screens/FamilyAlbumScreen';
import VoiceAssistantModal from './screens/VoiceAssistantModal';
import NotificationsModal from './screens/NotificationsModal';
import SosScreen from './screens/SosScreen';
import { speakText, stopSpeaking } from './utils/speech';

export default function App() {
  // 1. Language state with localStorage persistence
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('smriti_lang') || 'as'; // Default to Assamese or English
  });

  // 2. Patient profile state
  const [patient, setPatient] = useState(() => {
    const saved = localStorage.getItem('smriti_patient');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      id: 'SM-NER-8421',
      name: 'Bhaben Baruah',
      age: '74',
      caregiverCode: 'CARE-GUW-909',
      setupCompleted: false, // will trigger language -> login first
      mainCaregiver: {
        name: 'Ananya Baruah',
        relation: 'Daughter & Primary Caregiver',
        code: 'CARE-GUW-909',
        phone: '+91 98640 12345'
      }
    };
  });

  // 3. Screen state ('language', 'login', 'home', 'family-quiz', 'cultural-quiz', 'routine', 'album')
  const [activeScreen, setActiveScreen] = useState(() => {
    // If patient already finished one-time setup, jump straight to home!
    const saved = localStorage.getItem('smriti_patient');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.setupCompleted) return 'home';
      } catch {}
    }
    return 'language'; // First screen is always language selection
  });

  // 4. Daily Routine & Medicines state
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('smriti_meds');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_MEDICINES;
  });

  const [routineState, setRoutineState] = useState(() => {
    const saved = localStorage.getItem('smriti_routine');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_ROUTINE_STATE;
  });

  // 5. Modals and Overlays
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smriti_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('smriti_patient', JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    localStorage.setItem('smriti_meds', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('smriti_routine', JSON.stringify(routineState));
  }, [routineState]);

  // Generate dynamic simulated notifications
  const notifications = getSimulatedNotifications(medicines, routineState, language);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handlers
  const handleSelectLanguage = (newLang) => {
    setLanguage(newLang);
  };

  const handleLanguageContinue = () => {
    if (patient.setupCompleted) {
      setActiveScreen('home');
    } else {
      setActiveScreen('login');
    }
  };

  const handleSaveProfile = (newProfile) => {
    setPatient(newProfile);
    setActiveScreen('home');
  };

  const handleToggleMedicine = (medId) => {
    setMedicines(prev => prev.map(m => {
      if (m.id === medId) {
        return { ...m, taken: !m.taken, takenAt: !m.taken ? new Date().toLocaleTimeString() : null };
      }
      return m;
    }));
  };

  const handleUpdateRoutine = (updates) => {
    setRoutineState(prev => ({ ...prev, ...updates }));
  };

  const handleToggleSpeech = () => {
    if (isAudioSpeaking) {
      stopSpeaking();
      setIsAudioSpeaking(false);
    } else {
      setIsAudioSpeaking(true);
      const t = TRANSLATIONS[language] || TRANSLATIONS.en;
      const textToRead = `${t.greeting}, ${patient.name || 'Friend'}. ${t.appTagline}. You have ${routineState.waterCount} out of 8 glasses of water today, and your mind quiz is ready.`;
      speakText(textToRead, language, () => {
        setIsAudioSpeaking(false);
      });
    }
  };

  // Hackathon Judge Toolbar Handlers
  const handleSetSimulatedTime = (hour, period) => {
    setRoutineState(prev => ({
      ...prev,
      simulatedHour: hour,
      simulatedPeriod: period
    }));
    // Open notifications to immediately show the simulated trigger!
    setIsNotificationsOpen(true);
  };

  const handleToggleOffline = () => {
    setRoutineState(prev => ({
      ...prev,
      isOffline: !prev.isOffline
    }));
  };

  const handleResetApp = () => {
    localStorage.removeItem('smriti_patient');
    localStorage.removeItem('smriti_meds');
    localStorage.removeItem('smriti_routine');
    setPatient({
      id: 'SM-NER-8421',
      name: 'Bhaben Baruah',
      age: '74',
      caregiverCode: 'CARE-GUW-909',
      setupCompleted: false,
      mainCaregiver: {
        name: 'Ananya Baruah',
        relation: 'Daughter & Primary Caregiver',
        code: 'CARE-GUW-909',
        phone: '+91 98640 12345'
      }
    });
    setMedicines(INITIAL_MEDICINES);
    setRoutineState(INITIAL_ROUTINE_STATE);
    setActiveScreen('language');
  };

  const isSetupFlow = activeScreen === 'language' || activeScreen === 'login';

  return (
    <div className={`min-h-screen bg-[#FAF7F2] text-[#1C2421] flex flex-col font-sans transition-all ${isLargeText ? 'text-[22px]' : 'text-[19px]'}`}>
      {/* Simulation Tools for Hackathon Judges */}
      <DemoToolbar
        simulatedHour={routineState.simulatedHour}
        simulatedPeriod={routineState.simulatedPeriod}
        onSetSimulatedTime={handleSetSimulatedTime}
        isOffline={routineState.isOffline}
        onToggleOffline={handleToggleOffline}
        onResetApp={handleResetApp}
        isLargeText={isLargeText}
        onToggleTextSize={() => setIsLargeText(!isLargeText)}
      />

      {/* Top Header - Always visible once setup is done */}
      {!isSetupFlow && (
        <TopHeader
          patient={patient}
          language={language}
          onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadCount={unreadCount}
          onOpenSos={() => setIsSosOpen(true)}
          isAudioSpeaking={isAudioSpeaking}
          onToggleSpeech={handleToggleSpeech}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Screen 1: Language Selection */}
        {activeScreen === 'language' && (
          <LanguageSelect
            selectedLanguage={language}
            onSelectLanguage={handleSelectLanguage}
            onContinue={handleLanguageContinue}
          />
        )}

        {/* Screen 2: Patient Login / Setup */}
        {activeScreen === 'login' && (
          <PatientLogin
            language={language}
            initialProfile={patient}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {/* Screen 3: Home Page */}
        {activeScreen === 'home' && (
          <HomeScreen
            language={language}
            patient={patient}
            medicines={medicines}
            onToggleMedicine={handleToggleMedicine}
            routineState={routineState}
            onUpdateRoutine={handleUpdateRoutine}
            onNavigateScreen={(screen) => setActiveScreen(screen)}
            notifications={notifications}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
          />
        )}

        {/* Family Recognition Quiz */}
        {activeScreen === 'family-quiz' && (
          <FamilyQuizScreen
            language={language}
            onBackToHome={() => setActiveScreen('home')}
            onMarkGamePlayed={() => handleUpdateRoutine({ gamePlayed: true })}
          />
        )}

        {/* Cultural Quiz */}
        {activeScreen === 'cultural-quiz' && (
          <CulturalQuizScreen
            language={language}
            onBackToHome={() => setActiveScreen('home')}
            onMarkGamePlayed={() => handleUpdateRoutine({ gamePlayed: true })}
          />
        )}

        {/* Daily Routine Screen */}
        {activeScreen === 'routine' && (
          <DailyRoutineScreen
            language={language}
            medicines={medicines}
            onToggleMedicine={handleToggleMedicine}
            routineState={routineState}
            onUpdateRoutine={handleUpdateRoutine}
            onBackToHome={() => setActiveScreen('home')}
          />
        )}

        {/* Family Album Screen */}
        {activeScreen === 'album' && (
          <FamilyAlbumScreen
            language={language}
            onBackToHome={() => setActiveScreen('home')}
          />
        )}

        {/* Voice Assistant Screen (also accessible as dedicated tab or modal) */}
        {activeScreen === 'voice' && (
          <HomeScreen
            language={language}
            patient={patient}
            medicines={medicines}
            onToggleMedicine={handleToggleMedicine}
            routineState={routineState}
            onUpdateRoutine={handleUpdateRoutine}
            onNavigateScreen={(screen) => setActiveScreen(screen)}
            notifications={notifications}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      {!isSetupFlow && (
        <BottomNav
          activeScreen={activeScreen}
          onChangeScreen={(screen) => {
            if (screen === 'sos') {
              setIsSosOpen(true);
            } else if (screen === 'voice') {
              setIsVoiceOpen(true);
            } else {
              setActiveScreen(screen);
            }
          }}
          language={language}
        />
      )}

      {/* Modals & Overlays */}

      {/* 1. Language Switcher Modal */}
      {isLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border-2 border-[#D4CBB5] rounded-3xl w-full max-w-xl p-4 shadow-2xl relative">
            <LanguageSelect
              selectedLanguage={language}
              onSelectLanguage={handleSelectLanguage}
              onContinue={() => setIsLanguageModalOpen(false)}
              isModalMode={true}
              onCloseModal={() => setIsLanguageModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 2. Notifications Drawer / Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        language={language}
        onTakeMedicine={handleToggleMedicine}
      />

      {/* 3. Baat Karein Voice Assistant Full Screen */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        language={language}
        patient={patient}
        medicines={medicines}
        routineState={routineState}
        onNavigateScreen={(screen) => {
          setIsVoiceOpen(false);
          setActiveScreen(screen);
        }}
      />

      {/* 4. SOS Emergency Modal */}
      {isSosOpen && (
        <SosScreen
          language={language}
          patient={patient}
          isOffline={routineState.isOffline}
          onClose={() => setIsSosOpen(false)}
          onToggleOffline={handleToggleOffline}
        />
      )}
    </div>
  );
}
