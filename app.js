/**
 * SSJU Connect - Core Application Controller
 * Handles routing, feed rendering, post creation, PDF upload/download, profile/settings, search, and sharing.
 */

import {
  initStorage,
  getPosts,
  savePost,
  deletePost,
  togglePostVote,
  addCommentToPost,
  getPapers,
  savePaper,
  deletePaper,
  incrementPaperDownload,
  getUser,
  updateUser,
  toggleBookmark,
  getStreams,
  saveStream,
  getSettings,
  updateSettings,
  resetAllData
} from './storage.js';

import { triggerPaperDownload, readFileAsDataURL } from './pdf-helper.js';
import { generateQrCodeSvg, copyToClipboard, shareAppOrContent, getSocialShareLinks } from './share-helper.js';

// Application State
const state = {
  currentView: 'home', // 'home' | 'streams' | 'papers' | 'profile' | 'settings' | 'search'
  feedFilter: 'all', // 'all' | 'popular' | 'questions' | 'events' | 'announcements'
  selectedStreamId: null, // null for all streams
  searchQuery: '',
  profileTab: 'posts', // 'posts' | 'papers' | 'saved'
  tempPostImage: null,
  tempPaperFile: null,
  activePreviewPaper: null
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  applyTheme();
  initEventListeners();
  renderApp();
  initKeyboardShortcuts();
});

