// North East India Cultural Quiz Questions
// 4 categories: Festivals, Local Foods, Nature & Rivers, Traditions & Craft
// At least 3 sample questions per category with respectful, authentic regional facts

export const CULTURAL_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '✨' },
  { id: 'festivals', label: 'Festivals', icon: '🎉' },
  { id: 'food', label: 'Local Foods', icon: '🍲' },
  { id: 'nature', label: 'Nature & Rivers', icon: '🌿' },
  { id: 'traditions', label: 'Traditions & Craft', icon: '🧵' },
];

export const CULTURAL_QUESTIONS = [
  // ==================== FESTIVALS ====================
  {
    id: 'cq-fest-1',
    category: 'festivals',
    categoryLabel: 'Festivals of North East',
    badgeIcon: '🎉',
    question: 'Which joyful spring festival of Assam welcomes the Assamese New Year with lively dances and rhythmic dhol beats?',
    questionLocal: {
      as: 'অসমৰ কোনটো বসন্তকালীন উৎসৱে আনন্দময় বিহু নাচ আৰু ঢোলৰ চাপেৰে অসমীয়া নৱবৰ্ষক আদৰণি জনায়?',
      bn: 'আসামের কোন বসন্তকালীন উৎসব ঢোলের মিষ্টি বোলে ও নাচে নতুন বছরকে স্বাগত জানায়?',
      hi: 'असम का कौन सा वसंत उत्सव ढोल की थाप और पारंपरिक नृत्य के साथ नए साल का स्वागत करता है?'
    },
    funFact: 'Rongali Bihu (Bohag Bihu) marks the arrival of spring and sowing season, celebrated with tender buffalo-horn pepa music.',
    options: [
      { id: 'opt-1', text: 'Rongali Bihu (Bohag Bihu)', isCorrect: true },
      { id: 'opt-2', text: 'Diwali', isCorrect: false },
      { id: 'opt-3', text: 'Onam', isCorrect: false },
      { id: 'opt-4', text: 'Pushkar Fair', isCorrect: false }
    ]
  },
  {
    id: 'cq-fest-2',
    category: 'festivals',
    categoryLabel: 'Festivals of North East',
    badgeIcon: '🎉',
    question: 'Which vibrant harvest festival in Mizoram is celebrated with rhythmic bamboo dances known as Cheraw?',
    questionLocal: {
      as: 'মিজোৰামৰ কোনটো কৃষি উৎসৱত বিখ্যাত বাঁহ নৃত্য (চেৰাও) পৰিৱেশন কৰা হয়?',
      bn: 'মিজোরামের কোন উৎসব বিখ্যাত বাঁশ নাচ (চেরাও) দিয়ে ধুমধাম করে পালিত হয়?',
      hi: 'मिज़ोरम का कौन सा पावन उत्सव चेराव (बांस नृत्य) के साथ हर्षोल्लास से मनाया जाता है?'
    },
    funFact: 'Chapchar Kut is the beloved spring festival of the Mizo people after clearing forests for jhum cultivation.',
    options: [
      { id: 'opt-1', text: 'Chapchar Kut', isCorrect: true },
      { id: 'opt-2', text: 'Baisakhi', isCorrect: false },
      { id: 'opt-3', text: 'Ganesh Chaturthi', isCorrect: false },
      { id: 'opt-4', text: 'Lohri', isCorrect: false }
    ]
  },
  {
    id: 'cq-fest-3',
    category: 'festivals',
    categoryLabel: 'Festivals of North East',
    badgeIcon: '🎉',
    question: 'Which grand post-harvest festival in Meghalaya is celebrated by the Garo community as the "100 Drums Festival"?',
    questionLocal: {
      as: 'মেঘালয়ৰ গাৰো সম্প্ৰদায়ৰ ১০০টা ঢোলৰ সমাহাৰেৰে উদযাপিত প্ৰখ্যাত শস্য চপোৱা উৎসৱটো কি?',
      bn: 'মেঘালয়ের গারো সম্প্রদায়ের ১০০টি ঢোলের সাথে উদযাপিত বিখ্যাত নবান্ন উৎসব কোনটি?',
      hi: 'मेघालय के गारो समुदाय द्वारा १०० ढोलों के साथ मनाया जाने वाला पावन उत्सव कौन सा है?'
    },
    funFact: 'Wangala honors Saljong, the Sun god of fertility, with rhythmic synchronization of one hundred traditional drums.',
    options: [
      { id: 'opt-1', text: 'Wangala Festival', isCorrect: true },
      { id: 'opt-2', text: 'Hornbill Dance', isCorrect: false },
      { id: 'opt-3', text: 'Navratri', isCorrect: false },
      { id: 'opt-4', text: 'Chhath Puja', isCorrect: false }
    ]
  },

  // ==================== LOCAL FOODS ====================
  {
    id: 'cq-food-1',
    category: 'food',
    categoryLabel: 'Traditional Flavors',
    badgeIcon: '🍲',
    question: 'Which soothing, mildly tangy fish curry is a cornerstone comfort dish across traditional Assamese households?',
    questionLocal: {
      as: 'অসমৰ প্ৰতিখন ঘৰত অতি মৰমৰ আৰু তৃপ্তিদায়ক পাতল টেঙা মাছৰ জোলটোক কি বুলি কোৱা হয়?',
      bn: 'আসামের প্রতিটি পরিবারে অতি প্রিয় ও মুখরোচক হালকা টক মাছের ঝোলটিকে কী বলা হয়?',
      hi: 'असम के घरों में बेहद चाव से खाई जाने वाली हल्की खट्टी और स्वादिष्ट मछली की कढ़ी क्या कहलाती है?'
    },
    funFact: 'Masor Tenga is cooked gently with tomatoes, outenga (elephant apple), or thekera for a cooling, digestive meal.',
    options: [
      { id: 'opt-1', text: 'Masor Tenga (মাছৰ টেঙা)', isCorrect: true },
      { id: 'opt-2', text: 'Rogan Josh', isCorrect: false },
      { id: 'opt-3', text: 'Sambhar', isCorrect: false },
      { id: 'opt-4', text: 'Kadhi Pakora', isCorrect: false }
    ]
  },
  {
    id: 'cq-food-2',
    category: 'food',
    categoryLabel: 'Traditional Flavors',
    badgeIcon: '🍲',
    question: 'What is the unique traditional Assamese alkaline dish that is traditionally served right at the start of a meal?',
    questionLocal: {
      as: 'ভাত খোৱাৰ আৰম্ভণিতে পৰিৱেশন কৰা কলখাৰৰ পৰা তৈয়াৰী পৰম্পৰাগত ব্যঞ্জনবিধৰ নাম কি?',
      bn: 'খাওয়ার শুরুতে কলা গাছের ছাই থেকে প্রস্তুত ঐতিহ্যবাহী আসামের প্রথম পথটির নাম কী?',
      hi: 'असम में भोजन की शुरुआत में परोसा जाने वाला अनोखा पारंपरिक पाचक व्यंजन कौन सा है?'
    },
    funFact: 'Khar is traditionally prepared using filtered water from sun-dried and charred banana tree peels (Bhimkol).',
    options: [
      { id: 'opt-1', text: 'Khar (খাৰ)', isCorrect: true },
      { id: 'opt-2', text: 'Dhokla', isCorrect: false },
      { id: 'opt-3', text: 'Pav Bhaji', isCorrect: false },
      { id: 'opt-4', text: 'Litti Chokha', isCorrect: false }
    ]
  },
  {
    id: 'cq-food-3',
    category: 'food',
    categoryLabel: 'Traditional Flavors',
    badgeIcon: '🍲',
    question: 'Which aromatic purple-black rice from Manipur is renowned for its delightful sweet scent and health benefits?',
    questionLocal: {
      as: 'মণিপুৰৰ কোনবিধ সুগন্ধি ক’লা চাউল ইয়াৰ অনন্য সোৱাদ আৰু মিঠা পায়সৰ বাবে বিখ্যাত?',
      bn: 'মণিপুরের কোন সুগন্ধি কালো চাল চমৎকার সুবাস ও মিষ্টি ক্ষীরের জন্য পরিচিত?',
      hi: 'मणिपुर का कौन सा सुगंधित काला चावल अपने अनोखे रंग और मीठी खीर के लिए प्रसिद्ध है?'
    },
    funFact: 'Chak-hao (black rice) turns deep purple when cooked into sweet kheer, rich in healthy natural antioxidants.',
    options: [
      { id: 'opt-1', text: 'Chak-hao (Black Rice)', isCorrect: true },
      { id: 'opt-2', text: 'Basmati Rice', isCorrect: false },
      { id: 'opt-3', text: 'Sona Masoori', isCorrect: false },
      { id: 'opt-4', text: 'Jasmine Rice', isCorrect: false }
    ]
  },

  // ==================== NATURE & RIVERS ====================
  {
    id: 'cq-nat-1',
    category: 'nature',
    categoryLabel: 'Nature & Wildlife',
    badgeIcon: '🌿',
    question: 'Kaziranga National Park in Assam is globally celebrated as the proud home of which magnificent animal?',
    questionLocal: {
      as: 'অসমৰ বিশ্ববিখ্যাত কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান কোনটো বিশেষ প্ৰাণীৰ বাবে গৌৰৱৰ স্থল?',
      bn: 'আসামের কাজিরাঙা জাতীয় উদ্যান কোন বিরল ও গর্বের প্রাণীর সুরক্ষিত আবাসস্থল?',
      hi: 'असम का काजीरंगा राष्ट्रीय उद्यान किस गौरवशाली जीव के लिए पूरी दुनिया में जाना जाता है?'
    },
    funFact: 'Kaziranga shelters over two-thirds of the world’s surviving Great Indian One-horned Rhinoceroses.',
    options: [
      { id: 'opt-1', text: 'One-horned Rhinoceros (গঁড়)', isCorrect: true },
      { id: 'opt-2', text: 'Snow Leopard', isCorrect: false },
      { id: 'opt-3', text: 'Gir Lion', isCorrect: false },
      { id: 'opt-4', text: 'Polar Bear', isCorrect: false }
    ]
  },
  {
    id: 'cq-nat-2',
    category: 'nature',
    categoryLabel: 'Nature & Wildlife',
    badgeIcon: '🌿',
    question: 'Which beautiful pink-purple orchid is the state flower of Assam, worn lovingly by Bihu dancers in their hair?',
    questionLocal: {
      as: 'বিহু নাচনীয়ে খোপাত গুজি লোৱা অসমৰ ৰাজ্যিক ফুল কোনপাহ?',
      bn: 'বিহুর নাচে খোঁপায় গোঁজা আসামের রাষ্ট্রীয় সুবাসিত ফুল কোনটি?',
      hi: 'बिहू नर्तकियों द्वारा अपने केशों में सजाया जाने वाला असम का राजकीय पुष्प कौन सा है?'
    },
    funFact: 'Kopou Phool (Foxtail Orchid) blooms gloriously during April, signifying the joyful arrival of Bohag Bihu.',
    options: [
      { id: 'opt-1', text: 'Kopou Phool (কপৌ ফুল)', isCorrect: true },
      { id: 'opt-2', text: 'Gulmohar', isCorrect: false },
      { id: 'opt-3', text: 'Lotus', isCorrect: false },
      { id: 'opt-4', text: 'Marigold', isCorrect: false }
    ]
  },
  {
    id: 'cq-nat-3',
    category: 'nature',
    categoryLabel: 'Nature & Wildlife',
    badgeIcon: '🌿',
    question: 'What is the name of the majestic river that flows gracefully across the heart of Assam?',
    questionLocal: {
      as: 'অসমৰ বুকুৰ মাজেৰে বৈ যোৱা বিশাল আৰু জীৱনদায়িনী নদীখনৰ নাম কি?',
      bn: 'আসামের প্রাণকেন্দ্র দিয়ে বয়ে যাওয়া মহিমাময় বিশাল নদটির নাম কী?',
      hi: 'असम के हृदय से होकर बहने वाली जीवनदायिनी महान नदी का नाम क्या है?'
    },
    funFact: 'The Brahmaputra (Luit) originates high in the Himalayas and nourishes the lush valleys, tea estates, and wetlands.',
    options: [
      { id: 'opt-1', text: 'Brahmaputra (ব্ৰহ্মপুত্ৰ)', isCorrect: true },
      { id: 'opt-2', text: 'Yamuna', isCorrect: false },
      { id: 'opt-3', text: 'Narmada', isCorrect: false },
      { id: 'opt-4', text: 'Godavari', isCorrect: false }
    ]
  },

  // ==================== TRADITIONS & CRAFT ====================
  {
    id: 'cq-trad-1',
    category: 'traditions',
    categoryLabel: 'Crafts & Heritage',
    badgeIcon: '🧵',
    question: 'Which handwoven white cotton cloth with intricate red borders is presented in Assam as a token of deep respect and affection?',
    questionLocal: {
      as: 'অসমত সন্মান আৰু স্নেহৰ প্ৰতীক হিচাপে আগবঢ়োৱা ৰঙা ফুলৰ পাৰি থকা বগা কাপোৰখনৰ নাম কি?',
      bn: 'আসামে শ্রদ্ধা ও ভালোবাসার নিদর্শন হিসেবে উপহার দেওয়া লাল পাড়ের সাদা কাপড়ের নামটি কী?',
      hi: 'असम में सम्मान और प्रेम के प्रतीक के रूप में भेंट किया जाने वाला लाल किनारी का पवित्र वस्त्र क्या है?'
    },
    funFact: 'The Gamosa is woven on traditional looms (Tatxaal) with pure devotion to honor elders and guests.',
    options: [
      { id: 'opt-1', text: 'Gamosa (গামোচা)', isCorrect: true },
      { id: 'opt-2', text: 'Pashmina Shawl', isCorrect: false },
      { id: 'opt-3', text: 'Bandhani Dupatta', isCorrect: false },
      { id: 'opt-4', text: 'Banarasi Sari', isCorrect: false }
    ]
  },
  {
    id: 'cq-trad-2',
    category: 'traditions',
    categoryLabel: 'Crafts & Heritage',
    badgeIcon: '🧵',
    question: 'What is the iconic conical woven hat made from bamboo and toku leaves, representing Assamese dignity and heritage?',
    questionLocal: {
      as: 'বাঁহ আৰু টকৌ পাতেৰে সজোৱা অসমীয়া স্বাভিমানৰ প্ৰতীক টুপীসদৃশ বস্তুটোৰ নাম কি?',
      bn: 'বাঁশ ও টকৌ পাতা দিয়ে তৈরি আসামের ঐতিহ্যবাহী সম্মানীয় ছাতা বা টুপির নাম কী?',
      hi: 'बांस और पत्तों से बनी असम के गौरव और सम्मान की प्रतीक पारंपरिक टोपी कौन सी है?'
    },
    funFact: 'The Jaapi has historically sheltered farmers from the sun and is gifted as an auspicious symbol of hospitality.',
    options: [
      { id: 'opt-1', text: 'Jaapi (জাপি)', isCorrect: true },
      { id: 'opt-2', text: 'Pagri', isCorrect: false },
      { id: 'opt-3', text: 'Topi', isCorrect: false },
      { id: 'opt-4', text: 'Sombrero', isCorrect: false }
    ]
  },
  {
    id: 'cq-trad-3',
    category: 'traditions',
    categoryLabel: 'Crafts & Heritage',
    badgeIcon: '🧵',
    question: 'What is the graceful two-piece traditional silk attire worn by women in Assam during Bihu and sacred celebrations?',
    questionLocal: {
      as: 'বিহু আৰু পৱিত্ৰ অনুষ্ঠানত অসমৰ মহিলাই পিন্ধা সুন্দৰ দুটুকুৰা পৰম্পৰাগত বস্ত্ৰযোৰক কি বোলে?',
      bn: 'বিহু ও শুভ অনুষ্ঠানে আসামের মহিলারা যে দুই অংশের ঐতিহ্যবাহী পোশাক পরেন তার নাম কী?',
      hi: 'असम में महिलाओं द्वारा मांगलिक अवसरों व बिहू पर पहना जाने वाला दो-टुकड़ों का रेशमी परिधान क्या है?'
    },
    funFact: 'Mekhela Chador is woven from indigenous Golden Muga or Paat silk, known for its enduring golden sheen.',
    options: [
      { id: 'opt-1', text: 'Mekhela Chador (মেখেলা চাদৰ)', isCorrect: true },
      { id: 'opt-2', text: 'Salwar Kameez', isCorrect: false },
      { id: 'opt-3', text: 'Lehenga Choli', isCorrect: false },
      { id: 'opt-4', text: 'Ghagra', isCorrect: false }
    ]
  }
];
