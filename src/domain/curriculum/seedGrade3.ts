import {
  Curriculum,
  CurriculumGrade,
  Unit,
  Lesson,
  LearningObjective,
  KnowledgeItem,
} from "@/types/curriculum";

// ==========================================
// 1. LEARNING OBJECTIVES
// ==========================================

export const objectiveG3U1: LearningObjective = {
  id: "obj_g3_u1_greetings",
  title: "Social Greetings & Polite Well-being",
  titleVi: "Chào hỏi thân mật & Hỏi thăm sức khỏe",
  understandStatement: "Hiểu cách chào hỏi thân mật và lịch sự với bạn bè và thầy cô bằng tiếng Anh.",
  recognizeStatement: "Nhận diện từ 'Hello', 'Hi', 'Fine', 'Thank you' trong lời nói và mặt chữ.",
  sayStatement: "Phát âm chuẩn âm /h/, tự tin chào và hỏi 'Hello! How are you?' với bạn.",
  hearStatement: "Nghe hiểu các câu chào hỏi và phản hồi sức khỏe tự nhiên trong ngữ cảnh thực tế.",
  readStatement: "Đọc hiểu các mẩu hội thoại chào hỏi 2-3 lượt lời.",
  writeStatement: "Viết đúng chính tả các từ chào hỏi cơ bản: Hello, Hi, Fine, Thanks.",
  realWorldContext: "Gặp gỡ bạn mới ở sân chơi trường học, chào hỏi bạn bè vào mỗi buổi sáng.",
  cefrLevel: "Pre-A1",
  cambridgeStage: "Starters 1",
  primaryKnowledgeItemIds: [
    "k_g3_u1_hello",
    "k_g3_u1_hi",
    "k_g3_u1_how_are_you",
    "k_g3_u1_im_fine_thanks",
    "k_g3_u1_phonics_h",
  ],
};

export const objectiveG3U2: LearningObjective = {
  id: "obj_g3_u2_names_friends",
  title: "Asking Names & Introducing Friends",
  titleVi: "Hỏi tên & Giới thiệu bạn bè",
  understandStatement: "Hiểu cấu trúc hỏi đáp tên riêng và cách giới thiệu bạn đồng hành với người khác.",
  recognizeStatement: "Nhận diện cấu trúc 'What's your name?' và 'This is my friend...'",
  sayStatement: "Tự tin nói 'My name is [Tên]' và 'This is my friend, Chú Lười.'",
  hearStatement: "Nghe bắt được tên riêng của người nói trong đoạn hội thoại ngắn.",
  readStatement: "Đọc hiểu thẻ học sinh, bảng tên và đoạn văn giới thiệu bạn bè.",
  writeStatement: "Viết được câu tự giới thiệu tên mình kèm viết hoa chữ cái đầu tên riêng.",
  realWorldContext: "Buổi đầu tiên đến lớp tiếng Anh làm quen bạn cùng bàn hoặc giới thiệu bạn với Chú Lười.",
  cefrLevel: "Pre-A1",
  cambridgeStage: "Starters 1",
  primaryKnowledgeItemIds: [
    "k_g3_u2_name",
    "k_g3_u2_friend",
    "k_g3_u2_whats_your_name",
    "k_g3_u2_my_name_is",
    "k_g3_u2_this_is_my_friend",
    "k_g3_u2_phonics_n",
  ],
};

// ==========================================
// 2. KNOWLEDGE GRAPH NODES (KnowledgeItems)
// ==========================================

