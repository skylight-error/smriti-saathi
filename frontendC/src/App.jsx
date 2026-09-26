import { useState, useEffect } from 'react'

// Supported Language Configurations
const LANGUAGE_OPTIONS = [
  { id: 'Assamese', label: 'Assamese (অসমীয়া)' },
  { id: 'Manipuri (Meitei)', label: 'Manipuri (Meitei / মৈতৈলোন্)' },
  { id: 'Bengali', label: 'Bengali (বাংলা)' },
  { id: 'Bodo', label: 'Bodo (बड़ो)' },
  { id: 'Hindi', label: 'Hindi (हिंदी)' },
  { id: 'English', label: 'English' },
]

// Standard Family Relationships with complete reviewed translations across all 6 languages
const STANDARD_RELATIONSHIPS = [
  'Daughter',
  'Son',
  'Sister',
  'Brother',
  'Grandson',
  'Granddaughter',
  'Mother',
  'Father',
  'Wife',
  'Husband',
  'Aunt',
  'Uncle',
]

// Pure, non-mixed translations for Family Recognition
const FAMILY_TRANSLATIONS = {
  English: {
    questionTemplate: (name) => `Who is ${name}?`,
    relationshipHeader: 'Relationship',
    relationships: {
      Daughter: 'Daughter',
      Son: 'Son',
      Sister: 'Sister',
      Brother: 'Brother',
      Grandson: 'Grandson',
      Granddaughter: 'Granddaughter',
      Mother: 'Mother',
      Father: 'Father',
      Wife: 'Wife',
      Husband: 'Husband',
      Aunt: 'Aunt',
      Uncle: 'Uncle',
    },
    correctBadge: 'Correct Choice',
    distractorBadge: 'Other Family Member',
    targetLabel: 'Target Family Member',
    choicesLabel: 'Photo Choices (3 Options)',
    choicePrefix: 'Choice',
  },
  Assamese: {
    questionTemplate: (name) => `${name} কোন হয়?`,
    relationshipHeader: 'সম্পৰ্ক',
    relationships: {
      Daughter: 'জীয়াৰী',
      Son: 'পুত্ৰ',
      Sister: 'ভনী',
      Brother: 'ভাই',
      Grandson: 'নাতি',
      Granddaughter: 'নাতিনী',
      Mother: 'আই / মা',
      Father: 'দেউতা',
      Wife: 'পত্নী',
      Husband: 'স্বামী',
      Aunt: 'মাহী / পেহী',
      Uncle: 'খুড়া',
    },
    correctBadge: 'শুদ্ধ উত্তৰ',
    distractorBadge: 'পৰিয়ালৰ আন সদস্য',
    targetLabel: 'নিৰ্বাচিত সদস্য',
    choicesLabel: 'ফটো বিকল্প (৩ টা বিকল্প)',
    choicePrefix: 'বিকল্প',
  },
  'Manipuri (Meitei)': {
    questionTemplate: (name) => `${name} অসি কনানো?`,
    relationshipHeader: 'মরীবাল',
    relationships: {
      Daughter: 'মচানুপী',
      Son: 'মচানুপা',
      Sister: 'ইচেল',
      Brother: 'ইনাও',
      Grandson: 'ইশু নুপা',
      Granddaughter: 'ইশু নুপী',
      Mother: 'ইমা',
      Father: 'ইপা',
      Wife: 'নুপী',
      Husband: 'মপুরোইবা',
      Aunt: 'ইতোন',
      Uncle: 'খুরা',
    },
    correctBadge: 'চুম্বা ৱাহৈ',
    distractorBadge: 'ইমুংগী অতোপ্পা মী',
    targetLabel: 'ইমুংগী মী',
    choicesLabel: 'ফোতো খনগদবা (৩ খল)',
    choicePrefix: 'খনগদবা',
  },
  Bengali: {
    questionTemplate: (name) => `${name} কে হন?`,
    relationshipHeader: 'সম্পর্ক',
    relationships: {
      Daughter: 'মেয়ে',
      Son: 'ছেলে',
      Sister: 'বোন',
      Brother: 'ভাই',
      Grandson: 'নাতি',
      Granddaughter: 'নাতনি',
      Mother: 'মা',
      Father: 'বাবা',
      Wife: 'স্ত্রী',
      Husband: 'স্বামী',
      Aunt: 'মাসি / পিসি',
      Uncle: 'কাকা / মামা',
    },
    correctBadge: 'সঠিক উত্তর',
    distractorBadge: 'পরিবারের অন্য সদস্য',
    targetLabel: 'পরিবারের সদস্য',
    choicesLabel: 'ছবির বিকল্প (৩ টি বিকল্প)',
    choicePrefix: 'বিকল্প',
  },
  Bodo: {
    questionTemplate: (name) => `${name} आ सोर जायो?`,
    relationshipHeader: 'सोमोन्दो',
    relationships: {
      Daughter: 'फिसाजो',
      Son: 'फिसाला',
      Sister: 'बिनानाव',
      Brother: 'फंबाय',
      Grandson: 'उन्दै फिसा',
      Granddaughter: 'उन्दै फिसाजो',
      Mother: 'आइ',
      Father: 'आफा',
      Wife: 'बिसि',
      Husband: 'हौवा',
      Aunt: 'मादै',
      Uncle: 'आदै',
    },
    correctBadge: 'थार फिननाय',
    distractorBadge: 'नखरनि गुबुन सुबुं',
    targetLabel: 'नखरनि सुबुं',
    choicesLabel: 'फटोसायख’नाय (३ मोन)',
    choicePrefix: 'सायख’नाय',
  },
  Hindi: {
    questionTemplate: (name) => `${name} कौन हैं?`,
    relationshipHeader: 'संबंध',
    relationships: {
      Daughter: 'बेटी',
      Son: 'बेटा',
      Sister: 'बहन',
      Brother: 'भाई',
      Grandson: 'पोता / नाती',
      Granddaughter: 'पोती / नातिन',
      Mother: 'माँ',
      Father: 'पिताजी',
      Wife: 'पत्नी',
      Husband: 'पति',
      Aunt: 'चाची / मौसी',
      Uncle: 'चाचा / मामा',
    },
    correctBadge: 'सही उत्तर',
    distractorBadge: 'परिवार के अन्य सदस्य',
    targetLabel: 'परिवार के सदस्य',
    choicesLabel: 'फोटो विकल्प (3 विकल्प)',
    choicePrefix: 'विकल्प',
  },
}

