# SSJU Connect &bull; Campus Social & PYQ Question Paper Portal

> A fully responsive, modern **Quora & Reddit hybrid web application** tailored for **Soban Singh Jeena University (SSJU)** students, faculty, and alumni.

---

## 🌟 Key Features

### 1. 🏠 Home Page (Quora & Reddit Hybrid Feed)
- **Top Bar Post Creator**: *"What do you want to ask or share about SSJU?"* with quick buttons to **Ask Question**, **Post Image**, or **Upload Paper PDF**.
- **Interactive Post Cards**:
  - Reddit/Quora style **Upvote / Downvote pill** with live score calculations.
  - Verified student / faculty badges, branch labels, and timestamp.
  - Formatted text & expandable question discussions.
  - College photos and attachments with full-screen zoom Lightbox.
  - Clickable topic tags (`#EndTermExams`, `#Placements`, `#Spandan2026`).
  - **Answers & Comments System**: Inline answer textarea with author badge, upvoting, and nested reply structure.
  - One-click post sharing & bookmarking.
- **Feed Sub-Filters**:
  - 🔥 **Everything** (All campus posts)
  - ⚡ **Top Upvoted** (Trending by votes)
  - ❓ **Doubts & Questions** (Academic Q&A)
  - 🎉 **Campus Events** (Fests, auditions, sports)
  - 📢 **Notices** (Official university announcements)
  - Stream-specific feed filtering dropdown.

---

### 2. 🏛️ Department & Stream Selection Page
- Dedicated directory of university faculties and streams:
  - **B.Tech CSE & IT** (Computer Science & Engineering)
  - **BCA & MCA** (Computer Applications)
  - **Faculty of Science** (B.Sc / M.Sc Physics, Chemistry, Math, Botany, Zoology)
  - **Commerce & Finance** (B.Com / M.Com)
  - **Management Studies** (BBA / MBA)
  - **Arts & Humanities** (B.A. / M.A.)
  - **Faculty of Law** (LL.B / LL.M)
  - **Pharmacy & Medical Sciences** (B.Pharm / D.Pharm)
- Displays active student counts, question papers count, and direct shortcuts to filter feeds or view department-specific PYQ papers.
- Ability to set primary stream in your profile.

---

### 3. 📄 Question Paper (PYQ) Vault: Upload & Download
- **Anyone can upload question paper PDFs**:
  - Upload real `.pdf` files via drag-and-drop or file picker.
  - Specify subject code, subject title, department stream, semester (1 to 8), exam year (2021–2026), and exam type (End-Term, Mid-Term, Backlog).
  - Automatically calculates file size and stores the document securely in local browser storage.
  - Earns **+25 Campus Karma** points and a *"PYQ Donor"* badge!
- **Instant PDF Downloads**:
  - One-click download button triggers fast download of the authentic PDF exam paper with proper file naming (`SSJU_CSE_CS301_2025.pdf`).
  - Pre-seeded question papers dynamically generate an official formatted SSJU university exam paper using **jsPDF** with university header, exam sections (Section A, B, C), and marking scheme!
- **Interactive Preview Modal**:
  - Inspect the question paper directly on your screen without leaving the page.
- **Filters & Search**:
  - Filter question papers by Department, Semester, and live Subject / Code search.

---

### 4. 👤 Corner Profile & Settings
- **Top-Right Corner Avatar**:
  - Clickable avatar dropdown menu with quick profile stats, stream info, dark mode toggle, and settings shortcuts.
- **Dedicated Profile View**:
  - Cover photo, customizable avatar, roll number, stream, semester, and bio.
  - **Campus Karma** reputation score and achievement badges (*"Top Doubt Solver"*, *"Campus Contributor"*, *"PYQ Uploader"*).
  - Tabbed history:
    - **My Posts**: Review all posts you created with one-click delete option.
    - **Uploaded PYQs**: View all question papers you contributed.
    - **Saved Bookmarks**: Quick access to saved questions and papers.
- **Dedicated Settings View**:
  - Edit full name, username, email, roll number, bio, primary stream, and semester.
  - **Appearance Preferences**: Toggle **Dark Mode** / **Light Mode** (persists in storage).
  - Reset to default demo data option.

---

### 5. 🔍 Universal Search
- Real-time search in top navigation bar (`/` shortcut to instantly focus).
- Unified search results spanning:
  1. Campus questions and discussions (title, description, tags).
  2. Question papers and subject codes.
  3. University streams and departments.

---

### 6. 📲 "Share the App" Feature
- Prominent **"Share App"** button in header, right sidebar, and profile dropdown.
- **Interactive Share Dialog**:
  - **Dynamic QR Code**: High-resolution SVG QR code that smartphone cameras can scan immediately.
  - **Direct URL Copy**: One-click copy with animated toast notification.
  - **Mobile Native Share**: Integrates with device Web Share API (`navigator.share`) on mobile devices.
  - **Social Sharing**: Direct share shortcuts to **WhatsApp**, **Telegram**, **Twitter / X**, and **LinkedIn**.

---

### 7. 📱 100% Fully Responsive
- **Desktop (1024px+)**: Full 3-column Reddit/Quora layout (Left navigation & streams, Center feed, Right trending & PYQ widgets).
- **Tablet (768px - 1023px)**: 2-column layout with responsive stream switcher.
- **Mobile (<768px)**: Optimized mobile web app experience:
  - Sticky top header with brand and search.
  - Floating center **(+) Ask/Post** action button.
  - Native-style **Bottom Navigation Bar** (*Feed*, *Streams*, *(+)*, *PYQs*, *Profile*).

---

## 🚀 How to Run the App

You have multiple instant options:

### Option 1: Direct File Launch (No setup required!)
Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
```
Double-click: e:\SSJU.Connect\index.html
```

### Option 2: Windows One-Click Launcher
Double-click `start.bat` in File Explorer:
```cmd
start.bat
```

### Option 3: Python Local Server
```bash
python server.py
# Or:
python -m http.server 3000
```
Then visit: `http://localhost:3000`

### Option 4: Node.js Local Server
```bash
node server.js
```
Then visit: `http://localhost:3000`

---

## 📁 File Structure

```
e:\SSJU.Connect\
├── index.html          # Core responsive Quora/Reddit HTML application
├── css\
│   └── styles.css      # Custom animations, Quora/Reddit vote pills, dark mode
├── js\
│   ├── app.js          # Main router, UI event listeners & state manager
│   ├── data.js         # Initial mock streams, posts, papers & profiles
│   ├── storage.js      # LocalStorage persistence for posts, papers, & settings
│   ├── pdf-helper.js   # PDF upload, jsPDF exam paper generator & downloader
│   └── share-helper.js # QR code generator, clipboard & social share links
├── server.py           # Optional Python HTTP server with auto-launch
├── server.js           # Optional Node.js HTTP server
├── start.bat           # Windows quick-launch script
├── package.json        # Project metadata
└── README.md           # Documentation
```