export const knowledgeItemsGrade3: KnowledgeItem[] = [
  // --- Unit 1 Nodes ---
  {
    id: "k_g3_u1_hello",
    type: "vocabulary",
    primaryText: "Hello",
    vietnameseMeaning: "Xin chào (lịch sự / chuẩn mực)",
    phoneticIpa: "/həˈloʊ/",
    audioKey: "audio.g3.u1.hello",
    exampleSentence: "Hello! Nice to meet you.",
    targetStage: "recognize",
    skillFocus: ["listening", "speaking", "reading", "vocabulary"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 1",
      targetGrammarPoint: "Greetings (formal/standard)",
    },
    communicationCompetency: {
      functionCategory: "Social Greetings",
      canDoStatementEn: "Can greet teachers, parents, and friends politely in standard English.",
      canDoStatementVi: "Có thể chào hỏi thầy cô và bạn bè một cách lịch sự, chuẩn mực.",
      fluencyExpectation: "word",
      naturalContextExample: "Meeting teacher entering classroom: 'Hello, Teacher!'",
    },
    learningObjectiveIds: ["obj_g3_u1_greetings"],
    relations: [
      { targetId: "k_g3_u1_hi", relationType: "reinforces", note: "Hi is informal counterpart" },
      { targetId: "k_g3_u1_phonics_h", relationType: "related", note: "Initial sound /h/" },
    ],
    recallVariants: [
      {
        id: "rc_hello_flashcard",
        contextType: "flashcard",
        promptText: "How do you say 'Xin chào' politely?",
        promptTextVi: "Nói 'Xin chào' một cách lịch sự trong tiếng Anh như thế nào?",
        scenarioDescription: "Chú Lười vẫy tay mỉm cười chào bạn buổi sáng.",
        expectedResponse: "Hello",
      },
      {
        id: "rc_hello_dialogue",
        contextType: "conversation",
        promptText: "Chú Lười says: 'Hello!' -> How do you reply?",
        promptTextVi: "Chú Lười chào bạn: 'Hello!' -> Bé đáp lại thế nào?",
        scenarioDescription: "Gặp Chú Lười tại cổng trường.",
        expectedResponse: "Hello",
      },
    ],
    tags: ["greeting", "unit1", "starter"],
  },

  {
    id: "k_g3_u1_hi",
    type: "vocabulary",
    primaryText: "Hi",
    vietnameseMeaning: "Chào bạn (thân mật)",
    phoneticIpa: "/haɪ/",
    audioKey: "audio.g3.u1.hi",
    exampleSentence: "Hi, Nam!",
    targetStage: "recall",
    skillFocus: ["speaking", "listening", "vocabulary"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 1",
    },
    communicationCompetency: {
      functionCategory: "Social Greetings",
      canDoStatementEn: "Can greet close friends and peers in a friendly, casual tone.",
      canDoStatementVi: "Có thể chào bạn bè cùng trang lứa một cách gần gũi, tự nhiên.",
      fluencyExpectation: "word",
      naturalContextExample: "At the school playground: 'Hi, Nam!'",
    },
    learningObjectiveIds: ["obj_g3_u1_greetings"],
    relations: [
      { targetId: "k_g3_u1_hello", relationType: "reinforces" },
      { targetId: "k_g3_u1_phonics_h", relationType: "related" },
    ],
    recallVariants: [
      {
        id: "rc_hi_flashcard",
        contextType: "flashcard",
        promptText: "A short, friendly way to say hello to friends:",
        promptTextVi: "Cách chào ngắn gọn, thân mật với bạn bè:",
        scenarioDescription: "Hai bạn cùng lớp gặp nhau ở sân trường.",
        expectedResponse: "Hi",
      },
    ],
    tags: ["greeting", "unit1", "casual"],
  },

  {
    id: "k_g3_u1_phonics_h",
    type: "phonics",
    primaryText: "/h/ sound",
    vietnameseMeaning: "Âm /h/ trong tiếng Anh (âm thở nhẹ)",
    phoneticIpa: "/h/",
    audioKey: "audio.g3.phonics.h",
    exampleSentence: "H says /h/ as in Hello and Hi.",
    targetStage: "understand",
    skillFocus: ["phonics", "speaking", "listening"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 3 Phonics",
    },
    communicationCompetency: {
      functionCategory: "Pronunciation & Phonics",
      canDoStatementEn: "Can articulate the aspirated /h/ sound distinctly without dropping the breath.",
      canDoStatementVi: "Có thể phát âm bật hơi âm /h/ rõ ràng, không nuốt âm đầu.",
      fluencyExpectation: "word",
      naturalContextExample: "Practicing the letter H: 'H - /h/ - Hello!'",
    },
    learningObjectiveIds: ["obj_g3_u1_greetings"],
    relations: [
      { targetId: "k_g3_u1_hello", relationType: "appliesIn" },
      { targetId: "k_g3_u1_hi", relationType: "appliesIn" },
    ],
    recallVariants: [
      {
        id: "rc_phonics_h",
        contextType: "speaking_challenge",
        promptText: "Listen and make the /h/ sound in 'Hello'",
        promptTextVi: "Nghe và phát âm bật hơi âm /h/ trong từ 'Hello'",
        scenarioDescription: "Luyện phát âm cùng Chú Lười.",
        expectedResponse: "Hello",
      },
    ],
    tags: ["phonics", "consonant", "unit1"],
  },

  {
    id: "k_g3_u1_how_are_you",
    type: "chunk",
    primaryText: "How are you?",
    vietnameseMeaning: "Bạn có khỏe không?",
    phoneticIpa: "/haʊ ɑːr juː/",
    audioKey: "audio.g3.u1.how_are_you",
    exampleSentence: "Hello, Mai! How are you?",
    targetStage: "use",
    skillFocus: ["speaking", "listening", "communication", "grammar"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 2",
      targetGrammarPoint: "Inquiring about well-being",
    },
    communicationCompetency: {
      functionCategory: "Polite Inquiries",
      canDoStatementEn: "Can ask about a friend's well-being naturally after greeting.",
      canDoStatementVi: "Có thể hỏi thăm tình hình sức khỏe của bạn bè sau khi chào.",
      fluencyExpectation: "sentence",
      naturalContextExample: "Meeting a friend at school: 'Hi Linh! How are you?'",
    },
    learningObjectiveIds: ["obj_g3_u1_greetings"],
    relations: [
      { targetId: "k_g3_u1_hello", relationType: "prerequisite", note: "Must know greetings first" },
      { targetId: "k_g3_u1_im_fine_thanks", relationType: "reinforces", note: "Natural response pair" },
    ],
    recallVariants: [
      {
        id: "rc_how_are_you_dialogue",
        contextType: "conversation",
        promptText: "Ask Chú Lười how he is doing today:",
        promptTextVi: "Hỏi thăm Chú Lười hôm nay có khỏe không bằng tiếng Anh:",
        scenarioDescription: "Hỏi thăm Chú Lười trong cuộc trò chuyện buổi sáng.",
        expectedResponse: "How are you?",
      },
    ],
    tags: ["chunk", "question", "unit1"],
  },

  {
    id: "k_g3_u1_im_fine_thanks",
    type: "chunk",
    primaryText: "I'm fine, thank you.",
    vietnameseMeaning: "Mình khỏe, cảm ơn bạn.",
    phoneticIpa: "/aɪm faɪn θæŋk juː/",
    audioKey: "audio.g3.u1.im_fine_thanks",
    exampleSentence: "I'm fine, thank you. And you?",
    targetStage: "produce",
    skillFocus: ["speaking", "listening", "communication"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 2",
      targetGrammarPoint: "Responding to well-being inquiries",
    },
    communicationCompetency: {
      functionCategory: "Polite Inquiries",
      canDoStatementEn: "Can reply politely when asked about well-being and express gratitude.",
      canDoStatementVi: "Có thể trả lời lịch sự khi được hỏi thăm và nói lời cảm ơn.",
      fluencyExpectation: "sentence",
      naturalContextExample: "When teacher asks 'How are you?': 'I'm fine, thank you!'",
    },
    learningObjectiveIds: ["obj_g3_u1_greetings"],
    relations: [
      { targetId: "k_g3_u1_how_are_you", relationType: "prerequisite", note: "Pair with question" },
    ],
    recallVariants: [
      {
        id: "rc_fine_thanks_reply",
        contextType: "conversation",
        promptText: "Friend asks: 'How are you?' -> Reply that you are good and thank them:",
        promptTextVi: "Bạn hỏi: 'How are you?' -> Bé trả lời mình khỏe và cảm ơn bạn:",
        scenarioDescription: "Phản hồi câu hỏi thăm của bạn cùng lớp.",
        expectedResponse: "I'm fine, thank you.",
      },
    ],
    tags: ["chunk", "response", "unit1"],
  },

  // --- Unit 2 Nodes ---
  {
    id: "k_g3_u2_name",
    type: "vocabulary",
    primaryText: "Name",
    vietnameseMeaning: "Tên riêng",
    phoneticIpa: "/neɪm/",
    audioKey: "audio.g3.u2.name",
    exampleSentence: "My name is Chú Lười.",
    targetStage: "recognize",
    skillFocus: ["vocabulary", "reading", "writing"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 1",
    },
    communicationCompetency: {
      functionCategory: "Identity & Personal Info",
      canDoStatementEn: "Can recognize the English word for personal name on labels and forms.",
      canDoStatementVi: "Nhận biết từ 'Name' trên thẻ học sinh và bài tập.",
      fluencyExpectation: "word",
      naturalContextExample: "Looking at a school badge: 'Name: Bảo Nhi'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_phonics_n", relationType: "related" },
    ],
    recallVariants: [
      {
        id: "rc_name_flashcard",
        contextType: "flashcard",
        promptText: "What English word means 'Tên'?",
        promptTextVi: "Từ tiếng Anh nào có nghĩa là 'Tên'?",
        scenarioDescription: "Thẻ từ vựng cơ bản.",
        expectedResponse: "Name",
      },
    ],
    tags: ["vocabulary", "identity", "unit2"],
  },

  {
    id: "k_g3_u2_friend",
    type: "vocabulary",
    primaryText: "Friend",
    vietnameseMeaning: "Bạn bè",
    phoneticIpa: "/frend/",
    audioKey: "audio.g3.u2.friend",
    exampleSentence: "Nam is my friend.",
    targetStage: "recall",
    skillFocus: ["vocabulary", "reading", "speaking"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 2",
    },
    communicationCompetency: {
      functionCategory: "Social Relationships",
      canDoStatementEn: "Can refer to a classmate or peer as a friend in English.",
      canDoStatementVi: "Có thể gọi bạn cùng lớp là 'friend' khi giới thiệu.",
      fluencyExpectation: "word",
      naturalContextExample: "Introducing someone: 'This is my friend.'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_this_is_my_friend", relationType: "appliesIn" },
    ],
    recallVariants: [
      {
        id: "rc_friend_flashcard",
        contextType: "flashcard",
        promptText: "The word for someone you like to play and study with:",
        promptTextVi: "Từ chỉ người bạn cùng học và cùng chơi:",
        scenarioDescription: "Hai bạn nhỏ cùng nắm tay nhau.",
        expectedResponse: "Friend",
      },
    ],
    tags: ["vocabulary", "relationship", "unit2"],
  },

  {
    id: "k_g3_u2_phonics_n",
    type: "phonics",
    primaryText: "/n/ sound",
    vietnameseMeaning: "Âm /n/ trong tiếng Anh (âm mũi)",
    phoneticIpa: "/n/",
    audioKey: "audio.g3.phonics.n",
    exampleSentence: "N says /n/ as in Name and Nice.",
    targetStage: "understand",
    skillFocus: ["phonics", "listening", "speaking"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 3 Phonics",
    },
    communicationCompetency: {
      functionCategory: "Pronunciation & Phonics",
      canDoStatementEn: "Can articulate the nasal /n/ sound accurately at the start of words.",
      canDoStatementVi: "Phát âm chuẩn âm mũi /n/ ở đầu từ mà không bị ngọng hay nhầm sang /l/.",
      fluencyExpectation: "word",
      naturalContextExample: "Pronouncing: 'Name, Nice, Nine'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_name", relationType: "appliesIn" },
    ],
    recallVariants: [
      {
        id: "rc_phonics_n",
        contextType: "speaking_challenge",
        promptText: "Pronounce the /n/ sound in 'Name'",
        promptTextVi: "Phát âm âm /n/ trong từ 'Name'",
        scenarioDescription: "Luyện ngữ âm cùng Chú Lười.",
        expectedResponse: "Name",
      },
    ],
    tags: ["phonics", "consonant", "unit2"],
  },

  {
    id: "k_g3_u2_whats_your_name",
    type: "chunk",
    primaryText: "What's your name?",
    vietnameseMeaning: "Bạn tên là gì?",
    phoneticIpa: "/wʌts jɔːr neɪm/",
    audioKey: "audio.g3.u2.whats_your_name",
    exampleSentence: "Hello! What's your name?",
    targetStage: "use",
    skillFocus: ["speaking", "listening", "communication", "grammar"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 1",
      targetGrammarPoint: "Wh-question for personal identity",
    },
    communicationCompetency: {
      functionCategory: "Identity & Personal Info",
      canDoStatementEn: "Can ask someone's name clearly and confidently.",
      canDoStatementVi: "Có thể hỏi tên bạn bè hoặc người mới gặp một cách tự tin, rõ ràng.",
      fluencyExpectation: "sentence",
      naturalContextExample: "Meeting a new student in class: 'Hi! What's your name?'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_name", relationType: "prerequisite", note: "Need vocab 'name'" },
      { targetId: "k_g3_u1_hello", relationType: "reinforces", note: "Used right after greeting" },
      { targetId: "k_g3_u2_my_name_is", relationType: "reinforces", note: "Q&A pair" },
    ],
    recallVariants: [
      {
        id: "rc_ask_name_dialogue",
        contextType: "conversation",
        promptText: "Ask a new friend their name:",
        promptTextVi: "Hỏi tên bạn mới bằng tiếng Anh:",
        scenarioDescription: "Làm quen bạn mới ở thư viện trường.",
        expectedResponse: "What's your name?",
      },
    ],
    tags: ["chunk", "question", "unit2"],
  },

  {
    id: "k_g3_u2_my_name_is",
    type: "chunk",
    primaryText: "My name is ___.",
    vietnameseMeaning: "Tên của mình là ___.",
    phoneticIpa: "/maɪ neɪm ɪz/",
    audioKey: "audio.g3.u2.my_name_is",
    exampleSentence: "My name is Linh.",
    targetStage: "produce",
    skillFocus: ["speaking", "writing", "communication"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 1",
      targetGrammarPoint: "Personal introduction sentence frame",
    },
    communicationCompetency: {
      functionCategory: "Identity & Personal Info",
      canDoStatementEn: "Can introduce own name in a complete, grammatically sound English sentence.",
      canDoStatementVi: "Có thể tự giới thiệu tên mình bằng một câu tiếng Anh hoàn chỉnh.",
      fluencyExpectation: "sentence",
      naturalContextExample: "Self introduction: 'Hello, my name is Bao Nhi.'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_whats_your_name", relationType: "prerequisite", note: "Response to question" },
    ],
    recallVariants: [
      {
        id: "rc_my_name_reply",
        contextType: "conversation",
        promptText: "Teacher asks 'What's your name?' -> State your name:",
        promptTextVi: "Thầy cô hỏi 'What's your name?' -> Bé tự giới thiệu tên mình:",
        scenarioDescription: "Đứng trước lớp học tiếng Anh.",
        expectedResponse: "My name is Linh.",
      },
    ],
    tags: ["chunk", "statement", "unit2"],
  },

  {
    id: "k_g3_u2_this_is_my_friend",
    type: "chunk",
    primaryText: "This is my friend, ___.",
    vietnameseMeaning: "Đây là bạn của mình, bạn ___.",
    phoneticIpa: "/ðɪs ɪz maɪ frend/",
    audioKey: "audio.g3.u2.this_is_my_friend",
    exampleSentence: "This is my friend, Nam.",
    targetStage: "transfer",
    skillFocus: ["speaking", "communication"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-ENG-G3-U2",
      globalSuccessUnit: 2,
      globalSuccessLessonRef: "Unit 2 - Lesson 2",
      targetGrammarPoint: "Demonstrative pronoun 'This' for introduction",
    },
    communicationCompetency: {
      functionCategory: "Social Introductions",
      canDoStatementEn: "Can introduce a third person / friend to another peer or adult.",
      canDoStatementVi: "Có thể giới thiệu một người bạn của mình với người khác.",
      fluencyExpectation: "sentence",
      naturalContextExample: "Introducing best friend: 'Chú Lười, this is my friend, Mai!'",
    },
    learningObjectiveIds: ["obj_g3_u2_names_friends"],
    relations: [
      { targetId: "k_g3_u2_friend", relationType: "prerequisite" },
      { targetId: "k_g3_u2_my_name_is", relationType: "reinforces" },
    ],
    recallVariants: [
      {
        id: "rc_intro_friend",
        contextType: "character_intro",
        promptText: "Introduce your friend Nam to Chú Lười:",
        promptTextVi: "Giới thiệu bạn Nam với Chú Lười:",
        scenarioDescription: "Dắt bạn Nam đến gặp Chú Lười.",
        expectedResponse: "This is my friend, Nam.",
      },
    ],
    tags: ["chunk", "introduction", "unit2"],
  },
];