// Authentic North East India (NER) question bank for Cultural quizzes
const NER_QUESTION_BANK = {
  Festivals: {
    Assamese: [
      {
        question: 'অসমত বসন্ত কালৰ আগমন আৰু নতুন বছৰক আদৰণি জনাই কোনটো বিহু পালন কৰা হয়?',
        options: ['ৰঙালী বিহু (Rongali Bihu)', 'ভোগালী বিহু', 'কাতি বিহু'],
        correctIndex: 0,
      },
      {
        question: 'নাগালেণ্ডৰ বিভিন্ন জনজাতীয় ঐতিহ্য আৰু সংস্কৃতি প্ৰদৰ্শন কৰা বিখ্যাত বাৰ্ষিক উৎসৱটো কি?',
        options: ['হৰ্ণবিল উৎসৱ (Hornbill Festival)', 'ৱাংগালা', 'মপিন'],
        correctIndex: 0,
      },
    ],
    'Manipuri (Meitei)': [
      {
        question: 'মণিপুরগী নাৎ, কলা অমসুং সংস্কৃতিবু উৎপা চহি খুদিংগী পাংথোকপা অচৌবা কুমহৈ অসিবু করি কৌই?',
        options: ['সাংগাই কুমহৈ (Sangai Festival)', 'হর্নবিল কুমহৈ', 'বিহু কুমহৈ'],
        correctIndex: 0,
      },
      {
        question: 'বসন্ত থাদা মণিপুরদা পাংথোকপা নিংথিরবা মীতৈশিংগী হরাও-কুহ্মৈ অসি করি কৌই?',
        options: ['য়াওশং (Yaoshang)', 'লুই-ঙাই-নী', 'হিক্রু হিদোংবা'],
        correctIndex: 0,
      },
    ],
    Bengali: [
      {
        question: 'আসামের কোন বসন্তকালীন উৎসবে ঢোল ও পেঁপার সুরে নতুন বছরকে স্বাগত জানানো হয়?',
        options: ['রঙালি বিহু (Rongali Bihu)', 'ভোগালি বিহু', 'কাতি বিহু'],
        correctIndex: 0,
      },
      {
        question: 'নাগাল্যান্ডের উপজাতীয় সংস্কৃতি ও ঐতিহ্যের মহা-সম্মিলন হিসেবে পরিচিত উৎসব কোনটি?',
        options: ['হর্নবিল উৎসব (Hornbill Festival)', 'ওয়াঙ্গালা', 'সাংগাই উৎসব'],
        correctIndex: 0,
      },
    ],
    Bodo: [
      {
        question: 'बड़ो सुबुंफोरनि गेजेराव बैसागु बोथोराव सिफुं-खाम जों खुंनाय गाहाय बोथोरा बबे?',
        options: ['बैसागु (Bwisagu)', 'माघ बिहु', 'हर्नबिल'],
        correctIndex: 0,
      },
    ],
    Hindi: [
      {
        question: 'असम में नए साल और वसंत के स्वागत में ढोल और पेपा की धुन पर कौन सा प्रमुख त्योहार मनाया जाता है?',
        options: ['रोंगाली बिहू (Rongali Bihu)', 'भोगाली बिहू', 'काती बिहू'],
        correctIndex: 0,
      },
      {
        question: 'नागालैंड में जनजातीय संस्कृति और विरासत को दर्शाने वाला "त्योहारों का त्योहार" किसे कहा जाता है?',
        options: ['हॉर्नबिल महोत्सव (Hornbill Festival)', 'वांगला', 'सांगाई महोत्सव'],
        correctIndex: 0,
      },
    ],
    English: [
      {
        question: 'Which spring festival of Assam welcomes the Assamese New Year with lively dances and dhol beats?',
        options: ['Rongali Bihu', 'Bhogali Bihu', 'Kati Bihu'],
        correctIndex: 0,
      },
      {
        question: 'Which renowned cultural festival held in Nagaland is celebrated as the "Festival of Festivals"?',
        options: ['Hornbill Festival', 'Wangala Festival', 'Chapchar Kut'],
        correctIndex: 0,
      },
    ],
  },
  'Local Fruits': {
    Assamese: [
      {
        question: 'অসমৰ অনন্য সুবাস আৰু ঔষধি গুণযুক্ত জি আই (GI) টেগ পোৱা বিশেষ নেমুটেঙাটো কি?',
        options: ['কাজী নেমু (Kazi Nemu)', 'গোলাপী নেমু', 'বৰটেঙা'],
        correctIndex: 0,
      },
    ],
    'Manipuri (Meitei)': [
      {
        question: 'মণিপুরগী কাচৈ খুঙ্গংদা হৌবা তোপ-তোপ্পা জি আই (GI) টেগ ফংলবা চম্প্রা মখল অসিগী মমিং করি?',
        options: ['কাচৈ চম্প্রা (Kachai Lemon)', 'হেইবাং', 'হেইক্রু'],
        correctIndex: 0,
      },
    ],
    Bengali: [
      {
        question: 'আসামের বিশেষ সুগন্ধযুক্ত এবং জিআই (GI) ট্যাগপ্রাপ্ত ঐতিহ্যবাহী লেবু কোনটি?',
        options: ['কাজী নেমু (Kazi Nemu)', 'বাতাবি লেবু', 'কাগজি লেবু'],
        correctIndex: 0,
      },
    ],
    Hindi: [
      {
        question: 'असम का कौन सा अत्यंत सुगंधित और औषधीय गुणों वाला नींबू भौगोलिक संकेत (GI Tag) प्राप्त है?',
        options: ['काजी नेमु (Kazi Nemu)', 'कागजी नींबू', 'चकोतरा'],
        correctIndex: 0,
      },
    ],
    English: [
      {
        question: 'Which oblong, intensely aromatic lemon indigenous to Assam holds a prestigious GI tag?',
        options: ['Kazi Nemu', 'Assam Sweet Lemon', 'Nagaland Pomelo'],
        correctIndex: 0,
      },
    ],
  },
  'Traditional Instruments': {
    Assamese: [
      {
        question: 'বিহু নৃত্যত ম’হৰ শিঙৰ পৰা তৈয়াৰ কৰা অসমৰ কোনটো পৰম্পৰাগত বাদ্যযন্ত্ৰ বজোৱা হয়?',
        options: ['পেঁপা (Pepa)', 'গগনা (Gogona)', 'টকা (Toka)'],
        correctIndex: 0,
      },
    ],
    'Manipuri (Meitei)': [
      {
        question: 'মণিপুরগী লাইহরাওবা অমসুং লোকসঙ্গীত্তা শিজিন্নবা মচিন্না শাবা একক-তার বাদ্যযন্ত্র করি কৌই?',
        options: ['পেনা (Pena)', 'পেঁপা', 'খোল'],
        correctIndex: 0,
      },
    ],
    Bengali: [
      {
        question: 'আসামের বিহু সংস্কৃতিতে ব্যবহৃত মহিষের শিং ও বাঁশ দিয়ে তৈরি ঐতিহ্যবাহী সুরের বাদ্যযন্ত্র কোনটি?',
        options: ['পেঁপা (Pepa)', 'গগনা', 'ঢোলক'],
        correctIndex: 0,
      },
    ],
    Bodo: [
      {
        question: 'बड़ो हारिमुआव बैसागु मोसानायाव सिफुं (बांसुरी) जों लोगोसे बाहायनाय गाहाय बाजाया बबे?',
        options: ['खाम (Kham - Traditional Drum)', 'पेपा', 'तबला'],
        correctIndex: 0,
      },
    ],
    Hindi: [
      {
        question: 'असम के बिहू में भैंस के सींग और बांस से बना कौन सा विशिष्ट पारंपरिक वाद्ययंत्र बजाया जाता है?',
        options: ['पेपा (Pepa)', 'गगोना', 'टोकारी'],
        correctIndex: 0,
      },
    ],
    English: [
      {
        question: 'Which iconic Assamese wind instrument used in Bihu is crafted from buffalo horn and bamboo?',
        options: ['Pepa', 'Gogona', 'Tokari'],
        correctIndex: 0,
      },
    ],
  },
  'Local Nature': {
    Assamese: [
      {
        question: 'এশিঙীয়া গঁড়ৰ প্ৰাকৃতিক আৱাসস্থল হিচাপে বিশ্ববিখ্যাত অসমৰ ৰাষ্ট্ৰীয় উদ্যানখনৰ নাম কি?',
        options: ['কাজিৰঙা ৰাষ্ট্ৰীয় উদ্যান (Kaziranga)', 'মানাহ ৰাষ্ট্ৰীয় উদ্যান', 'নামেৰি ৰাষ্ট্ৰীয় উদ্যান'],
        correctIndex: 0,
      },
    ],
    'Manipuri (Meitei)': [
      {
        question: 'মণিপুরগী অখন্নবা ঈশিং মপাংদা পুন্না হৌরিবা "ফুমদি" (Phumdis) লৈবা মালেমগী অচৌবা পাত অসিগী মমিং করি?',
        options: ['লোকতাক পাত (Loktak Lake)', 'উমিয়াম পাত', 'রুদ্রসাগর'],
        correctIndex: 0,
      },
    ],
    Bengali: [
      {
        question: 'একশৃঙ্গ গণ্ডারের প্রাকৃতিক আবাসস্থল হিসেবে বিশ্বখ্যাত আসামের জাতীয় উদ্যান কোনটি?',
        options: ['কাজিরাঙা জাতীয় উদ্যান (Kaziranga)', 'মানস জাতীয় উদ্যান', 'নামদফা জাতীয় উদ্যান'],
        correctIndex: 0,
      },
    ],
    Hindi: [
      {
        question: 'एक सींग वाले दुर्लभ भारतीय गैंडे (One-Horned Rhino) के लिए विश्वप्रसिद्ध असम का राष्ट्रीय उद्यान कौन सा है?',
        options: ['काजीरंगा राष्ट्रीय उद्यान (Kaziranga)', 'मानस राष्ट्रीय उद्यान', 'नमदाफा राष्ट्रीय उद्यान'],
        correctIndex: 0,
      },
    ],
    English: [
      {
        question: 'Which national park in Assam is world-famous as the sanctuary of the Great Indian One-Horned Rhinoceros?',
        options: ['Kaziranga National Park', 'Manas National Park', 'Namdapha National Park'],
        correctIndex: 0,
      },
    ],
  },
}