// Apply Theme (Light / Dark)
function applyTheme() {
  const settings = getSettings();
  const isDark = settings.theme === 'dark' || 
    (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Global Toast System
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    share: '🔗'
  };

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

// Navigation View Switcher
export function navigateTo(viewName, params = {}) {
  state.currentView = viewName;
  if (params.streamId !== undefined) state.selectedStreamId = params.streamId;
  if (params.searchQuery !== undefined) state.searchQuery = params.searchQuery;
  if (params.profileTab !== undefined) state.profileTab = params.profileTab;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// Main Render Dispatcher
function renderApp() {
  updateNavActiveState();
  updateHeaderUserBadge();

  const mainContent = document.getElementById('mainContentArea');
  const rightSidebar = document.getElementById('rightSidebarArea');
  const leftSidebar = document.getElementById('leftSidebar');

  // Ensure right sidebar visibility on desktop for home/papers
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
    case 'home':
      renderHomeView();
      break;
    case 'streams':
      renderStreamsView();
      break;
    case 'papers':
      renderPapersView();
      break;
    case 'profile':
      renderProfileView();
      break;
    case 'settings':
      renderSettingsView();
      break;
    case 'search':
      renderSearchResultsView();
      break;
    default:
      renderHomeView();
  }

  renderRightSidebarWidgets();
}

// Header User Avatar & Menu update
function updateHeaderUserBadge() {
  const user = getUser();
  const avatarImg = document.getElementById('headerUserAvatar');
  const avatarName = document.getElementById('headerUserName');
  const avatarStream = document.getElementById('headerUserStream');

  if (avatarImg) avatarImg.src = user.avatar;
  if (avatarName) avatarName.textContent = user.name;
  if (avatarStream) avatarStream.textContent = user.streamName || 'SSJU Student';
}

// Update Active Link Indicators
function updateNavActiveState() {
  document.querySelectorAll('[data-nav-target]').forEach(el => {
    const target = el.getAttribute('data-nav-target');
    if (target === state.currentView) {
      el.classList.add('active', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30', 'dark:text-blue-400');
    } else {
      el.classList.remove('active', 'text-blue-600', 'bg-blue-50', 'dark:bg-blue-900/30', 'dark:text-blue-400');
    }
  });

  // Mobile Bottom Bar Active state
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

// ==========================================
// VIEW: HOME FEED (QUORA / REDDIT STYLE)
// ==========================================
function renderHomeView() {
  const container = document.getElementById('mainContentArea');
  const user = getUser();
  const streams = getStreams();
  const activeStream = streams.find(s => s.id === state.selectedStreamId);

  let posts = getPosts();

  // Filter by selected stream if active
  if (state.selectedStreamId) {
    posts = posts.filter(p => p.streamId === state.selectedStreamId);
  }

  // Filter by feed category/tab
  if (state.feedFilter === 'questions') {
    posts = posts.filter(p => p.category.toLowerCase().includes('doubt') || p.category.toLowerCase().includes('question'));
  } else if (state.feedFilter === 'events') {
    posts = posts.filter(p => p.category.toLowerCase().includes('event'));
  } else if (state.feedFilter === 'announcements') {
    posts = posts.filter(p => p.category.toLowerCase().includes('announcement') || p.category.toLowerCase().includes('notice'));
  } else if (state.feedFilter === 'popular') {
    posts = [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
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

    <!-- Quora / Reddit Style "Ask / Create Post" Bar -->
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

    <!-- Feed Sub-Filters Bar (Reddit / Quora tabs) -->
    <div class="flex items-center justify-between overflow-x-auto pb-2 mb-4 scrollbar-none">
      <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
        <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}" data-filter="all">
          🔥 Everything
        </button>
        <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'popular' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}" data-filter="popular">
          ⚡ Top Upvoted
        </button>
        <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'questions' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}" data-filter="questions">
          ❓ Doubts & Questions
        </button>
        <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'events' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}" data-filter="events">
          🎉 Campus Events
        </button>
        <button class="feed-filter-btn px-3 py-1.5 rounded-lg transition ${state.feedFilter === 'announcements' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}" data-filter="announcements">
          📢 Notices
        </button>
      </div>

      <!-- Quick Stream Switcher Dropdown in Feed -->
      <div class="hidden sm:flex items-center gap-2">
        <span class="text-xs text-slate-500 font-medium">Stream:</span>
        <select id="feedStreamDropdown" class="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="" ${!state.selectedStreamId ? 'selected' : ''}>All Streams</option>
          ${streams.map(s => `<option value="${s.id}" ${state.selectedStreamId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Posts Feed Container -->
    <div id="postsListContainer" class="space-y-4">
      ${posts.length > 0 ? posts.map(renderSinglePostCard).join('') : renderEmptyState("No posts found in this feed", "Be the first student to start a discussion or ask a question!")}
    </div>
  `;

  // Attach event handlers for Home Feed
  attachHomeFeedEvents();
}

// Render Single Post Card HTML (Quora & Reddit hybrid)
function renderSinglePostCard(post) {
  const user = getUser();
  const isUpvoted = user.upvotedPosts && user.upvotedPosts.includes(post.id);
  const isDownvoted = user.downvotedPosts && user.downvotedPosts.includes(post.id);
  const isBookmarked = user.bookmarks && user.bookmarks.includes(`post_${post.id}`);
  const voteScore = (post.upvotes || 0) - (post.downvotes || 0);

  const formattedTime = formatTimeAgo(post.createdAt);

  return `
    <article class="post-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition" data-post-id="${post.id}">
      <!-- Author Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <img src="${post.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}" alt="${post.author.name}" class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="font-semibold text-sm text-slate-900 dark:text-white">${post.author.name}</span>
              ${post.author.isVerifiedStudent ? `
                <span class="inline-flex items-center gap-0.5 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium" title="Verified SSJU Student">
                  ✓ Verified
                </span>
              ` : ''}
              <span class="text-xs text-slate-400">•</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">${formattedTime}</span>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>${post.author.streamLabel || 'SSJU Campus'}</span>
              ${post.category ? `<span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">${post.category}</span>` : ''}
            </div>
          </div>
        </div>

        <!-- Post options / Bookmark -->
        <div class="flex items-center gap-1">
          <button class="btn-bookmark p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${isBookmarked ? 'text-amber-500' : ''}" data-post-id="${post.id}" title="${isBookmarked ? 'Remove Bookmark' : 'Save Post'}">
            <svg class="w-4 h-4 ${isBookmarked ? 'fill-current' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </button>
          ${post.author.username === user.username ? `
            <button class="btn-delete-post p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" data-post-id="${post.id}" title="Delete Post">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Post Title (Quora Question style) -->
      <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition" onclick="window.togglePostComments('${post.id}')">
        ${post.title}
      </h3>

      <!-- Post Body Text -->
      <div class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3 whitespace-pre-line">
        ${post.content}
      </div>

      <!-- Optional Post Image -->
      ${post.image ? `
        <div class="post-image-container mb-3 bg-slate-100 dark:bg-slate-800 max-h-96 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700" onclick="window.openImageZoom('${post.image}')">
          <img src="${post.image}" alt="Post attachment" class="w-full h-auto max-h-96 object-cover" loading="lazy" />
        </div>
      ` : ''}

      <!-- Tags list -->
      ${post.tags && post.tags.length > 0 ? `
        <div class="flex items-center gap-1.5 flex-wrap mb-4">
          ${post.tags.map(t => `<span class="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 px-2.5 py-0.5 rounded-full font-medium cursor-pointer" onclick="window.filterByTag('${t}')">#${t}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Action Footer (Reddit/Quora style Upvotes, Comments, Share) -->
      <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <!-- Upvote / Downvote Pill -->
        <div class="vote-pill inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-0.5 border border-slate-200/80 dark:border-slate-700/80">
          <button class="vote-btn-up flex items-center gap-1 px-2.5 py-1 rounded-full transition hover:text-orange-600 ${isUpvoted ? 'vote-btn-active-up font-bold' : ''}" data-post-id="${post.id}" title="Upvote">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
            <span class="text-xs">${post.upvotes || 0}</span>
          </button>
          <span class="w-[1px] h-3 bg-slate-300 dark:bg-slate-700"></span>
          <button class="vote-btn-down px-2 py-1 rounded-full transition hover:text-indigo-600 ${isDownvoted ? 'vote-btn-active-down' : ''}" data-post-id="${post.id}" title="Downvote">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Comments Toggle Button -->
          <button class="btn-toggle-comments flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition" data-post-id="${post.id}">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>${(post.comments && post.comments.length) || 0} Answers</span>
          </button>

          <!-- Share Post Button -->
          <button class="btn-share-post flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition" data-post-id="${post.id}" data-post-title="${encodeURIComponent(post.title)}">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            <span class="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      <!-- Comments Thread Section (Collapsible) -->
      <div id="commentsSection_${post.id}" class="comments-accordion hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <!-- New Comment Input Box -->
        <div class="flex items-start gap-2.5 mb-4">
          <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover" />
          <div class="flex-grow">
            <div class="relative">
              <textarea id="commentInput_${post.id}" rows="2" placeholder="Write an answer or reply..." class="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"></textarea>
              <button class="btn-submit-comment absolute bottom-2 right-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition" data-post-id="${post.id}">
                Reply
              </button>
            </div>
          </div>
        </div>

        <!-- Existing Comments List -->
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
          `).join('') : '<p class="text-xs text-slate-400 italic">No answers yet. Share your knowledge!</p>'}
        </div>
      </div>
    </article>
  `;
}

// Attach event listeners for Home feed
function attachHomeFeedEvents() {
  // Feed filter buttons (All, Popular, Questions, etc.)
  document.querySelectorAll('.feed-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.feedFilter = e.currentTarget.getAttribute('data-filter');
      renderHomeView();
    });
  });

  // Feed stream selector dropdown
  const streamDropdown = document.getElementById('feedStreamDropdown');
  if (streamDropdown) {
    streamDropdown.addEventListener('change', (e) => {
      state.selectedStreamId = e.target.value || null;
      renderHomeView();
    });
  }

  // Clear stream filter button
  const clearStreamBtn = document.getElementById('clearStreamFilterBtn');
  if (clearStreamBtn) {
    clearStreamBtn.addEventListener('click', () => {
      state.selectedStreamId = null;
      renderHomeView();
    });
  }

  // Quick action buttons
  document.getElementById('openQuickPostBtn')?.addEventListener('click', () => openCreatePostModal());
  document.getElementById('btnAskQuestionQuick')?.addEventListener('click', () => openCreatePostModal('question'));
  document.getElementById('btnUploadImageQuick')?.addEventListener('click', () => openCreatePostModal('image'));
  document.getElementById('btnUploadPaperQuick')?.addEventListener('click', () => openUploadPaperModal());

  // Post Card Event Listeners (Delegated)
  document.querySelectorAll('.vote-btn-up').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = e.currentTarget.getAttribute('data-post-id');
      togglePostVote(postId, 'up');
      renderHomeView();
      showToast('Upvote recorded!', 'success');
    });
  });

  document.querySelectorAll('.vote-btn-down').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = e.currentTarget.getAttribute('data-post-id');
      togglePostVote(postId, 'down');
      renderHomeView();
      showToast('Downvote recorded', 'info');
    });
  });

  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = e.currentTarget.getAttribute('data-post-id');
      const res = toggleBookmark('post', postId);
      renderHomeView();
      showToast(res.isBookmarked ? 'Post saved to bookmarks!' : 'Bookmark removed', 'info');
    });
  });

  document.querySelectorAll('.btn-delete-post').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const postId = e.currentTarget.getAttribute('data-post-id');
      if (confirm('Are you sure you want to delete this post?')) {
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
        url: `${window.location.origin}${window.location.pathname}?post=${postId}`
      });
    });
  });
}

// Global window helpers for inline calls
window.togglePostComments = (postId, forceOpen = false) => {
  const section = document.getElementById(`commentsSection_${postId}`);
  if (section) {
    if (forceOpen) {
      section.classList.remove('hidden');
    } else {
      section.classList.toggle('hidden');
    }
  }
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

// ==========================================
// VIEW: STREAMS & DEPARTMENTS SELECTION
// ==========================================
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

    <!-- Active Stream Card -->
    <div class="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold bg-white/20 uppercase tracking-wider px-2.5 py-1 rounded-full">Your Current Department</span>
        <h2 class="text-xl font-bold mt-2">${user.streamName || 'Computer Science & Engineering'}</h2>
        <p class="text-xs text-blue-100 mt-1">Semester ${user.semester} • Roll: ${user.rollNo || 'Not specified'}</p>
      </div>
      <button onclick="window.navigateTo('settings')" class="px-4 py-2 bg-white text-blue-800 text-xs font-bold rounded-xl shadow hover:bg-blue-50 transition">
        Edit in Settings ⚙️
      </button>
    </div>

    <!-- Stream Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${streams.map(stream => `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col justify-between group">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">${stream.icon}</span>
              <span class="text-xs font-mono font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-lg">
                ${stream.code}
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition mb-1">
              ${stream.name}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
              ${stream.description}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span title="Active Students">👥 ${stream.studentCount}</span>
              <span title="Question Papers">📄 ${stream.papersCount} Papers</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.filterFeedByStream('${stream.id}')" class="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                Explore Feed →
              </button>
              <button onclick="window.filterPapersByStream('${stream.id}')" class="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="View Question Papers">
                PYQs
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

window.filterFeedByStream = (streamId) => {
  state.selectedStreamId = streamId;
  navigateTo('home');
};

window.filterPapersByStream = (streamId) => {
  state.selectedStreamId = streamId;
  navigateTo('papers');
};

window.promptAddCourse = () => {
  const name = prompt("Enter Faculty / Course Name (e.g. Department of Forestry & Wildlife):");
  if (!name || !name.trim()) return;
  const code = prompt("Enter Course Degree Code (e.g. B.Sc Forestry / M.Sc):", "UG / PG Degree");
  const desc = prompt("Enter brief description of subjects covered:", "Academic study and practical coursework at SSJU.");
  const icon = prompt("Enter an emoji icon for this department (e.g. 🌲, 🔬, 📚, 🎓):", "🎓");

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


// ==========================================
// VIEW: QUESTION PAPERS (PYQ VAULT)
// ==========================================
function renderPapersView() {
  const container = document.getElementById('mainContentArea');
  const streams = getStreams();
  const papers = getPapers();

  // Filter papers
  let filteredPapers = papers;
  if (state.selectedStreamId) {
    filteredPapers = filteredPapers.filter(p => p.streamId === state.selectedStreamId);
  }

  container.innerHTML = `
    <!-- Question Papers Hero & Header -->
    <div class="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white rounded-2xl p-5 mb-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">📚</span>
          <h1 class="text-xl font-bold">SSJU Question Paper (PYQ) Vault</h1>
        </div>
        <p class="text-xs text-emerald-100 mt-1 max-w-xl">
          Archive of authentic Soban Singh Jeena University previous years question papers. Upload your exam papers in PDF format or download anytime for free!
        </p>
      </div>
      <button id="btnOpenPaperModal" class="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-50 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Upload Question Paper PDF
      </button>
    </div>

    <!-- Filter & Search Controls -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Stream filter -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Filter by Department</label>
          <select id="paperStreamSelect" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <option value="">All Departments</option>
            ${streams.map(s => `<option value="${s.id}" ${state.selectedStreamId === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>

        <!-- Semester filter -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Filter by Semester</label>
          <select id="paperSemesterSelect" class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </div>

        <!-- Search papers input -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Search Subject or Code</label>
          <div class="relative">
            <input type="text" id="paperSearchInput" placeholder="e.g. CS-301, Data Structures..." class="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Paper Cards Grid -->
    <div id="papersGridContainer" class="space-y-3">
      ${filteredPapers.length > 0 ? filteredPapers.map(renderSinglePaperCard).join('') : renderEmptyState("No question papers found", "Be the first student to upload a question paper for this department!")}
    </div>
  `;

  // Attach Paper Events
  document.getElementById('btnOpenPaperModal')?.addEventListener('click', () => openUploadPaperModal());

  const streamSelect = document.getElementById('paperStreamSelect');
  if (streamSelect) {
    streamSelect.addEventListener('change', (e) => {
      state.selectedStreamId = e.target.value || null;
      renderPapersView();
    });
  }

  const semesterSelect = document.getElementById('paperSemesterSelect');
  const searchInput = document.getElementById('paperSearchInput');

  function applyPaperFilters() {
    const sem = semesterSelect ? semesterSelect.value : '';
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let results = getPapers();

    if (state.selectedStreamId) {
      results = results.filter(p => p.streamId === state.selectedStreamId);
    }
    if (sem) {
      results = results.filter(p => p.semester == sem);
    }
    if (q) {
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.subjectCode.toLowerCase().includes(q) ||
        p.streamName.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const grid = document.getElementById('papersGridContainer');
    if (grid) {
      grid.innerHTML = results.length > 0 ? results.map(renderSinglePaperCard).join('') : renderEmptyState("No matching question papers", "Try adjusting your filters.");
      attachPaperActionEvents();
    }
  }

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
            <span class="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded">
              ${paper.subjectCode}
            </span>
            <span class="text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Sem ${paper.semester}
            </span>
            <span class="text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
              ${paper.examYear} ${paper.examType || 'Regular'}
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">
            ${paper.title}
          </h3>

          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            ${paper.description || paper.streamName}
          </p>

          <div class="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span>Uploader: <strong>${paper.uploaderName || 'Anonymous'}</strong></span>
            <span>•</span>
            <span>Size: ${paper.fileSize || '1.2 MB'}</span>
            <span>•</span>
            <span>Downloads: <strong>${paper.downloadsCount || 0}</strong></span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
        <button class="btn-preview-paper text-xs font-semibold px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition flex items-center gap-1.5" data-paper-id="${paper.id}">
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

function attachPaperActionEvents() {
  document.querySelectorAll('.btn-download-paper').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const paperId = e.currentTarget.getAttribute('data-paper-id');
      const papers = getPapers();
      const paper = papers.find(p => p.id === paperId);
      if (!paper) return;

      showToast(`Generating & downloading ${paper.subjectCode}...`, 'info');
      incrementPaperDownload(paperId);
      await triggerPaperDownload(paper);
      showToast('Download started successfully!', 'success');
    });
  });

  document.querySelectorAll('.btn-preview-paper').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const paperId = e.currentTarget.getAttribute('data-paper-id');
      const papers = getPapers();
      const paper = papers.find(p => p.id === paperId);
      if (!paper) return;

      openPaperPreviewModal(paper);
    });
  });
}

// Paper Preview Modal
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

      <div class="p-2.5 bg-slate-50 border border-dashed border-slate-300 rounded text-[11px] italic mb-4 font-sans text-slate-600">
        Note: Answer all questions according to guidelines. Neat diagrams and proper step-by-step solutions are required.
      </div>

      <div class="space-y-4 text-xs font-sans">
        <div>
          <h4 class="font-bold text-blue-900 border-b border-slate-200 pb-1 mb-2">SECTION A: Conceptual Questions (30 Marks)</h4>
          <ol class="list-decimal pl-4 space-y-1 text-slate-800">
            <li>Define the fundamental definitions and structural boundaries of ${paper.subjectCode}.</li>
            <li>Compare empirical versus analytical methodologies in current applications.</li>
            <li>Derive time vs space trade-offs with illustrative test cases.</li>
            <li>Explain the state machine representation and invariant principles.</li>
          </ol>
        </div>

        <div>
          <h4 class="font-bold text-blue-900 border-b border-slate-200 pb-1 mb-2">SECTION B: Analytical Problems (40 Marks)</h4>
          <ol class="list-decimal pl-4 space-y-1 text-slate-800" start="5">
            <li>Formulate an optimal end-to-end procedural workflow for real-world scenarios.</li>
            <li>Provide mathematical proof of correctness and worst-case bounds.</li>
            <li>Evaluate concurrency control mechanisms and fault-recovery protocols.</li>
          </ol>
        </div>

        <div>
          <h4 class="font-bold text-blue-900 border-b border-slate-200 pb-1 mb-2">SECTION C: Case Study (30 Marks)</h4>
          <ol class="list-decimal pl-4 space-y-1 text-slate-800" start="8">
            <li>Given an enterprise high-volume requirement, architect a scalable and fault-tolerant implementation.</li>
          </ol>
        </div>
      </div>

      <div class="text-center pt-6 mt-6 border-t border-slate-200 text-[10px] text-slate-400 font-sans">
        SSJU Question Paper Archive &bull; Uploaded by ${paper.uploaderName || 'Student Council'}
      </div>
    </div>
  `;

  dwnBtn.onclick = async () => {
    await triggerPaperDownload(paper);
    showToast('Download started!', 'success');
  };

  modal.classList.remove('hidden');
}

// ==========================================
// VIEW: PROFILE (CORNER PROFILE ACCESS)
// ==========================================
function renderProfileView() {
  const container = document.getElementById('mainContentArea');
  const user = getUser();
  const allPosts = getPosts();
  const allPapers = getPapers();

  const userPosts = allPosts.filter(p => p.author.username === user.username);
  const userPapers = allPapers.filter(p => p.uploaderName === user.name);
  const savedPosts = allPosts.filter(p => user.bookmarks && user.bookmarks.includes(`post_${p.id}`));

  container.innerHTML = `
    <!-- Profile Header Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-6">
      <!-- Cover Banner -->
      <div class="h-32 sm:h-44 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 relative">
        <button onclick="window.navigateTo('settings')" class="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Edit Profile
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
              <p class="text-xs text-slate-500 dark:text-slate-400">@${user.username} • Roll: ${user.rollNo}</p>
            </div>
          </div>

          <!-- Karma / Reputation Counter -->
          <div class="flex items-center gap-3">
            <div class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl text-center">
              <span class="block text-lg font-black text-blue-600 dark:text-blue-400">${user.reputation || 280}</span>
              <span class="text-[10px] font-bold text-slate-400 uppercase">Campus Karma</span>
            </div>
          </div>
        </div>

        <!-- Bio & Details -->
        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          ${user.bio || 'Soban Singh Jeena University student. Here to discuss academics, campus life and share question papers.'}
        </p>

        <!-- Department Tag & Badges -->
        <div class="flex items-center gap-2 flex-wrap mb-2">
          <span class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full font-semibold">
            🏛️ ${user.streamName} (Sem ${user.semester})
          </span>
          ${(user.badges || []).map(b => `
            <span class="text-xs bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 px-2.5 py-1 rounded-full font-medium">
              🏆 ${b}
            </span>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Profile Tabs (My Posts, Uploaded Papers, Saved) -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
      <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'posts' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}" data-tab="posts">
        My Posts (${userPosts.length})
      </button>
      <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'papers' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}" data-tab="papers">
        Uploaded PYQs (${userPapers.length})
      </button>
      <button class="profile-tab-btn text-sm font-bold px-4 py-2 rounded-xl transition ${state.profileTab === 'saved' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}" data-tab="saved">
        Saved Bookmarks (${savedPosts.length})
      </button>
    </div>

    <!-- Profile Tab Content -->
    <div id="profileTabContentArea" class="space-y-4">
      ${state.profileTab === 'posts' ? (
        userPosts.length > 0 ? userPosts.map(renderSinglePostCard).join('') : renderEmptyState("You haven't posted yet", "Share a thought, doubt, or campus picture!")
      ) : state.profileTab === 'papers' ? (
        userPapers.length > 0 ? userPapers.map(renderSinglePaperCard).join('') : renderEmptyState("No question papers uploaded yet", "Upload exam PDFs to help fellow students and earn Karma!")
      ) : (
        savedPosts.length > 0 ? savedPosts.map(renderSinglePostCard).join('') : renderEmptyState("No saved bookmarks", "Click the bookmark icon on any post to save it for quick reference.")
      )}
    </div>
  `;

  // Attach Profile Tab Listeners
  document.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.profileTab = e.currentTarget.getAttribute('data-tab');
      renderProfileView();
    });
  });

  if (state.profileTab === 'papers') {
    attachPaperActionEvents();
  } else {
    attachHomeFeedEvents();
  }
}

// ==========================================
// VIEW: SETTINGS (CORNER SETTINGS ACCESS)
// ==========================================
function renderSettingsView() {
  const container = document.getElementById('mainContentArea');
  const user = getUser();
  const settings = getSettings();
  const streams = getStreams();

  container.innerHTML = `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span>⚙️</span> Account & App Settings
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Manage your profile details, department stream, theme preferences, and notifications.
      </p>
    </div>

    <div class="space-y-6">
      <!-- Profile Information Edit Card -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          Personal Information
        </h2>

        <form id="profileSettingsForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <input type="text" id="settingName" value="${user.name}" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
              <input type="text" id="settingUsername" value="${user.username}" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <input type="email" id="settingEmail" value="${user.email}" required class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">University Roll / Registration No</label>
              <input type="text" id="settingRollNo" value="${user.rollNo || ''}" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <!-- Stream & Semester -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Primary Stream / Department</label>
              <select id="settingStream" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Semester</label>
              <select id="settingSemester" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${user.semester == s ? 'selected' : ''}>Semester ${s}</option>`).join('')}
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
            <textarea id="settingBio" rows="3" class="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">${user.bio || ''}</textarea>
          </div>

          <div class="pt-2">
            <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      <!-- App Appearance & Preferences Card -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          Appearance & Preferences
        </h2>

        <div class="space-y-4">
          <!-- Theme toggle -->
          <div class="flex items-center justify-between">
            <div>
              <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
              <span class="text-xs text-slate-400">Switch between light and dark visual mode</span>
            </div>
            <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button class="theme-choice-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition ${settings.theme === 'light' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'}" data-theme="light">
                ☀️ Light
              </button>
              <button class="theme-choice-btn text-xs font-semibold px-3 py-1.5 rounded-lg transition ${settings.theme === 'dark' ? 'bg-white dark:bg-slate-900 text-blue-400 shadow-sm' : 'text-slate-500'}" data-theme="dark">
                🌙 Dark
              </button>
            </div>
          </div>

          <!-- Share App Quick Link -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 block">Share SSJU Connect</span>
              <span class="text-xs text-slate-400">Invite classmates or share campus notes link</span>
            </div>
            <button onclick="window.openShareModal()" class="text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 dark:text-blue-400 rounded-xl transition">
              Open Share Dialog 📲
            </button>
          </div>

          <!-- Reset data -->
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-sm font-semibold text-rose-600 block">Reset Demo Data</span>
              <span class="text-xs text-slate-400">Restore factory sample posts, questions and papers</span>
            </div>
            <button id="btnResetData" class="text-xs font-bold px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 rounded-xl transition">
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Settings events
  const profileForm = document.getElementById('profileSettingsForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sId = document.getElementById('settingStream').value;
      const streamObj = streams.find(s => s.id === sId);

      updateUser({
        name: document.getElementById('settingName').value.trim(),
        username: document.getElementById('settingUsername').value.trim(),
        email: document.getElementById('settingEmail').value.trim(),
        rollNo: document.getElementById('settingRollNo').value.trim(),
        stream: sId,
        streamName: streamObj ? streamObj.name : 'Computer Science',
        semester: parseInt(document.getElementById('settingSemester').value, 10),
        bio: document.getElementById('settingBio').value.trim()
      });

      showToast('Profile updated successfully!', 'success');
      updateHeaderUserBadge();
    });
  }

  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const th = e.currentTarget.getAttribute('data-theme');
      updateSettings({ theme: th });
      applyTheme();
      renderSettingsView();
      showToast(`Switched to ${th} mode`, 'info');
    });
  });

  document.getElementById('btnResetData')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data to default demo posts and papers?')) {
      resetAllData();
      showToast('Data reset to default successfully', 'info');
      navigateTo('home');
    }
  });
}

// ==========================================
// VIEW: UNIVERSAL SEARCH RESULTS
// ==========================================
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
    p.streamName.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  );

  const matchedStreams = allStreams.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.code.toLowerCase().includes(q)
  );

  container.innerHTML = `
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🔍</span> Search Results for "${state.searchQuery}"
        </h1>
        <button onclick="window.navigateTo('home')" class="text-xs font-semibold text-blue-600 hover:underline">
          Back to Feed
        </button>
      </div>
      <p class="text-xs text-slate-500 mt-1">Found ${matchedPosts.length} posts, ${matchedPapers.length} question papers, and ${matchedStreams.length} departments.</p>
    </div>

    <!-- Matched Streams -->
    ${matchedStreams.length > 0 ? `
      <div class="mb-6">
        <h2 class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Matching Streams</h2>
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

    <!-- Matched Question Papers -->
    ${matchedPapers.length > 0 ? `
      <div class="mb-6">
        <h2 class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Matching Question Papers (${matchedPapers.length})</h2>
        <div class="space-y-3">
          ${matchedPapers.map(renderSinglePaperCard).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Matched Posts -->
    <div>
      <h2 class="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Matching Posts & Questions (${matchedPosts.length})</h2>
      <div class="space-y-4">
        ${matchedPosts.length > 0 ? matchedPosts.map(renderSinglePostCard).join('') : renderEmptyState("No matching posts found", "Try another search term or ask a new question!")}
      </div>
    </div>
  `;

  attachHomeFeedEvents();
  attachPaperActionEvents();
}

// ==========================================
// RIGHT SIDEBAR WIDGETS
// ==========================================
function renderRightSidebarWidgets() {
  const container = document.getElementById('rightSidebarArea');
  if (!container) return;

  const streams = getStreams();
  const papers = getPapers();

  container.innerHTML = `
    <!-- Share App Promotion Widget -->
    <div class="bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-5 rounded-2xl shadow-sm mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl">📲</span>
        <h3 class="font-bold text-sm">Share SSJU Connect</h3>
      </div>
      <p class="text-xs text-blue-100 leading-relaxed mb-4">
        Connect your classmates, hostel friends, and study groups to the university knowledge hub!
      </p>
      <div class="flex items-center gap-2">
        <button onclick="window.openShareModal()" class="flex-grow text-xs font-bold bg-white text-blue-900 py-2 px-3 rounded-xl hover:bg-blue-50 transition shadow">
          Share App Now
        </button>
        <button onclick="window.copyAppUrlQuick()" class="text-xs font-bold bg-blue-600/70 hover:bg-blue-600 text-white p-2 rounded-xl transition" title="Copy Link">
          🔗
        </button>
      </div>
    </div>

    <!-- Question Paper Quick Vault -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <span>📄</span> PYQ Vault
        </h3>
        <button onclick="window.navigateTo('papers')" class="text-xs font-semibold text-blue-600 hover:underline">
          View All (${papers.length})
        </button>
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

    <!-- Trending Campus Discussions -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm">
      <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <span>🔥</span> Trending in SSJU
      </h3>
      <div class="space-y-3">
        <div onclick="window.filterByTag('EndTermExams')" class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 font-medium">Academics &bull; Trending</span>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">#EndTermExams2026</h4>
          <span class="text-[11px] text-slate-500">1.2k students discussing</span>
        </div>
        <div onclick="window.filterByTag('Placements')" class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 font-medium">Career &bull; Trending</span>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">#CampusPlacementDrive</h4>
          <span class="text-[11px] text-slate-500">850 posts</span>
        </div>
        <div onclick="window.filterByTag('Spandan2026')" class="cursor-pointer group">
          <span class="text-[10px] text-slate-400 font-medium">Campus Fest &bull; Trending</span>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition">#SpandanFestAuditions</h4>
          <span class="text-[11px] text-slate-500">620 posts</span>
        </div>
      </div>
    </div>

    <!-- Quick Helplines & University Links -->
    <div class="p-3 text-xs text-slate-400 space-y-1">
      <div class="flex items-center gap-2 flex-wrap text-[11px]">
        <a href="#" class="hover:underline">About SSJU</a> &bull;
        <a href="#" class="hover:underline">Academic Calendar</a> &bull;
        <a href="#" class="hover:underline">Central Library</a> &bull;
        <a href="#" class="hover:underline">Anti-Ragging Cell</a>
      </div>
      <p class="text-[10px] text-slate-400 pt-2">&copy; 2026 SSJU Connect &bull; Almora Campus</p>
    </div>
  `;
}

window.openPaperPreviewModalFromWidget = (paperId) => {
  const papers = getPapers();
  const paper = papers.find(p => p.id === paperId);
  if (paper) openPaperPreviewModal(paper);
};

window.copyAppUrlQuick = async () => {
  const success = await copyToClipboard(window.location.href.split('#')[0]);
  if (success) showToast('SSJU Connect app link copied to clipboard!', 'share');
};

// ==========================================
// MODALS CONTROLLERS
// ==========================================

// Create Post / Ask Question Modal
export function openCreatePostModal(presetMode = 'post') {
  const modal = document.getElementById('createPostModal');
  const streams = getStreams();
  const user = getUser();

  if (!modal) return;

  const streamSelect = document.getElementById('postStreamSelect');
  if (streamSelect) {
    streamSelect.innerHTML = `
      <option value="">General (All Streams)</option>
      ${streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
    `;
  }

  // Clear previous values
  document.getElementById('postTitleInput').value = '';
  document.getElementById('postContentInput').value = '';
  document.getElementById('postTagsInput').value = '';
  document.getElementById('postImageInput').value = '';
  state.tempPostImage = null;

  const previewBox = document.getElementById('postImagePreviewArea');
  if (previewBox) previewBox.classList.add('hidden');

  if (presetMode === 'question') {
    document.getElementById('postCategorySelect').value = 'Doubt / Question';
  }

  modal.classList.remove('hidden');
}

export function closeCreatePostModal() {
  const modal = document.getElementById('createPostModal');
  if (modal) modal.classList.add('hidden');
}

// Upload Question Paper Modal
export function openUploadPaperModal() {
  const modal = document.getElementById('uploadPaperModal');
  const streams = getStreams();
  const user = getUser();

  if (!modal) return;

  const streamSelect = document.getElementById('paperModalStreamSelect');
  if (streamSelect) {
    streamSelect.innerHTML = streams.map(s => `<option value="${s.id}" ${user.stream === s.id ? 'selected' : ''}>${s.name}</option>`).join('');
  }

  // Clear previous inputs
  document.getElementById('paperSubjectCodeInput').value = '';
  document.getElementById('paperTitleInput').value = '';
  document.getElementById('paperDescriptionInput').value = '';
  document.getElementById('paperFileInput').value = '';
  document.getElementById('paperFileNameDisplay').textContent = 'No file selected (Optional: standard SSJU layout will be synthesized if omitted)';
  state.tempPaperFile = null;

  modal.classList.remove('hidden');
}

export function closeUploadPaperModal() {
  const modal = document.getElementById('uploadPaperModal');
  if (modal) modal.classList.add('hidden');
}

// Share Modal Controller
export function openShareModal(customData = null) {
  const modal = document.getElementById('shareAppModal');
  if (!modal) return;

  const url = (customData && customData.url) || window.location.href.split('#')[0];
  const title = (customData && customData.title) || 'SSJU Connect - Campus Social & PYQ Vault';
  const text = (customData && customData.text) || 'Join SSJU Connect to discuss campus topics, ask questions, and download Question Papers!';

  // Generate QR Code SVG
  const qrContainer = document.getElementById('shareQrCodeContainer');
  if (qrContainer) {
    qrContainer.innerHTML = generateQrCodeSvg(url, 180);
  }

  // Set URL input
  const urlInput = document.getElementById('shareUrlInput');
  if (urlInput) urlInput.value = url;

  // Build social URLs
  const socialLinks = getSocialShareLinks(text, url);
  document.getElementById('shareWhatsappBtn').href = socialLinks.whatsapp;
  document.getElementById('shareTelegramBtn').href = socialLinks.telegram;
  document.getElementById('shareTwitterBtn').href = socialLinks.twitter;
  document.getElementById('shareLinkedinBtn').href = socialLinks.linkedin;

  // Setup Web Share Button
  const nativeBtn = document.getElementById('shareNativeBtn');
  if (nativeBtn) {
    if (navigator.share) {
      nativeBtn.classList.remove('hidden');
      nativeBtn.onclick = () => shareAppOrContent({ title, text, url });
    } else {
      nativeBtn.classList.add('hidden');
    }
  }

  modal.classList.remove('hidden');
}

export function closeShareModal() {
  const modal = document.getElementById('shareAppModal');
  if (modal) modal.classList.add('hidden');
}

// Helper: Empty state builder
function renderEmptyState(title, subtitle) {
  return `
    <div class="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="w-16 h-16 mx-auto mb-3 text-slate-300 dark:text-slate-600">
        <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
      </div>
      <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">${title}</h3>
      <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">${subtitle}</p>
    </div>
  `;
}

// Helper: Time ago formatter
function formatTimeAgo(isoString) {
  if (!isoString) return 'recently';
  const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ==========================================
// INITIALIZE EVENT LISTENERS & SHORTCUTS
// ==========================================
function initEventListeners() {
  // Navigation clicks (Desktop and Mobile)
  document.querySelectorAll('[data-nav-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-nav-target');
      state.selectedStreamId = null; // reset specific stream filter unless explicitly clicked
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

  // Top Nav Search Input
  const mainSearchInput = document.getElementById('globalSearchInput');
  if (mainSearchInput) {
    mainSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        navigateTo('search', { searchQuery: e.target.value.trim() });
      }
    });
  }

  // Corner Profile Dropdown Toggle
  const userMenuBtn = document.getElementById('headerUserMenuBtn');
  const userMenuDropdown = document.getElementById('headerUserDropdown');
  if (userMenuBtn && userMenuDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      userMenuDropdown.classList.add('hidden');
    });
  }

  // Corner Dropdown Items
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

  // Top Navbar Action Buttons
  document.getElementById('btnNavCreatePost')?.addEventListener('click', () => openCreatePostModal());
  document.getElementById('btnNavShareApp')?.addEventListener('click', () => openShareModal());

  // Post Modal Form Handling
  const postImageInput = document.getElementById('postImageInput');
  if (postImageInput) {
    postImageInput.addEventListener('change', async (e) => {
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
  }

  document.getElementById('btnRemovePostImage')?.addEventListener('click', () => {
    state.tempPostImage = null;
    document.getElementById('postImageInput').value = '';
    document.getElementById('postImagePreviewArea').classList.add('hidden');
  });

  const postForm = document.getElementById('createPostForm');
  if (postForm) {
    postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitleInput').value.trim();
      const content = document.getElementById('postContentInput').value.trim();
      const category = document.getElementById('postCategorySelect').value;
      const streamId = document.getElementById('postStreamSelect').value || null;
      const tagsRaw = document.getElementById('postTagsInput').value;

      if (!title) {
        showToast('Please enter a question or title', 'error');
        return;
      }

      const tags = tagsRaw
        .split(',')
        .map(t => t.trim().replace(/^#/, ''))
        .filter(Boolean);

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
      showToast('Your post has been published to SSJU Connect!', 'success');
      navigateTo('home');
    });
  }

  // Paper Upload Form Handling
  const paperFileInput = document.getElementById('paperFileInput');
  if (paperFileInput) {
    paperFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        document.getElementById('paperFileNameDisplay').textContent = `Selected: ${file.name} (${sizeMb} MB)`;
        const dataUrl = await readFileAsDataURL(file);
        state.tempPaperFile = {
          dataUrl,
          name: file.name,
          size: `${sizeMb} MB`
        };
      }
    });
  }

  const paperUploadForm = document.getElementById('uploadPaperForm');
  if (paperUploadForm) {
    paperUploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjectCode = document.getElementById('paperSubjectCodeInput').value.trim().toUpperCase();
      const title = document.getElementById('paperTitleInput').value.trim();
      const streamId = document.getElementById('paperModalStreamSelect').value;
      const semester = parseInt(document.getElementById('paperModalSemesterSelect').value, 10);
      const examYear = parseInt(document.getElementById('paperModalYearSelect').value, 10);
      const examType = document.getElementById('paperModalTypeSelect').value;
      const description = document.getElementById('paperDescriptionInput').value.trim();

      if (!subjectCode || !title) {
        showToast('Please enter subject code and title', 'error');
        return;
      }

      const streams = getStreams();
      const streamObj = streams.find(s => s.id === streamId);
      const user = getUser();

      savePaper({
        title,
        subjectCode,
        streamId,
        streamName: streamObj ? streamObj.name : 'University Department',
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
      showToast('Question Paper uploaded to SSJU Vault! (+25 Karma)', 'success');
      navigateTo('papers');
    });
  }

  // Share Dialog Actions
  document.getElementById('btnCopyShareUrl')?.addEventListener('click', async () => {
    const input = document.getElementById('shareUrlInput');
    const success = await copyToClipboard(input.value);
    if (success) {
      showToast('Link copied to clipboard!', 'share');
    }
  });

  // Modal Closers
  document.getElementById('closeCreatePostModalBtn')?.addEventListener('click', closeCreatePostModal);
  document.getElementById('closeUploadPaperModalBtn')?.addEventListener('click', closeUploadPaperModal);
  document.getElementById('closeShareModalBtn')?.addEventListener('click', closeShareModal);
  document.getElementById('closePreviewPaperModalBtn')?.addEventListener('click', () => {
    document.getElementById('paperPreviewModal').classList.add('hidden');
  });
  document.getElementById('closeImageLightboxBtn')?.addEventListener('click', () => {
    document.getElementById('imageLightboxModal').classList.add('hidden');
  });

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target.id === 'createPostModal') closeCreatePostModal();
    if (e.target.id === 'uploadPaperModal') closeUploadPaperModal();
    if (e.target.id === 'shareAppModal') closeShareModal();
    if (e.target.id === 'paperPreviewModal') document.getElementById('paperPreviewModal').classList.add('hidden');
    if (e.target.id === 'imageLightboxModal') document.getElementById('imageLightboxModal').classList.add('hidden');
  });
}

// Global Keyboard Shortcuts
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Focus search on '/'
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      document.getElementById('globalSearchInput')?.focus();
    }
    // ESC closes open modals
    if (e.key === 'Escape') {
      closeCreatePostModal();
      closeUploadPaperModal();
      closeShareModal();
      document.getElementById('paperPreviewModal')?.classList.add('hidden');
      document.getElementById('imageLightboxModal')?.classList.add('hidden');
    }
  });
}

// Expose routing globally to HTML elements
window.navigateTo = navigateTo;
window.openCreatePostModal = openCreatePostModal;
window.closeCreatePostModal = closeCreatePostModal;
window.openUploadPaperModal = openUploadPaperModal;
window.closeUploadPaperModal = closeUploadPaperModal;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;

