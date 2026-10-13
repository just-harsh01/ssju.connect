/**
 * SSJU Connect - Initial Mock & Seed Data
 * Soban Singh Jeena University (SSJU), Almora Campus Social & Academic Portal
 * Official Faculties & Academic Programs
 */

export const INITIAL_STREAMS = [
  {
    id: "science",
    name: "Faculty of Science",
    code: "B.Sc / M.Sc",
    icon: "🔬",
    description: "Physics, Chemistry, Mathematics, Botany, Zoology, Geology, Statistics, Biotechnology & Forestry.",
    studentCount: 2450,
    papersCount: 78,
    color: "from-emerald-600 to-teal-700",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "arts",
    name: "Faculty of Arts & Humanities",
    code: "B.A / M.A",
    icon: "📚",
    description: "Hindi, English, Sanskrit, History, Political Science, Sociology, Geography, Economics, Psychology & Journalism.",
    studentCount: 3100,
    papersCount: 92,
    color: "from-rose-600 to-pink-700",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "commerce",
    name: "Faculty of Commerce",
    code: "B.Com / M.Com",
    icon: "📊",
    description: "Corporate Accounting, Auditing, Financial Management, Taxation, Banking, Business Economics & E-Commerce.",
    studentCount: 1680,
    papersCount: 54,
    color: "from-amber-600 to-orange-700",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "bca_mca",
    name: "Computer Applications & IT",
    code: "BCA / MCA / PGDCA",
    icon: "💻",
    description: "Programming, Data Structures, Web Technologies, Database Systems, Software Engineering, AI & Python.",
    studentCount: 1220,
    papersCount: 46,
    color: "from-blue-600 to-indigo-700",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "education",
    name: "Faculty of Education",
    code: "B.Ed / M.Ed",
    icon: "🎓",
    description: "Teacher Education, Philosophical & Sociological Foundations, Educational Psychology, Curriculum & Pedagogy.",
    studentCount: 920,
    papersCount: 38,
    color: "from-sky-600 to-cyan-700",
    semesters: [1, 2, 3, 4]
  },
  {
    id: "management",
    name: "Management Studies",
    code: "BBA / MBA",
    icon: "📈",
    description: "Business Administration, Marketing Strategy, Financial Management, Human Resource & Tourism Management.",
    studentCount: 840,
    papersCount: 32,
    color: "from-purple-600 to-violet-800",
    semesters: [1, 2, 3, 4]
  },
  {
    id: "law",
    name: "Faculty of Law",
    code: "LL.B / LL.M",
    icon: "⚖️",
    description: "Constitutional Law of India, Criminal Jurisprudence, Civil Code, Law of Torts, Evidence Act & Moot Courts.",
    studentCount: 610,
    papersCount: 26,
    color: "from-slate-700 to-zinc-900",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "yoga",
    name: "Yoga & Alternative Therapy",
    code: "B.A / B.Sc & M.A / M.Sc (Yoga)",
    icon: "🧘",
    description: "Yogic Philosophy, Patanjali Yoga Sutras, Naturopathy, Asanas, Pranayama, Human Anatomy & Wellness Science.",
    studentCount: 520,
    papersCount: 20,
    color: "from-lime-600 to-emerald-800",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "visual_arts",
    name: "Visual Arts & Performing Arts",
    code: "B.F.A / M.F.A & Music",
    icon: "🎨",
    description: "Fine Arts, Painting, Sculpture, Traditional Folk Art (Aipan of Kumaon), Classical Vocal & Instrumental Music.",
    studentCount: 390,
    papersCount: 16,
    color: "from-fuchsia-600 to-pink-800",
    semesters: [1, 2, 3, 4, 5, 6]
  },
  {
    id: "pharmacy",
    name: "Pharmacy & Medical Sciences",
    code: "B.Pharm / D.Pharm",
    icon: "💊",
    description: "Pharmaceutics, Pharmacology, Pharmacognosy, Pharmaceutical Chemistry, Biochemistry & Clinical Trials.",
    studentCount: 480,
    papersCount: 22,
    color: "from-teal-600 to-cyan-800",
    semesters: [1, 2, 3, 4, 5, 6, 7, 8]
  }
];

