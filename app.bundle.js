/**
 * SSJU Connect - Standalone Application Bundle
 * Soban Singh Jeena University Campus Social & PYQ Vault
 * Bundled for 100% compatibility across file://, localhost, and live public hosts.
 */

(function () {
  'use strict';

  // ========================================================
  // 1. SEED DATA & CONSTANTS
  // ========================================================
  const INITIAL_STREAMS = [
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

  const INITIAL_USER = {
    id: "user_ssju_01",
    name: "Arjun Singh Negi",
    username: "arjun_ssju",
    email: "arjun.negi@ssju.ac.in",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
    bio: "BCA 3rd Year student @ SSJU Almora Campus. Interested in Web Development & Open Source. Feel free to ask doubts!",
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

  const INITIAL_POSTS = [
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

  const INITIAL_PAPERS = [
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

  // ========================================================
  // 2. STORAGE CONTROLLER
  // ========================================================
  const STORAGE_KEYS = {
    POSTS: 'ssju_connect_posts_v2',
    PAPERS: 'ssju_connect_papers_v2',
    USER: 'ssju_connect_user_v2',
    SETTINGS: 'ssju_connect_settings_v1',
    STREAMS: 'ssju_connect_streams_v2'
  };

  function safeGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      safeSet(STORAGE_KEYS.POSTS, INITIAL_POSTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAPERS)) {
      safeSet(STORAGE_KEYS.PAPERS, INITIAL_PAPERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      safeSet(STORAGE_KEYS.USER, INITIAL_USER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STREAMS)) {
      safeSet(STORAGE_KEYS.STREAMS, INITIAL_STREAMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      safeSet(STORAGE_KEYS.SETTINGS, {
        theme: 'light',
        filterStreamByDefault: false,
        enableNotifications: true,
        compactView: false
      });
    }
  }

  function getPosts() { return safeGet(STORAGE_KEYS.POSTS, INITIAL_POSTS); }
  function savePost(newPost) {
    const posts = getPosts();
    const created = { id: 'post_' + Date.now(), createdAt: new Date().toISOString(), upvotes: 0, downvotes: 0, comments: [], ...newPost };
    posts.unshift(created);
    safeSet(STORAGE_KEYS.POSTS, posts);
    return created;
  }
  function deletePost(postId) {
    const posts = getPosts().filter(p => p.id !== postId);
    safeSet(STORAGE_KEYS.POSTS, posts);
    return posts;
  }
  function togglePostVote(postId, voteType) {
    const posts = getPosts();
    const user = getUser();
    const post = posts.find(p => p.id === postId);
    if (!post) return { posts, user };

    const upIndex = user.upvotedPosts.indexOf(postId);
    const downIndex = user.downvotedPosts.indexOf(postId);

    if (voteType === 'up') {
      if (upIndex > -1) {
        user.upvotedPosts.splice(upIndex, 1);
        post.upvotes = Math.max(0, post.upvotes - 1);
      } else {
        user.upvotedPosts.push(postId);
        post.upvotes += 1;
        if (downIndex > -1) {
          user.downvotedPosts.splice(downIndex, 1);
          post.downvotes = Math.max(0, post.downvotes - 1);
        }
      }
    } else if (voteType === 'down') {
      if (downIndex > -1) {
        user.downvotedPosts.splice(downIndex, 1);
        post.downvotes = Math.max(0, post.downvotes - 1);
      } else {
        user.downvotedPosts.push(postId);
        post.downvotes += 1;
        if (upIndex > -1) {
          user.upvotedPosts.splice(upIndex, 1);
          post.upvotes = Math.max(0, post.upvotes - 1);
        }
      }
    }
    safeSet(STORAGE_KEYS.POSTS, posts);
    safeSet(STORAGE_KEYS.USER, user);
    return { posts, user, post };
  }
  function addCommentToPost(postId, commentData) {
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;
    const newComment = { id: 'c_' + Date.now(), createdAt: new Date().toISOString(), upvotes: 0, ...commentData };
    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    safeSet(STORAGE_KEYS.POSTS, posts);
    return newComment;
  }

  function getPapers() { return safeGet(STORAGE_KEYS.PAPERS, INITIAL_PAPERS); }
  function savePaper(newPaper) {
    const papers = getPapers();
    const created = { id: 'paper_' + Date.now(), uploadedAt: new Date().toISOString().split('T')[0], downloadsCount: 0, rating: 5.0, pages: 3, fileSize: '1.2 MB', ...newPaper };
    papers.unshift(created);
    safeSet(STORAGE_KEYS.PAPERS, papers);
    const user = getUser();
    user.reputation = (user.reputation || 0) + 25;
    if (!user.badges.includes("PYQ Donor")) user.badges.push("PYQ Donor");
    safeSet(STORAGE_KEYS.USER, user);
    return created;
  }
  function incrementPaperDownload(paperId) {
    const papers = getPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      paper.downloadsCount = (paper.downloadsCount || 0) + 1;
      safeSet(STORAGE_KEYS.PAPERS, papers);
    }
    return paper;
  }

  function getUser() { return safeGet(STORAGE_KEYS.USER, INITIAL_USER); }
  function updateUser(updatedFields) {
    const current = getUser();
    const merged = { ...current, ...updatedFields };
    safeSet(STORAGE_KEYS.USER, merged);
    return merged;
  }
  function toggleBookmark(itemType, itemId) {
    const user = getUser();
    if (!user.bookmarks) user.bookmarks = [];
    const key = `${itemType}_${itemId}`;
    const idx = user.bookmarks.indexOf(key);
    if (idx > -1) user.bookmarks.splice(idx, 1);
    else user.bookmarks.push(key);
    safeSet(STORAGE_KEYS.USER, user);
    return { bookmarks: user.bookmarks, isBookmarked: idx === -1 };
  }

  function getStreams() { return safeGet(STORAGE_KEYS.STREAMS, INITIAL_STREAMS); }
  function saveStream(newStream) {
    const streams = getStreams();
    const created = { id: 'stream_' + Date.now(), studentCount: 0, papersCount: 0, semesters: [1, 2, 3, 4, 5, 6], color: 'from-blue-600 to-indigo-700', icon: '📘', ...newStream };
    streams.push(created);
    safeSet(STORAGE_KEYS.STREAMS, streams);
    return created;
  }

  function getSettings() {
    return safeGet(STORAGE_KEYS.SETTINGS, { theme: 'light', filterStreamByDefault: false, enableNotifications: true, compactView: false });
  }
  function updateSettings(newSettings) {
    const current = getSettings();
    const merged = { ...current, ...newSettings };
    safeSet(STORAGE_KEYS.SETTINGS, merged);
    return merged;
  }
  function resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.PAPERS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STREAMS);
    initStorage();
  }

  // ========================================================
  // 3. HELPERS: PDF & SHARE
  // ========================================================
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  function generateQuestionPaperPdf(paper) {
    return new Promise((resolve) => {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        const htmlContent = `
          <!DOCTYPE html><html><head><title>${paper.subjectCode} - ${paper.title}</title>
          <style>body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
          .univ-name { font-size: 20pt; font-weight: bold; text-transform: uppercase; }
          .meta-table { width: 100%; margin: 15px 0; border-collapse: collapse; font-size: 11pt; }
          .section-title { font-weight: bold; font-size: 12pt; text-align: center; margin: 20px 0 10px; border-bottom: 1px solid #ddd; }
          .question-item { margin-bottom: 14px; font-size: 11pt; display: flex; justify-content: space-between; }</style></head>
          <body>
            <div class="header">
              <div class="univ-name">Soban Singh Jeena University, Almora</div>
              <div style="font-size: 13pt; margin-top: 4px; font-weight: bold;">${paper.streamName || 'Examination Vault'}</div>
              <div style="font-size: 11pt; margin-top: 6px;">${paper.examType} Examination - ${paper.examYear}</div>
            </div>
            <table class="meta-table"><tr><td><strong>Course:</strong> ${paper.title}</td><td style="text-align: right;"><strong>Subject Code:</strong> ${paper.subjectCode}</td></tr>
            <tr><td><strong>Semester:</strong> ${paper.semester}</td><td style="text-align: right;"><strong>Max Marks:</strong> 100</td></tr></table>
            <div class="section-title">SECTION A &mdash; (Short Answer Questions)</div>
            <div class="question-item"><div>1. Define core principles, fundamental scope, and modern applications of ${paper.subjectCode}.</div><div>[10]</div></div>
            <div class="section-title">SECTION B &mdash; (Descriptive Analytical Questions)</div>
            <div class="question-item"><div>2. Formulate an optimized technical specification with step-by-step mathematical proofs.</div><div>[20]</div></div>
          </body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        resolve({ dataUrl: URL.createObjectURL(blob), isHtmlFallback: true });
        return;
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 18;
      const contentWidth = pageWidth - (margin * 2);

      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.8);
      doc.rect(10, 10, pageWidth - 20, 277);

      doc.setFont('times', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(30, 58, 138);
      doc.text("SOBAN SINGH JEENA UNIVERSITY, ALMORA", pageWidth / 2, 22, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      doc.text((paper.streamName || '').toUpperCase(), pageWidth / 2, 28, { align: 'center' });
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.text(`${(paper.examType || 'Regular').toUpperCase()} EXAMINATION - ${paper.examYear}`, pageWidth / 2, 34, { align: 'center' });

      doc.line(margin, 38, pageWidth - margin, 38);
      doc.setFontSize(10);
      doc.text(`Subject: ${paper.title}`, margin, 44);
      doc.text(`Code: ${paper.subjectCode}`, pageWidth - margin, 44, { align: 'right' });
      doc.setFont('times', 'normal');
      doc.text(`Semester: ${paper.semester} | Time: 3 Hours`, margin, 50);
      doc.text(`Max Marks: 100`, pageWidth - margin, 50, { align: 'right' });

      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.text("SECTION A (Short Answer Type - 30 Marks)", pageWidth / 2, 65, { align: 'center' });
      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.text(`1. Explain fundamental theorems and key properties of ${paper.subjectCode}.`, margin, 75);
      doc.text(`2. Compare analytical modeling versus experimental verification.`, margin, 85);
      doc.text(`3. Illustrate asymptotic time-space bounds with diagrams.`, margin, 95);

      doc.setFont('times', 'bold');
      doc.text("SECTION B (Analytical & Case Study - 70 Marks)", pageWidth / 2, 115, { align: 'center' });
      doc.setFont('times', 'normal');
      doc.text(`4. Comprehensive analysis of ${paper.title}: Formulate step-by-step methodologies.`, margin, 125);
      doc.text(`5. Design high-throughput, fault-tolerant architectures under variable loads.`, margin, 140);

      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Official Academic Archive • Soban Singh Jeena University, Almora`, pageWidth / 2, 280, { align: 'center' });

      const pdfBlob = doc.output('blob');
      resolve({ dataUrl: URL.createObjectURL(pdfBlob), blob: pdfBlob, isHtmlFallback: false });
    });
  }

  async function triggerPaperDownload(paper) {
    let downloadUrl = paper.pdfDataUrl;
    if (!downloadUrl) {
      const generated = await generateQuestionPaperPdf(paper);
      downloadUrl = generated.dataUrl;
    }
    const filename = `SSJU_${paper.streamId.toUpperCase()}_${paper.subjectCode.replace(/[^a-zA-Z0-9_-]/g, '_')}_${paper.examYear}.pdf`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function generateQrCodeSvg(text, size = 180) {
    const hash = Array.from(text).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
    const gridSize = 25;
    const cellSize = size / gridSize;
    let rects = [];

    function addFinder(xStart, yStart) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            rects.push(`<rect x="${(xStart + c) * cellSize}" y="${(yStart + r) * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1e3a8a" rx="1.5"/>`);
          }
        }
      }
    }
    addFinder(0, 0);
    addFinder(gridSize - 7, 0);
    addFinder(0, gridSize - 7);

    let seed = Math.abs(hash);
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= gridSize - 8) || (r >= gridSize - 8 && c < 8)) continue;
        seed = (seed * 9301 + 49297) % 233280;
        if ((seed / 233280) > 0.48) {
          rects.push(`<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="#334155" rx="1"/>`);
        }
      }
    }

    const centerRadius = cellSize * 2.4;
    const centerCoord = size / 2;
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="rounded-xl bg-white p-2 shadow-inner border border-slate-200">
        <rect width="100%" height="100%" fill="#ffffff" rx="8" />
        ${rects.join('')}
        <circle cx="${centerCoord}" cy="${centerCoord}" r="${centerRadius}" fill="#ffffff" stroke="#1e3a8a" stroke-width="2"/>
        <text x="${centerCoord}" y="${centerCoord + 4}" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">SSJU</text>
      </svg>
    `;
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const res = document.execCommand('copy');
        textArea.remove();
        return res;
      }
    } catch (e) {
      return false;
    }
  }

  function getSocialShareLinks(text, url) {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);
    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=SSJU,CampusConnect`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
  }

  // ========================================================
  // 4. APPLICATION STATE & ROUTING
  // ========================================================
  const state = {
    currentView: 'home',
    feedFilter: 'all',
    selectedStreamId: null,
    searchQuery: '',
    profileTab: 'posts',
    tempPostImage: null,
    tempPaperFile: null
  };

  function applyTheme() {
    const settings = getSettings();
    const isDark = settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: '✓', error: '✕', info: 'ℹ', share: '🔗' };
    const bgColors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      info: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
      share: 'bg-blue-600 text-white'
    };

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${bgColors[type] || bgColors.info} animate-toast`;
    toast.innerHTML = `
      <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center font-bold text-base rounded-full bg-white/20">${icons[type] || '•'}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function navigateTo(viewName, params = {}, updateHash = true) {
    state.currentView = viewName;
    if (params.streamId !== undefined) state.selectedStreamId = params.streamId;
    if (params.searchQuery !== undefined) state.searchQuery = params.searchQuery;
    if (params.profileTab !== undefined) state.profileTab = params.profileTab;

    if (updateHash && window.location.hash !== `#${viewName}`) {
      window.location.hash = `#${viewName}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
  }

  function renderApp() {
    updateNavActiveState();
    updateHeaderUserBadge();

    const rightSidebar = document.getElementById('rightSidebarArea');
    if (rightSidebar) {
      if (state.currentView === 'home' || state.currentView === 'papers') {
        rightSidebar.classList.remove('hidden');
        rightSidebar.classList.add('lg:block');
      } else {
        rightSidebar.classList.add('hidden');
        rightSidebar.classList.remove('lg:block');
      }
    }

    switch (state.currentView) {
      case 'home': renderHomeView(); break;
      case 'streams': renderStreamsView(); break;
      case 'papers': renderPapersView(); break;
      case 'profile': renderProfileView(); break;
      case 'settings': renderSettingsView(); break;
      case 'search': renderSearchResultsView(); break;
      default: renderHomeView();
    }

    renderRightSidebarWidgets();
  }

  function updateHeaderUserBadge() {
    const user = getUser();
    const avatarImg = document.getElementById('headerUserAvatar');
    const avatarName = document.getElementById('headerUserName');
    const avatarStream = document.getElementById('headerUserStream');
    if (avatarImg) avatarImg.src = user.avatar;
    if (avatarName) avatarName.textContent = user.name;
    if (avatarStream) avatarStream.textContent = user.streamName || 'SSJU Student';
  }

  function updateNavActiveState() {
    document.querySelectorAll('[data-nav-target]').forEach(el => {
      const target = el.getAttribute('data-nav-target');
      if (target === state.currentView) {
        el.classList.add('active', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30', 'dark:text-blue-400');
      } else {
        el.classList.remove('active', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30', 'dark:text-blue-400');
      }
    });

    document.querySelectorAll('[data-mobile-target]').forEach(el => {
      const target = el.getAttribute('data-mobile-target');
      if (target === state.currentView) {
        el.classList.add('text-blue-600', 'dark:text-blue-400', 'font-semibold');
        el.classList.remove('text-slate-500', 'dark:text-slate-400');
      } else {
        el.classList.remove('text-blue-600', 'dark:text-blue-400', 'font-semibold');
        el.classList.add('text-slate-500', 'dark:text-slate-400');
      }
    });
  }

  // ========================================================
  // 5. VIEW RENDERING: HOME, STREAMS, PAPERS, PROFILE, SETTINGS
  // ========================================================
  function renderHomeView() {
    const container = document.getElementById('mainContentArea');
    const user = getUser();
    const streams = getStreams();
    const activeStream = streams.find(s => s.id === state.selectedStreamId);
    let posts = getPosts();

    if (state.selectedStreamId) {
      posts = posts.filter(p => p.streamId === state.selectedStreamId);
    }

    if (state.feedFilter === 'questions') {
      posts = posts.filter(p => (p.category || '').toLowerCase().includes('doubt') || (p.category || '').toLowerCase().includes('question'));
    } else if (state.feedFilter === 'events') {
      posts = posts.filter(p => (p.category || '').toLowerCase().includes('event'));
    } else if (state.feedFilter === 'announcements') {
      posts = posts.filter(p => (p.category || '').toLowerCase().includes('announcement') || (p.category || '').toLowerCase().includes('notice'));
    } else if (state.feedFilter === 'popular') {
      posts = [...posts].sort((a, b) => ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0)));
    }

    let streamBannerHtml = '';
    if (activeStream) {
      streamBannerHtml = `
        <div class="mb-4 bg-gradient-to-r ${activeStream.color} text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-4xl p-2 bg-white/20 rounded-xl backdrop-blur-sm">${activeStream.icon}</span>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-bold">${activeStream.name}</h2>
                <span class="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">${activeStream.code}</span>
              </div>
              <p class="text-xs text-white/80 mt-1 max-w-xl">${activeStream.description}</p>
            </div>
          </div>
          <button id="clearStreamFilterBtn" class="flex-shrink-0 text-xs bg-white text-slate-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition shadow">
            View All Feeds ✕
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      ${streamBannerHtml}

      <!-- Ask Question / Create Post Bar -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div class="flex items-center gap-3">
          <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          <button id="openQuickPostBtn" class="flex-grow text-left bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 text-slate-500 dark:text-slate-400 text-sm px-4 py-2.5 rounded-full transition border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
            What do you want to ask or share about SSJU?
          </button>
        </div>
        <div class="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <button id="btnAskQuestionQuick" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition text-blue-600 dark:text-blue-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Ask Question
          </button>
          <button id="btnUploadImageQuick" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition text-emerald-600 dark:text-emerald-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Post Image
          </button>
          <button id="btnUploadPaperQuick" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition text-amber-600 dark:text-amber-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Upload Paper PDF
          </button>
        </div>
      </div>

      <!-- Feed Filter Pills -->
      <div class="flex items-center justify-between overflow-x-auto pb-2 mb-4 scrollbar-none">
        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
          <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}" data-filter="all">🔥 Everything</button>
          <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'popular' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}" data-filter="popular">⚡ Top Upvoted</button>
          <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'questions' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}" data-filter="questions">❓ Doubts</button>
          <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'events' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}" data-filter="events">🎉 Events</button>
          <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'announcements' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}" data-filter="announcements">📢 Notices</button>
        </div>

        <div class="hidden sm:flex items-center gap-2">
          <select id="feedStreamDropdown" class="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300">
            <option value="" ${!state.selectedStreamId ? 'selected' : ''}>All Faculties</option>
            ${streams.map(s => `<option value="${s.id}" ${state.selectedStreamId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="postsListContainer" class="space-y-4">
        ${posts.length > 0 ? posts.map(renderSinglePostCard).join('') : renderEmptyState("No posts found in this feed", "Be the first student to start a discussion or ask a question!")}
      </div>
    `;

    attachHomeFeedEvents();
  }

  function renderSinglePostCard(post) {
    const user = getUser();
    const isUpvoted = (user.upvotedPosts || []).includes(post.id);
    const isDownvoted = (user.downvotedPosts || []).includes(post.id);
    const isBookmarked = (user.bookmarks || []).includes(`post_${post.id}`);

    return `
      <article class="post-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition" data-post-id="${post.id}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <img src="${post.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" alt="${post.author.name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
            <div>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-semibold text-sm text-slate-900 dark:text-white">${post.author.name}</span>
                ${post.author.isVerifiedStudent ? `<span class="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium">✓ Verified</span>` : ''}
                <span class="text-xs text-slate-400">•</span>
                <span class="text-xs text-slate-500">${formatTimeAgo(post.createdAt)}</span>
              </div>
              <div class="text-xs text-slate-500 flex items-center gap-2">
                <span>${post.author.streamLabel || 'SSJU Campus'}</span>
                ${post.category ? `<span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">${post.category}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button class="btn-bookmark p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${isBookmarked ? 'text-amber-500' : ''}" data-post-id="${post.id}">
              <svg class="w-4 h-4 ${isBookmarked ? 'fill-current' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
            ${post.author.username === user.username ? `
              <button class="btn-delete-post p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" data-post-id="${post.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            ` : ''}
          </div>
        </div>

        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug cursor-pointer hover:text-blue-600 transition" onclick="window.togglePostComments('${post.id}')">
          ${post.title}
        </h3>

        <div class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">${post.content}</div>

        ${post.image ? `
          <div class="post-image-container mb-3 bg-slate-100 dark:bg-slate-800 max-h-96 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700" onclick="window.openImageZoom('${post.image}')">
            <img src="${post.image}" alt="Attachment" class="w-full h-auto max-h-96 object-cover" loading="lazy" />
          </div>
        ` : ''}

        ${post.tags && post.tags.length > 0 ? `
          <div class="flex items-center gap-1.5 flex-wrap mb-4">
            ${post.tags.map(t => `<span class="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 px-2.5 py-0.5 rounded-full font-medium cursor-pointer" onclick="window.filterByTag('${t}')">#${t}</span>`).join('')}
          </div>
        ` : ''}

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div class="vote-pill inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/80">
            <button class="vote-btn-up flex items-center gap-1 px-2.5 py-1 rounded-full transition hover:text-orange-600 ${isUpvoted ? 'vote-btn-active-up font-bold' : ''}" data-post-id="${post.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
              <span>${post.upvotes || 0}</span>
            </button>
            <span class="w-[1px] h-3 bg-slate-300 dark:bg-slate-700"></span>
            <button class="vote-btn-down px-2 py-1 rounded-full transition hover:text-indigo-600 ${isDownvoted ? 'vote-btn-active-down' : ''}" data-post-id="${post.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>

          <div class="flex items-center gap-2 sm:gap-3">
            <button class="btn-toggle-comments flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition" data-post-id="${post.id}">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span>${(post.comments && post.comments.length) || 0} Answers</span>
            </button>
            <button class="btn-share-post flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition" data-post-id="${post.id}" data-post-title="${encodeURIComponent(post.title)}">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              <span class="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        <div id="commentsSection_${post.id}" class="comments-accordion hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-start gap-2.5 mb-4">
            <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover" />
            <div class="flex-grow relative">
              <textarea id="commentInput_${post.id}" rows="2" placeholder="Write an answer or response..." class="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              <button class="btn-submit-comment absolute bottom-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm" data-post-id="${post.id}">Reply</button>
            </div>
          </div>
          <div class="space-y-3">
            ${(post.comments && post.comments.length > 0) ? post.comments.map(c => `
              <div class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center gap-2">
                    <img src="${c.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" alt="${c.author.name}" class="w-5 h-5 rounded-full object-cover" />
                    <span class="font-semibold text-slate-800 dark:text-slate-200">${c.author.name}</span>
                    <span class="text-slate-400 text-[11px]">${c.author.streamLabel || ''}</span>
                  </div>
                  <span class="text-slate-400 text-[10px]">${formatTimeAgo(c.createdAt)}</span>
                </div>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${c.content}</p>
              </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">No answers yet. Share your thoughts!</p>'}
          </div>
        </div>
      </article>
    `;
  }

  function renderStreamsView() {
    const container = document.getElementById('mainContentArea');
    const streams = getStreams();
    const user = getUser();

    container.innerHTML = `
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🏛️</span> Official Faculties & Courses
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Soban Singh Jeena University, Almora academic programs. Select a faculty to explore discussions and PYQ papers.
          </p>
        </div>
        <button onclick="window.promptAddCourse()" class="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 self-start sm:self-auto">
          <span>+</span> Add Custom Course
        </button>
      </div>

      <!-- Current Department Card -->
      <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span class="text-xs font-semibold bg-white/20 uppercase tracking-wider px-2.5 py-1 rounded-full">Your Enrolled Department</span>
          <h2 class="text-xl font-bold mt-2">${user.streamName || 'Computer Applications & IT'}</h2>
          <p class="text-xs text-blue-100 mt-1">Semester ${user.semester} • Roll: ${user.rollNo || 'SSJU Student'}</p>
        </div>
        <button onclick="window.navigateTo('settings')" class="px-4 py-2 bg-white text-blue-800 text-xs font-bold rounded-xl shadow hover:bg-blue-50 transition">
          Change in Settings ⚙️
        </button>
      </div>

      <!-- Streams Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${streams.map(stream => `
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-3xl p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">${stream.icon}</span>
                <span class="text-xs font-mono font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-lg">${stream.code}</span>
              </div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition mb-1">${stream.name}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">${stream.description}</p>
            </div>
            <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span>👥 ${stream.studentCount || 0}</span>
                <span>📄 ${stream.papersCount || 0} Papers</span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="window.filterFeedByStream('${stream.id}')" class="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg hover:bg-blue-100 transition">Explore Feed →</button>
                <button onclick="window.filterPapersByStream('${stream.id}')" class="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition">PYQs</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderPapersView() {
    const container = document.getElementById('mainContentArea');
    const streams = getStreams();
    const papers = getPapers();
    let filteredPapers = papers;

    if (state.selectedStreamId) {
      filteredPapers = filteredPapers.filter(p => p.streamId === state.selectedStreamId);
    }

    container.innerHTML = `
      <div class="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-2xl">📚</span>
            <h1 class="text-xl font-bold">SSJU Question Paper (PYQ) Vault</h1>
          </div>
          <p class="text-xs text-emerald-100 mt-1 max-w-xl">
            Archive of authentic Soban Singh Jeena University previous year examination papers. Upload PDF papers or download anytime for free!
          </p>
        </div>
        <button id="btnOpenPaperModal" class="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Upload Question Paper PDF
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Filter Faculty</label>
            <select id="paperStreamSelect" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200">
              <option value="">All Faculties</option>
              ${streams.map(s => `<option value="${s.id}" ${state.selectedStreamId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Filter Semester</label>
            <select id="paperSemesterSelect" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200">
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Search Subject Code</label>
            <input type="text" id="paperSearchInput" placeholder="e.g. BCA-301, PHY-501..." class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200" />
          </div>
        </div>
      </div>

      <div id="papersGridContainer" class="space-y-3">
        ${filteredPapers.length > 0 ? filteredPapers.map(renderSinglePaperCard).join('') : renderEmptyState("No question papers found", "Be the first student to upload a question paper for this faculty!")}
      </div>
    `;

    document.getElementById('btnOpenPaperModal')?.addEventListener('click', () => openUploadPaperModal());

    const streamSelect = document.getElementById('paperStreamSelect');
    const semesterSelect = document.getElementById('paperSemesterSelect');
    const searchInput = document.getElementById('paperSearchInput');

    function applyPaperFilters() {
      const sId = streamSelect ? streamSelect.value : '';
      const sem = semesterSelect ? semesterSelect.value : '';
      const q = (searchInput ? searchInput.value : '').toLowerCase().trim();

      let results = getPapers();
      if (sId) results = results.filter(p => p.streamId === sId);
      if (sem) results = results.filter(p => p.semester == sem);
      if (q) {
        results = results.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.subjectCode.toLowerCase().includes(q) ||
          (p.streamName && p.streamName.toLowerCase().includes(q))
        );
      }

      const grid = document.getElementById('papersGridContainer');
      if (grid) {
        grid.innerHTML = results.length > 0 ? results.map(renderSinglePaperCard).join('') : renderEmptyState("No matching question papers", "Try adjusting your search criteria.");
        attachPaperActionEvents();
      }
    }

    streamSelect?.addEventListener('change', applyPaperFilters);
    semesterSelect?.addEventListener('change', applyPaperFilters);
    searchInput?.addEventListener('input', applyPaperFilters);

    attachPaperActionEvents();
  }

  function renderSinglePaperCard(paper) {
    return `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span class="text-[9px] font-bold uppercase mt-0.5">PDF</span>
          </div>

          <div>
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded">${paper.subjectCode}</span>
              <span class="text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">Sem ${paper.semester}</span>
              <span class="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-full">${paper.examYear} ${paper.examType || 'Regular'}</span>
            </div>

            <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${paper.title}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">${paper.description || paper.streamName}</p>

            <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
              <span>Uploader: <strong>${paper.uploaderName || 'Student Council'}</strong></span>
              <span>•</span>
              <span>Size: ${paper.fileSize || '1.2 MB'}</span>
              <span>•</span>
              <span>Downloads: <strong>${paper.downloadsCount || 0}</strong></span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
          <button class="btn-preview-paper text-xs font-semibold px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition flex items-center gap-1.5" data-paper-id="${paper.id}">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Preview
          </button>
          <button class="btn-download-paper text-xs font-bold px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5" data-paper-id="${paper.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download PDF
          </button>
        </div>
      </div>
    `;
  }

  function renderProfileView() {
    const container = document.getElementById('mainContentArea');
    const user = getUser();
    const allPosts = getPosts();
    const allPapers = getPapers();

    const userPosts = allPosts.filter(p => p.author.username === user.username);
    const userPapers = allPapers.filter(p => p.uploaderName === user.name);
    const savedPosts = allPosts.filter(p => (user.bookmarks || []).includes(`post_${p.id}`));

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-6">
        <div class="h-32 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 relative">
          <button onclick="window.navigateTo('settings')" class="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5">
            Edit Profile ⚙️
          </button>
        </div>
        <div class="px-6 pb-6 pt-0 relative">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            <div class="flex items-end gap-4">
              <img src="${user.avatar}" alt="${user.name}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-md bg-white" />
              <div class="mb-1">
                <div class="flex items-center gap-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">${user.name}</h1>
                  <span class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">Student</span>
                </div>
                <p class="text-xs text-slate-500">@${user.username} • Roll: ${user.rollNo}</p>
              </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl text-center">
              <span class="block text-lg font-black text-blue-600 dark:text-blue-400">${user.reputation || 340}</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Campus Karma</span>
            </div>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">${user.bio || 'Soban Singh Jeena University student.'}</p>
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-semibold">
              🏛️ ${user.streamName} (Sem ${user.semester})
            </span>
            ${(user.badges || []).map(b => `<span class="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 px-2.5 py-1 rounded-full font-medium">🏆 ${b}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
        <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'posts' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500'}" data-tab="posts">My Posts (${userPosts.length})</button>
        <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'papers' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500'}" data-tab="papers">Uploaded PYQs (${userPapers.length})</button>
        <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'saved' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500'}" data-tab="saved">Saved Bookmarks (${savedPosts.length})</button>
      </div>

      <div class="space-y-4">
        ${state.profileTab === 'posts' ? (
          userPosts.length > 0 ? userPosts.map(renderSinglePostCard).join('') : renderEmptyState("No posts created yet", "Ask a question or post a campus update!")
        ) : state.profileTab === 'papers' ? (
          userPapers.length > 0 ? userPapers.map(renderSinglePaperCard).join('') : renderEmptyState("No question papers uploaded yet", "Upload exam PDFs to earn Karma!")
        ) : (
          savedPosts.length > 0 ? savedPosts.map(renderSinglePostCard).join('') : renderEmptyState("No saved bookmarks", "Click the bookmark icon on any post to save it.")
        )}
      </div>
    `;

    document.querySelectorAll('.profile-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.profileTab = e.currentTarget.getAttribute('data-tab');
        renderProfileView();
      });
    });

    if (state.profileTab === 'papers') attachPaperActionEvents();
    else attachHomeFeedEvents();
  }

  function renderSettingsView() {
    const container = document.getElementById('mainContentArea');
    const user = getUser();
    const settings = getSettings();
    const streams = getStreams();

    container.innerHTML = `
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚙️</span> Account & Profile Settings
        </h1>
        <p class="text-sm text-slate-500 mt-1">Manage your identity, department faculty, and visual theme.</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Student Profile Information</h2>
          <form id="profileSettingsForm" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                <input type="text" id="settingName" value="${user.name}" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
                <input type="text" id="settingUsername" value="${user.username}" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Enrolled Faculty / Stream</label>
                <select id="settingStream" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100">
                  ${streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Semester</label>
                <select id="settingSemester" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100">
                  ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => `<option value="${s}" ${user.semester == s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">University Roll Number</label>
              <input type="text" id="settingRollNo" value="${user.rollNo || ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
              <textarea id="settingBio" rows="3" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100">${user.bio || ''}</textarea>
            </div>

            <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">Save Profile Changes</button>
          </form>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Theme & Data Preferences</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Dark / Light Mode</span>
                <span class="text-xs text-slate-400">Switch visual appearance</span>
              </div>
              <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button class="theme-choice-btn text-xs font-semibold px-3 py-1.5 rounded-lg ${settings.theme === 'light' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'}" data-theme="light">☀️ Light</button>
                <button class="theme-choice-btn text-xs font-semibold px-3 py-1.5 rounded-lg ${settings.theme === 'dark' ? 'bg-white dark:bg-slate-900 text-blue-400 shadow-sm' : 'text-slate-500'}" data-theme="dark">🌙 Dark</button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span class="text-sm font-semibold text-rose-600 block">Reset Demo Data</span>
                <span class="text-xs text-slate-400">Restore default demo posts and question papers</span>
              </div>
              <button id="btnResetData" class="text-xs font-bold px-4 py-2 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition">Reset All Data</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('profileSettingsForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const sId = document.getElementById('settingStream').value;
      const streamObj = streams.find(s => s.id === sId);
      updateUser({
        name: document.getElementById('settingName').value.trim(),
        username: document.getElementById('settingUsername').value.trim(),
        rollNo: document.getElementById('settingRollNo').value.trim(),
        stream: sId,
        streamName: streamObj ? streamObj.name : 'Computer Applications',
        semester: parseInt(document.getElementById('settingSemester').value, 10),
        bio: document.getElementById('settingBio').value.trim()
      });
      showToast('Profile updated successfully!', 'success');
      updateHeaderUserBadge();
    });

    document.querySelectorAll('.theme-choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const th = e.currentTarget.getAttribute('data-theme');
        updateSettings({ theme: th });
        applyTheme();
        renderSettingsView();
        showToast(`Theme switched to ${th} mode`, 'info');
      });
    });

    document.getElementById('btnResetData')?.addEventListener('click', () => {
      if (confirm('Reset all demo data to default?')) {
        resetAllData();
        navigateTo('home');
        showToast('Data reset to default', 'info');
      }
    });
  }

  function renderSearchResultsView() {
    const container = document.getElementById('mainContentArea');
    const q = (state.searchQuery || '').toLowerCase().trim();
    const allPosts = getPosts();
    const allPapers = getPapers();
    const allStreams = getStreams();

    const matchedPosts = allPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );

    const matchedPapers = allPapers.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.subjectCode.toLowerCase().includes(q) ||
      p.streamName.toLowerCase().includes(q)
    );

    const matchedStreams = allStreams.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );

    container.innerHTML = `
      <div class="mb-6">
        <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🔍</span> Search Results for "${state.searchQuery}"
        </h1>
        <p class="text-xs text-slate-500 mt-1">Found ${matchedPosts.length} posts, ${matchedPapers.length} question papers, and ${matchedStreams.length} faculties.</p>
      </div>

      ${matchedStreams.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-sm font-bold text-slate-500 uppercase mb-3">Matching Faculties</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${matchedStreams.map(s => `
              <div onclick="window.filterFeedByStream('${s.id}')" class="cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 flex items-center gap-3">
                <span class="text-2xl">${s.icon}</span>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">${s.name}</h3>
                  <span class="text-xs text-slate-500">${s.code} • ${s.studentCount} Students</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${matchedPapers.length > 0 ? `
        <div class="mb-6">
          <h2 class="text-sm font-bold text-slate-500 uppercase mb-3">Matching Question Papers (${matchedPapers.length})</h2>
          <div class="space-y-3">${matchedPapers.map(renderSinglePaperCard).join('')}</div>
        </div>
      ` : ''}

      <div>
        <h2 class="text-sm font-bold text-slate-500 uppercase mb-3">Matching Posts & Questions (${matchedPosts.length})</h2>
        <div class="space-y-4">
          ${matchedPosts.length > 0 ? matchedPosts.map(renderSinglePostCard).join('') : renderEmptyState("No matching posts found", "Try another search term or ask a new question!")}
        </div>
      </div>
    `;

    attachHomeFeedEvents();
    attachPaperActionEvents();
  }

  function renderRightSidebarWidgets() {
    const container = document.getElementById('rightSidebarArea');
    if (!container) return;
    const papers = getPapers();

    container.innerHTML = `
      <div class="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-5 rounded-2xl shadow-sm mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xl">📲</span>
          <h3 class="font-bold text-sm">Share SSJU Connect</h3>
        </div>
        <p class="text-xs text-blue-100 leading-relaxed mb-4">Invite your classmates, hostel friends, and faculty groups!</p>
        <div class="flex items-center gap-2">
          <button onclick="window.openShareModal()" class="flex-grow text-xs font-bold bg-white text-blue-900 py-2 px-3 rounded-xl hover:bg-blue-50 transition shadow">Share App Now</button>
          <button onclick="window.copyAppUrlQuick()" class="text-xs font-bold bg-blue-600/70 hover:bg-blue-600 text-white p-2 rounded-xl transition" title="Copy Link">🔗</button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2"><span>📄</span> PYQ Vault</h3>
          <button onclick="window.navigateTo('papers')" class="text-xs font-semibold text-blue-600 hover:underline">View All (${papers.length})</button>
        </div>
        <div class="space-y-2 mb-3">
          ${papers.slice(0, 3).map(p => `
            <div onclick="window.openPaperPreviewModalFromWidget('${p.id}')" class="cursor-pointer p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 transition">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">${p.subjectCode}</span>
                <span class="text-[10px] text-emerald-600 font-semibold">${p.examYear}</span>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">${p.title}</p>
            </div>
          `).join('')}
        </div>
        <button onclick="window.openUploadPaperModal()" class="w-full text-xs font-bold py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-1.5">
          <span>+</span> Upload Exam Paper
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2"><span>🔥</span> Trending in SSJU</h3>
        <div class="space-y-3">
          <div onclick="window.filterByTag('EndTermExams')" class="cursor-pointer">
            <span class="text-[10px] text-slate-400">Academics</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600">#EndTermExams2026</h4>
            <span class="text-[11px] text-slate-500">1.2k students</span>
          </div>
          <div onclick="window.filterByTag('Placements')" class="cursor-pointer">
            <span class="text-[10px] text-slate-400">Career</span>
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600">#CampusPlacements</h4>
            <span class="text-[11px] text-slate-500">850 posts</span>
          </div>
        </div>
      </div>
    `;
  }

  function attachHomeFeedEvents() {
    document.querySelectorAll('.feed-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.feedFilter = e.currentTarget.getAttribute('data-filter');
        renderHomeView();
      });
    });

    const streamDropdown = document.getElementById('feedStreamDropdown');
    if (streamDropdown) {
      streamDropdown.addEventListener('change', (e) => {
        state.selectedStreamId = e.target.value || null;
        renderHomeView();
      });
    }

    document.getElementById('clearStreamFilterBtn')?.addEventListener('click', () => {
      state.selectedStreamId = null;
      renderHomeView();
    });

    document.getElementById('openQuickPostBtn')?.addEventListener('click', () => openCreatePostModal());
    document.getElementById('btnAskQuestionQuick')?.addEventListener('click', () => openCreatePostModal('question'));
    document.getElementById('btnUploadImageQuick')?.addEventListener('click', () => openCreatePostModal('image'));
    document.getElementById('btnUploadPaperQuick')?.addEventListener('click', () => openUploadPaperModal());

    document.querySelectorAll('.vote-btn-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        togglePostVote(postId, 'up');
        renderHomeView();
        showToast('Upvoted!', 'success');
      });
    });

    document.querySelectorAll('.vote-btn-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        togglePostVote(postId, 'down');
        renderHomeView();
        showToast('Downvoted', 'info');
      });
    });

    document.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        const res = toggleBookmark('post', postId);
        renderHomeView();
        showToast(res.isBookmarked ? 'Post bookmarked!' : 'Bookmark removed', 'info');
      });
    });

    document.querySelectorAll('.btn-delete-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        if (confirm('Delete this post?')) {
          deletePost(postId);
          renderHomeView();
          showToast('Post deleted', 'info');
        }
      });
    });

    document.querySelectorAll('.btn-toggle-comments').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        window.togglePostComments(postId);
      });
    });

    document.querySelectorAll('.btn-submit-comment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        const input = document.getElementById(`commentInput_${postId}`);
        if (!input || !input.value.trim()) return;

        const user = getUser();
        addCommentToPost(postId, {
          author: {
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            streamLabel: `${user.streamName} - Sem ${user.semester}`
          },
          content: input.value.trim()
        });

        input.value = '';
        renderHomeView();
        window.togglePostComments(postId, true);
        showToast('Comment submitted!', 'success');
      });
    });

    document.querySelectorAll('.btn-share-post').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = e.currentTarget.getAttribute('data-post-id');
        const title = decodeURIComponent(e.currentTarget.getAttribute('data-post-title') || 'SSJU Post');
        openShareModal({
          title: `${title} - SSJU Connect`,
          text: `Check out this discussion on SSJU Connect: "${title}"`,
          url: `${window.location.origin}${window.location.pathname}#home`
        });
      });
    });
  }

  function attachPaperActionEvents() {
    document.querySelectorAll('.btn-download-paper').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const paperId = e.currentTarget.getAttribute('data-paper-id');
        const papers = getPapers();
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;

        showToast(`Downloading ${paper.subjectCode}...`, 'info');
        incrementPaperDownload(paperId);
        await triggerPaperDownload(paper);
        showToast('Download started!', 'success');
      });
    });

    document.querySelectorAll('.btn-preview-paper').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const paperId = e.currentTarget.getAttribute('data-paper-id');
        const papers = getPapers();
        const paper = papers.find(p => p.id === paperId);
        if (paper) openPaperPreviewModal(paper);
      });
    });
  }

  function openPaperPreviewModal(paper) {
    const modal = document.getElementById('paperPreviewModal');
    const title = document.getElementById('previewModalTitle');
    const body = document.getElementById('previewModalBody');
    const dwnBtn = document.getElementById('previewModalDownloadBtn');
    if (!modal || !body) return;

    title.textContent = `${paper.subjectCode} - ${paper.title}`;
    body.innerHTML = `
      <div class="border border-slate-300 dark:border-slate-700 rounded-xl p-6 bg-white text-slate-900 shadow-inner font-serif">
        <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
          <h2 class="text-lg font-bold uppercase tracking-wider text-blue-900">Soban Singh Jeena University, Almora</h2>
          <h3 class="text-sm font-semibold text-slate-700">${paper.streamName}</h3>
          <p class="text-xs text-slate-500">${paper.examType} Examination - ${paper.examYear}</p>
        </div>
        <div class="flex justify-between text-xs mb-3 font-sans">
          <div><strong>Course:</strong> ${paper.title}</div>
          <div><strong>Code:</strong> ${paper.subjectCode}</div>
        </div>
        <div class="flex justify-between text-xs mb-4 pb-2 border-b border-slate-200 font-sans">
          <div><strong>Semester:</strong> ${paper.semester}</div>
          <div><strong>Time:</strong> 3 Hours | <strong>Max Marks:</strong> 100</div>
        </div>
        <div class="space-y-4 text-xs font-sans">
          <div>
            <h4 class="font-bold text-blue-900 border-b border-slate-200 pb-1 mb-2">SECTION A: Short Answer Questions (30 Marks)</h4>
            <ol class="list-decimal pl-4 space-y-1 text-slate-800">
              <li>Define the core objectives and scope of ${paper.subjectCode}.</li>
              <li>State fundamental laws and empirical derivations involved.</li>
              <li>Explain key operational constraints and edge scenarios.</li>
            </ol>
          </div>
          <div>
            <h4 class="font-bold text-blue-900 border-b border-slate-200 pb-1 mb-2">SECTION B: Analytical Problems (70 Marks)</h4>
            <ol class="list-decimal pl-4 space-y-1 text-slate-800" start="4">
              <li>Derive theoretical foundations and formulate optimized solutions for ${paper.title}.</li>
              <li>Analyze concurrent state machines and recovery mechanisms under failure conditions.</li>
            </ol>
          </div>
        </div>
      </div>
    `;

    dwnBtn.onclick = async () => {
      await triggerPaperDownload(paper);
      showToast('Download started!', 'success');
    };
    modal.classList.remove('hidden');
  }

  function openCreatePostModal(presetMode = 'post') {
    const modal = document.getElementById('createPostModal');
    const streams = getStreams();
    const user = getUser();
    if (!modal) return;

    const streamSelect = document.getElementById('postStreamSelect');
    if (streamSelect) {
      streamSelect.innerHTML = `
        <option value="">General (All Faculties)</option>
        ${streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
      `;
    }

    document.getElementById('postTitleInput').value = '';
    document.getElementById('postContentInput').value = '';
    document.getElementById('postTagsInput').value = '';
    document.getElementById('postImageInput').value = '';
    state.tempPostImage = null;
    document.getElementById('postImagePreviewArea')?.classList.add('hidden');

    if (presetMode === 'question') {
      document.getElementById('postCategorySelect').value = 'Doubt / Question';
    }
    modal.classList.remove('hidden');
  }

  function closeCreatePostModal() {
    document.getElementById('createPostModal')?.classList.add('hidden');
  }

  function openUploadPaperModal() {
    const modal = document.getElementById('uploadPaperModal');
    const streams = getStreams();
    const user = getUser();
    if (!modal) return;

    const streamSelect = document.getElementById('paperModalStreamSelect');
    if (streamSelect) {
      streamSelect.innerHTML = streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('');
    }

    document.getElementById('paperSubjectCodeInput').value = '';
    document.getElementById('paperTitleInput').value = '';
    document.getElementById('paperDescriptionInput').value = '';
    document.getElementById('paperFileInput').value = '';
    document.getElementById('paperFileNameDisplay').textContent = 'No file selected (Standard SSJU format will be generated if omitted)';
    state.tempPaperFile = null;
    modal.classList.remove('hidden');
  }

  function closeUploadPaperModal() {
    document.getElementById('uploadPaperModal')?.classList.add('hidden');
  }

  function openShareModal(customData = null) {
    const modal = document.getElementById('shareAppModal');
    if (!modal) return;

    const url = (customData && customData.url) || window.location.href.split('#')[0];
    const title = (customData && customData.title) || 'SSJU Connect - Campus Social & PYQ Vault';
    const text = (customData && customData.text) || 'Join SSJU Connect to discuss campus topics and download question papers!';

    const qrContainer = document.getElementById('shareQrCodeContainer');
    if (qrContainer) qrContainer.innerHTML = generateQrCodeSvg(url, 180);

    const urlInput = document.getElementById('shareUrlInput');
    if (urlInput) urlInput.value = url;

    const socialLinks = getSocialShareLinks(text, url);
    document.getElementById('shareWhatsappBtn').href = socialLinks.whatsapp;
    document.getElementById('shareTelegramBtn').href = socialLinks.telegram;
    document.getElementById('shareTwitterBtn').href = socialLinks.twitter;
    document.getElementById('shareLinkedinBtn').href = socialLinks.linkedin;

    const nativeBtn = document.getElementById('shareNativeBtn');
    if (nativeBtn) {
      if (navigator.share) {
        nativeBtn.classList.remove('hidden');
        nativeBtn.onclick = () => navigator.share({ title, text, url });
      } else {
        nativeBtn.classList.add('hidden');
      }
    }
    modal.classList.remove('hidden');
  }

  function closeShareModal() {
    document.getElementById('shareAppModal')?.classList.add('hidden');
  }

  function renderEmptyState(title, subtitle) {
    return `
      <div class="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">${title}</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">${subtitle}</p>
      </div>
    `;
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return 'recently';
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // ========================================================
  // 6. INITIALIZE LISTENERS & HASH ROUTING
  // ========================================================
  function initEventListeners() {
    // Nav Target Clicks (Sidebar & Mobile)
    document.querySelectorAll('[data-nav-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-nav-target');
        state.selectedStreamId = null;
        navigateTo(target);
      });
    });

    document.querySelectorAll('[data-mobile-target]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const target = el.getAttribute('data-mobile-target');
        navigateTo(target);
      });
    });

    // Hash Change Listener
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace(/^#\/?/, '') || 'home';
      const valid = ['home', 'streams', 'papers', 'profile', 'settings', 'search'];
      if (valid.includes(hash) && state.currentView !== hash) {
        navigateTo(hash, {}, false);
      }
    });

    // Search Input
    document.getElementById('globalSearchInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        navigateTo('search', { searchQuery: e.target.value.trim() });
      }
    });

    // Corner Dropdown
    const userMenuBtn = document.getElementById('headerUserMenuBtn');
    const userMenuDropdown = document.getElementById('headerUserDropdown');
    if (userMenuBtn && userMenuDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', () => userMenuDropdown.classList.add('hidden'));
    }

    document.getElementById('menuItemProfile')?.addEventListener('click', () => {
      navigateTo('profile');
      userMenuDropdown.classList.add('hidden');
    });
    document.getElementById('menuItemSettings')?.addEventListener('click', () => {
      navigateTo('settings');
      userMenuDropdown.classList.add('hidden');
    });
    document.getElementById('menuItemShareApp')?.addEventListener('click', () => {
      openShareModal();
      userMenuDropdown.classList.add('hidden');
    });
    document.getElementById('menuItemThemeToggle')?.addEventListener('click', () => {
      const settings = getSettings();
      const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
      updateSettings({ theme: newTheme });
      applyTheme();
      showToast(`Switched to ${newTheme} mode`, 'info');
      userMenuDropdown.classList.add('hidden');
    });

    document.getElementById('btnNavCreatePost')?.addEventListener('click', () => openCreatePostModal());
    document.getElementById('btnNavShareApp')?.addEventListener('click', () => openShareModal());

    // Post Image Upload
    document.getElementById('postImageInput')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const dataUrl = await readFileAsDataURL(file);
        state.tempPostImage = dataUrl;
        const previewBox = document.getElementById('postImagePreviewArea');
        const previewImg = document.getElementById('postImagePreviewElement');
        if (previewBox && previewImg) {
          previewImg.src = dataUrl;
          previewBox.classList.remove('hidden');
        }
      }
    });

    document.getElementById('btnRemovePostImage')?.addEventListener('click', () => {
      state.tempPostImage = null;
      document.getElementById('postImageInput').value = '';
      document.getElementById('postImagePreviewArea')?.classList.add('hidden');
    });

    document.getElementById('createPostForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitleInput').value.trim();
      const content = document.getElementById('postContentInput').value.trim();
      const category = document.getElementById('postCategorySelect').value;
      const streamId = document.getElementById('postStreamSelect').value || null;
      const tagsRaw = document.getElementById('postTagsInput').value;

      if (!title) return;
      const tags = tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
      const user = getUser();
      const streams = getStreams();
      const streamObj = streams.find(s => s.id === (streamId || user.stream));

      savePost({
        author: {
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          stream: user.stream,
          streamLabel: `${streamObj ? streamObj.name : 'SSJU Student'} - Sem ${user.semester}`,
          isVerifiedStudent: true
        },
        title,
        content,
        category,
        streamId,
        tags,
        image: state.tempPostImage || null
      });

      closeCreatePostModal();
      showToast('Post published!', 'success');
      navigateTo('home');
    });

    // Paper File Upload
    document.getElementById('paperFileInput')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        document.getElementById('paperFileNameDisplay').textContent = `Selected: ${file.name} (${sizeMb} MB)`;
        const dataUrl = await readFileAsDataURL(file);
        state.tempPaperFile = { dataUrl, name: file.name, size: `${sizeMb} MB` };
      }
    });

    document.getElementById('uploadPaperForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjectCode = document.getElementById('paperSubjectCodeInput').value.trim().toUpperCase();
      const title = document.getElementById('paperTitleInput').value.trim();
      const streamId = document.getElementById('paperModalStreamSelect').value;
      const semester = parseInt(document.getElementById('paperModalSemesterSelect').value, 10);
      const examYear = parseInt(document.getElementById('paperModalYearSelect').value, 10);
      const examType = document.getElementById('paperModalTypeSelect').value;
      const description = document.getElementById('paperDescriptionInput').value.trim();

      if (!subjectCode || !title) return;
      const streams = getStreams();
      const streamObj = streams.find(s => s.id === streamId);
      const user = getUser();

      savePaper({
        title,
        subjectCode,
        streamId,
        streamName: streamObj ? streamObj.name : 'University Faculty',
        semester,
        examYear,
        examType,
        uploaderName: user.name,
        uploaderStream: user.streamName,
        fileSize: state.tempPaperFile ? state.tempPaperFile.size : '1.2 MB',
        description,
        pdfDataUrl: state.tempPaperFile ? state.tempPaperFile.dataUrl : null,
        tags: [subjectCode, `Sem${semester}`, `${examYear}`]
      });

      closeUploadPaperModal();
      showToast('Question Paper uploaded (+25 Karma)', 'success');
      navigateTo('papers');
    });

    document.getElementById('btnCopyShareUrl')?.addEventListener('click', async () => {
      const input = document.getElementById('shareUrlInput');
      const success = await copyToClipboard(input.value);
      if (success) showToast('Link copied to clipboard!', 'share');
    });

    document.getElementById('closeCreatePostModalBtn')?.addEventListener('click', closeCreatePostModal);
    document.getElementById('closeUploadPaperModalBtn')?.addEventListener('click', closeUploadPaperModal);
    document.getElementById('closeShareModalBtn')?.addEventListener('click', closeShareModal);
    document.getElementById('closePreviewPaperModalBtn')?.addEventListener('click', () => {
      document.getElementById('paperPreviewModal')?.classList.add('hidden');
    });
    document.getElementById('closeImageLightboxBtn')?.addEventListener('click', () => {
      document.getElementById('imageLightboxModal')?.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
      if (e.target.id === 'createPostModal') closeCreatePostModal();
      if (e.target.id === 'uploadPaperModal') closeUploadPaperModal();
      if (e.target.id === 'shareAppModal') closeShareModal();
      if (e.target.id === 'paperPreviewModal') document.getElementById('paperPreviewModal')?.classList.add('hidden');
      if (e.target.id === 'imageLightboxModal') document.getElementById('imageLightboxModal')?.classList.add('hidden');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.getElementById('globalSearchInput')?.focus();
      }
      if (e.key === 'Escape') {
        closeCreatePostModal();
        closeUploadPaperModal();
        closeShareModal();
        document.getElementById('paperPreviewModal')?.classList.add('hidden');
        document.getElementById('imageLightboxModal')?.classList.add('hidden');
      }
    });
  }

  // ========================================================
  // 7. EXPOSE GLOBAL WINDOW FUNCTIONS (FOR INLINE ONCLICK)
  // ========================================================
  window.navigateTo = navigateTo;
  window.openCreatePostModal = openCreatePostModal;
  window.closeCreatePostModal = closeCreatePostModal;
  window.openUploadPaperModal = openUploadPaperModal;
  window.closeUploadPaperModal = closeUploadPaperModal;
  window.openShareModal = openShareModal;
  window.closeShareModal = closeShareModal;

  window.togglePostComments = (postId, forceOpen = false) => {
    const sec = document.getElementById(`commentsSection_${postId}`);
    if (sec) {
      if (forceOpen) sec.classList.remove('hidden');
      else sec.classList.toggle('hidden');
    }
  };

  window.filterFeedByStream = (streamId) => {
    state.selectedStreamId = streamId;
    navigateTo('home');
  };

  window.filterPapersByStream = (streamId) => {
    state.selectedStreamId = streamId;
    navigateTo('papers');
  };

  window.filterByTag = (tag) => {
    navigateTo('search', { searchQuery: tag });
  };

  window.openImageZoom = (imageUrl) => {
    const modal = document.getElementById('imageLightboxModal');
    const img = document.getElementById('lightboxImage');
    if (modal && img) {
      img.src = imageUrl;
      modal.classList.remove('hidden');
    }
  };

  window.openPaperPreviewModalFromWidget = (paperId) => {
    const papers = getPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) openPaperPreviewModal(paper);
  };

  window.copyAppUrlQuick = async () => {
    const success = await copyToClipboard(window.location.href.split('#')[0]);
    if (success) showToast('App link copied to clipboard!', 'share');
  };

  window.promptAddCourse = () => {
    const name = prompt("Enter Faculty / Course Name (e.g., Department of Forestry):");
    if (!name || !name.trim()) return;
    const code = prompt("Enter Course Degree Code (e.g., B.Sc Forestry / M.Sc):", "UG / PG Degree");
    const desc = prompt("Enter brief description of subjects covered:", "Academic study and practical coursework at SSJU.");
    const icon = prompt("Enter an emoji icon (e.g., 🌲, 🔬, 📚, 🎓):", "🎓");

    const created = saveStream({
      name: name.trim(),
      code: (code || "Degree").trim(),
      description: (desc || "Academic department").trim(),
      icon: (icon || "🎓").trim(),
      color: "from-blue-600 to-indigo-700"
    });

    showToast(`Added ${created.name} successfully!`, 'success');
    renderStreamsView();
  };

  // ========================================================
  // 8. BOOTSTRAP ON LOAD
  // ========================================================
  function initApp() {
    initStorage();
    applyTheme();
    initEventListeners();

    // Check URL hash for initial subpage (e.g. #streams, #papers, #profile, #settings)
    const initialHash = window.location.hash.replace(/^#\/?/, '');
    if (initialHash && ['home', 'streams', 'papers', 'profile', 'settings', 'search'].includes(initialHash)) {
      state.currentView = initialHash;
    }

    renderApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