// ==========================================
// 3. LESSONS & ACTIVITIES
// ==========================================

export const lessonG3U1L1: Lesson = {
  id: "lesson_g3_u1_l1",
  unitId: "unit_g3_u1",
  order: 1,
  title: "Hello! How are you?",
  titleVi: "Xin chào! Bạn có khỏe không?",
  description: "Học cách chào hỏi và hỏi thăm sức khỏe cùng Chú Lười.",
  learningObjectives: [objectiveG3U1],
  knowledgeItems: knowledgeItemsGrade3.filter((k) => k.tags.includes("unit1")),
  activities: [
    {
      id: "act_g3_u1_l1_1",
      type: "listen_and_repeat",
      prompt: "Listen and repeat the greeting 'Hello'",
      instructionVi: "Lắng nghe và phát âm theo Chú Lười nhé!",
      knowledgeItemIds: ["k_g3_u1_hello", "k_g3_u1_phonics_h"],
      audioKey: "audio.g3.u1.hello",
      targetExpectedText: "Hello",
      rewardPoints: { stars: 1, xp: 10, petFood: 1 },
    },
    {
      id: "act_g3_u1_l1_2",
      type: "word_match",
      prompt: "Match 'How are you?' with its Vietnamese meaning",
      instructionVi: "Chọn nghĩa tiếng Việt chính xác của câu 'How are you?'.",
      knowledgeItemIds: ["k_g3_u1_how_are_you"],
      options: [
        { id: "opt_1", label: "Bạn có khỏe không?", isCorrect: true, feedbackExplanation: "Chính xác! Dùng để hỏi thăm sức khỏe." },
        { id: "opt_2", label: "Bạn tên là gì?", isCorrect: false, feedbackExplanation: "Chưa đúng, câu hỏi tên là 'What is your name?'" },
        { id: "opt_3", label: "Tạm biệt bạn!", isCorrect: false, feedbackExplanation: "Chưa đúng, tạm biệt là 'Goodbye!'" },
      ],
      rewardPoints: { stars: 1, xp: 10, petFood: 1 },
    },
    {
      id: "act_g3_u1_l1_3",
      type: "mini_conversation",
      prompt: "Chú Lười asks: 'How are you?' -> Choose the best polite response:",
      instructionVi: "Chú Lười hỏi bạn 'How are you?', bé hãy chọn câu trả lời lịch sự nhất:",
      knowledgeItemIds: ["k_g3_u1_im_fine_thanks"],
      options: [
        { id: "opt_c1", label: "I'm fine, thank you.", isCorrect: true, feedbackExplanation: "Rất giỏi! Vừa nói mình khỏe vừa cảm ơn bạn." },
        { id: "opt_c2", label: "My name is Chú Lười.", isCorrect: false, feedbackExplanation: "Câu này là giới thiệu tên mất rồi!" },
      ],
      rewardPoints: { stars: 2, xp: 15, petFood: 1 },
    },
  ],
};

