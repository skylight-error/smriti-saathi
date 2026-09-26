// Initial mock daily routine items and notification templates for Smritisathi

export const INITIAL_MEDICINES = [
  {
    id: 'med-morning',
    name: 'Morning Blood Pressure & Heart Care',
    time: '8:00 AM',
    dosage: '1 tablet with warm water after light breakfast',
    dosageLocal: {
      as: 'পুৱাৰ জলপানৰ পিছত কুহুমীয়া পানীৰে ১টা টেবলেট',
      bn: 'সকালের খাবারের পর ঈষদুষ্ণ জল দিয়ে ১টি ট্যাবলেট',
      hi: 'सुबह के नाश्ते के बाद गुनगुने पानी के साथ १ गोली',
      en: '1 tablet with warm water after light breakfast'
    },
    taken: false,
    takenAt: null
  },
  {
    id: 'med-afternoon',
    name: 'Afternoon Calcium & Vitamin D3',
    time: '1:30 PM',
    dosage: '1 capsule after lunch',
    dosageLocal: {
      as: 'দুপৰীয়া ভাত খোৱাৰ পিছত ১টা কেপচুল',
      bn: 'দুপুরের খাবারের পর ১টি ক্যাপসুল',
      hi: 'दोपहर के भोजन के बाद १ कैप्सूल',
      en: '1 capsule after lunch'
    },
    taken: false,
    takenAt: null
  },
  {
    id: 'med-night',
    name: 'Night Joint Comfort & Calming Herb',
    time: '8:30 PM',
    dosage: '1 tablet with warm milk before sleep',
    dosageLocal: {
      as: 'শোৱাৰ আগতে কুহুমীয়া গাখীৰ বা পানীৰে ১টা টেবলেট',
      bn: 'ঘুমানোর আগে হালকা গরম দুধ বা জল দিয়ে ১টি ট্যাবলেট',
      hi: 'सोने से पहले हल्के गर्म दूध या पानी के साथ १ गोली',
      en: '1 tablet before bedtime'
    },
    taken: false,
    takenAt: null
  }
];

export const INITIAL_ROUTINE_STATE = {
  waterCount: 4, // 4 out of 8 glasses
  waterTarget: 8,
  stepsCount: 1650, // 1650 out of 2500
  stepsTarget: 2500,
  gamePlayed: false,
  simulatedHour: 10, // 10:00 AM default
  simulatedPeriod: 'AM',
  isOffline: false // for SOS demo toggle
};

// Generates gentle, warm notifications based on routine state and simulated time
export function getSimulatedNotifications(medicines, routineState, language = 'en') {
  const notifications = [];
  const hour = routineState.simulatedHour;
  const isPM = routineState.simulatedPeriod === 'PM';
  const effectiveHour24 = isPM ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);

  // Morning medicine check (8:00 AM or later)
  const morningMed = medicines.find(m => m.id === 'med-morning');
  if (morningMed) {
    if (morningMed.taken) {
      notifications.push({
        id: 'notif-med-morning-done',
        type: 'success',
        icon: '✅',
        title: language === 'as' ? 'পুৱাৰ দৰৱ খোৱা হ’ল' : 'Morning Medicine Taken',
        message: language === 'as' ? 'আপুনি পুৱা ৮ বজাৰ দৰৱ নিয়মমতে খালে। বৰ ভাল লাগিল! 🌸' : 'You took your 8:00 AM medicine on time. Well done! 🌸',
        time: '8:15 AM',
        isRead: true
      });
    } else if (effectiveHour24 >= 8) {
      notifications.push({
        id: 'notif-med-morning-alert',
        type: 'reminder',
        icon: '💊',
        title: language === 'as' ? 'পুৱাৰ দৰৱৰ সময় হ’ল' : 'Time for Morning Medicine',
        message: language === 'as' ? 'মৰমৰ ভবেন দেউতা, আপোনাৰ পুৱা ৮:০০ বজাৰ দৰৱ খোৱাৰ সময় হৈছে। কুহুমীয়া পানীৰে খাওক।' : 'Time for your 8:00 AM medicine 💊 — Please enjoy it with a warm glass of water.',
        time: '8:00 AM',
        isRead: false,
        actionType: 'take-med',
        medId: 'med-morning'
      });
    }
  }

  // Afternoon medicine check (1:30 PM or later)
  const afternoonMed = medicines.find(m => m.id === 'med-afternoon');
  if (afternoonMed && effectiveHour24 >= 13) {
    if (!afternoonMed.taken) {
      notifications.push({
        id: 'notif-med-afternoon-alert',
        type: 'reminder',
        icon: '💊',
        title: language === 'as' ? 'দুপৰীয়াৰ ভিটামিনৰ সময়' : 'Afternoon Vitamin Reminder',
        message: language === 'as' ? 'দুপৰীয়াৰ সাজ খোৱাৰ পিছত ১:৩০ বজাৰ ভিটামিনটো ল’বলৈ নাপাহৰিব।' : 'A gentle reminder for your 1:30 PM Calcium & Vitamin D3 after lunch.',
        time: '1:30 PM',
        isRead: false,
        actionType: 'take-med',
        medId: 'med-afternoon'
      });
    }
  }

  // 5:00 PM Gentle Hydration Check
  if (effectiveHour24 >= 17) {
    if (routineState.waterCount < routineState.waterTarget) {
      notifications.push({
        id: 'notif-water-5pm',
        type: 'hydration',
        icon: '💧',
        title: language === 'as' ? 'সন্ধিয়া পানী খোৱাৰ সোঁৱৰণী' : 'Afternoon Water Reminder',
        message: language === 'as' ? 'সন্ধিয়া ৫ বাজিলে, মনত পেলাই দিছোঁ — অলপ পানী বা কুহুমীয়া চাহ একাপ খাই লওক 💧' : 'It is past 5:00 PM. Don\'t forget to drink a fresh glass of water today 💧',
        time: '5:00 PM',
        isRead: false
      });
    }
  }

  // Evening Walk / Steps
  if (routineState.stepsCount < 2000 && effectiveHour24 >= 16) {
    notifications.push({
      id: 'notif-steps-evening',
      type: 'activity',
      icon: '🌿',
      title: language === 'as' ? 'বাৰীৰ সেউজীয়াত অলপ ফুৰা' : 'Gentle Evening Garden Stroll',
      message: language === 'as' ? 'বতাহজাক ভাল লাগিছে, ফুলনিত লাহে লাহে খোজ কাঢ়িলে মনটো প্ৰফুল্ল হ’ব।' : 'The weather is pleasant. A gentle short stroll in the veranda or courtyard will feel refreshing.',
      time: '4:30 PM',
      isRead: false
    });
  }

  // Quiz completed cheer
  if (routineState.gamePlayed) {
    notifications.push({
      id: 'notif-game-cheer',
      type: 'cheer',
      icon: '🌸',
      title: language === 'as' ? 'সুন্দৰ স্মৃতি খেল!' : 'Mind Quiz Completed',
      message: language === 'as' ? 'আজি আপুনি কুইজটো বৰ আনন্দৰে খেলিলে। অনন্যা দেউতাৰ প্ৰতি গৌৰৱান্বিত!' : 'You enjoyed your daily mind exercise today. Wonderful smile earned!',
      time: 'Today',
      isRead: true
    });
  }

  return notifications;
}