export const INITIAL_USER = {
  id: "user_ssju_01",
  name: "Arjun Singh Negi",
  username: "arjun_ssju",
  email: "arjun.negi@ssju.ac.in",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
  bio: "BCA 3rd Year student @ SSJU Almora Campus. Interested in Web Development & Open Source. Feel free to ask programming doubts!",
  stream: "bca_mca",
  streamName: "Computer Applications & IT",
  semester: 5,
  rollNo: "SSJU/2023/BCA/042",
  reputation: 340,
  badges: ["Campus Contributor", "Top Doubt Solver", "PYQ Uploader"],
  bookmarks: ["post_2", "paper_1"],
  upvotedPosts: ["post_1", "post_3"],
  downvotedPosts: []
};

export const INITIAL_POSTS = [
  {
    id: "post_1",
    author: {
      name: "Pooja Bisht",
      username: "pooja_b",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      stream: "bca_mca",
      streamLabel: "BCA - 5th Sem",
      isVerifiedStudent: true
    },
    title: "How to prepare for Data Structures & Algorithms for upcoming campus placement drives?",
    content: "SSJU Almora training and placement cell announced that technical recruiters are visiting next semester. For 2nd and 3rd year students in Computer Applications and Sciences, what specific topics in DSA should we prioritize? Should we focus on LeetCode Top 150 or Striver's SDE sheet? Also, do they ask core OS and DBMS questions in round 1 technical interview?",
    category: "Doubt / Question",
    streamId: "bca_mca",
    tags: ["Placements", "DSA", "CampusHiring", "SSJU"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    upvotes: 42,
    downvotes: 1,
    createdAt: "2026-10-12T10:30:00Z",
    comments: [
      {
        id: "c_1",
        author: {
          name: "Rohit Joshi",
          username: "rohit_j",
          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
          streamLabel: "Alumni / Software Engineer"
        },
        content: "From my experience, Striver's A2Z DSA sheet is solid for campus placements. Ensure you master Binary Trees, Graphs (BFS/DFS), and Dynamic Programming basics. For DBMS, normalize tables up to BCNF and know SQL indexing!",
        upvotes: 18,
        createdAt: "2026-10-12T11:45:00Z"
      },
      {
        id: "c_2",
        author: {
          name: "Dr. K. S. Rawat",
          username: "rawat_faculty",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
          streamLabel: "Faculty - Dept of Computer Applications"
        },
        content: "Good question Pooja. The department is also organizing a 3-day hands-on workshop on Mock Technical Interviews in the Central Seminar Hall next Wednesday. Attendance is highly encouraged.",
        upvotes: 24,
        createdAt: "2026-10-12T14:10:00Z"
      }
    ]
  },
  {
    id: "post_2",
    author: {
      name: "Aditya Pant",
      username: "aditya_sc",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      stream: "science",
      streamLabel: "B.Sc Physics - 4th Sem",
      isVerifiedStudent: true
    },
    title: "Glimpse of today's Astronomy Club telescope setup at Almora Upper Ground! 🌌🔭",
    content: "The sky was crystal clear tonight over the Kumaon hills! The Physics Society & Astronomy Club set up the 8-inch reflector telescope near the SSJU Administrative block. We got spectacular views of Saturn's rings and Jupiter's Galilean moons. Huge shoutout to everyone who braved the cold breeze to join us. Next stargazing session is scheduled during the upcoming meteor shower!",
    category: "Campus Events",
    streamId: "science",
    tags: ["AstronomyClub", "CampusLife", "Almora", "PhysicsSociety"],
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    upvotes: 68,
    downvotes: 0,
    createdAt: "2026-10-11T20:15:00Z",
    comments: [
      {
        id: "c_3",
        author: {
          name: "Deepa Mehta",
          username: "deepa_m",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          streamLabel: "B.A. English - 2nd Sem"
        },
        content: "It was magical! The view of Saturn was so sharp. Please do another session next Saturday so students from lower campus hostels can also reach on time.",
        upvotes: 9,
        createdAt: "2026-10-11T21:00:00Z"
      }
    ]
  },
  {
    id: "post_3",
    author: {
      name: "Neha Tiwari",
      username: "neha_comm",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      stream: "commerce",
      streamLabel: "B.Com Honours - 5th Sem",
      isVerifiedStudent: true
    },
    title: "Notice regarding Central Library book renewal & Extended hours for Mid-Term Exams",
    content: "Official update from University Central Library: Library reading halls will now remain open until 9:00 PM on weekdays starting next Monday due to mid-semester exams. Also, students can renew up to 4 textbooks simultaneously through the online portal without library fine. Make sure to carry your university ID card for biometric gate entry.",
    category: "Official Announcement",
    streamId: "commerce",
    tags: ["CentralLibrary", "Exams2026", "CampusNotice", "SSJU"],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    upvotes: 53,
    downvotes: 2,
    createdAt: "2026-10-10T09:00:00Z",
    comments: [
      {
        id: "c_4",
        author: {
          name: "Virendra Singh",
          username: "viren_bca",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
          streamLabel: "BCA - 3rd Sem"
        },
        content: "Much needed! The WiFi connection in the 2nd-floor digital section has also been upgraded to high-speed fiber.",
        upvotes: 7,
        createdAt: "2026-10-10T10:20:00Z"
      }
    ]
  },
  {
    id: "post_4",
    author: {
      name: "Manoj Bhatt",
      username: "manoj_yoga",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
      stream: "yoga",
      streamLabel: "M.A. Yoga - 1st Sem",
      isVerifiedStudent: true
    },
    title: "Morning Sunrise Pranayama & Hatha Yoga Camp on University Lawn this Sunday 🧘‍♂️",
    content: "The Department of Yoga & Alternative Therapy is organizing a sunrise practical meditation and Surya Namaskar session this Sunday at 6:30 AM. Students from all faculties (Science, Arts, Commerce, Law, B.Ed) are welcome! Mats will be provided by the department.",
    category: "Campus Events",
    streamId: "yoga",
    tags: ["YogaDepartment", "Wellness", "SSJUAlmora", "Health"],
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    upvotes: 71,
    downvotes: 0,
    createdAt: "2026-10-09T14:20:00Z",
    comments: [
      {
        id: "c_5",
        author: {
          name: "Siddharth Verma",
          username: "sid_law",
          avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
          streamLabel: "LL.B - 2nd Sem"
        },
        content: "Count the Law faculty students in! Great initiative for relieving exam stress.",
        upvotes: 8,
        createdAt: "2026-10-09T16:12:00Z"
      }
    ]
  }
];

export const INITIAL_PAPERS = [
  {
    id: "paper_1",
    title: "Data Structures and File Organization (BCA-301)",
    subjectCode: "BCA-301",
    streamId: "bca_mca",
    streamName: "Computer Applications & IT",
    semester: 3,
    examYear: 2025,
    examType: "End-Term Regular",
    uploaderName: "Arjun Singh Negi",
    uploaderStream: "BCA",
    uploadedAt: "2026-09-18",
    fileSize: "1.4 MB",
    pages: 4,
    downloadsCount: 184,
    rating: 4.9,
    description: "Official End-Term examination paper covering Stacks, Queues, Binary Trees, AVL Trees, Graphs, Sorting algorithms, and dynamic file indexing.",
    tags: ["DSA", "DataStructures", "Semester3", "EndTerm2025"],
    pdfDataUrl: null
  },
  {
    id: "paper_2",
    title: "Childhood and Growing Up (B.Ed Core Paper I)",
    subjectCode: "BED-101",
    streamId: "education",
    streamName: "Faculty of Education",
    semester: 1,
    examYear: 2025,
    examType: "End-Term Regular",
    uploaderName: "Sunita Arya",
    uploaderStream: "B.Ed",
    uploadedAt: "2026-08-20",
    fileSize: "1.2 MB",
    pages: 4,
    downloadsCount: 145,
    rating: 4.8,
    description: "Covers psychological development, Piaget's cognitive development theory, Vygotsky's socio-cultural theory, and adolescent learning in school environments.",
    tags: ["BEd", "ChildPsychology", "Semester1", "Education"],
    pdfDataUrl: null
  },
  {
    id: "paper_3",
    title: "Quantum Mechanics & Modern Physics (PHY-501)",
    subjectCode: "PHY-501",
    streamId: "science",
    streamName: "Faculty of Science",
    semester: 5,
    examYear: 2024,
    examType: "End-Term Regular",
    uploaderName: "Aditya Pant",
    uploaderStream: "B.Sc Physics",
    uploadedAt: "2026-06-14",
    fileSize: "1.7 MB",
    pages: 5,
    downloadsCount: 132,
    rating: 4.9,
    description: "Complete question paper including 1D Schrodinger wave equation, photoelectric effect, Compton effect, operator formalism, and hydrogen atom energy states.",
    tags: ["Physics", "QuantumMechanics", "BSc", "Sem5"],
    pdfDataUrl: null
  },
  {
    id: "paper_4",
    title: "Foundations of Yogic Sciences & Philosophy (YOG-101)",
    subjectCode: "YOG-101",
    streamId: "yoga",
    streamName: "Yoga & Alternative Therapy",
    semester: 1,
    examYear: 2025,
    examType: "End-Term Regular",
    uploaderName: "Manoj Bhatt",
    uploaderStream: "M.A. Yoga",
    uploadedAt: "2026-07-10",
    fileSize: "1.0 MB",
    pages: 3,
    downloadsCount: 118,
    rating: 4.9,
    description: "Questions on Patanjali Yoga Sutras, Ashtanga Yoga, Hatha Yoga Pradipika, subtle anatomy (Chakras and Nadis), and modern wellness science.",
    tags: ["Yoga", "Philosophy", "Semester1", "SSJU"],
    pdfDataUrl: null
  },
  {
    id: "paper_5",
    title: "Financial Accounting & Corporate Auditing (COM-302)",
    subjectCode: "COM-302",
    streamId: "commerce",
    streamName: "Faculty of Commerce",
    semester: 3,
    examYear: 2025,
    examType: "End-Term Regular",
    uploaderName: "Neha Tiwari",
    uploaderStream: "B.Com",
    uploadedAt: "2026-05-30",
    fileSize: "1.2 MB",
    pages: 4,
    downloadsCount: 88,
    rating: 4.6,
    description: "Corporate financial statements, partnership accounting, depreciation methodologies, goodwill valuation, and internal auditing guidelines.",
    tags: ["Accounting", "Finance", "BCom", "Auditing"],
    pdfDataUrl: null
  },
  {
    id: "paper_6",
    title: "Constitutional Law of India - Part I & II (LAW-101)",
    subjectCode: "LAW-101",
    streamId: "law",
    streamName: "Faculty of Law",
    semester: 1,
    examYear: 2024,
    examType: "End-Term Regular",
    uploaderName: "Siddharth Verma",
    uploaderStream: "LL.B",
    uploadedAt: "2026-04-19",
    fileSize: "1.5 MB",
    pages: 4,
    downloadsCount: 95,
    rating: 4.8,
    description: "Fundamental Rights (Articles 14 to 32), Directive Principles of State Policy, Preamble interpretations, writ petitions, and landmark Supreme Court judgments.",
    tags: ["ConstitutionalLaw", "LLB", "Judgments", "Law"],
    pdfDataUrl: null
  },
  {
    id: "paper_7",
    title: "History of Modern India (1757 - 1947) (HIST-201)",
    subjectCode: "HIST-201",
    streamId: "arts",
    streamName: "Faculty of Arts & Humanities",
    semester: 2,
    examYear: 2025,
    examType: "End-Term Regular",
    uploaderName: "Deepa Mehta",
    uploaderStream: "B.A. History",
    uploadedAt: "2026-03-15",
    fileSize: "1.1 MB",
    pages: 3,
    downloadsCount: 84,
    rating: 4.7,
    description: "Colonial rule, revolt of 1857, socio-religious reform movements, Indian National Congress formation, Gandhian movements, and independence.",
    tags: ["History", "ModernIndia", "BA", "Sem2"],
    pdfDataUrl: null
  }
];

export const CAMPUS_TRENDS = [
  { tag: "#EndTermExams2026", count: "1.2k discussions", category: "Academics" },
  { tag: "#AlmoraHostelsMess", count: "840 discussions", category: "Campus Life" },
  { tag: "#PlacementDriveTCS", count: "650 discussions", category: "Career" },
  { tag: "#SpandanFestAuditions", count: "510 discussions", category: "Events" },
  { tag: "#YogaSunriseCamp", count: "420 discussions", category: "Wellness" }
];