// Labelled family members pool in session memory (using standard keys for pure translation)
const INITIAL_DEMO_FAMILY_MEMBERS = [
  {
    id: 'demo-fam-1',
    name: 'Rohan',
    relationshipKey: 'Grandson',
    photoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23E7F3F1"/><circle cx="60" cy="45" r="22" fill="%230F3E3B"/><path d="M25 105 C25 75, 95 75, 95 105 Z" fill="%230F3E3B"/></svg>',
  },
  {
    id: 'demo-fam-2',
    name: 'Ananya',
    relationshipKey: 'Sister',
    photoUrl:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23FEF4DA"/><circle cx="60" cy="45" r="22" fill="%239A7016"/><path d="M25 105 C25 75, 95 75, 95 105 Z" fill="%239A7016"/></svg>',
  },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caregiver, setCaregiver] = useState(null);

    const [loginContact, setLoginContact] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Quiz Activity')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(1)
  const [selectedQuizType, setSelectedQuizType] = useState(null)


    // Real patient game results from backend
  const [gameResults, setGameResults] = useState([])
  const [gameResultsLoading, setGameResultsLoading] = useState(true)
  const [gameResultsError, setGameResultsError] = useState('')
  // Local storage for created quizzes
  const [quizzes, setQuizzes] = useState(() => {
    try {
      const saved = localStorage.getItem('smriti_sathi_quizzes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Cultural Quiz Form State
  const [formTopic, setFormTopic] = useState('Festivals')
  const [formLanguage, setFormLanguage] = useState('Assamese')
  const [draftGenerated, setDraftGenerated] = useState(false)
  const [draftQuestion, setDraftQuestion] = useState('')
  const [draftOptions, setDraftOptions] = useState(['', '', ''])
  const [draftCorrectIndex, setDraftCorrectIndex] = useState(0)
  const [isEditingDraft, setIsEditingDraft] = useState(false)
  const [missingReviewNotice, setMissingReviewNotice] = useState('')

  // Family Recognition State
  const [familyMembersPool, setFamilyMembersPool] = useState(INITIAL_DEMO_FAMILY_MEMBERS)
  const [famName, setFamName] = useState('Priya')
  const [famRelationshipKey, setFamRelationshipKey] = useState('Daughter')
  const [famLanguage, setFamLanguage] = useState('Assamese')
  const [famPhotoData, setFamPhotoData] = useState(
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23F3E8FF"/><circle cx="60" cy="45" r="22" fill="%236B21A8"/><path d="M25 105 C25 75, 95 75, 95 105 Z" fill="%236B21A8"/></svg>'
  )
  const [famDraftGenerated, setFamDraftGenerated] = useState(false)
  const [famDraftQuestion, setFamDraftQuestion] = useState('')
  const [famPhotoChoices, setFamPhotoChoices] = useState([])
  const [famDraftNotice, setFamDraftNotice] = useState('')

  // Shared preview and feedback modal
  const [previewData, setPreviewData] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [formError, setFormError] = useState('')

    useEffect(() => {
    const fetchGameResults = async () => {
      try {
        setGameResultsLoading(true)
        setGameResultsError('')

        const response = await fetch(
          'http://127.0.0.1:5000/api/patients/1/game-results'
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const result = await response.json()
        setGameResults(result.data || [])
      } catch (error) {
        setGameResultsError(error.message || 'Unable to load game results')
      } finally {
        setGameResultsLoading(false)
      }
    }

    fetchGameResults()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('smriti_sathi_quizzes', JSON.stringify(quizzes))
    } catch {
      // ignore
    }
  }, [quizzes])

  const handleTabClick = (name) => {
    setActiveTab(name)
    setSidebarOpen(false)
    if (name !== 'Manage Quizzes') {
      setIsCreatingQuiz(false)
      setQuizStep(1)
      setSelectedQuizType(null)
      setDraftGenerated(false)
      setFamDraftGenerated(false)
    }
  }

  const startQuizCreation = () => {
    setIsCreatingQuiz(true)
    setQuizStep(1)
    setFormError('')
    setSaveSuccess('')
    setMissingReviewNotice('')
    setDraftGenerated(false)
    setFamDraftGenerated(false)
    setFamDraftNotice('')
  }

  const exitQuizCreation = () => {
    setIsCreatingQuiz(false)
    setQuizStep(1)
    setSelectedQuizType(null)
    setFormError('')
    setSaveSuccess('')
    setMissingReviewNotice('')
    setDraftGenerated(false)
    setFamDraftGenerated(false)
    setFamDraftNotice('')
  }

  // --- Cultural Quiz Generator ---
  const handleGenerateCulturalQuiz = () => {
    setMissingReviewNotice('')
    setFormError('')
    setSaveSuccess('')

    const topicQuestions = NER_QUESTION_BANK[formTopic]
    const languageQuestions = topicQuestions?.[formLanguage]

    if (!languageQuestions || languageQuestions.length === 0) {
      setDraftGenerated(false)
      const selectedLangObj = LANGUAGE_OPTIONS.find((l) => l.id === formLanguage)
      const langLabel = selectedLangObj ? selectedLangObj.label : formLanguage
      setMissingReviewNotice(
        `No reviewed question is currently available for "${formTopic}" in ${langLabel}. We do not fall back to English to preserve regional language fidelity. Please select another topic or language.`
      )
      return
    }

    const randomQuestion =
      languageQuestions[Math.floor(Math.random() * languageQuestions.length)]

    setDraftQuestion(randomQuestion.question)
    setDraftOptions([...randomQuestion.options])
    setDraftCorrectIndex(randomQuestion.correctIndex)
    setDraftGenerated(true)
    setIsEditingDraft(false)
  }

  const handleSaveCulturalQuiz = (e) => {
    e.preventDefault()
    setFormError('')

    if (!draftQuestion.trim()) {
      setFormError('Question text cannot be empty.')
      return
    }
    if (draftOptions.some((opt) => !opt.trim())) {
      setFormError('All three answer choices must be filled.')
      return
    }

    const newQuiz = {
      id: Date.now().toString(),
      category: 'Cultural & Local Knowledge',
      topic: formTopic,
      language: formLanguage,
      question: draftQuestion.trim(),
      options: draftOptions.map((o) => o.trim()),
      correctIndex: draftCorrectIndex,
      isPhotoQuiz: false,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }

    setQuizzes((prev) => [newQuiz, ...prev])
    setSaveSuccess('Quiz saved successfully in local storage!')

    setTimeout(() => {
      setSaveSuccess('')
      setIsCreatingQuiz(false)
      setQuizStep(1)
      setSelectedQuizType(null)
      setDraftGenerated(false)
    }, 1100)
  }

  // --- Family Recognition Quiz Flow ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFamPhotoData(event.target.result)
        setFamDraftGenerated(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateFamilyQuiz = () => {
    setFamDraftNotice('')
    setFormError('')

    const trimmedName = famName.trim()
    if (!trimmedName) {
      setFormError("Please enter the family member's name.")
      return
    }
    if (!famPhotoData) {
      setFormError('Please upload or provide a photo for this family member.')
      return
    }

    const langPack = FAMILY_TRANSLATIONS[famLanguage]
    if (!langPack) {
      setFamDraftGenerated(false)
      setFamDraftNotice(
        `Translation not available yet: Complete reviewed translations for ${famLanguage} are not ready. To prevent mixing languages, please select another language.`
      )
      return
    }

    const targetRelTranslated = langPack.relationships[famRelationshipKey]
    if (!targetRelTranslated) {
      setFamDraftGenerated(false)
      setFamDraftNotice(
        `Translation not available yet for relationship "${famRelationshipKey}" in ${famLanguage}. To avoid mixing languages in a single question, please select a standard reviewed relationship.`
      )
      return
    }

    const otherLabelledPhotos = familyMembersPool.filter(
      (m) => m.name.toLowerCase() !== trimmedName.toLowerCase()
    )

    if (otherLabelledPhotos.length < 2) {
      setFamDraftGenerated(false)
      setFamDraftNotice(
        `Not enough labelled family photos to create distractor options (found ${otherLabelledPhotos.length}, need at least 2). Please add more family photos to the pool below to generate this quiz.`
      )
      return
    }

    const distractor1 = otherLabelledPhotos[0]
    const distractor2 = otherLabelledPhotos[1]

    const dist1RelTranslated = langPack.relationships[distractor1.relationshipKey]
    const dist2RelTranslated = langPack.relationships[distractor2.relationshipKey]

    if (!dist1RelTranslated || !dist2RelTranslated) {
      setFamDraftGenerated(false)
      setFamDraftNotice(
        `Translation not available yet for some distractor family relationships in ${famLanguage}. All choices must have verified translations to avoid mixed languages.`
      )
      return
    }

    const targetChoice = {
      id: 'target-choice',
      name: trimmedName,
      relationshipLabel: targetRelTranslated,
      photoUrl: famPhotoData,
      isCorrect: true,
    }

    const distractorChoice1 = {
      id: distractor1.id,
      name: distractor1.name,
      relationshipLabel: dist1RelTranslated,
      photoUrl: distractor1.photoUrl,
      isCorrect: false,
    }

    const distractorChoice2 = {
      id: distractor2.id,
      name: distractor2.name,
      relationshipLabel: dist2RelTranslated,
      photoUrl: distractor2.photoUrl,
      isCorrect: false,
    }

    const qText = langPack.questionTemplate(trimmedName)

    setFamDraftQuestion(qText)
    setFamPhotoChoices([targetChoice, distractorChoice1, distractorChoice2])
    setFamDraftGenerated(true)
  }

  const handleSaveFamilyQuiz = (e) => {
    e.preventDefault()
    setFormError('')

    if (!famDraftGenerated) {
      setFormError('Please generate the draft quiz first.')
      return
    }

    const langPack = FAMILY_TRANSLATIONS[famLanguage] || FAMILY_TRANSLATIONS.English
    const targetRelLabel =
      langPack.relationships[famRelationshipKey] || famRelationshipKey

    const newQuiz = {
      id: Date.now().toString(),
      category: 'Family Recognition',
      topic: `${famName.trim()} (${targetRelLabel})`,
      language: famLanguage,
      question: famDraftQuestion,
      isPhotoQuiz: true,
      options: famPhotoChoices.map((c) => `${c.name} (${c.relationshipLabel})`),
      photoOptions: famPhotoChoices,
      correctIndex: 0,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }

    setQuizzes((prev) => [newQuiz, ...prev])
    setSaveSuccess('Family quiz saved successfully in local storage!')

    setTimeout(() => {
      setSaveSuccess('')
      setIsCreatingQuiz(false)
      setQuizStep(1)
      setSelectedQuizType(null)
      setFamDraftGenerated(false)
    }, 1100)
  }

  const handleDeleteQuiz = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id))
  }

  const handleRemoveFamilyMember = (id) => {
    setFamilyMembersPool((prev) => prev.filter((m) => m.id !== id))
    setFamDraftGenerated(false)
  }

  const handleAddSampleMember = () => {
    const newId = `demo-fam-${Date.now()}`
    const presets = [
      { name: 'Kavita', relKey: 'Aunt' },
      { name: 'Bikash', relKey: 'Uncle' },
      { name: 'Dev', relKey: 'Brother' },
      { name: 'Sunita', relKey: 'Sister' },
    ]
    const pick = presets[familyMembersPool.length % presets.length]

    const newMember = {
      id: newId,
      name: pick.name,
      relationshipKey: pick.relKey,
      photoUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23E2E8F0"/><circle cx="60" cy="45" r="22" fill="%23475569"/><path d="M25 105 C25 75, 95 75, 95 105 Z" fill="%23475569"/></svg>`,
    }
    setFamilyMembersPool((prev) => [...prev, newMember])
    setFamDraftNotice('')
  }

  // Filter quizzes by category
  const culturalQuizzes = quizzes.filter(
    (q) => q.category === 'Cultural & Local Knowledge'
  )
  const familyQuizzes = quizzes.filter(
    (q) => q.category === 'Family Recognition'
  )

  const currentFamLangPack =
    FAMILY_TRANSLATIONS[famLanguage] || FAMILY_TRANSLATIONS.English

  const navItems = [
    {
      name: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Quiz Activity',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Manage Quizzes',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      name: 'Alerts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      name: 'Patient Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ]
    if (!isLoggedIn) {
  const handleCaregiverLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/caregiver/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: loginContact,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || 'Login failed');
        return;
      }

      setCaregiver(data.caregiver);
      setIsLoggedIn(true);
    } catch (error) {
      setLoginError('Unable to connect to the server.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
            <h1 className="text-3xl font-bold text-[#0F3E3B]">
              SmritiSathi
            </h1>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 mt-6">
            Caregiver Login
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Sign in to manage your patient's care.
          </p>
        </div>

        <form onSubmit={handleCaregiverLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contact
            </label>

            <input
              type="text"
              value={loginContact}
              onChange={(e) => setLoginContact(e.target.value)}
              placeholder="Enter email or contact"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F3E3B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F3E3B]"
            />
          </div>

          {loginError && (
            <p className="text-sm text-red-600">
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-[#0F3E3B] text-white py-3 rounded-lg font-semibold hover:bg-[#0B302E] transition disabled:opacity-60"
          >
            {loginLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-slate-800 flex flex-col md:flex-row font-sans antialiased">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar overlay"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F3E3B] text-teal-50 flex flex-col shadow-xl transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 max-md:-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-teal-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#D4AF37] shadow-sm"></span>
              <span className="text-xl font-bold tracking-tight text-white">SmritiSathi</span>
            </div>
            <p className="text-xs text-teal-200/80 mt-1 pl-5">Caregiver Companion</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-teal-200 hover:text-white p-1 rounded-md cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-teal-300/70">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.name
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleTabClick(item.name)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#185551] text-white shadow-sm ring-1 ring-[#D4AF37]/40'
                    : 'text-teal-100/80 hover:bg-teal-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#D4AF37]' : 'text-teal-300/70'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Caregiver Portal Status Footer */}
        <div className="p-4 border-t border-teal-800/80 bg-[#0B3230]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center text-xs font-semibold text-teal-100">
              CP
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">Caregiver Portal</p>
              <p className="text-[11px] text-teal-300/70 truncate">Demo data</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#FEFDF9] border-b border-[#E7E2D5] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-teal-900 hover:bg-amber-100/60 focus:outline-hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#0F3E3B] tracking-tight">
                Caregiver Portal
              </h1>
              <p className="text-xs text-stone-500 hidden sm:block">
                Layout Preview
              </p>
            </div>
          </div>

          {/* Fixed Demo Patient Profile Card */}
          <div className="flex items-center gap-3 pl-3 py-1 pr-3 bg-[#FAF7F0] border border-[#E4DEC9] rounded-xl shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#185551] text-[#F3E7C4] font-semibold text-xs flex items-center justify-center ring-2 ring-[#D4AF37]/50 shadow-xs">
              DP
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-stone-900 leading-tight">
                  Demo Patient
                </span>
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-[#F4EAC8] text-[#825B0E]">
                  Demo data
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-none mt-0.5">
                No active patient connected
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'Quiz Activity' ? (
            /* Quiz Activity Page */
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F3F1] text-[#0F3E3B] mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#185551]"></span>
                      Activity Records
                    </span>
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      Quiz Activity
                    </h2>
                    <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                      Review completed quiz sessions, cognitive recall rates, and response metrics for Demo Patient. (Demo data)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-[#FEFDFB] border border-[#E2DBD0] px-3.5 py-2 rounded-xl text-stone-600 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#C99824]"></span>
                    <span>Monitoring: Inactive</span>
                  </div>
                </div>
              </div>

              {/* Informative Backend & Patient Activity Notice */}
              <div className="bg-[#FEF9EC] border border-[#F0E4BE] rounded-xl p-4 text-xs text-[#805B0D] flex items-start sm:items-center gap-3 shadow-2xs">
                <svg className="w-5 h-5 text-[#C99824] shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="leading-relaxed">
                  <strong>Notice:</strong> Activity records will appear here automatically after the patient completes quizzes on the companion app and the backend service is connected. No patient attempts or performance records exist in this prototype.
                </div>
              </div>

              {/* Activity Table with Specified Columns & Clear Empty State */}
              <div className="bg-white border border-[#E9E4D6] rounded-2xl shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#EFECE2] flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 tracking-tight">
                      Session Logs Table
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Detailed log of cognitive recall attempts.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {gameResults.length} Sessions Recorded
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F3] border-b border-[#E9E4D6] text-[11px] font-bold uppercase tracking-wider text-stone-600">
                        <th className="py-3.5 px-4 sm:px-6">Date</th>
                        <th className="py-3.5 px-4 sm:px-6">Quiz</th>
                        <th className="py-3.5 px-4 sm:px-6">Quiz Type</th>
                        <th className="py-3.5 px-4 sm:px-6">Completion</th>
                        <th className="py-3.5 px-4 sm:px-6">Correct Answers</th>
                        <th className="py-3.5 px-4 sm:px-6">Response Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameResultsLoading ? (
  <tr>
    <td colSpan={6} className="py-12 px-4 text-center text-sm text-stone-500">
      Loading patient activity...
    </td>
  </tr>
) : gameResultsError ? (
  <tr>
    <td colSpan={6} className="py-12 px-4 text-center text-sm text-red-600">
      Unable to load activity: {gameResultsError}
    </td>
  </tr>
) : gameResults.length > 0 ? (
  gameResults.map((result) => (
    <tr
      key={result.id}
      className="border-b border-[#EFECE2] text-sm text-stone-700"
    >
      <td className="py-4 px-4 sm:px-6">
        {result.created_at
          ? new Date(result.created_at).toLocaleString()
          : '—'}
      </td>

      <td className="py-4 px-4 sm:px-6 font-medium text-stone-900">
        {result.game}
      </td>

      <td className="py-4 px-4 sm:px-6">
        {result.difficulty}
      </td>

      <td className="py-4 px-4 sm:px-6">
        {result.accuracy}%
      </td>

      <td className="py-4 px-4 sm:px-6">
        {Math.max(0, 4 - result.mistakes)} / 4
      </td>

      <td className="py-4 px-4 sm:px-6">
        {result.completion_time}s
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={6} className="py-12 px-4 text-center">
      <p className="text-sm font-semibold text-stone-800">
        No quiz activity yet
      </p>
      <p className="text-xs text-stone-500 mt-1">
        Patient quiz results will appear here after a quiz is completed.
      </p>
    </td>
  </tr>
)}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'Manage Quizzes' ? (
            isCreatingQuiz ? (
              quizStep === 1 ? (
                /* Step 1: Quiz Type Selection Screen */
                <div className="space-y-6">
                  <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <button
                          type="button"
                          onClick={exitQuizCreation}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3E3B] hover:text-[#185551] mb-2.5 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Manage Quizzes
                        </button>
                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                          Select Quiz Type
                        </h2>
                        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                          Choose a quiz category to begin creating recall questions for Demo Patient. (Demo data)
                        </p>
                      </div>

                      <div className="self-start sm:self-auto">
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-stone-100 text-stone-600">
                          Step 1 of 2: Type Selection
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Selection Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Choice 1: Cultural & Local Knowledge */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedQuizType('Cultural & Local Knowledge')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedQuizType('Cultural & Local Knowledge')
                        }
                      }}
                      className={`text-left rounded-2xl p-6 transition-all border cursor-pointer flex flex-col justify-between shadow-xs ${
                        selectedQuizType === 'Cultural & Local Knowledge'
                          ? 'border-[#0F3E3B] ring-2 ring-[#D4AF37] bg-[#F7F5EE]'
                          : 'border-[#E9E4D6] bg-white hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#FEF4DA] text-[#9A7016] flex items-center justify-center shadow-xs">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                              selectedQuizType === 'Cultural & Local Knowledge'
                                ? 'border-[#0F3E3B] bg-[#0F3E3B] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {selectedQuizType === 'Cultural & Local Knowledge' && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2">
                          Cultural & Local Knowledge
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Questions on North East India traditions, Bihu, Hornbill Festival, Kazi Nemu, and traditional instruments across regional languages.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#EFECE2] flex items-center justify-between text-[11px] text-stone-500">
                        <span>Domain: North East India Cultural</span>
                        <span className="font-medium text-[#0F3E3B]">Auto-draft Ready</span>
                      </div>
                    </div>

                    {/* Choice 2: Family Recognition */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedQuizType('Family Recognition')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedQuizType('Family Recognition')
                        }
                      }}
                      className={`text-left rounded-2xl p-6 transition-all border cursor-pointer flex flex-col justify-between shadow-xs ${
                        selectedQuizType === 'Family Recognition'
                          ? 'border-[#0F3E3B] ring-2 ring-[#D4AF37] bg-[#F7F5EE]'
                          : 'border-[#E9E4D6] bg-white hover:border-[#D4AF37]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-[#E7F3F1] text-[#0F3E3B] flex items-center justify-center shadow-xs">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                              selectedQuizType === 'Family Recognition'
                                ? 'border-[#0F3E3B] bg-[#0F3E3B] text-white'
                                : 'border-stone-300 bg-white'
                            }`}
                          >
                            {selectedQuizType === 'Family Recognition' && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-2">
                          Family Recognition
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Enter a family member&apos;s name and relationship, upload their photo, and auto-draft &ldquo;Who is Priya?&rdquo; photo recognition quizzes with pure language translation.
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#EFECE2] flex items-center justify-between text-[11px] text-stone-500">
                        <span>Domain: Personal Memory</span>
                        <span className="font-medium text-[#0F3E3B]">Pure Translation</span>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  {selectedQuizType && (
                    <div className="bg-white border border-[#E9E4D6] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Selected Type
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                          <h4 className="text-base font-bold text-[#0F3E3B]">
                            {selectedQuizType}
                          </h4>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Click Continue to proceed to step 2 configuration.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedQuizType(null)}
                          className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Clear Selection
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQuizStep(2)
                            setDraftGenerated(false)
                            setFamDraftGenerated(false)
                            setMissingReviewNotice('')
                            setFamDraftNotice('')
                          }}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Continue</span>
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : selectedQuizType === 'Cultural & Local Knowledge' ? (
                /* Step 2: Cultural & Local Knowledge Generator */
                <div className="space-y-6">
                  <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3E3B] hover:text-[#185551] mb-2.5 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Type Selection
                        </button>
                        <div className="inline-flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Step 2: Cultural Quiz
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                          Cultural & Local Knowledge Generator
                        </h2>
                        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                          Select a North East India topic and language, then click <strong>“Generate Quiz”</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Back</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Informational Banner */}
                  <div className="bg-[#FEF9EC] border border-[#F0E4BE] rounded-xl p-3.5 text-xs text-[#805B0D] flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#C99824] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Prototype Notice:</strong> Questions use verified North East India cultural records from a curated local sample bank. No external AI services or medical claims are used.
                    </span>
                  </div>

                  {/* Topic & Language Selection */}
                  <div className="bg-white border border-[#E9E4D6] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5">
                        <label htmlFor="topic-dropdown" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Topic (North East India)
                        </label>
                        <select
                          id="topic-dropdown"
                          value={formTopic}
                          onChange={(e) => {
                            setFormTopic(e.target.value)
                            setDraftGenerated(false)
                            setMissingReviewNotice('')
                          }}
                          className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                        >
                          <option value="Festivals">Festivals (Bihu, Hornbill, Yaoshang, Bwisagu)</option>
                          <option value="Local Fruits">Local Fruits (Kazi Nemu, Queen Pineapple, Kachai Lemon)</option>
                          <option value="Traditional Instruments">Traditional Instruments (Pepa, Pena, Kham, Tokari)</option>
                          <option value="Local Nature">Local Nature (Kaziranga Rhino, Loktak Phumdis, Kopou)</option>
                        </select>
                      </div>

                      <div className="md:col-span-4">
                        <label htmlFor="language-dropdown" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Language
                        </label>
                        <select
                          id="language-dropdown"
                          value={formLanguage}
                          onChange={(e) => {
                            setFormLanguage(e.target.value)
                            setDraftGenerated(false)
                            setMissingReviewNotice('')
                          }}
                          className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                        >
                          {LANGUAGE_OPTIONS.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-3">
                        <button
                          type="button"
                          onClick={handleGenerateCulturalQuiz}
                          className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Generate Quiz</span>
                        </button>
                      </div>
                    </div>

                    {missingReviewNotice && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 text-xs text-amber-900 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-bold text-amber-950 mb-0.5">
                            Language Review Pending
                          </p>
                          <p className="leading-relaxed">{missingReviewNotice}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cultural Draft Card */}
                  {draftGenerated ? (
                    <form onSubmit={handleSaveCulturalQuiz} className="bg-white border border-[#E9E4D6] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#EFECE2] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <h3 className="text-base font-bold text-stone-900 tracking-tight">
                              Draft Question (Auto-Created)
                            </h3>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Topic: <strong className="text-stone-700">{formTopic}</strong> • Language: <strong className="text-stone-700">{formLanguage}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={handleGenerateCulturalQuiz}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Regenerate</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setIsEditingDraft(!isEditingDraft)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isEditingDraft ? 'bg-[#0F3E3B] text-white' : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>{isEditingDraft ? 'Done Editing' : 'Edit Draft'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div>
                        {isEditingDraft ? (
                          <textarea
                            rows={3}
                            value={draftQuestion}
                            onChange={(e) => setDraftQuestion(e.target.value)}
                            className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl p-3.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                          />
                        ) : (
                          <div className="bg-[#FAF8F3] border border-[#E6DFCE] rounded-xl p-4 sm:p-5">
                            <p className="text-base font-semibold text-stone-900 leading-snug">
                              {draftQuestion}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 3 Options */}
                      <div className="space-y-3">
                        {draftOptions.map((opt, idx) => {
                          const isCorrect = draftCorrectIndex === idx
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                                isCorrect
                                  ? 'border-[#0F3E3B] bg-[#F7F5EE] ring-1 ring-[#D4AF37]/50'
                                  : 'border-[#E6DFCE] bg-[#FAF8F3]'
                              }`}
                            >
                              {isEditingDraft ? (
                                <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                  <input
                                    type="radio"
                                    name="draftCorrectOption"
                                    checked={isCorrect}
                                    onChange={() => setDraftCorrectIndex(idx)}
                                    className="w-4 h-4 text-[#0F3E3B] focus:ring-[#0F3E3B] cursor-pointer"
                                  />
                                  <span className="text-xs font-bold text-stone-700 w-16">
                                    Choice {String.fromCharCode(65 + idx)}:
                                  </span>
                                </label>
                              ) : (
                                <span className="w-6 h-6 rounded-full bg-stone-200/80 text-xs font-bold flex items-center justify-center text-stone-700 shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                              )}

                              {isEditingDraft ? (
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const updated = [...draftOptions]
                                    updated[idx] = e.target.value
                                    setDraftOptions(updated)
                                  }}
                                  className="flex-1 bg-white border border-[#DCD5C4] rounded-lg px-3 py-1.5 text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-[#0F3E3B]"
                                />
                              ) : (
                                <span className="flex-1 text-sm text-stone-800 font-medium">
                                  {opt}
                                </span>
                              )}

                              {isCorrect && (
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E7F3F1] text-[#0F3E3B] border border-[#BEDCD7] shrink-0">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {formError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                          {formError}
                        </div>
                      )}
                      {saveSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{saveSuccess}</span>
                        </div>
                      )}

                      <div className="pt-4 border-t border-[#EFECE2] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewData({
                                title: 'Cultural Quiz Preview',
                                topic: formTopic,
                                language: formLanguage,
                                question: draftQuestion,
                                isPhotoQuiz: false,
                                options: draftOptions,
                                correctIndex: draftCorrectIndex,
                              })
                            }
                            className="px-5 py-2.5 rounded-xl border border-[#0F3E3B] text-[#0F3E3B] hover:bg-[#E7F3F1] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Preview
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            Save Quiz
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="border border-dashed border-[#DFD8C8] bg-white rounded-2xl p-10 text-center shadow-xs">
                      <h4 className="text-sm font-bold text-stone-800">
                        Ready to Generate North East India Quiz
                      </h4>
                      <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                        Select a topic and language above, then click <strong>“Generate Quiz”</strong>.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Step 2: Family Recognition Quiz Flow (Pure Translation, Untranslated Names) */
                <div className="space-y-6">
                  {/* Step 2 Header */}
                  <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F3E3B] hover:text-[#185551] mb-2.5 transition-colors cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back to Type Selection
                        </button>
                        <div className="inline-flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                            Step 2: Family Recognition Quiz
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                          Family Member Photo Recognition
                        </h2>
                        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                          Select the target language, enter a family member&apos;s name and relationship, and upload their photo. The entire question and labels will appear in pure regional language with unmixed terms.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Back</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Informational Banner */}
                  <div className="bg-[#FEF9EC] border border-[#F0E4BE] rounded-xl p-3.5 text-xs text-[#805B0D] flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-[#C99824] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Language Policy:</strong> Entire questions and relationship labels are translated into the chosen language without mixing words. Family members&apos; personal names stay exactly as entered by the caregiver.
                    </span>
                  </div>

                  {/* Family Member Input Form */}
                  <div className="bg-white border border-[#E9E4D6] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 tracking-tight">
                        1. Family Member Information & Language
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Choose language and standard relationship to ensure a complete, non-mixed regional translation.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Language Selection */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Quiz Language
                        </label>
                        <select
                          value={famLanguage}
                          onChange={(e) => {
                            setFamLanguage(e.target.value)
                            setFamDraftGenerated(false)
                            setFamDraftNotice('')
                          }}
                          className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                        >
                          {LANGUAGE_OPTIONS.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Name (Preserved exactly as entered) */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Family Member Name (Kept Exact)
                        </label>
                        <input
                          type="text"
                          value={famName}
                          onChange={(e) => {
                            setFamName(e.target.value)
                            setFamDraftGenerated(false)
                            setFamDraftNotice('')
                          }}
                          placeholder="e.g. Priya"
                          className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                        />
                      </div>

                      {/* Relationship Dropdown with Reviewed Translations */}
                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Relationship ({currentFamLangPack.relationshipHeader})
                        </label>
                        <select
                          value={famRelationshipKey}
                          onChange={(e) => {
                            setFamRelationshipKey(e.target.value)
                            setFamDraftGenerated(false)
                            setFamDraftNotice('')
                          }}
                          className="w-full bg-[#FAF8F3] border border-[#DCD5C4] rounded-xl px-3.5 py-2.5 text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-[#0F3E3B]"
                        >
                          {STANDARD_RELATIONSHIPS.map((rel) => {
                            const translated = currentFamLangPack.relationships[rel] || rel
                            return (
                              <option key={rel} value={rel}>
                                {translated} ({rel})
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* Photo Upload Box */}
                      <div className="md:col-span-12 pt-2">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                          Upload Photo of {famName || 'Family Member'}
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-dashed border-[#DFD8C8] bg-[#FAF8F3]">
                          {famPhotoData ? (
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#DCD5C4] shadow-xs shrink-0 bg-white">
                              <img
                                src={famPhotoData}
                                alt={famName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-stone-200 text-stone-400 flex items-center justify-center text-xs shrink-0">
                              No photo
                            </div>
                          )}

                          <div className="flex-1 text-center sm:text-left">
                            <input
                              type="file"
                              accept="image/*"
                              id="family-photo-upload"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="family-photo-upload"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#DCD5C4] hover:bg-stone-50 text-xs font-bold text-[#0F3E3B] cursor-pointer shadow-2xs transition-colors"
                            >
                              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Browse & Upload Photo</span>
                            </label>
                            <p className="text-[11px] text-stone-500 mt-1.5">
                              JPEG, PNG, or SVG. Stored strictly in local browser memory for demo.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleGenerateFamilyQuiz}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Generate Quiz</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notice when translation not available or not enough distractors */}
                    {famDraftNotice && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <p className="font-bold text-amber-950 mb-0.5">
                            Translation / Distractor Notice
                          </p>
                          <p className="leading-relaxed">{famDraftNotice}</p>
                        </div>
                      </div>
                    )}

                    {/* Labelled Family Photos Pool (Distractor Source) */}
                    <div className="pt-4 border-t border-[#EFECE2]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                            Labelled Family Photo Pool ({familyMembersPool.length} Photos)
                          </h4>
                          <p className="text-[11px] text-stone-500">
                            Distractor photos are pulled strictly from other labelled family members in this pool.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSampleMember}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>+ Add Family Photo</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {familyMembersPool.map((member) => {
                          const translatedRel =
                            currentFamLangPack.relationships[member.relationshipKey] ||
                            member.relationshipKey
                          return (
                            <div
                              key={member.id}
                              className="p-2.5 rounded-xl border border-[#E6DFCE] bg-[#FAF8F3] flex items-center gap-3 relative shadow-2xs"
                            >
                              <img
                                src={member.photoUrl}
                                alt={member.name}
                                className="w-10 h-10 rounded-lg object-cover bg-white border border-[#DCD5C4]"
                              />
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-stone-900 truncate">
                                  {member.name}
                                </p>
                                <p className="text-[10px] text-stone-500 truncate">
                                  {translatedRel}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFamilyMember(member.id)}
                                className="absolute top-1 right-1 text-stone-400 hover:text-red-600 p-0.5"
                                title="Remove from pool"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Generated Draft Family Recognition Quiz Card (Pure Translation) */}
                  {famDraftGenerated ? (
                    <form onSubmit={handleSaveFamilyQuiz} className="bg-white border border-[#E9E4D6] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#EFECE2] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <h3 className="text-base font-bold text-stone-900 tracking-tight">
                              2. Draft Question & Photo Options
                            </h3>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Language: <strong className="text-stone-700">{famLanguage}</strong> • Target: <strong className="text-stone-700">{famName}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={handleGenerateFamilyQuiz}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Regenerate Choices</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Banner in Pure Language */}
                      <div className="bg-[#FAF8F3] border border-[#E6DFCE] rounded-xl p-5 text-center sm:text-left">
                        <span className="text-xs font-bold text-[#825B0E] uppercase tracking-wider">
                          {currentFamLangPack.targetLabel}
                        </span>
                        <h4 className="text-xl font-bold text-stone-900 mt-1">
                          {famDraftQuestion}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {currentFamLangPack.relationshipHeader}: <strong>{currentFamLangPack.relationships[famRelationshipKey]}</strong>
                        </p>
                      </div>

                      {/* 3 Photo Choices */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                            {currentFamLangPack.choicesLabel}
                          </label>
                          <span className="text-xs text-emerald-800 font-medium">
                            {currentFamLangPack.correctBadge}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {famPhotoChoices.map((choice, idx) => (
                            <div
                              key={choice.id || idx}
                              className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                                choice.isCorrect
                                  ? 'border-[#0F3E3B] bg-[#F7F5EE] ring-2 ring-[#D4AF37]/50 shadow-xs'
                                  : 'border-[#E6DFCE] bg-[#FAF8F3]'
                              }`}
                            >
                              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-[#DCD5C4] mb-3 bg-white">
                                <img
                                  src={choice.photoUrl}
                                  alt={choice.name}
                                  className="w-full h-full object-cover"
                                />
                                {choice.isCorrect && (
                                  <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-1 shadow-xs">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <span className="w-6 h-6 rounded-full bg-stone-200 text-xs font-bold flex items-center justify-center text-stone-700 mb-1">
                                {String.fromCharCode(65 + idx)}
                              </span>

                              <p className="text-sm font-bold text-stone-900 leading-tight">
                                {choice.name}
                              </p>
                              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                                {choice.relationshipLabel}
                              </p>

                              {choice.isCorrect ? (
                                <span className="mt-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7F3F1] text-[#0F3E3B] border border-[#BEDCD7]">
                                  {currentFamLangPack.correctBadge}
                                </span>
                              ) : (
                                <span className="mt-3 text-[10px] text-stone-500 px-2 py-0.5 rounded-full bg-stone-100">
                                  {currentFamLangPack.distractorBadge}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {formError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                          {formError}
                        </div>
                      )}
                      {saveSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{saveSuccess}</span>
                        </div>
                      )}

                      {/* Action Buttons: Back, Preview, Save Quiz */}
                      <div className="pt-4 border-t border-[#EFECE2] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setQuizStep(1)}
                          className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Back
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewData({
                                title: 'Family Recognition Quiz Preview',
                                topic: `${famName} (${currentFamLangPack.relationships[famRelationshipKey]})`,
                                language: famLanguage,
                                question: famDraftQuestion,
                                isPhotoQuiz: true,
                                photoOptions: famPhotoChoices,
                                correctIndex: 0,
                                langPack: currentFamLangPack,
                              })
                            }
                            className="px-5 py-2.5 rounded-xl border border-[#0F3E3B] text-[#0F3E3B] hover:bg-[#E7F3F1] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Preview
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            Save Quiz
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="border border-dashed border-[#DFD8C8] bg-white rounded-2xl p-10 text-center shadow-xs">
                      <h4 className="text-sm font-bold text-stone-800">
                        Ready to Generate Family Recognition Quiz
                      </h4>
                      <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                        Select language and details for {famName}, then click <strong>“Generate Quiz”</strong>.
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Manage Quizzes Main View */
              <div className="space-y-6">
                <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F3F1] text-[#0F3E3B] mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#185551]"></span>
                        Quiz Management
                      </span>
                      <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                        Manage Quizzes
                      </h2>
                      <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                        Organize memory recall quizzes across categories for Demo Patient. (Demo data)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={startQuizCreation}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3E3B] hover:bg-[#185551] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create a Quiz</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category 1: Cultural & Local Knowledge */}
                  <div className="bg-white border border-[#E9E4D6] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FEF4DA] text-[#9A7016] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-stone-900 tracking-tight">
                              Cultural & Local Knowledge
                            </h3>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-stone-100 text-stone-600">
                          {culturalQuizzes.length} {culturalQuizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                        North East India traditions, festivals (Bihu, Hornbill), fruits (Kazi Nemu), and instruments.
                      </p>

                      {culturalQuizzes.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          {culturalQuizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              className="p-4 rounded-xl border border-[#E4DEC9] bg-[#FAF8F3] space-y-2.5 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FAF7F0] border border-[#E4DEC9] text-[#825B0E]">
                                    {quiz.topic}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-stone-200/80 text-stone-700">
                                    {quiz.language}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-stone-400">
                                    {quiz.createdAt}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                    className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                    title="Delete Quiz"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs font-semibold text-stone-900 leading-snug">
                                {quiz.question}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                                {quiz.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={`px-2 py-1 rounded-lg border truncate ${
                                      quiz.correctIndex === i
                                        ? 'border-[#BEDCD7] bg-[#E7F3F1] text-[#0F3E3B] font-semibold'
                                        : 'border-stone-200 bg-white text-stone-600'
                                    }`}
                                    title={opt}
                                  >
                                    <span className="text-[9px] mr-1 opacity-70">
                                      {String.fromCharCode(65 + i)}:
                                    </span>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-[#DFD8C8] bg-[#FAF8F3] rounded-xl p-8 text-center mt-2">
                          <h4 className="text-sm font-semibold text-stone-700">
                            No quizzes created yet
                          </h4>
                          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                            No cultural quizzes created yet. (Demo data)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#EFECE2] flex items-center justify-between text-xs text-stone-500">
                      <span>Category: Cultural (NER)</span>
                      <span className="text-stone-600 font-medium">
                        {culturalQuizzes.length} stored locally
                      </span>
                    </div>
                  </div>

                  {/* Category 2: Family Recognition */}
                  <div className="bg-white border border-[#E9E4D6] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#E7F3F1] text-[#0F3E3B] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-stone-900 tracking-tight">
                              Family Recognition
                            </h3>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-stone-100 text-stone-600">
                          {familyQuizzes.length} {familyQuizzes.length === 1 ? 'Quiz' : 'Quizzes'}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                        Personal photos, family relations, and memory prompts to support face recognition.
                      </p>

                      {familyQuizzes.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          {familyQuizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              className="p-4 rounded-xl border border-[#E4DEC9] bg-[#FAF8F3] space-y-2.5 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FAF7F0] border border-[#E4DEC9] text-[#825B0E]">
                                    {quiz.topic}
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-stone-200/80 text-stone-700">
                                    {quiz.language}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-stone-400">
                                    {quiz.createdAt}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                    className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                                    title="Delete Quiz"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs font-semibold text-stone-900 leading-snug">
                                {quiz.question}
                              </p>

                              {quiz.photoOptions ? (
                                <div className="grid grid-cols-3 gap-2 pt-1">
                                  {quiz.photoOptions.map((opt, i) => (
                                    <div
                                      key={i}
                                      className={`p-1.5 rounded-lg border text-center ${
                                        opt.isCorrect
                                          ? 'border-[#BEDCD7] bg-[#E7F3F1]'
                                          : 'border-stone-200 bg-white'
                                      }`}
                                    >
                                      <img
                                        src={opt.photoUrl}
                                        alt={opt.name}
                                        className="w-12 h-12 object-cover rounded-md mx-auto mb-1 border border-stone-200"
                                      />
                                      <p className="text-[10px] font-bold text-stone-900 truncate">
                                        {opt.name}
                                      </p>
                                      <p className="text-[9px] text-stone-600 font-medium truncate">
                                        {opt.relationshipLabel}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
                                  {quiz.options.map((opt, i) => (
                                    <div
                                      key={i}
                                      className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-600 truncate"
                                    >
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border border-dashed border-[#DFD8C8] bg-[#FAF8F3] rounded-xl p-8 text-center mt-2">
                          <h4 className="text-sm font-semibold text-stone-700">
                            No quizzes created yet
                          </h4>
                          <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                            No family recognition quizzes created yet. (Demo data)
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#EFECE2] flex items-center justify-between text-xs text-stone-500">
                      <span>Category: Family</span>
                      <span className="text-stone-600 font-medium">
                        {familyQuizzes.length} stored locally
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : activeTab === 'Overview' ? (
            /* Overview Page */
            <div className="space-y-6">
              <div className="bg-[#FAF7EF] border border-[#E6DFCE] rounded-2xl p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F3F1] text-[#0F3E3B] mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#185551]"></span>
                      Overview
                    </span>
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      Patient Overview
                    </h2>
                    <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                      Layout placeholder for <strong className="text-stone-800">Demo Patient</strong>. Real patient records are not connected yet.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-[#FEFDFB] border border-[#E2DBD0] px-3 py-2 rounded-xl text-stone-600 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#C99824]"></span>
                    <span>Demo data</span>
                  </div>
                </div>
              </div>

              {/* Metric Empty State Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E9E4D6] rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Recent Activity
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-stone-100 text-stone-600">
                      Demo data
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-stone-700 mt-3">No data yet</p>
                  <p className="text-xs text-stone-400 mt-1">No activity recorded</p>
                </div>

                <div className="bg-white border border-[#E9E4D6] rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Quiz Activity
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-stone-100 text-stone-600">
                      Demo data
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-stone-700 mt-3">No data yet</p>
                  <p className="text-xs text-stone-400 mt-1">No quiz sessions recorded</p>
                </div>

                <div className="bg-white border border-[#E9E4D6] rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Alerts
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-stone-100 text-stone-600">
                      Demo data
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-stone-700 mt-3">No data yet</p>
                  <p className="text-xs text-stone-400 mt-1">No alerts recorded</p>
                </div>

                <div className="bg-white border border-[#E9E4D6] rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Patient Status
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-stone-100 text-stone-600">
                      Demo data
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-stone-700 mt-3">No data yet</p>
                  <p className="text-xs text-stone-400 mt-1">No status recorded</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E9E4D6] rounded-2xl p-10 text-center shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 tracking-tight">{activeTab}</h2>
              <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
                No data yet for <span className="font-semibold text-stone-700">{activeTab}</span>. (Demo data)
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('Overview')}
                className="mt-6 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F3E3B] text-white hover:bg-[#185551] transition-colors shadow-xs cursor-pointer"
              >
                Back to Overview
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Shared Preview Modal (Pure Regional Language) */}
      {previewData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#E9E4D6] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFECE2]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  {previewData.title}
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                Caregiver Preview
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E4DEC9] text-[#825B0E] font-medium">
                {previewData.topic}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E7F3F1] text-[#0F3E3B] font-medium">
                {previewData.language}
              </span>
            </div>

            <div className="bg-[#FAF8F3] border border-[#E6DFCE] rounded-xl p-5 text-center">
              <p className="text-lg font-bold text-stone-900 leading-snug">
                {previewData.question}
              </p>
            </div>

            {/* Photo Quiz Preview */}
            {previewData.isPhotoQuiz ? (
              <div className="grid grid-cols-3 gap-3">
                {previewData.photoOptions.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center ${
                      opt.isCorrect
                        ? 'border-[#0F3E3B] bg-[#E7F3F1] ring-1 ring-[#D4AF37]/50'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <img
                      src={opt.photoUrl}
                      alt={opt.name}
                      className="w-20 h-20 rounded-lg object-cover mb-2 border border-stone-200"
                    />
                    <p className="text-xs font-bold text-stone-900">{opt.name}</p>
                    <p className="text-[10px] text-stone-600 font-medium">{opt.relationshipLabel}</p>
                    {opt.isCorrect && (
                      <span className="mt-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {previewData.langPack?.correctBadge || 'Key Answer'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {previewData.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-center justify-between text-sm ${
                      previewData.correctIndex === i
                        ? 'border-[#0F3E3B] bg-[#E7F3F1] font-semibold text-[#0F3E3B]'
                        : 'border-[#E6DFCE] bg-white text-stone-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {previewData.correctIndex === i && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F3E3B] text-white">
                        Correct Answer
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#EFECE2] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewData(null)}
                className="px-5 py-2 rounded-xl bg-[#0F3E3B] text-white text-xs font-semibold hover:bg-[#185551] transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