export const lessonG3U2L1: Lesson = {
  id: "lesson_g3_u2_l1",
  unitId: "unit_g3_u2",
  order: 1,
  title: "What's your name?",
  titleVi: "Bạn tên là gì?",
  description: "Học cách tự tin hỏi tên và giới thiệu bạn bè bằng tiếng Anh.",
  learningObjectives: [objectiveG3U2],
  knowledgeItems: knowledgeItemsGrade3.filter((k) => k.tags.includes("unit2")),
  activities: [
    {
      id: "act_g3_u2_l1_1",
      type: "listen_and_repeat",
      prompt: "Listen and repeat the question: 'What's your name?'",
      instructionVi: "Lắng nghe và lặp lại câu hỏi tên cùng Chú Lười:",
      knowledgeItemIds: ["k_g3_u2_whats_your_name", "k_g3_u2_name"],
      audioKey: "audio.g3.u2.whats_your_name",
      targetExpectedText: "What's your name?",
      rewardPoints: { stars: 1, xp: 10, petFood: 1 },
    },
    {
      id: "act_g3_u2_l1_2",
      type: "choose_correct",
      prompt: "Complete the introduction: 'This is my ____, Nam.'",
      instructionVi: "Điền từ còn thiếu: 'Đây là bạn của mình, bạn Nam.'",
      knowledgeItemIds: ["k_g3_u2_friend", "k_g3_u2_this_is_my_friend"],
      options: [
        { id: "opt_f1", label: "friend", isCorrect: true, feedbackExplanation: "Chính xác! 'friend' có nghĩa là bạn bè." },
        { id: "opt_f2", label: "name", isCorrect: false, feedbackExplanation: "Chưa đúng, 'name' là tên riêng." },
      ],
      rewardPoints: { stars: 1, xp: 10, petFood: 1 },
    },
  ],
};

