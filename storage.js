/**
 * SSJU Connect - Storage Controller
 * LocalStorage & IndexedDB abstraction for persisting posts, papers, user profiles, and settings.
 */

import { INITIAL_POSTS, INITIAL_PAPERS, INITIAL_USER, INITIAL_STREAMS } from './data.js';

const STORAGE_KEYS = {
  POSTS: 'ssju_connect_posts_v1',
  PAPERS: 'ssju_connect_papers_v2',
  USER: 'ssju_connect_user_v2',
  SETTINGS: 'ssju_connect_settings_v1',
  STREAMS: 'ssju_connect_streams_v2'
};

// Safe JSON Parse
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Safe JSON Set
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Initializing Storage with seed data if not present
export function initStorage() {
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
      theme: 'system', // 'light' | 'dark' | 'system'
      filterStreamByDefault: false,
      enableNotifications: true,
      compactView: false
    });
  }
}

// Posts API
export function getPosts() {
  return safeGet(STORAGE_KEYS.POSTS, INITIAL_POSTS);
}

export function savePost(newPost) {
  const posts = getPosts();
  const created = {
    id: 'post_' + Date.now(),
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    comments: [],
    ...newPost
  };
  posts.unshift(created);
  safeSet(STORAGE_KEYS.POSTS, posts);
  return created;
}

export function deletePost(postId) {
  const posts = getPosts().filter(p => p.id !== postId);
  safeSet(STORAGE_KEYS.POSTS, posts);
  return posts;
}

export function togglePostVote(postId, voteType) { // 'up' or 'down'
  const posts = getPosts();
  const user = getUser();
  const post = posts.find(p => p.id === postId);

  if (!post) return { posts, user };

  const upIndex = user.upvotedPosts.indexOf(postId);
  const downIndex = user.downvotedPosts.indexOf(postId);

  if (voteType === 'up') {
    if (upIndex > -1) {
      // Remove upvote
      user.upvotedPosts.splice(upIndex, 1);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      // Add upvote
      user.upvotedPosts.push(postId);
      post.upvotes += 1;
      // Remove downvote if previously downvoted
      if (downIndex > -1) {
        user.downvotedPosts.splice(downIndex, 1);
        post.downvotes = Math.max(0, post.downvotes - 1);
      }
    }
  } else if (voteType === 'down') {
    if (downIndex > -1) {
      // Remove downvote
      user.downvotedPosts.splice(downIndex, 1);
      post.downvotes = Math.max(0, post.downvotes - 1);
    } else {
      // Add downvote
      user.downvotedPosts.push(postId);
      post.downvotes += 1;
      // Remove upvote if previously upvoted
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

export function addCommentToPost(postId, commentData) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);

  if (!post) return null;

  const newComment = {
    id: 'c_' + Date.now(),
    createdAt: new Date().toISOString(),
    upvotes: 0,
    ...commentData
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);

  safeSet(STORAGE_KEYS.POSTS, posts);
  return newComment;
}

// Question Papers (PYQ) API
export function getPapers() {
  return safeGet(STORAGE_KEYS.PAPERS, INITIAL_PAPERS);
}

export function savePaper(newPaper) {
  const papers = getPapers();
  const created = {
    id: 'paper_' + Date.now(),
    uploadedAt: new Date().toISOString().split('T')[0],
    downloadsCount: 0,
    rating: 5.0,
    pages: 3,
    fileSize: '1.2 MB',
    ...newPaper
  };
  papers.unshift(created);
  safeSet(STORAGE_KEYS.PAPERS, papers);

  // Award Karma points to user for contributing
  const user = getUser();
  user.reputation = (user.reputation || 0) + 25;
  if (!user.badges.includes("PYQ Donor")) {
    user.badges.push("PYQ Donor");
  }
  safeSet(STORAGE_KEYS.USER, user);

  return created;
}

export function deletePaper(paperId) {
  const papers = getPapers().filter(p => p.id !== paperId);
  safeSet(STORAGE_KEYS.PAPERS, papers);
  return papers;
}

export function incrementPaperDownload(paperId) {
  const papers = getPapers();
  const paper = papers.find(p => p.id === paperId);
  if (paper) {
    paper.downloadsCount = (paper.downloadsCount || 0) + 1;
    safeSet(STORAGE_KEYS.PAPERS, papers);
  }
  return paper;
}

// User Profile API
export function getUser() {
  return safeGet(STORAGE_KEYS.USER, INITIAL_USER);
}

export function updateUser(updatedFields) {
  const current = getUser();
  const merged = { ...current, ...updatedFields };
  safeSet(STORAGE_KEYS.USER, merged);
  return merged;
}

export function toggleBookmark(itemType, itemId) {
  const user = getUser();
  if (!user.bookmarks) user.bookmarks = [];

  const key = `${itemType}_${itemId}`;
  const idx = user.bookmarks.indexOf(key);

  if (idx > -1) {
    user.bookmarks.splice(idx, 1);
  } else {
    user.bookmarks.push(key);
  }

  safeSet(STORAGE_KEYS.USER, user);
  return { bookmarks: user.bookmarks, isBookmarked: idx === -1 };
}

// Streams API
export function getStreams() {
  return safeGet(STORAGE_KEYS.STREAMS, INITIAL_STREAMS);
}

export function saveStream(newStream) {
  const streams = getStreams();
  const created = {
    id: 'stream_' + Date.now(),
    studentCount: 0,
    papersCount: 0,
    semesters: [1, 2, 3, 4, 5, 6],
    color: 'from-blue-600 to-indigo-700',
    icon: '📘',
    ...newStream
  };
  streams.push(created);
  safeSet(STORAGE_KEYS.STREAMS, streams);
  return created;
}

export function deleteStream(streamId) {
  const streams = getStreams().filter(s => s.id !== streamId);
  safeSet(STORAGE_KEYS.STREAMS, streams);
  return streams;
}


// Settings API
export function getSettings() {
  return safeGet(STORAGE_KEYS.SETTINGS, {
    theme: 'light',
    filterStreamByDefault: false,
    enableNotifications: true,
    compactView: false
  });
}

export function updateSettings(newSettings) {
  const current = getSettings();
  const merged = { ...current, ...newSettings };
  safeSet(STORAGE_KEYS.SETTINGS, merged);
  return merged;
}

// Reset data to defaults
export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.POSTS);
  localStorage.removeItem(STORAGE_KEYS.PAPERS);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.STREAMS);
  initStorage();
}
