/**
 * SSJU Connect — Production Server v3.2
 * Soban Singh Jeena University · Campus Social & PYQ Vault
 *
 * Security & correctness audit, November 2026:
 * - Only public app assets are served; data, source, and configuration files stay private
 * - All user-facing create endpoints whitelist accepted fields (no mass-assignment)
 * - Passwords hashed with crypto.scrypt + per-user random salt
 * - Sessions expire after 7 days
 * - File uploads capped at 20 MB and validated as PDF content
 * - Uploads served with the MIME type detected from the file extension
 * - /api/ping keep-alive endpoint for UptimeRobot
 * - Zero npm dependencies (100 % native Node.js)
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

// ── Directories ──────────────────────────────────────────────────────────────
const DATA_DIR   = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const DB_FILE    = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'));

if (!fs.existsSync(DATA_DIR))   fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── MIME map ─────────────────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.pdf':  'application/pdf',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
};

// ── Static-file allow-list ───────────────────────────────────────────────────
// Only these named public files are served. Everything else
// (server.js, server.py, data/, .git/, …) is invisible to HTTP clients.
const ALLOWED_STATIC = new Set([
  'index.html',
  'login.html',
  'app.bundle.js',
  'styles.css',
  'robots.txt',
  'sitemap.xml',
]);
function isAllowedStaticPath(relative) {
  return ALLOWED_STATIC.has(relative);
}

// ── Password helpers ─────────────────────────────────────────────────────────
function hashPassword(pw, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) => {
      if (err) return reject(err);
      resolve(key.toString('hex'));
    });
  });
}
function newSalt() { return crypto.randomBytes(16).toString('hex'); }
function genToken() { return crypto.randomBytes(32).toString('hex'); }
function tokenKey(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
function id(prefix) { return prefix + '_' + crypto.randomUUID(); }

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Default seed data ────────────────────────────────────────────────────────
const DEFAULT_STREAMS = [
  { id: "science",     name: "Faculty of Science",             code: "B.Sc / M.Sc",                icon: "🔬", description: "Physics, Chemistry, Mathematics, Botany, Zoology, Geology, Statistics, Biotechnology & Forestry.", studentCount: 0, papersCount: 0, color: "from-emerald-600 to-teal-700", semesters: [1,2,3,4,5,6] },
  { id: "arts",        name: "Faculty of Arts & Humanities",   code: "B.A / M.A",                  icon: "📚", description: "Hindi, English, Sanskrit, History, Political Science, Sociology, Geography, Economics, Psychology & Journalism.", studentCount: 0, papersCount: 0, color: "from-rose-600 to-pink-700", semesters: [1,2,3,4,5,6] },
  { id: "commerce",    name: "Faculty of Commerce",            code: "B.Com / M.Com",              icon: "📊", description: "Corporate Accounting, Auditing, Financial Management, Taxation, Banking, Business Economics & E-Commerce.", studentCount: 0, papersCount: 0, color: "from-amber-600 to-orange-700", semesters: [1,2,3,4,5,6] },
  { id: "bca_mca",     name: "Computer Applications & IT",     code: "BCA / MCA / PGDCA",          icon: "💻", description: "Programming, Data Structures, Web Technologies, Database Systems, Software Engineering, AI & Python.", studentCount: 0, papersCount: 0, color: "from-blue-600 to-indigo-700", semesters: [1,2,3,4,5,6] },
  { id: "education",   name: "Faculty of Education",           code: "B.Ed / M.Ed",                icon: "🎓", description: "Teacher Education, Philosophical & Sociological Foundations, Educational Psychology, Curriculum & Pedagogy.", studentCount: 0, papersCount: 0, color: "from-sky-600 to-cyan-700", semesters: [1,2,3,4] },
  { id: "management",  name: "Management Studies",             code: "BBA / MBA",                  icon: "📈", description: "Business Administration, Marketing Strategy, Financial Management, Human Resource & Tourism Management.", studentCount: 0, papersCount: 0, color: "from-purple-600 to-violet-800", semesters: [1,2,3,4] },
  { id: "law",         name: "Faculty of Law",                 code: "LL.B / LL.M",                icon: "⚖️", description: "Constitutional Law of India, Criminal Jurisprudence, Civil Code, Law of Torts, Evidence Act & Moot Courts.", studentCount: 0, papersCount: 0, color: "from-slate-700 to-zinc-900", semesters: [1,2,3,4,5,6] },
  { id: "yoga",        name: "Yoga & Alternative Therapy",     code: "B.A/B.Sc & M.A/M.Sc (Yoga)", icon: "🧘", description: "Yogic Philosophy, Patanjali Yoga Sutras, Naturopathy, Asanas, Pranayama, Human Anatomy & Wellness Science.", studentCount: 0, papersCount: 0, color: "from-lime-600 to-emerald-800", semesters: [1,2,3,4,5,6] },
  { id: "visual_arts", name: "Visual Arts & Performing Arts",  code: "B.F.A / M.F.A & Music",      icon: "🎨", description: "Fine Arts, Painting, Sculpture, Traditional Folk Art (Aipan of Kumaon), Classical Vocal & Instrumental Music.", studentCount: 0, papersCount: 0, color: "from-fuchsia-600 to-pink-800", semesters: [1,2,3,4,5,6] },
  { id: "pharmacy",    name: "Pharmacy & Medical Sciences",    code: "B.Pharm / D.Pharm",          icon: "💊", description: "Pharmaceutics, Pharmacology, Pharmacognosy, Pharmaceutical Chemistry, Biochemistry & Clinical Trials.", studentCount: 0, papersCount: 0, color: "from-teal-600 to-cyan-800", semesters: [1,2,3,4,5,6,7,8] },
];

const DEFAULT_POSTS = [];
const PLACEHOLDER_POST_IDS = new Set(['post_1', 'post_2', 'post_3', 'post_4']);

const DEFAULT_PAPERS = [
  // Papers are created only after a real PDF has been uploaded.
];

function freshDB() {
  return {
    users: [],
    sessions: {},
    sessionVersion: 1,
    uploads: {},
    streams: JSON.parse(JSON.stringify(DEFAULT_STREAMS)),
    posts: JSON.parse(JSON.stringify(DEFAULT_POSTS)),
    papers: JSON.parse(JSON.stringify(DEFAULT_PAPERS)),
  };
}

// ── Local DB ─────────────────────────────────────────────────────────────────
let db;

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!db.users) db.users = [];
      if (!db.sessions) db.sessions = {};
      if (!db.uploads) db.uploads = {};
      let migrated = false;
      if (db.sessionVersion !== 1) {
        // Old versions stored the bearer token itself as the DB key. Revoke
        // those sessions and persist only SHA-256 token fingerprints going forward.
        db.sessions = {};
        db.sessionVersion = 1;
        migrated = true;
      }
      if (!Array.isArray(db.posts))   db.posts   = DEFAULT_POSTS;
      if (!Array.isArray(db.papers))  db.papers  = DEFAULT_PAPERS;
      if (!Array.isArray(db.streams)) db.streams = DEFAULT_STREAMS;
      const realPosts = db.posts.filter(post => post && !PLACEHOLDER_POST_IDS.has(post.id));
      if (realPosts.length !== db.posts.length) {
        db.posts = realPosts;
        migrated = true;
      }
      // Drop placeholder/demo entries and stale file references. Every public paper
      // must point to a PDF the server actually stored.
      const validFiles = new Set(fs.existsSync(UPLOAD_DIR) ? fs.readdirSync(UPLOAD_DIR) : []);
      const validPapers = db.papers.filter(p => p && typeof p.fileUrl === 'string' &&
        /^\/uploads\/[a-f0-9]+\.pdf$/i.test(p.fileUrl) && validFiles.has(path.basename(p.fileUrl)));
      if (validPapers.length !== db.papers.length || migrated) {
        db.papers = validPapers;
        saveDB();
      }
      console.log('[DB] Loaded ' + db.posts.length + ' posts, ' + db.papers.length + ' papers, ' + db.users.length + ' users');
    } catch {
      db = freshDB();
      saveDB();
    }
  } else {
    db = freshDB();
    saveDB();
    console.log('[DB] Created fresh database');
  }
  // Prune expired sessions on load
  pruneExpiredSessions();
}

function saveDB() {
  try {
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tmp, DB_FILE);
  } catch (e) {
    console.error('[DB] Save error:', e.message);
  }
}

function pruneExpiredSessions() {
  const now = Date.now();
  let changed = false;
  for (const tok of Object.keys(db.sessions)) {
    if (now - (db.sessions[tok].createdAt || 0) > SESSION_TTL_MS) {
      delete db.sessions[tok];
      changed = true;
    }
  }
  if (changed) saveDB();
}

loadDB();

// ── Session helpers ──────────────────────────────────────────────────────────
function createSession(userId, username) {
  const token = genToken();
  db.sessions[tokenKey(token)] = { userId, username, createdAt: Date.now() };
  saveDB();
  return token;
}

function getSession(req) {
  const header = req.headers['authorization'] || '';
  const match = /^Bearer ([a-f0-9]{64})$/i.exec(header);
  if (!match) return null;
  const auth = tokenKey(match[1]);
  const s = db.sessions[auth];
  if (!s) return null;
  if (Date.now() - (s.createdAt || 0) > SESSION_TTL_MS) {
    delete db.sessions[auth]; saveDB(); return null;
  }
  return s;
}

function getUserFromSession(req) {
  const s = getSession(req);
  if (!s) return null;
  return db.users.find(u => u.id === s.userId) || null;
}

function safeUser(u) {
  if (!u) return null;
  const { passwordHash, salt, ...rest } = u;
  return rest;
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────
function parseJsonBody(req, maxBytes) {
  maxBytes = maxBytes || 1024 * 1024; // 1 MB default
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    let settled = false;
    req.on('data', c => {
      if (settled) return;
      bytes += c.length;
      if (bytes > maxBytes) {
        settled = true;
        const err = new Error('Request body is too large.');
        err.statusCode = 413;
        reject(err);
        return;
      }
      body += c.toString('utf8');
    });
    req.on('end', () => {
      if (settled) return;
      settled = true;
      if (!body.trim()) return resolve({});
      try {
        const value = JSON.parse(body);
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
          const err = new Error('JSON body must be an object.');
          err.statusCode = 400;
          return reject(err);
        }
        resolve(value);
      }
      catch {
        const err = new Error('Invalid JSON.');
        err.statusCode = 400;
        reject(err);
      }
    });
    req.on('error', err => { if (!settled) { settled = true; reject(err); } });
  });
}

function json(res, code, data) {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function localIp() {
  for (const ifs of Object.values(os.networkInterfaces())) {
    for (const i of ifs) { if (i.family === 'IPv4' && !i.internal) return i.address; }
  }
  return '127.0.0.1';
}

// Store user text without markup delimiters. The frontend still escapes every
// dynamic value at render time; this is defense in depth, not HTML encoding.
function stripTags(s) {
  return typeof s === 'string' ? s.replace(/[<>]/g, '') : '';
}

// ═══════════════════════════════════════════════════════════════════════════
// HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(405); return res.end(); }

  const parsedUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  const pathname = parsedUrl.pathname;

  try {

  // ── Keep-alive ──────────────────────────────────────────────────────────
  if (pathname === '/api/ping' || pathname === '/ping') {
    return json(res, 200, { pong: true, t: Date.now() });
  }

  // ── Status ──────────────────────────────────────────────────────────────
  if (pathname === '/api/status' && req.method === 'GET') {
    return json(res, 200, {
      status: 'online',
      version: '3.2.0',
      postsCount: db.posts.length,
      papersCount: db.papers.length,
      usersCount: db.users.length,
      uptime: Math.round(process.uptime()),
    });
  }

  // ── Streams (public) ───────────────────────────────────────────────────
  if (pathname === '/api/streams' && req.method === 'GET') {
    const streams = db.streams.map(stream => ({
      ...stream,
      studentCount: db.users.filter(user => user.stream === stream.id).length,
      papersCount: db.papers.filter(paper => paper.streamId === stream.id).length,
    }));
    return json(res, 200, streams);
  }

  if (pathname === '/api/streams' && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });
    const body = await parseJsonBody(req);
    const name = typeof body.name === 'string' ? stripTags(body.name).trim().slice(0, 80) : '';
    const code = typeof body.code === 'string' ? stripTags(body.code).trim().slice(0, 40) : '';
    const description = typeof body.description === 'string' ? stripTags(body.description).trim().slice(0, 300) : '';
    const icon = typeof body.icon === 'string' ? stripTags(body.icon).trim().slice(0, 12) : '';
    if (name.length < 2) return json(res, 400, { error: 'Faculty name must have at least two characters.' });
    if (db.streams.some(stream => stream.name.toLowerCase() === name.toLowerCase())) {
      return json(res, 409, { error: 'This faculty already exists.' });
    }
    const stream = {
      id: id('stream'), name, code: code || 'UG / PG',
      description: description || 'Academic studies and practical coursework at SSJU.',
      icon: icon || '🎓', studentCount: 0, papersCount: 0,
      semesters: [1, 2, 3, 4, 5, 6], color: 'from-blue-600 to-indigo-700',
    };
    db.streams.push(stream);
    saveDB();
    return json(res, 201, stream);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname === '/api/auth/signup' && req.method === 'POST') {
    const body = await parseJsonBody(req);
    const { username, password, name, stream, streamName, semester, rollNo } = body;
    if (typeof username !== 'string' || typeof password !== 'string' || typeof name !== 'string' || !name.trim()) {
      return json(res, 400, { error: 'Name, username and password are required.' });
    }
    if (username.trim().length < 3 || username.trim().length > 30 || !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return json(res, 400, { error: 'Username must be 3–30 characters and contain only letters, numbers, and underscores.' });
    }
    if (password.length < 6 || password.length > 1024) return json(res, 400, { error: 'Password must be between 6 and 1024 characters.' });

    const cleanUser = stripTags(username).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30);
    if (db.users.find(u => u.username === cleanUser)) return json(res, 409, { error: 'Username already taken.' });

    const selectedStream = db.streams.find(s => s.id === stream) || db.streams.find(s => s.id === 'bca_mca');
    const userSalt = newSalt();
    const newUser = {
      id: id('user'),
      username: cleanUser,
      passwordHash: await hashPassword(password, userSalt),
      salt: userSalt,
      name: stripTags(name).slice(0, 60),
      stream: selectedStream.id,
      streamName: selectedStream.name || stripTags(streamName || '').slice(0, 80),
      semester: Math.min(Math.max(parseInt(semester) || 1, 1), 8),
      rollNo: stripTags(rollNo || '').slice(0, 40),
      avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(stripTags(name).slice(0, 40)) + '&background=1e3a8a&color=fff&size=200',
      bio: 'Student at SSJU Almora',
      reputation: 0,
      badges: ['New Member'],
      bookmarks: [],
      upvotedPosts: [],
      downvotedPosts: [],
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB();
    const token = createSession(newUser.id, newUser.username);
    return json(res, 201, { success: true, token, user: safeUser(newUser) });
  }

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const { username, password } = await parseJsonBody(req);
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password || password.length > 1024) {
      return json(res, 400, { error: 'Username and password required.' });
    }
    const user = db.users.find(u => u.username === username.trim().toLowerCase());
    if (!user) return json(res, 401, { error: 'No account with that username.' });
    const candidate = Buffer.from(await hashPassword(password, user.salt), 'hex');
    const existing = Buffer.from(user.passwordHash || '', 'hex');
    if (candidate.length !== existing.length || !crypto.timingSafeEqual(candidate, existing)) {
      return json(res, 401, { error: 'Wrong password.' });
    }
    const token = createSession(user.id, user.username);
    return json(res, 200, { success: true, token, user: safeUser(user) });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    const match = /^Bearer ([a-f0-9]{64})$/i.exec(req.headers['authorization'] || '');
    const key = match ? tokenKey(match[1]) : null;
    if (key && db.sessions[key]) { delete db.sessions[key]; saveDB(); }
    return json(res, 200, { success: true });
  }

  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Not logged in' });
    return json(res, 200, safeUser(user));
  }

  // ══════════════════════════════════════════════════════════════════════════
  // USER PROFILE
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname === '/api/user' && req.method === 'GET') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Not logged in' });
    return json(res, 200, safeUser(user));
  }

  if (pathname === '/api/user' && (req.method === 'PUT' || req.method === 'POST')) {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Not logged in' });
    const body = await parseJsonBody(req);
    const idx = db.users.findIndex(u => u.id === user.id);
    if (idx < 0) return json(res, 404, { error: 'User not found' });
    const oldUsername = db.users[idx].username;

    // Whitelist editable profile fields; credentials, role, karma, badges, and
    // voting state are server managed.
    if (Object.hasOwn(body, 'name')) db.users[idx].name = stripTags(body.name).trim().slice(0, 60);
    if (Object.hasOwn(body, 'bio')) db.users[idx].bio = stripTags(body.bio).slice(0, 300);
    if (Object.hasOwn(body, 'avatar')) {
      const avatar = typeof body.avatar === 'string' ? body.avatar.trim() : '';
      if (avatar && !/^https:\/\//i.test(avatar)) return json(res, 400, { error: 'Avatar must be an HTTPS image URL.' });
      db.users[idx].avatar = avatar.slice(0, 500);
    }
    if (Object.hasOwn(body, 'stream')) {
      const selectedStream = db.streams.find(s => s.id === body.stream);
      if (!selectedStream) return json(res, 400, { error: 'Choose a valid faculty.' });
      db.users[idx].stream = selectedStream.id;
      db.users[idx].streamName = selectedStream.name;
    }
    if (Object.hasOwn(body, 'streamName') && !Object.hasOwn(body, 'stream')) {
      return json(res, 400, { error: 'Faculty name is server managed.' });
    }
    if (Object.hasOwn(body, 'username')) {
      const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
      if (!/^[a-z0-9_]{3,30}$/.test(username)) return json(res, 400, { error: 'Username must be 3–30 letters, numbers, or underscores.' });
      if (db.users.some(u => u.id !== user.id && u.username === username)) return json(res, 409, { error: 'Username already taken.' });
      db.users[idx].username = username;
      for (const session of Object.values(db.sessions)) if (session.userId === user.id) session.username = username;
    }
    if (Object.hasOwn(body, 'semester')) {
      const value = Number(body.semester);
      if (!Number.isInteger(value) || value < 1 || value > 8) return json(res, 400, { error: 'Semester must be between 1 and 8.' });
      db.users[idx].semester = value;
    }
    if (Object.hasOwn(body, 'rollNo')) db.users[idx].rollNo = stripTags(body.rollNo).slice(0, 40);
    for (const post of db.posts) {
      if (post.author && (post.author.id === user.id || post.author.username === oldUsername)) {
        post.author.id = user.id;
        post.author.name = db.users[idx].name;
        post.author.username = db.users[idx].username;
        post.author.avatar = db.users[idx].avatar;
        post.author.stream = db.users[idx].stream;
        post.author.streamLabel = (db.users[idx].streamName || '') + (db.users[idx].semester ? ' - Sem ' + db.users[idx].semester : '');
      }
      for (const comment of post.comments || []) {
        if (comment.author && (comment.author.id === user.id || comment.author.username === oldUsername)) {
          comment.author.id = user.id;
          comment.author.name = db.users[idx].name;
          comment.author.username = db.users[idx].username;
          comment.author.avatar = db.users[idx].avatar;
          comment.author.streamLabel = (db.users[idx].streamName || '') + (db.users[idx].semester ? ' - Sem ' + db.users[idx].semester : '');
        }
      }
    }
    saveDB();
    return json(res, 200, { success: true, user: safeUser(db.users[idx]) });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // POSTS
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname === '/api/posts' && req.method === 'GET') {
    return json(res, 200, db.posts);
  }

  if (pathname === '/api/posts' && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required to post' });
    const body = await parseJsonBody(req, 1024 * 1024);
    if (typeof body.title !== 'string' || !body.title.trim()) return json(res, 400, { error: 'Title is required' });
    if (typeof body.image === 'string' && body.image.length > 950_000) return json(res, 413, { error: 'Post images must be 700 KB or smaller.' });
    const requestedStreamId = body.streamId || user.stream;
    const postStream = db.streams.find(stream => stream.id === requestedStreamId);
    if (!postStream) return json(res, 400, { error: 'Choose a valid faculty.' });

    const post = {
      id: id('post'),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        stream: user.stream,
        streamLabel: (user.streamName || '') + (user.semester ? ' - Sem ' + user.semester : ''),
        isVerifiedStudent: true,
      },
      title:    stripTags(body.title).slice(0, 300),
      content:  stripTags(body.content || '').slice(0, 5000),
      category: stripTags(body.category || 'General Discussion').slice(0, 60),
      streamId: postStream.id,
      tags:     Array.isArray(body.tags) ? body.tags.slice(0, 10).map(t => stripTags(String(t)).slice(0, 30)) : [],
      image:    (typeof body.image === 'string' && (/^https?:\/\//i.test(body.image) || /^data:image\/(png|jpeg|gif|webp);base64,/i.test(body.image))) ? body.image : null,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
      comments: [],
    };
    db.posts.unshift(post);

    // Reputation
    const ui = db.users.findIndex(u => u.id === user.id);
    if (ui >= 0) db.users[ui].reputation = (db.users[ui].reputation || 0) + 5;
    saveDB();
    return json(res, 201, post);
  }

  // Vote
  if (pathname.startsWith('/api/posts/') && pathname.endsWith('/vote') && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });
    const postId = pathname.split('/')[3];
    const { type } = await parseJsonBody(req);
    if (type !== 'up' && type !== 'down') return json(res, 400, { error: 'Vote type must be up or down.' });
    const post = db.posts.find(p => p.id === postId);
    if (!post) return json(res, 404, { error: 'Post not found' });

    const ui = db.users.findIndex(u => u.id === user.id);
    const u = db.users[ui];
    if (!u.upvotedPosts) u.upvotedPosts = [];
    if (!u.downvotedPosts) u.downvotedPosts = [];

    const upI = u.upvotedPosts.indexOf(postId);
    const dnI = u.downvotedPosts.indexOf(postId);

    if (type === 'up') {
      if (upI > -1) { u.upvotedPosts.splice(upI, 1); post.upvotes = Math.max(0, post.upvotes - 1); }
      else { if (dnI > -1) { u.downvotedPosts.splice(dnI, 1); post.downvotes = Math.max(0, post.downvotes - 1); } u.upvotedPosts.push(postId); post.upvotes += 1; }
    } else if (type === 'down') {
      if (dnI > -1) { u.downvotedPosts.splice(dnI, 1); post.downvotes = Math.max(0, post.downvotes - 1); }
      else { if (upI > -1) { u.upvotedPosts.splice(upI, 1); post.upvotes = Math.max(0, post.upvotes - 1); } u.downvotedPosts.push(postId); post.downvotes += 1; }
    }
    saveDB();
    return json(res, 200, { post, user: safeUser(u) });
  }

  if (/^\/api\/posts\/[^/]+$/.test(pathname) && req.method === 'DELETE') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });
    const postId = decodeURIComponent(pathname.split('/')[3] || '');
    const index = db.posts.findIndex(post => post.id === postId);
    if (index < 0) return json(res, 404, { error: 'Post not found.' });
    const post = db.posts[index];
    if (!post.author || (post.author.id !== user.id && post.author.username !== user.username)) {
      return json(res, 403, { error: 'You can only delete your own posts.' });
    }
    db.posts.splice(index, 1);
    saveDB();
    return json(res, 200, { success: true });
  }

  // Comment
  if (pathname.startsWith('/api/posts/') && pathname.endsWith('/comment') && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });
    const postId = pathname.split('/')[3];
    const body = await parseJsonBody(req);
    const post = db.posts.find(p => p.id === postId);
    if (!post) return json(res, 404, { error: 'Post not found' });
    if (typeof body.content !== 'string' || !body.content.trim()) return json(res, 400, { error: 'Comment content required' });

    const comment = {
      id: id('comment'),
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        streamLabel: (user.streamName || '') + (user.semester ? ' - Sem ' + user.semester : ''),
      },
      content: stripTags(body.content).slice(0, 2000),
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    if (!post.comments) post.comments = [];
    post.comments.push(comment);
    saveDB();
    return json(res, 201, comment);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAPERS
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname === '/api/papers' && req.method === 'GET') {
    return json(res, 200, db.papers);
  }

  if (pathname === '/api/papers' && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });
    const body = await parseJsonBody(req);
    if (typeof body.title !== 'string' || !body.title.trim() || typeof body.subjectCode !== 'string' || !body.subjectCode.trim()) {
      return json(res, 400, { error: 'Title and subject code required' });
    }
    const paperStream = body.streamId
      ? db.streams.find(stream => stream.id === body.streamId)
      : db.streams.find(stream => stream.id === user.stream);
    if (!paperStream) return json(res, 400, { error: 'Choose a valid faculty.' });
    const fileName = typeof body.fileUrl === 'string' && body.fileUrl.startsWith('/uploads/') ? path.basename(body.fileUrl) : '';
    const uploadRecord = db.uploads[fileName];
    if (!fileName || !uploadRecord || uploadRecord.userId !== user.id || !fs.existsSync(path.join(UPLOAD_DIR, fileName))) {
      return json(res, 400, { error: 'Upload a real PDF before adding it to the vault.' });
    }

    const paper = {
      id: id('paper'),
      title:        stripTags(body.title).slice(0, 200),
      subjectCode:  stripTags(body.subjectCode).slice(0, 20),
      streamId:     paperStream.id,
      streamName:   paperStream.name,
      semester:     Math.min(Math.max(parseInt(body.semester) || 1, 1), 8),
      examYear:     parseInt(body.examYear) || new Date().getFullYear(),
      examType:     stripTags(body.examType || 'End-Term Regular').slice(0, 40),
      uploaderName: user.name,
      uploaderUsername: user.username,
      uploaderId: user.id,
      fileUrl:      '/uploads/' + fileName,
      fileSize:     uploadRecord.fileSize,
      description:  stripTags(body.description || '').slice(0, 500),
      tags:         Array.isArray(body.tags) ? body.tags.slice(0, 10).map(t => stripTags(String(t)).slice(0, 30)) : [],
      downloadsCount: 0,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    db.papers.unshift(paper);

    const ui = db.users.findIndex(u => u.id === user.id);
    if (ui >= 0) {
      db.users[ui].reputation = (db.users[ui].reputation || 0) + 25;
      if (!db.users[ui].badges.includes('PYQ Donor')) db.users[ui].badges.push('PYQ Donor');
    }
    saveDB();
    return json(res, 201, paper);
  }

  // Download count
  if (pathname.startsWith('/api/papers/') && pathname.endsWith('/download') && req.method === 'POST') {
    const paperId = pathname.split('/')[3];
    const p = db.papers.find(x => x.id === paperId);
    if (!p) return json(res, 404, { error: 'Paper not found.' });
    p.downloadsCount = (p.downloadsCount || 0) + 1;
    saveDB();
    return json(res, 200, p);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FILE UPLOAD (20 MB cap, PDF only)
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname === '/api/upload' && req.method === 'POST') {
    const user = getUserFromSession(req);
    if (!user) return json(res, 401, { error: 'Login required' });

    const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
    const declaredLength = Number(req.headers['content-length'] || 0);
    if (declaredLength > MAX_BYTES) {
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify({ error: 'File exceeds 20 MB limit.' }));
      req.resume();
      return;
    }
    const rawHeaderName = req.headers['x-filename'];
    let rawName;
    try { rawName = rawHeaderName ? decodeURIComponent(rawHeaderName) : 'exam.pdf'; }
    catch { return json(res, 400, { error: 'Invalid file name.' }); }
    const ext = path.extname(rawName).toLowerCase();

    if (ext !== '.pdf') return json(res, 400, { error: 'Only PDF files are accepted.' });
    if (req.headers['content-type'] !== 'application/pdf') return json(res, 400, { error: 'Set the upload content type to application/pdf.' });

    const safeFilename = crypto.randomBytes(18).toString('hex') + '.pdf';
    const targetPath = path.join(UPLOAD_DIR, safeFilename);
    const chunks = [];
    let totalBytes = 0;
    for await (const chunk of req) {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BYTES) return json(res, 413, { error: 'File exceeds 20 MB limit.' });
      chunks.push(chunk);
    }
    const fileData = Buffer.concat(chunks);
    if (fileData.length < 8 || fileData.subarray(0, 5).toString('ascii') !== '%PDF-') {
      return json(res, 400, { error: 'The selected file is not a valid PDF.' });
    }
    await fs.promises.writeFile(targetPath, fileData, { flag: 'wx' });
    const sizeMb = (totalBytes / (1024 * 1024)).toFixed(1);
    const sizeStr = totalBytes >= 1024 * 1024 ? sizeMb + ' MB' : Math.max(1, Math.round(totalBytes / 1024)) + ' KB';
    db.uploads[safeFilename] = { userId: user.id, fileSize: sizeStr, uploadedAt: Date.now() };
    saveDB();
    console.log('[Upload] ' + safeFilename + ' (' + sizeStr + ') by ' + user.username);
    return json(res, 201, { success: true, fileUrl: '/uploads/' + safeFilename, fileName: path.basename(rawName), fileSize: sizeStr });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SERVE UPLOADED FILES
  // ══════════════════════════════════════════════════════════════════════════

  if (pathname.startsWith('/uploads/') && req.method === 'GET') {
    const fileName = path.basename(pathname);
    // Expose only randomized, server-validated PDF uploads.
    if (!/^[a-f0-9]{36}\.pdf$/i.test(fileName) || path.basename(pathname) !== pathname.slice('/uploads/'.length)) {
      res.writeHead(400); return res.end('Bad request');
    }
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (!fs.existsSync(filePath)) { res.writeHead(404); return res.end('Not found'); }

    const stat = fs.statSync(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const isDownload = parsedUrl.searchParams.get('download') === '1';

    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stat.size,
      'Content-Disposition': isDownload ? 'attachment; filename="' + fileName + '"' : 'inline',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "sandbox; default-src 'none'",
      'Cache-Control': 'public, max-age=86400',
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // STATIC FILE SERVING  (allow-listed paths only)
  // ══════════════════════════════════════════════════════════════════════════

  // Serve only named public files. There is no directory serving or SPA
  // fallback, so private project files can never be reached by guessing paths.
  if (req.method !== 'GET') { res.writeHead(404); return res.end('Not found'); }
  let relative = pathname === '/' ? 'index.html' : pathname.replace(/^\//, '');
  if (!isAllowedStaticPath(relative)) { res.writeHead(404); return res.end('Not found'); }
  const fullPath = path.join(__dirname, relative);
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) { res.writeHead(404); return res.end('Not found'); }
    const ct = MIME[path.extname(fullPath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': ct,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': ['index.html', 'login.html', 'app.bundle.js', 'styles.css'].includes(relative)
        ? 'no-cache'
        : 'public, max-age=3600',
    });
    fs.createReadStream(fullPath).pipe(res);
  });

  } catch (err) {
    console.error('[Server] Unhandled error:', err);
    const status = err.statusCode || 500;
    if (!res.headersSent) json(res, status, { error: status < 500 ? err.message : 'Internal server error' });
  }
});

server.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log('  🎓 SSJU CONNECT v3.2');
  console.log('  Soban Singh Jeena University · Almora');
  console.log('================================================================');
  console.log('  http://localhost:' + PORT);
  console.log('  http://' + localIp() + ':' + PORT);
  console.log('  Auth:   multi-user login');
  console.log('  DB:     ' + DB_FILE);
  console.log('================================================================');
});