// ==========================================
// 4. UNITS & GRADE DEFINITION
// ==========================================

export const unitGrade3Unit1: Unit = {
  id: "unit_g3_u1",
  grade: 3,
  semester: 1,
  order: 1,
  topicName: "Hello & Greetings",
  topicNameVi: "Chào Hỏi & Làm Quen",
  description: "Làm quen với Chú Lười, học cách chào hỏi và hỏi thăm sức khỏe tự nhiên.",
  globalSuccessUnitNumber: 1,
  cefrTarget: "Pre-A1",
  iconKey: "icon.unit.greetings",
  backgroundKey: "bg.unit.sloth_forest",
  lessons: [lessonG3U1L1],
};

export const unitGrade3Unit2: Unit = {
  id: "unit_g3_u2",
  grade: 3,
  semester: 1,
  order: 2,
  topicName: "Our Names & Friends",
  topicNameVi: "Tên Của Chúng Mình & Bạn Bè",
  description: "Hỏi tên, giới thiệu bản thân và bạn bè bằng các mẫu câu chuẩn.",
  globalSuccessUnitNumber: 2,
  cefrTarget: "Pre-A1",
  iconKey: "icon.unit.friends",
  backgroundKey: "bg.unit.playground",
  lessons: [lessonG3U2L1],
};

export const grade3Definition: CurriculumGrade = {
  grade: 3,
  displayName: "Lớp 3 — Khởi Động Tự Tin",
  description: "Chương trình tiếng Anh Lớp 3 chuẩn GDPT 2018 & Global Success, giúp bé tự tin giao tiếp và đạt điểm cao trên lớp.",
  targetCefrLevel: "Pre-A1",
  units: [unitGrade3Unit1, unitGrade3Unit2],
};

export const masterCurriculum: Curriculum = {
  id: "curriculum_vn_primary_g3",
  title: "LƯỜI ENGLISH — Chương Trình Chuẩn GDPT 2018 & Tham Chiếu Global Success",
  standard: "Vietnam MOET GDPT 2018 & Global Success 3 Alignment",
  version: "1.0.0",
  grades: [grade3Definition],
  knowledgeGraphNodes: knowledgeItemsGrade3,
};
