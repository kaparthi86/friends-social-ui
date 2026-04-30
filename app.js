const stories = ["Maya", "Jordan", "Chris", "Nia", "Leo", "Anya"];
const storyLines = [
  "Sunset run with my day-one crew.",
  "Cafe stop and random life updates.",
  "New playlist just dropped for close friends.",
  "Late-night drive and city lights.",
  "Weekend fit check and vibe check.",
  "Invite-only hangout tonight.",
];
const suggested = ["Sam", "Priya", "Daniel", "Sofia"];
const posts = [
  { id: 1, user: "Maya", time: "2h ago", text: "Coffee meetup this weekend?", likes: 7, comments: 2, shares: 1, mood: "Social", visibility: "public" },
  { id: 2, user: "Jordan", time: "5h ago", text: "Just finished a 5k run with friends!", likes: 12, comments: 4, shares: 2, mood: "Fitness", visibility: "close_friends" },
  { id: 3, user: "Chris", time: "1d ago", text: "Movie night suggestions?", likes: 5, comments: 8, shares: 1, mood: "Weekend", visibility: "public" },
];
const themes = ["default", "sunset", "mint"];
const heroMessages = [
  "12 fresh updates and 4 DMs waiting.",
  "Your close friends dropped 9 stories in the last hour.",
  "3 hangouts are trending in your circle.",
];
const trends = ["#NightRun", "#StudyCrew", "#PhotoDump", "#FitCheck", "#WeekendLinkup"];
const reels = [
  { user: "Maya", views: "12.4k", tone: "Sunset" },
  { user: "Jordan", views: "9.8k", tone: "Neon" },
  { user: "Nia", views: "7.1k", tone: "Urban" },
];
const lenses = ["Cinematic", "VHS", "Glow", "B&W", "Dream"];
const streaks = [
  { name: "Sam", days: 24 },
  { name: "Priya", days: 12 },
  { name: "Chris", days: 31 },
];
const notes = [
  "Maya: Post your fit check tonight. (expires in 2h)",
  "Jordan: Gym reel drops in 20 min. (expires in 1h)",
  "Nia: Brunch story for close friends only. (expires in 3h)",
];
const dms = [
  { id: 1, name: "Maya", preview: "Can you check my new reel?", time: "2m", unread: true },
  { id: 2, name: "Sam", preview: "Sending snap from gym now", time: "10m", unread: true },
  { id: 3, name: "Priya", preview: "Dinner plan confirmed", time: "1h", unread: false },
];
const dmThreads = {
  1: [
    { from: "them", text: "Can you check my new reel?" },
    { from: "me", text: "Yes, sending feedback now." },
  ],
  2: [
    { from: "them", text: "Sending snap from gym now" },
    { from: "me", text: "Let's keep the streak alive." },
  ],
  3: [
    { from: "them", text: "Dinner plan confirmed" },
    { from: "me", text: "Perfect, see you at 8." },
  ],
};

const AUTH_USERS_KEY = "connectspace_users";
const AUTH_SESSION_KEY = "connectspace_session_user";
const SUPABASE_URL = window.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";
const THEME_KEY = "connectspace_theme";
const NEON_MODE_KEY = "connectspace_neon_mode";
const BIO_KEY = "connectspace_profile_bio";
const POSTS_KEY = "connectspace_posts";
const DMS_KEY = "connectspace_dms";
const DM_THREADS_KEY = "connectspace_dm_threads";
const PROFILE_PHOTO_KEY = "connectspace_profile_photo";
const FRIEND_GRAPH_KEY = "connectspace_friend_graph";
const BLOCKED_USERS_KEY = "connectspace_blocked_users";
const REPORTS_KEY = "connectspace_reports";
const NOTIFICATIONS_KEY = "connectspace_notifications";
const NOTIFICATION_PREFS_KEY = "connectspace_notification_prefs";
const LAYOUT_KEY = "connectspace_layout_order";
const RIGHT_LAYOUT_KEY = "connectspace_right_layout_order";
const APP_SCHEMA_KEY = "connectspace_schema_version";
const CURRENT_SCHEMA_VERSION = 2;

const LIMITS = {
  post: 280,
  message: 240,
  bio: 180,
  profileField: 80,
};

const RATE_LIMIT_MS = {
  post: 3000,
  snap: 3000,
  dm: 1200,
};
let isSignupMode = false;
let themeIndex = 0;
let heroIndex = 0;
let activeLens = lenses[0];
let ghostMode = false;
let currentStoryIndex = 0;
let storyTimer = null;
let activeDmId = null;
let selectedPostMedia = null;
const lastActionAt = { post: 0, snap: 0, dm: 0 };
let reportCounter = 1;

const authView = document.getElementById("authView");
const appShell = document.getElementById("appShell");
const googleAuthBtn = document.getElementById("googleAuthBtn");
const authMessage = document.getElementById("authMessage");

const storiesRow = document.getElementById("storiesRow");
const suggestedFriends = document.getElementById("suggestedFriends");
const inviteFriendsBtn = document.getElementById("inviteFriendsBtn");
const inviteHistoryList = document.getElementById("inviteHistoryList");
const feed = document.getElementById("feed");
const postText = document.getElementById("postText");
const postBtn = document.getElementById("postBtn");
const searchInput = document.getElementById("searchInput");
const visibilitySelect = document.getElementById("visibilitySelect");
const feedVisibilityFilter = document.getElementById("feedVisibilityFilter");
const userChip = document.getElementById("userChip");
const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");
const neonModeBtn = document.getElementById("neonModeBtn");
const customizeLayoutBtn = document.getElementById("customizeLayoutBtn");
const heroText = document.getElementById("heroText");
const onlineCount = document.getElementById("onlineCount");
const postCount = document.getElementById("postCount");
const liveStatusTitle = document.getElementById("liveStatusTitle");
const liveStatusText = document.getElementById("liveStatusText");
const trendTags = document.getElementById("trendTags");
const mainNav = document.getElementById("mainNav");
const editBioBtn = document.getElementById("editBioBtn");
const cancelBioBtn = document.getElementById("cancelBioBtn");
const bioView = document.getElementById("bioView");
const bioForm = document.getElementById("bioForm");
const bioAboutInput = document.getElementById("bioAboutInput");
const bioWorkInput = document.getElementById("bioWorkInput");
const bioEducationInput = document.getElementById("bioEducationInput");
const bioCityInput = document.getElementById("bioCityInput");
const bioRelationshipInput = document.getElementById("bioRelationshipInput");
const profileImage = document.getElementById("profileImage");
const profileInitials = document.getElementById("profileInitials");
const profileUploadInput = document.getElementById("profileUploadInput");
const profileUploadBtn = document.getElementById("profileUploadBtn");
const removeProfilePhotoBtn = document.getElementById("removeProfilePhotoBtn");
const reelsRow = document.getElementById("reelsRow");
const refreshReelsBtn = document.getElementById("refreshReelsBtn");
const lensFilters = document.getElementById("lensFilters");
const snapNowBtn = document.getElementById("snapNowBtn");
const toggleGhostModeBtn = document.getElementById("toggleGhostModeBtn");
const streakList = document.getElementById("streakList");
const quickNotes = document.getElementById("quickNotes");
const dmList = document.getElementById("dmList");
const dmUnreadCount = document.getElementById("dmUnreadCount");
const notificationList = document.getElementById("notificationList");
const openReportsCount = document.getElementById("openReportsCount");
const reportsList = document.getElementById("reportsList");
const adminStats = document.getElementById("adminStats");
const topicDiscovery = document.getElementById("topicDiscovery");
const profilePage = document.getElementById("profilePage");
const notifCenterBtn = document.getElementById("notifCenterBtn");
const notifCenterBackdrop = document.getElementById("notifCenterBackdrop");
const notifCenterDrawer = document.getElementById("notifCenterDrawer");
const closeNotifCenterBtn = document.getElementById("closeNotifCenterBtn");
const clearNotificationsBtn = document.getElementById("clearNotificationsBtn");
const notifCenterList = document.getElementById("notifCenterList");
const globalSearchPanel = document.getElementById("globalSearchPanel");
const globalSearchResults = document.getElementById("globalSearchResults");
const searchMeta = document.getElementById("searchMeta");
const prefMessages = document.getElementById("prefMessages");
const prefFriends = document.getElementById("prefFriends");
const prefModeration = document.getElementById("prefModeration");
const prefSystem = document.getElementById("prefSystem");
const storyModal = document.getElementById("storyModal");
const storyProgress = document.getElementById("storyProgress");
const storyUserName = document.getElementById("storyUserName");
const storyBody = document.getElementById("storyBody");
const closeStoryBtn = document.getElementById("closeStoryBtn");
const prevStoryBtn = document.getElementById("prevStoryBtn");
const nextStoryBtn = document.getElementById("nextStoryBtn");
const dmBackdrop = document.getElementById("dmBackdrop");
const dmDrawer = document.getElementById("dmDrawer");
const dmDrawerTitle = document.getElementById("dmDrawerTitle");
const closeDmDrawerBtn = document.getElementById("closeDmDrawerBtn");
const dmThread = document.getElementById("dmThread");
const dmComposer = document.getElementById("dmComposer");
const dmInput = document.getElementById("dmInput");
const floatingCloseBtn = document.getElementById("floatingCloseBtn");
const toast = document.getElementById("toast");
const networkStatus = document.getElementById("networkStatus");
const postMediaInput = document.getElementById("postMediaInput");
const postMediaPreview = document.getElementById("postMediaPreview");
const profilePhotoModal = document.getElementById("profilePhotoModal");
const closeProfilePhotoBtn = document.getElementById("closeProfilePhotoBtn");
const profilePhotoViewerImage = document.getElementById("profilePhotoViewerImage");
const profilePhotoViewer = document.getElementById("profilePhotoViewer");
const profilePhotoHint = document.getElementById("profilePhotoHint");
const shareModal = document.getElementById("shareModal");
const closeShareModalBtn = document.getElementById("closeShareModalBtn");
const shareForm = document.getElementById("shareForm");
const shareCaptionInput = document.getElementById("shareCaptionInput");
const shareVisibilitySelect = document.getElementById("shareVisibilitySelect");
const mainContent = document.querySelector(".main-content");
const rightPanel = document.querySelector(".right-panel");
const profileAvatar = document.querySelector(".profile-avatar");

const defaultBio = {
  about: "Invite-only circle. Keeping moments private and meaningful.",
  work: "Works at Connectspace Studio",
  education: "Studied at City University",
  city: "Lives in Bengaluru",
  relationship: "Single",
};

const defaultFriendGraph = {
  Maya: "close_friend",
  Jordan: "friends",
  Chris: "friends",
  Nia: "friends",
  Leo: "none",
  Anya: "none",
  Sam: "request_received",
  Priya: "friends",
  Daniel: "none",
  Sofia: "none",
};

let friendGraph = { ...defaultFriendGraph };
let blockedUsers = [];
let reports = [];
let notifications = [];
let selectedTopic = "";
let notificationPrefs = { messages: true, friends: true, moderation: true, system: true };
let layoutEditMode = false;
let draggedWidgetId = null;
let activeSharePostId = null;
let supabaseClient = null;
let consumedInviteCode = "";

function hasSupabase() {
  return Boolean(supabaseClient);
}

function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
}

async function getSupabaseUser() {
  if (!hasSupabase()) return null;
  const { data } = await supabaseClient.auth.getUser();
  return data.user || null;
}

async function syncProfileFromSupabase() {
  const user = await getSupabaseUser();
  if (!user) return;
  const { data } = await supabaseClient
    .from("profiles")
    .select("bio")
    .eq("id", user.id)
    .single();
  if (!data?.bio) return;
  const nextBio = { ...getBio(), about: clampText(data.bio, LIMITS.bio) };
  saveBio(nextBio);
  renderBio();
}

async function syncBioToSupabase(bio) {
  const user = await getSupabaseUser();
  if (!user) return;
  await supabaseClient
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: getSessionUser() || "Friend",
        bio: bio.about,
      },
      { onConflict: "id" }
    );
}

async function syncNotificationsFromSupabase() {
  const user = await getSupabaseUser();
  if (!user) return;
  const { data } = await supabaseClient
    .from("notifications")
    .select("id,type,message,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);
  if (!Array.isArray(data)) return;
  notifications = data.map((item) => ({
    id: item.id,
    type: item.type || "system",
    message: clampText(item.message || "", 120),
    time: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));
  renderNotifications();
}

async function persistNotificationToSupabase(type, message) {
  const user = await getSupabaseUser();
  if (!user) return;
  await supabaseClient.from("notifications").insert({
    user_id: user.id,
    type,
    message: clampText(message, 120),
  });
}

async function persistPostToSupabase(post) {
  const user = await getSupabaseUser();
  if (!user) return;
  const payload = {
    user_id: user.id,
    text: post.text,
    media_url: post.mediaData || null,
    media_type: post.mediaType || null,
    visibility: post.visibility || "public",
  };
  if (post.sharedFromPostId && isUuidLike(post.sharedFromPostId)) {
    payload.shared_from_post_id = post.sharedFromPostId;
  }
  const { data, error } = await supabaseClient.from("posts").insert(payload).select().single();
  if (error) return null;
  return data;
}

async function loadFeedFromSupabase() {
  const user = await getSupabaseUser();
  if (!user) return;
  const { data: postRows, error: postError } = await supabaseClient
    .from("posts")
    .select("id,user_id,text,media_url,media_type,visibility,created_at,profiles(display_name,username)")
    .order("created_at", { ascending: false })
    .limit(120);
  if (postError || !Array.isArray(postRows)) return;

  const postIds = postRows.map((item) => item.id);
  if (postIds.length === 0) {
    posts.splice(0, posts.length);
    renderTopics();
    renderFeed(searchInput.value);
    return;
  }
  const { data: commentRows } = await supabaseClient
    .from("comments")
    .select("id,post_id,text,created_at,profiles(display_name,username)")
    .in("post_id", postIds);
  const commentsByPost = {};
  (commentRows || []).forEach((comment) => {
    const postId = String(comment.post_id);
    commentsByPost[postId] = commentsByPost[postId] || [];
    commentsByPost[postId].push({
      id: String(comment.id),
      user: clampText(comment.profiles?.display_name || comment.profiles?.username || "Friend", 40),
      text: clampText(comment.text || "", LIMITS.message),
      replies: [],
    });
  });

  const mapped = postRows.map((item) => {
    const commentsData = commentsByPost[String(item.id)] || [];
    return normalizePost({
      id: String(item.id),
      user: clampText(item.profiles?.display_name || item.profiles?.username || "Friend", 50),
      time: formatTimeAgo(item.created_at),
      text: item.text || "",
      likes: 0,
      comments: commentsData.length,
      shares: 0,
      mood: "Social",
      visibility: item.visibility || "public",
      mediaType: item.media_type || null,
      mediaData: item.media_url || null,
      commentsData,
    });
  });

  posts.splice(0, posts.length, ...mapped);
  renderTopics();
  renderFeed(searchInput.value);
}

function migrateStorageKey(oldKey, newKey) {
  const hasNew = localStorage.getItem(newKey) !== null;
  const oldValue = localStorage.getItem(oldKey);
  if (!hasNew && oldValue !== null) {
    localStorage.setItem(newKey, oldValue);
    localStorage.removeItem(oldKey);
  }
}

function migrateLegacyStorage() {
  migrateStorageKey("friendspace_users", AUTH_USERS_KEY);
  migrateStorageKey("friendspace_session_user", AUTH_SESSION_KEY);
  migrateStorageKey("friendspace_theme", THEME_KEY);
  migrateStorageKey("friendspace_profile_bio", BIO_KEY);
}

function migrateSchema() {
  const version = Number(localStorage.getItem(APP_SCHEMA_KEY) || "1");
  if (version < CURRENT_SCHEMA_VERSION) {
    localStorage.setItem(APP_SCHEMA_KEY, String(CURRENT_SCHEMA_VERSION));
  }
}

function safeParse(rawValue, fallback) {
  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("app-hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add("app-hidden");
  }, 2200);
}

function clampText(text, maxLength) {
  return String(text || "").trim().slice(0, maxLength);
}

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function formatTimeAgo(value) {
  if (!value) return "now";
  const diffMs = Date.now() - new Date(value).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function canPerform(action) {
  const now = Date.now();
  const last = lastActionAt[action] || 0;
  if (now - last < RATE_LIMIT_MS[action]) {
    return false;
  }
  lastActionAt[action] = now;
  return true;
}

function setNetworkStatus(isOnline) {
  networkStatus.textContent = isOnline ? "Online" : "Offline";
  networkStatus.classList.toggle("offline", !isOnline);
}

function normalizePost(post) {
  const commentsData = Array.isArray(post.commentsData)
    ? post.commentsData.map((comment) => ({
        id: String(comment.id || makeId()),
        user: clampText(comment.user || "User", 40),
        text: clampText(comment.text || "", LIMITS.message),
        replies: Array.isArray(comment.replies)
          ? comment.replies.map((reply) => ({
              user: clampText(reply.user || "User", 40),
              text: clampText(reply.text || "", LIMITS.message),
            }))
          : [],
      }))
    : [];

  return {
    id: String(post.id || makeId()),
    user: clampText(post.user || "User", 50),
    time: clampText(post.time || "now", 30),
    text: clampText(post.text || "", LIMITS.post),
    likes: Math.max(0, Number(post.likes) || 0),
    comments: Math.max(0, Number(post.comments) || 0),
    shares: Math.max(0, Number(post.shares) || 0),
    mood: clampText(post.mood || "Social", 20),
    visibility: post.visibility === "close_friends" ? "close_friends" : "public",
    mediaType: post.mediaType === "video" ? "video" : post.mediaType === "image" ? "image" : null,
    mediaData:
      typeof post.mediaData === "string" &&
      (post.mediaData.startsWith("data:") || post.mediaData.startsWith("http"))
        ? post.mediaData
        : null,
    commentsData,
  };
}

function normalizeDm(dm) {
  return {
    id: Number(dm.id) || Date.now(),
    name: clampText(dm.name || "Friend", 30),
    preview: clampText(dm.preview || "", LIMITS.message),
    time: clampText(dm.time || "now", 20),
    unread: Boolean(dm.unread),
  };
}

function normalizeThreadMessages(thread) {
  if (!Array.isArray(thread)) return [];
  return thread
    .map((msg) => ({
      from: msg.from === "me" ? "me" : "them",
      text: clampText(msg.text || "", LIMITS.message),
    }))
    .filter((msg) => msg.text.length > 0);
}

function saveSocialData() {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  localStorage.setItem(DMS_KEY, JSON.stringify(dms));
  localStorage.setItem(DM_THREADS_KEY, JSON.stringify(dmThreads));
  localStorage.setItem(FRIEND_GRAPH_KEY, JSON.stringify(friendGraph));
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blockedUsers));
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(notificationPrefs));
}

function loadSocialData() {
  const savedPosts = safeParse(localStorage.getItem(POSTS_KEY), null);
  if (Array.isArray(savedPosts) && savedPosts.length > 0) {
    posts.splice(0, posts.length, ...savedPosts.map(normalizePost));
  }

  const savedDms = safeParse(localStorage.getItem(DMS_KEY), null);
  if (Array.isArray(savedDms) && savedDms.length > 0) {
    dms.splice(0, dms.length, ...savedDms.map(normalizeDm));
  }

  const savedThreads = safeParse(localStorage.getItem(DM_THREADS_KEY), null);
  if (savedThreads && typeof savedThreads === "object") {
    Object.keys(dmThreads).forEach((key) => delete dmThreads[key]);
    Object.entries(savedThreads).forEach(([key, value]) => {
      dmThreads[key] = normalizeThreadMessages(value);
    });
  }

  const savedFriendGraph = safeParse(localStorage.getItem(FRIEND_GRAPH_KEY), null);
  if (savedFriendGraph && typeof savedFriendGraph === "object") {
    friendGraph = { ...defaultFriendGraph, ...savedFriendGraph };
  }

  const savedBlockedUsers = safeParse(localStorage.getItem(BLOCKED_USERS_KEY), null);
  if (Array.isArray(savedBlockedUsers)) {
    blockedUsers = savedBlockedUsers.map((name) => clampText(name, 40));
  }

  const savedReports = safeParse(localStorage.getItem(REPORTS_KEY), null);
  if (Array.isArray(savedReports)) {
    reports = savedReports;
    const maxId = reports.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    reportCounter = maxId + 1;
  }

  const savedNotifications = safeParse(localStorage.getItem(NOTIFICATIONS_KEY), null);
  if (Array.isArray(savedNotifications)) {
    notifications = savedNotifications.slice(0, 20);
  }

  const savedPrefs = safeParse(localStorage.getItem(NOTIFICATION_PREFS_KEY), null);
  if (savedPrefs && typeof savedPrefs === "object") {
    notificationPrefs = {
      messages: savedPrefs.messages !== false,
      friends: savedPrefs.friends !== false,
      moderation: savedPrefs.moderation !== false,
      system: savedPrefs.system !== false,
    };
  }
}

function addNotification(typeOrMessage, maybeMessage) {
  const type = maybeMessage ? typeOrMessage : "system";
  const message = maybeMessage || typeOrMessage;
  const typeAllowed =
    (type === "messages" && notificationPrefs.messages) ||
    (type === "friends" && notificationPrefs.friends) ||
    (type === "moderation" && notificationPrefs.moderation) ||
    (type === "system" && notificationPrefs.system);
  if (!typeAllowed) return;

  notifications.unshift({
    id: Date.now(),
    type,
    message: clampText(message, 120),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  notifications = notifications.slice(0, 20);
  if (hasSupabase()) {
    persistNotificationToSupabase(type, message);
  }
}

function buildInviteLink() {
  const base = window.location.origin || window.location.href.split("?")[0];
  const code = makeInviteCode();
  return `${base}?invite=${encodeURIComponent(code)}`;
}

function makeInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let output = "";
  for (let i = 0; i < 10; i += 1) {
    output += chars[Math.floor(Math.random() * chars.length)];
  }
  return output;
}

function getInviteCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return clampText(params.get("invite") || "", 32).toUpperCase();
}

function clearInviteCodeFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("invite");
  window.history.replaceState({}, "", url.toString());
}

async function consumeInviteIfPresent() {
  if (!hasSupabase()) return;
  const inviteCode = getInviteCodeFromUrl();
  if (!inviteCode || inviteCode === consumedInviteCode) return;
  consumedInviteCode = inviteCode;

  const user = await getSupabaseUser();
  if (!user) return;
  const { data: invite, error: lookupError } = await supabaseClient
    .from("invites")
    .select("code,created_by,used_by")
    .eq("code", inviteCode)
    .single();

  if (lookupError || !invite) {
    showToast("Invite is invalid");
    clearInviteCodeFromUrl();
    return;
  }

  if (invite.created_by === user.id) {
    showToast("This invite belongs to you");
    clearInviteCodeFromUrl();
    return;
  }

  if (invite.used_by) {
    showToast("Invite already used");
    clearInviteCodeFromUrl();
    return;
  }

  const { error: consumeError } = await supabaseClient
    .from("invites")
    .update({ used_by: user.id, used_at: new Date().toISOString() })
    .eq("code", inviteCode)
    .is("used_by", null);

  if (consumeError) {
    showToast("Could not redeem invite");
    clearInviteCodeFromUrl();
    return;
  }

  addNotification("friends", "Invite redeemed successfully");
  showToast("Invite redeemed");
  clearInviteCodeFromUrl();
  loadInviteHistory();
}

async function loadInviteHistory() {
  if (!inviteHistoryList) return;
  if (!hasSupabase()) {
    inviteHistoryList.innerHTML = "";
    return;
  }
  const user = await getSupabaseUser();
  if (!user) return;

  const { data, error } = await supabaseClient
    .from("invites")
    .select("code,created_at,used_at,used_by")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !Array.isArray(data)) {
    inviteHistoryList.innerHTML = "";
    return;
  }

  if (data.length === 0) {
    inviteHistoryList.innerHTML = `<li>No invites sent yet.</li>`;
    return;
  }

  inviteHistoryList.innerHTML = data
    .map((item) => {
      const status = item.used_by ? "Used" : "Open";
      const when = item.used_at
        ? `used ${formatTimeAgo(item.used_at)}`
        : `created ${formatTimeAgo(item.created_at)}`;
      return `<li><strong>${escapeHtml(item.code)}</strong> - ${status} <span>${escapeHtml(when)}</span></li>`;
    })
    .join("");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function renderPostMediaPreview() {
  if (!selectedPostMedia) {
    postMediaPreview.innerHTML = "";
    postMediaPreview.classList.add("app-hidden");
    return;
  }

  if (selectedPostMedia.type === "image") {
    postMediaPreview.innerHTML = `<img src="${selectedPostMedia.data}" alt="Post preview" />`;
  } else {
    postMediaPreview.innerHTML = `<video src="${selectedPostMedia.data}" controls></video>`;
  }
  postMediaPreview.classList.remove("app-hidden");
}

function enhanceFeedVideos() {
  const videos = feed.querySelectorAll(".feed-video");
  videos.forEach((video) => {
    if (video.dataset.enhanced === "true") return;
    video.dataset.enhanced = "true";
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("playsinline", "");

    const setPosterFromFrame = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
        video.poster = canvas.toDataURL("image/jpeg", 0.75);
      } catch {
        // Ignore poster generation failures and keep native frame preview.
      }
    };

    video.addEventListener("loadeddata", () => {
      try {
        video.currentTime = 0.1;
      } catch {
        setPosterFromFrame();
      }
    });

    video.addEventListener("seeked", () => {
      setPosterFromFrame();
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    video.play().catch(() => {});
  });
}

function renderProfilePhoto() {
  const saved = localStorage.getItem(PROFILE_PHOTO_KEY);
  if (saved) {
    profileImage.src = saved;
    profileImage.classList.remove("app-hidden");
    profileInitials.classList.add("app-hidden");
  } else {
    profileImage.classList.add("app-hidden");
    profileInitials.classList.remove("app-hidden");
  }
}

async function uploadProfilePhoto(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please upload an image for profile");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("Profile image must be under 5MB");
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    localStorage.setItem(PROFILE_PHOTO_KEY, dataUrl);
    renderProfilePhoto();
    showToast("Profile photo updated");
  } catch {
    showToast("Could not upload profile photo");
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSessionUser() {
  return localStorage.getItem(AUTH_SESSION_KEY);
}

function setSessionUser(name) {
  localStorage.setItem(AUTH_SESSION_KEY, name);
}

function clearSessionUser() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || "default";
}

function setTheme(theme) {
  if (theme === "default") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", theme);
  }
  localStorage.setItem(THEME_KEY, theme);
}

function getNeonMode() {
  return localStorage.getItem(NEON_MODE_KEY) !== "off";
}

function setNeonMode(enabled) {
  if (enabled) {
    document.body.removeAttribute("data-neon");
    localStorage.setItem(NEON_MODE_KEY, "on");
  } else {
    document.body.setAttribute("data-neon", "off");
    localStorage.setItem(NEON_MODE_KEY, "off");
  }
  if (neonModeBtn) {
    neonModeBtn.textContent = `Neon: ${enabled ? "On" : "Off"}`;
  }
}

function getBio() {
  return JSON.parse(localStorage.getItem(BIO_KEY) || JSON.stringify(defaultBio));
}

function saveBio(bio) {
  localStorage.setItem(BIO_KEY, JSON.stringify(bio));
}

function renderBio() {
  const bio = getBio();
  bioView.innerHTML = `
    <p><strong>Bio:</strong> ${escapeHtml(bio.about)}</p>
    <p><strong>Work:</strong> ${escapeHtml(bio.work)}</p>
    <p><strong>Education:</strong> ${escapeHtml(bio.education)}</p>
    <p><strong>Current City:</strong> ${escapeHtml(bio.city)}</p>
    <p><strong>Relationship:</strong> ${escapeHtml(bio.relationship)}</p>
  `;
}

function fillBioForm() {
  const bio = getBio();
  bioAboutInput.value = bio.about;
  bioWorkInput.value = bio.work;
  bioEducationInput.value = bio.education;
  bioCityInput.value = bio.city;
  bioRelationshipInput.value = bio.relationship;
}

function setBioEditMode(isEditing) {
  if (isEditing) {
    bioForm.classList.remove("app-hidden");
    bioView.classList.add("app-hidden");
    editBioBtn.textContent = "Editing";
    editBioBtn.disabled = true;
  } else {
    bioForm.classList.add("app-hidden");
    bioView.classList.remove("app-hidden");
    editBioBtn.textContent = "Edit Bio";
    editBioBtn.disabled = false;
  }
}

function nextTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
  const selected = themes[themeIndex];
  setTheme(selected);
}

function updateAuthModeUi() {
  authMessage.textContent = "";
  authMessage.classList.remove("success");
}

function showAppForUser(name) {
  userChip.textContent = `Hi, ${name}`;
  authView.classList.add("app-hidden");
  appShell.classList.remove("app-hidden");
}

function showAuth() {
  appShell.classList.add("app-hidden");
  authView.classList.remove("app-hidden");
}

function getAuthDisplayName(session) {
  const metadata = session?.user?.user_metadata || {};
  const email = session?.user?.email || "";
  return clampText(metadata.full_name || metadata.name || email.split("@")[0] || "Friend", 40);
}

function initSupabaseAuth() {
  if (!window.supabase || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    authMessage.textContent = "Set SUPABASE_URL and SUPABASE_ANON_KEY to enable Gmail login.";
    return false;
  }

  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    if (session) {
      const displayName = getAuthDisplayName(session);
      setSessionUser(displayName);
      showAppForUser(displayName);
      authMessage.textContent = "";
      syncProfileFromSupabase();
      syncNotificationsFromSupabase();
      loadFeedFromSupabase();
      consumeInviteIfPresent();
      loadInviteHistory();
    } else {
      clearSessionUser();
      showAuth();
    }
  });
  return true;
}

async function restoreAuthSession() {
  if (!supabaseClient) return false;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    authMessage.textContent = "Could not restore session. Try Gmail login again.";
    return false;
  }
  const session = data.session;
  if (!session) return false;
  const displayName = getAuthDisplayName(session);
  setSessionUser(displayName);
  showAppForUser(displayName);
  await syncProfileFromSupabase();
  await syncNotificationsFromSupabase();
  await loadFeedFromSupabase();
  await consumeInviteIfPresent();
  await loadInviteHistory();
  return true;
}

async function signInWithGoogle() {
  if (!supabaseClient) {
    authMessage.textContent = "Supabase is not configured yet.";
    return;
  }
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.href,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) {
    authMessage.textContent = "Gmail login failed. Please retry.";
  }
}

function renderStories() {
  storiesRow.innerHTML = "";
  stories.forEach((name, index) => {
    const div = document.createElement("div");
    div.className = "story";
    div.dataset.storyIndex = String(index);
    div.innerHTML = `<strong>${name.charAt(0)}</strong><span>${name}</span>`;
    storiesRow.appendChild(div);
  });
}

function isBlockedUser(name) {
  return blockedUsers.includes(name);
}

function isCloseFriend(name) {
  const status = friendGraph[name] || "none";
  return status === "close_friend" || status === "friends";
}

function getFriendActionLabel(name) {
  const status = friendGraph[name] || "none";
  const labelByStatus = {
    none: "Add",
    request_sent: "Requested",
    request_received: "Accept",
    friends: "Friends",
    close_friend: "Close",
    blocked: "Blocked",
  };
  return labelByStatus[status] || "Add";
}

function extractHashtags(text) {
  const matches = String(text).match(/#[a-zA-Z0-9_]+/g);
  return matches ? matches.map((tag) => tag.toLowerCase()) : [];
}

function postRankScore(post) {
  const relationBoost = isCloseFriend(post.user) ? 25 : 8;
  const engagementBoost = post.likes * 2 + post.comments * 3 + post.shares * 4;
  const freshnessBoost = post.time === "now" ? 30 : post.time.includes("h") ? 16 : 8;
  return relationBoost + engagementBoost + freshnessBoost;
}

function renderProfilePage(userName) {
  const relationship = friendGraph[userName] || "none";
  const canViewPrivate = relationship === "friends" || relationship === "close_friend";
  const userPosts = posts.filter((post) => post.user === userName);
  const privateVisible = userPosts.filter(
    (post) => post.visibility === "public" || (post.visibility === "close_friends" && canViewPrivate)
  );
  const followers = Object.values(friendGraph).filter((status) => status === "friends" || status === "close_friend")
    .length;
  const following = Object.values(friendGraph).filter((status) => status === "request_sent" || status === "friends")
    .length;

  profilePage.innerHTML = `
    <article class="profile-page-card">
      <h3>${escapeHtml(userName)} Profile</h3>
      <p>Relationship: ${escapeHtml(relationship)}</p>
      <p>Followers: ${followers} | Following: ${following}</p>
      <p>Visible posts: ${privateVisible.length}</p>
      <p>${canViewPrivate ? "Private content unlocked for this user." : "Only public content visible."}</p>
    </article>
  `;
  profilePage.classList.remove("app-hidden");
}

function renderTopics() {
  if (!topicDiscovery) return;
  const counts = {};
  posts.forEach((post) => {
    extractHashtags(post.text).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  const topics = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  topicDiscovery.innerHTML = topics
    .map(([tag, count]) => `<span data-topic="${tag}" title="${count} posts">${tag}</span>`)
    .join("");
}

function renderGlobalSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    globalSearchPanel.classList.add("app-hidden");
    globalSearchResults.innerHTML = "";
    searchMeta.textContent = "";
    return;
  }

  const users = [...new Set(Object.keys(friendGraph).concat(posts.map((post) => post.user)))]
    .filter((name) => name.toLowerCase().includes(q))
    .slice(0, 8);
  const matchingPosts = posts.filter(
    (post) => post.text.toLowerCase().includes(q) || post.user.toLowerCase().includes(q)
  );
  const hashtags = [...new Set(posts.flatMap((post) => extractHashtags(post.text)))]
    .filter((tag) => tag.includes(q.startsWith("#") ? q : `#${q}`) || tag.includes(q))
    .slice(0, 8);
  const messages = dms.filter(
    (dm) => dm.name.toLowerCase().includes(q) || dm.preview.toLowerCase().includes(q)
  );

  globalSearchResults.innerHTML = `
    <div class="search-group"><h4>Users (${users.length})</h4>${users
      .map((name) => `<p>${escapeHtml(name)}</p>`)
      .join("")}</div>
    <div class="search-group"><h4>Posts (${matchingPosts.length})</h4>${matchingPosts
      .slice(0, 6)
      .map((post) => `<p><strong>${escapeHtml(post.user)}:</strong> ${escapeHtml(post.text)}</p>`)
      .join("")}</div>
    <div class="search-group"><h4>Hashtags (${hashtags.length})</h4>${hashtags
      .map((tag) => `<p>${escapeHtml(tag)}</p>`)
      .join("")}</div>
    <div class="search-group"><h4>Messages (${messages.length})</h4>${messages
      .map((dm) => `<p><strong>${escapeHtml(dm.name)}:</strong> ${escapeHtml(dm.preview)}</p>`)
      .join("")}</div>
  `;

  searchMeta.textContent = `Results for "${query}"`;
  globalSearchPanel.classList.remove("app-hidden");
}

function openNotifCenter() {
  notifCenterBackdrop.classList.remove("app-hidden");
  notifCenterDrawer.classList.remove("app-hidden");
}

function closeNotifCenter() {
  notifCenterBackdrop.classList.add("app-hidden");
  notifCenterDrawer.classList.add("app-hidden");
}

function isAnyOverlayOpen() {
  return (
    !storyModal.classList.contains("app-hidden") ||
    !dmDrawer.classList.contains("app-hidden") ||
    !notifCenterDrawer.classList.contains("app-hidden") ||
    !profilePhotoModal.classList.contains("app-hidden") ||
    !shareModal.classList.contains("app-hidden")
  );
}

function openProfilePhotoModal() {
  const saved = localStorage.getItem(PROFILE_PHOTO_KEY);
  if (saved) {
    profilePhotoViewerImage.src = saved;
    profilePhotoHint.textContent = "Tap image area or Upload Photo.";
    profilePhotoViewer.classList.remove("empty-state");
  } else {
    profilePhotoViewerImage.src =
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='220'><rect width='100%' height='100%' fill='%23141f3d'/><text x='50%' y='50%' fill='%23dce6ff' font-family='Inter,sans-serif' font-size='16' text-anchor='middle'>No profile photo yet</text></svg>";
    profilePhotoHint.textContent = "No photo yet. Tap the image area or Upload Photo.";
    profilePhotoViewer.classList.add("empty-state");
  }
  profilePhotoModal.classList.remove("app-hidden");
  floatingCloseBtn.classList.remove("app-hidden");
}

function closeProfilePhotoModal() {
  profilePhotoModal.classList.add("app-hidden");
}

function openShareModal(postId) {
  activeSharePostId = String(postId);
  shareCaptionInput.value = "";
  shareVisibilitySelect.value = "public";
  shareModal.classList.remove("app-hidden");
  floatingCloseBtn.classList.remove("app-hidden");
}

function closeShareModal() {
  shareModal.classList.add("app-hidden");
  activeSharePostId = null;
}

function syncNotificationPrefsUi() {
  prefMessages.checked = notificationPrefs.messages;
  prefFriends.checked = notificationPrefs.friends;
  prefModeration.checked = notificationPrefs.moderation;
  prefSystem.checked = notificationPrefs.system;
}

function getLayoutWidgets() {
  return Array.from(mainContent.querySelectorAll(":scope > section"));
}

function saveLayoutOrder() {
  const order = getLayoutWidgets().map((item) => item.id).filter(Boolean);
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(order));
}

function getRightWidgets() {
  return Array.from(rightPanel.querySelectorAll(":scope > section.right-widget"));
}

function saveRightLayoutOrder() {
  const order = getRightWidgets().map((item) => item.id).filter(Boolean);
  localStorage.setItem(RIGHT_LAYOUT_KEY, JSON.stringify(order));
}

function applySavedLayoutOrder() {
  const savedOrder = safeParse(localStorage.getItem(LAYOUT_KEY), null);
  if (!Array.isArray(savedOrder) || savedOrder.length === 0) return;
  const widgetMap = new Map(getLayoutWidgets().map((item) => [item.id, item]));
  savedOrder.forEach((id) => {
    const widget = widgetMap.get(id);
    if (widget) mainContent.appendChild(widget);
  });
}

function applySavedRightLayoutOrder() {
  const savedOrder = safeParse(localStorage.getItem(RIGHT_LAYOUT_KEY), null);
  if (!Array.isArray(savedOrder) || savedOrder.length === 0) return;
  const widgetMap = new Map(getRightWidgets().map((item) => [item.id, item]));
  savedOrder.forEach((id) => {
    const widget = widgetMap.get(id);
    if (widget) rightPanel.appendChild(widget);
  });
}

function setupLayoutWidgets() {
  getLayoutWidgets().forEach((widget, index) => {
    if (!widget.id) {
      widget.id = `layoutWidget${index + 1}`;
    }
    widget.classList.add("layout-widget");
    widget.draggable = false;
    widget.addEventListener("dragstart", () => {
      if (!layoutEditMode) return;
      draggedWidgetId = widget.id;
      widget.classList.add("dragging");
    });
    widget.addEventListener("dragend", () => {
      widget.classList.remove("dragging");
      draggedWidgetId = null;
      saveLayoutOrder();
    });
  });

  getRightWidgets().forEach((widget, index) => {
    if (!widget.id) {
      widget.id = `rightWidget${index + 1}`;
    }
    widget.classList.add("layout-widget");
    widget.draggable = false;
    widget.addEventListener("dragstart", () => {
      if (!layoutEditMode) return;
      draggedWidgetId = widget.id;
      widget.classList.add("dragging");
    });
    widget.addEventListener("dragend", () => {
      widget.classList.remove("dragging");
      draggedWidgetId = null;
      saveRightLayoutOrder();
    });
  });
}

function enableLayoutEditing(enabled) {
  layoutEditMode = enabled;
  document.body.classList.toggle("layout-editing", enabled);
  getLayoutWidgets().forEach((widget) => {
    widget.draggable = enabled;
  });
  if (customizeLayoutBtn) {
    customizeLayoutBtn.textContent = enabled ? "Done" : "Customize UI";
  }
  showToast(enabled ? "Drag sections to reorder the page" : "Layout saved");
}

function wireLayoutDragDrop() {
  mainContent.addEventListener("dragover", (event) => {
    if (!layoutEditMode || !draggedWidgetId) return;
    event.preventDefault();
    const target = event.target.closest(".layout-widget");
    const dragged = document.getElementById(draggedWidgetId);
    if (!target || !dragged || target === dragged) return;
    if (!mainContent.contains(target) || !mainContent.contains(dragged)) return;
    const rect = target.getBoundingClientRect();
    const insertAfter = event.clientY > rect.top + rect.height / 2;
    if (insertAfter) {
      target.insertAdjacentElement("afterend", dragged);
    } else {
      target.insertAdjacentElement("beforebegin", dragged);
    }
  });

  rightPanel.addEventListener("dragover", (event) => {
    if (!layoutEditMode || !draggedWidgetId) return;
    event.preventDefault();
    const target = event.target.closest(".right-widget");
    const dragged = document.getElementById(draggedWidgetId);
    if (!target || !dragged || target === dragged) return;
    if (!rightPanel.contains(target) || !rightPanel.contains(dragged)) return;
    const rect = target.getBoundingClientRect();
    const insertAfter = event.clientY > rect.top + rect.height / 2;
    if (insertAfter) {
      target.insertAdjacentElement("afterend", dragged);
    } else {
      target.insertAdjacentElement("beforebegin", dragged);
    }
  });
}

function renderCommentThread(post) {
  const comments = Array.isArray(post.commentsData) ? post.commentsData : [];
  if (comments.length === 0) {
    return `<div class="comment-thread"><p class="comment-item">No comments yet.</p>
      <div class="comment-input-row">
        <input data-comment-input="${post.id}" placeholder="Add comment or @mention" />
        <button data-comment-add="${post.id}" type="button">Send</button>
      </div>
    </div>`;
  }

  const commentsHtml = comments
    .map((comment) => {
      const replies = (comment.replies || [])
        .map((reply) => `<div class="comment-item">? <strong>${escapeHtml(reply.user)}</strong>: ${escapeHtml(reply.text)}</div>`)
        .join("");
      return `<div class="comment-item">
        <strong>${escapeHtml(comment.user)}</strong>: ${escapeHtml(comment.text)}
        <span class="comment-actions">
          <button data-comment-reply="${post.id}:${comment.id}" type="button">Reply</button>
          <button data-comment-edit="${post.id}:${comment.id}" type="button">Edit</button>
          <button data-comment-delete="${post.id}:${comment.id}" type="button">Delete</button>
        </span>
        ${replies}
      </div>`;
    })
    .join("");

  return `<div class="comment-thread">
    ${commentsHtml}
    <div class="comment-input-row">
      <input data-comment-input="${post.id}" placeholder="Add comment or @mention" />
      <button data-comment-add="${post.id}" type="button">Send</button>
    </div>
  </div>`;
}

function isSnapPost(post) {
  return post?.mood === "Snap" || post?.mood === "Ghost";
}

function renderSuggested() {
  suggestedFriends.innerHTML = "";
  suggested.forEach((name) => {
    const li = document.createElement("li");
    const blocked = isBlockedUser(name);
    li.innerHTML = `<span>${escapeHtml(name)}</span><button type="button" data-friend-name="${escapeHtml(name)}" ${
      blocked ? "disabled" : ""
    }>${blocked ? "Blocked" : getFriendActionLabel(name)}</button>`;
    suggestedFriends.appendChild(li);
  });
}

function renderTrends() {
  trendTags.innerHTML = trends.map((tag) => `<span>${tag}</span>`).join("");
}

function renderReels() {
  reelsRow.innerHTML = reels
    .map(
      (reel) => `
      <article class="reel-card">
        <div class="reel-thumb"></div>
        <strong>${reel.user}</strong>
        <div class="reel-meta">
          <span>${reel.views} views</span>
          <span>${reel.tone}</span>
        </div>
      </article>
    `
    )
    .join("");
}

function renderLenses() {
  lensFilters.innerHTML = lenses
    .map((lens) => `<button class="lens-chip ${lens === activeLens ? "active" : ""}" type="button">${lens}</button>`)
    .join("");
}

function renderStreaks() {
  streakList.innerHTML = streaks
    .map((item) => `<li><span>${item.name}</span><strong>${item.days} day streak</strong></li>`)
    .join("");
}

function renderNotes() {
  if (!quickNotes) return;
  quickNotes.innerHTML = notes.map((item) => `<div class="quick-note">${item}</div>`).join("");
}

function updateLiveStatusCard() {
  if (!liveStatusTitle || !liveStatusText) return;
  const online = Number(onlineCount.textContent) || 0;
  const unread = notifications.length;
  const bestStreak = streaks.reduce((max, item) => Math.max(max, Number(item.days) || 0), 0);
  const pulse = [
    { title: "Circle Online", text: `${online} friends are active right now.` },
    { title: "Alert Mode", text: `${unread} updates are waiting in your notifications.` },
    { title: "Streak Energy", text: `Top streak in your circle is ${bestStreak} days.` },
    { title: "Feed Pulse", text: `${postCount.textContent} fresh posts dropped recently.` },
  ];
  const pick = pulse[Math.floor(Date.now() / 3500) % pulse.length];
  liveStatusTitle.textContent = pick.title;
  liveStatusText.textContent = pick.text;
}

function renderDms() {
  const visibleDms = dms.filter((dm) => !isBlockedUser(dm.name));
  dmList.innerHTML = visibleDms
    .map(
      (dm) => `
      <li class="dm-item ${dm.unread ? "unread" : ""}" data-dm-id="${dm.id}">
        <div class="dm-top">
          <strong>${escapeHtml(dm.name)}</strong>
          <span>${escapeHtml(dm.time)}</span>
        </div>
        <p class="dm-preview">${escapeHtml(dm.preview)}</p>
      </li>
    `
    )
    .join("");
  dmUnreadCount.textContent = String(visibleDms.filter((dm) => dm.unread).length);
}

function renderNotifications() {
  notificationList.innerHTML = notifications
    .slice(0, 8)
    .map((item) => `<li><strong>${escapeHtml(item.time)}</strong> - ${escapeHtml(item.message)}</li>`)
    .join("");

  notifCenterList.innerHTML = notifications
    .map(
      (item) =>
        `<li><strong>${escapeHtml(item.time)}</strong> [${escapeHtml(item.type || "system")}] - ${escapeHtml(
          item.message
        )}</li>`
    )
    .join("");
}

function renderReports() {
  if (!openReportsCount || !reportsList || !adminStats) return;
  const openReports = reports.filter((item) => item.status === "open");
  openReportsCount.textContent = String(openReports.length);
  reportsList.innerHTML = openReports
    .slice(0, 8)
    .map(
      (item) => `
      <li>
        <p><strong>${escapeHtml(item.targetUser)}</strong> - ${escapeHtml(item.reason)}</p>
        <button type="button" data-report-action="resolve" data-report-id="${item.id}">Resolve</button>
        <button type="button" data-report-action="remove_post" data-report-id="${item.id}">Remove Post</button>
      </li>
    `
    )
    .join("");

  adminStats.innerHTML = `
    <div class="metric-item"><p>Total Posts</p><strong>${posts.length}</strong></div>
    <div class="metric-item"><p>Blocked Users</p><strong>${blockedUsers.length}</strong></div>
    <div class="metric-item"><p>Reports</p><strong>${reports.length}</strong></div>
    <div class="metric-item"><p>Notifications</p><strong>${notifications.length}</strong></div>
  `;
}

function renderStoryModal() {
  storyUserName.textContent = `${stories[currentStoryIndex]}'s Story`;
  storyBody.textContent = storyLines[currentStoryIndex];
  storyProgress.innerHTML = stories
    .map((_, index) => `<span class="${index <= currentStoryIndex ? "active" : ""}"></span>`)
    .join("");
}

function startStoryTimer() {
  clearInterval(storyTimer);
  storyTimer = setInterval(() => {
    currentStoryIndex = (currentStoryIndex + 1) % stories.length;
    renderStoryModal();
  }, 3000);
}

function openStoryModal(index) {
  currentStoryIndex = index;
  storyModal.classList.remove("app-hidden");
  floatingCloseBtn.classList.remove("app-hidden");
  renderStoryModal();
  startStoryTimer();
}

function closeStoryModal() {
  storyModal.classList.add("app-hidden");
  clearInterval(storyTimer);
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
}

function renderDmThread(dmId) {
  const thread = dmThreads[dmId] || [];
  dmThread.innerHTML = thread
    .map((msg) => `<div class="bubble ${msg.from}">${escapeHtml(msg.text)}</div>`)
    .join("");
  dmThread.scrollTop = dmThread.scrollHeight;
}

function openDmDrawer(dmId) {
  const dm = dms.find((entry) => entry.id === dmId);
  if (!dm) return;
  if (isBlockedUser(dm.name)) {
    showToast("User is blocked");
    return;
  }
  activeDmId = dmId;
  dmDrawerTitle.textContent = `Chat with ${dm.name}`;
  dmBackdrop.classList.remove("app-hidden");
  dmDrawer.classList.remove("app-hidden");
  floatingCloseBtn.classList.remove("app-hidden");
  renderDmThread(dmId);
}

function ensureDmThreadForUser(name) {
  let dm = dms.find((entry) => entry.name === name);
  if (!dm) {
    dm = {
      id: Date.now(),
      name: clampText(name || "Friend", 30),
      preview: "Started a new chat",
      time: "now",
      unread: false,
    };
    dms.unshift(dm);
    dmThreads[dm.id] = [{ from: "them", text: "Hey! Replying from snap." }];
    saveSocialData();
    renderDms();
  }
  return dm.id;
}

function closeDmDrawer() {
  dmBackdrop.classList.add("app-hidden");
  dmDrawer.classList.add("app-hidden");
  activeDmId = null;
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
}

function closeOverlays() {
  closeStoryModal();
  closeDmDrawer();
  closeNotifCenter();
  closeProfilePhotoModal();
  closeShareModal();
  floatingCloseBtn.classList.add("app-hidden");
}

function postCardTemplate(post) {
  const initials = post.user
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const visibilityLabel = post.visibility === "close_friends" ? "Close Friends" : "Public Circle";
  const visibilityClass = post.visibility === "close_friends" ? "close-friends" : "";
  const mediaHtml = post.mediaType && post.mediaData
    ? `<div class="post-media-content">${
        post.mediaType === "image"
          ? `<img src="${post.mediaData}" alt="Post media" />`
          : `<div class="video-frame">
              <video class="feed-video" src="${post.mediaData}" preload="metadata"></video>
              <button class="video-mute-btn" type="button">Unmute</button>
            </div>`
      }</div>`
    : "";
  const currentUser = getSessionUser() || "Alex";
  const canModerate = post.user !== currentUser;
  const moderationHtml = canModerate
    ? `<button class="mod-btn report-btn">Report</button><button class="mod-btn block-btn">Block</button>`
    : "";
  const isSnap = isSnapPost(post);
  const commentThreadHtml = isSnap ? "" : renderCommentThread(post);
  const commentLabel = isSnap ? "Reply in DM" : `Comment (${post.comments})`;
  return `
    <article class="post-card card" data-post-id="${post.id}">
      <div class="post-head">
        <div class="post-user">
          <span class="avatar">${initials}</span>
          <div class="post-meta">
            <strong><button class="nav-btn" data-user-link="${escapeHtml(post.user)}" type="button">${escapeHtml(post.user)}</button></strong>
            <p>${escapeHtml(post.time)}</p>
          </div>
        </div>
        <span class="post-tag ${visibilityClass}">${escapeHtml(post.mood)} - ${visibilityLabel}</span>
      </div>
      <p>${escapeHtml(post.text)}</p>
      ${mediaHtml}
      <div class="post-stats">
        <span>${post.likes + post.comments + post.shares} interactions</span>
        <span>Realtime reach</span>
      </div>
      <div class="post-actions">
        <button class="like-btn">Like (${post.likes})</button>
        <button class="comment-btn">${commentLabel}</button>
        <button class="share-btn">Share (${post.shares})</button>
        ${moderationHtml}
      </div>
      ${commentThreadHtml}
    </article>
  `;
}

function createSharedPost(originalPost, caption = "", visibility = "public") {
  const currentUser = getSessionUser() || "Alex";
  const captionText = clampText(caption, 120);
  const prefix = captionText ? `${captionText} ` : "";
  const sharedText = clampText(`${prefix}Shared from ${originalPost.user}: ${originalPost.text}`, LIMITS.post);
  return {
    id: makeId(),
    user: currentUser,
    time: "now",
    text: sharedText,
    likes: 0,
    comments: 0,
    shares: 0,
    mood: "Shared",
    visibility: visibility === "close_friends" ? "close_friends" : "public",
    mediaType: originalPost.mediaType || null,
    mediaData: originalPost.mediaData || null,
    commentsData: [],
    sharedFromPostId: originalPost.id,
  };
}

function renderFeed(query = "") {
  const filtered = posts.filter((post) => {
    const q = query.toLowerCase();
    const matchesText = post.user.toLowerCase().includes(q) || post.text.toLowerCase().includes(q);
    const visibility = feedVisibilityFilter.value;
    const matchesVisibility = visibility === "all" ? true : post.visibility === visibility;
    const allowedByGraph =
      post.user === (getSessionUser() || "Alex") ||
      post.visibility === "public" ||
      (post.visibility === "close_friends" && isCloseFriend(post.user));
    const topicMatch = selectedTopic ? extractHashtags(post.text).includes(selectedTopic) : true;
    return matchesText && matchesVisibility && allowedByGraph && !isBlockedUser(post.user) && topicMatch;
  });

  filtered.sort((a, b) => postRankScore(b) - postRankScore(a));
  feed.innerHTML = filtered.map(postCardTemplate).join("");
  enhanceFeedVideos();
  renderGlobalSearch(query);
}

postBtn.addEventListener("click", async () => {
  if (!canPerform("post")) {
    showToast("Please wait before posting again");
    return;
  }

  const text = clampText(postText.value, LIMITS.post);
  if (!text) return;

  const newPost = {
    id: makeId(),
    user: getSessionUser() || "Alex",
    time: "now",
    text,
    likes: 0,
    comments: 0,
    shares: 0,
    mood: "Fresh",
    visibility: visibilitySelect.value,
    mediaType: selectedPostMedia?.type || null,
    mediaData: selectedPostMedia?.data || null,
    commentsData: [],
  };
  posts.unshift(newPost);

  postText.value = "";
  postMediaInput.value = "";
  selectedPostMedia = null;
  renderPostMediaPreview();
  saveSocialData();
  if (hasSupabase()) {
    const inserted = await persistPostToSupabase(newPost);
    if (inserted?.id) {
      newPost.id = String(inserted.id);
      newPost.time = formatTimeAgo(inserted.created_at);
      await loadFeedFromSupabase();
    }
  }
  showToast("Post published");
  renderTopics();
  renderFeed(searchInput.value);
});

googleAuthBtn?.addEventListener("click", async () => {
  await signInWithGoogle();
});

logoutBtn.addEventListener("click", async () => {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  clearSessionUser();
  showAuth();
  authMessage.textContent = "";
  showToast("Logged out");
});

themeBtn?.addEventListener("click", () => {
  nextTheme();
});

neonModeBtn?.addEventListener("click", () => {
  setNeonMode(!getNeonMode());
});

customizeLayoutBtn?.addEventListener("click", () => {
  enableLayoutEditing(!layoutEditMode);
});

refreshReelsBtn.addEventListener("click", () => {
  reels.push({ user: "Alex", views: `${(Math.random() * 4 + 1).toFixed(1)}k`, tone: activeLens });
  reels.shift();
  renderReels();
});

lensFilters.addEventListener("click", (event) => {
  if (!event.target.classList.contains("lens-chip")) return;
  activeLens = event.target.textContent;
  renderLenses();
});

snapNowBtn.addEventListener("click", async () => {
  if (!canPerform("snap")) {
    showToast("Please wait before sending another snap");
    return;
  }

  const snapPost = {
    id: makeId(),
    user: getSessionUser() || "Alex",
    time: "now",
    text: `Quick snap sent with ${activeLens} lens`,
    likes: 0,
    comments: 0,
    shares: 0,
    mood: ghostMode ? "Ghost" : "Snap",
    visibility: ghostMode ? "close_friends" : "public",
    commentsData: [],
  };
  posts.unshift(snapPost);
  if (hasSupabase()) {
    const inserted = await persistPostToSupabase(snapPost);
    if (inserted?.id) {
      snapPost.id = String(inserted.id);
      snapPost.time = formatTimeAgo(inserted.created_at);
      await loadFeedFromSupabase();
    }
  }
  saveSocialData();
  showToast("Snap shared");
  renderTopics();
  renderFeed(searchInput.value);
});

toggleGhostModeBtn.addEventListener("click", () => {
  ghostMode = !ghostMode;
  toggleGhostModeBtn.textContent = ghostMode ? "Ghost Mode On" : "Ghost Mode Off";
});

if (mainNav) {
  mainNav.addEventListener("click", (event) => {
    const clicked = event.target.closest(".nav-btn");
    if (!clicked) return;
    mainNav.querySelectorAll(".nav-btn").forEach((item) => item.classList.remove("active"));
    clicked.classList.add("active");
  });
}

editBioBtn.addEventListener("click", () => {
  fillBioForm();
  setBioEditMode(true);
});

cancelBioBtn.addEventListener("click", () => {
  setBioEditMode(false);
});

bioForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const bio = {
    about: clampText(bioAboutInput.value, LIMITS.bio) || defaultBio.about,
    work: clampText(bioWorkInput.value, LIMITS.profileField) || defaultBio.work,
    education: clampText(bioEducationInput.value, LIMITS.profileField) || defaultBio.education,
    city: clampText(bioCityInput.value, LIMITS.profileField) || defaultBio.city,
    relationship: clampText(bioRelationshipInput.value, LIMITS.profileField) || defaultBio.relationship,
  };
  saveBio(bio);
  if (hasSupabase()) {
    syncBioToSupabase(bio);
  }
  renderBio();
  setBioEditMode(false);
  showToast("Profile bio updated");
});

suggestedFriends.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;
  const name = event.target.dataset.friendName;
  if (!name) return;
  const status = friendGraph[name] || "none";

  if (status === "none") {
    friendGraph[name] = "request_sent";
    addNotification("friends", `Friend request sent to ${name}`);
    showToast(`Request sent to ${name}`);
  } else if (status === "request_received") {
    friendGraph[name] = "friends";
    addNotification("friends", `You are now friends with ${name}`);
    showToast(`You are now friends with ${name}`);
  } else if (status === "friends") {
    friendGraph[name] = "close_friend";
    addNotification("friends", `${name} moved to close friends`);
    showToast(`${name} is now close friend`);
  } else if (status === "close_friend") {
    friendGraph[name] = "friends";
    showToast(`${name} moved to friends`);
  }

  saveSocialData();
  renderSuggested();
  renderNotifications();
});

inviteFriendsBtn?.addEventListener("click", async () => {
  const inviteCode = makeInviteCode();
  const inviteLink = `${window.location.origin || window.location.href.split("?")[0]}?invite=${encodeURIComponent(inviteCode)}`;
  if (hasSupabase()) {
    const user = await getSupabaseUser();
    if (user) {
      const { error } = await supabaseClient.from("invites").insert({
        code: inviteCode,
        created_by: user.id,
      });
      if (error) {
        showToast("Create invites table in Supabase to enable private invites");
        return;
      }
      await loadInviteHistory();
    }
  }
  const shareText = `Join my private Connectspace circle: ${inviteLink}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Connectspace Invite", text: shareText, url: inviteLink });
      addNotification("friends", "Invite shared successfully");
      showToast("Invite sent");
      renderNotifications();
      return;
    }
    await navigator.clipboard.writeText(inviteLink);
    addNotification("friends", "Invite link copied");
    showToast("Invite link copied");
    renderNotifications();
  } catch {
    showToast("Could not share invite");
  }
});

storiesRow.addEventListener("click", (event) => {
  const story = event.target.closest("[data-story-index]");
  if (!story) return;
  openStoryModal(Number(story.dataset.storyIndex));
});

closeStoryBtn.addEventListener("click", () => {
  closeStoryModal();
});

storyModal.addEventListener("click", (event) => {
  if (event.target === storyModal) {
    closeStoryModal();
  }
});

prevStoryBtn.addEventListener("click", () => {
  currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
  renderStoryModal();
  startStoryTimer();
});

nextStoryBtn.addEventListener("click", () => {
  currentStoryIndex = (currentStoryIndex + 1) % stories.length;
  renderStoryModal();
  startStoryTimer();
});

dmList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-dm-id]");
  if (!item) return;
  const dm = dms.find((entry) => entry.id === Number(item.dataset.dmId));
  if (!dm) return;
  dm.unread = false;
  saveSocialData();
  renderDms();
  openDmDrawer(dm.id);
});

closeDmDrawerBtn.addEventListener("click", () => {
  closeDmDrawer();
});

closeProfilePhotoBtn.addEventListener("click", () => {
  closeProfilePhotoModal();
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
});

closeShareModalBtn.addEventListener("click", () => {
  closeShareModal();
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
});

shareModal.addEventListener("click", (event) => {
  if (event.target === shareModal) {
    closeShareModal();
    if (!isAnyOverlayOpen()) {
      floatingCloseBtn.classList.add("app-hidden");
    }
  }
});

profilePhotoModal.addEventListener("click", (event) => {
  if (event.target === profilePhotoModal) {
    closeProfilePhotoModal();
    if (!isAnyOverlayOpen()) {
      floatingCloseBtn.classList.add("app-hidden");
    }
  }
});

dmBackdrop.addEventListener("click", () => {
  closeDmDrawer();
});

floatingCloseBtn.addEventListener("click", () => {
  closeOverlays();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOverlays();
  }
});

dmComposer.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canPerform("dm")) {
    showToast("Sending too fast, wait a moment");
    return;
  }

  const text = clampText(dmInput.value, LIMITS.message);
  if (!text || activeDmId === null) return;

  dmThreads[activeDmId].push({ from: "me", text });
  const dm = dms.find((entry) => entry.id === activeDmId);
  if (dm) {
    dm.preview = text;
    dm.time = "now";
    dm.unread = false;
  }
  dmInput.value = "";
  renderDmThread(activeDmId);
  renderDms();
  saveSocialData();

  setTimeout(() => {
    if (activeDmId === null) return;
    dmThreads[activeDmId].push({ from: "them", text: "Seen. Replying soon." });
    const dmForReply = dms.find((entry) => entry.id === activeDmId);
    if (dmForReply) {
      dmForReply.preview = "Seen. Replying soon.";
      dmForReply.time = "now";
      dmForReply.unread = true;
      addNotification("messages", `New message from ${dmForReply.name}`);
      renderDms();
      renderNotifications();
    }
    saveSocialData();
    renderDmThread(activeDmId);
  }, 1300);
});

profileUploadBtn.addEventListener("click", () => {
  profileUploadInput.click();
});

profileUploadInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  await uploadProfilePhoto(file);
  profileUploadInput.value = "";
});

removeProfilePhotoBtn.addEventListener("click", () => {
  if (!localStorage.getItem(PROFILE_PHOTO_KEY)) {
    showToast("No profile photo to remove");
    return;
  }
  localStorage.removeItem(PROFILE_PHOTO_KEY);
  renderProfilePhoto();
  if (!profilePhotoModal.classList.contains("app-hidden")) {
    openProfilePhotoModal();
  }
  showToast("Profile photo removed");
});

["dragenter", "dragover"].forEach((eventName) => {
  profileAvatar.addEventListener(eventName, (event) => {
    event.preventDefault();
    profileAvatar.classList.add("drop-active");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  profileAvatar.addEventListener(eventName, () => {
    profileAvatar.classList.remove("drop-active");
  });
});

profileAvatar.addEventListener("drop", async (event) => {
  event.preventDefault();
  const file = event.dataTransfer?.files?.[0];
  await uploadProfilePhoto(file);
});

profileAvatar.addEventListener("click", () => {
  openProfilePhotoModal();
});

profilePhotoViewer?.addEventListener("click", () => {
  profileUploadInput.click();
});

shareForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (activeSharePostId === null) return;
  const post = posts.find((item) => String(item.id) === String(activeSharePostId));
  if (!post) {
    closeShareModal();
    showToast("Post not found");
    return;
  }

  post.shares += 1;
  const sharedPost = createSharedPost(post, shareCaptionInput.value, shareVisibilitySelect.value);
  posts.unshift(sharedPost);
  if (hasSupabase()) {
    const inserted = await persistPostToSupabase(sharedPost);
    if (inserted?.id) {
      await loadFeedFromSupabase();
    }
  }
  addNotification("system", `You shared ${post.user}'s post`);
  saveSocialData();
  renderNotifications();
  renderTopics();
  renderFeed(searchInput.value);
  closeShareModal();
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
  showToast("Post shared to your feed");
});

postMediaInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    selectedPostMedia = null;
    renderPostMediaPreview();
    return;
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    showToast("Only photos or videos are supported");
    postMediaInput.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast("Media file must be under 5MB");
    postMediaInput.value = "";
    return;
  }

  try {
    const dataUrl = await readFileAsDataUrl(file);
    selectedPostMedia = { type: isVideo ? "video" : "image", data: dataUrl };
    renderPostMediaPreview();
  } catch {
    showToast("Could not load selected media");
  }
});

searchInput.addEventListener("input", (event) => {
  renderFeed(event.target.value);
  renderGlobalSearch(event.target.value);
});

feedVisibilityFilter.addEventListener("change", () => {
  renderFeed(searchInput.value);
});

feed.addEventListener("click", (event) => {
  const userLink = event.target.closest("[data-user-link]");
  if (userLink) {
    renderProfilePage(userLink.dataset.userLink);
    return;
  }

  const addCommentBtn = event.target.closest("[data-comment-add]");
  if (addCommentBtn) {
    const postId = String(addCommentBtn.dataset.commentAdd || "");
    const post = posts.find((item) => String(item.id) === postId);
    const input = feed.querySelector(`[data-comment-input="${postId}"]`);
    if (!post || !input) return;
    const text = clampText(input.value, LIMITS.message);
    if (!text) return;
    post.commentsData = post.commentsData || [];
    post.commentsData.push({ id: makeId(), user: getSessionUser() || "Alex", text, replies: [] });
    post.comments += 1;
    input.value = "";
    addNotification("system", `New comment on ${post.user}'s post`);
    if (hasSupabase() && isUuidLike(post.id)) {
      (async () => {
        const user = await getSupabaseUser();
        if (!user) return;
        await supabaseClient.from("comments").insert({
          post_id: String(post.id),
          user_id: user.id,
          text,
        });
      })();
    }
    saveSocialData();
    renderNotifications();
    renderFeed(searchInput.value);
    return;
  }

  const replyBtn = event.target.closest("[data-comment-reply]");
  if (replyBtn) {
    const [postIdRaw, commentIdRaw] = String(replyBtn.dataset.commentReply).split(":");
    const post = posts.find((item) => String(item.id) === String(postIdRaw));
    const comment = post?.commentsData?.find((item) => String(item.id) === String(commentIdRaw));
    if (!post || !comment) return;
    const replyText = prompt("Reply to comment:");
    const text = clampText(replyText, LIMITS.message);
    if (!text) return;
    comment.replies = comment.replies || [];
    comment.replies.push({ user: getSessionUser() || "Alex", text });
    post.comments += 1;
    saveSocialData();
    renderFeed(searchInput.value);
    return;
  }

  const editBtn = event.target.closest("[data-comment-edit]");
  if (editBtn) {
    const [postIdRaw, commentIdRaw] = String(editBtn.dataset.commentEdit).split(":");
    const post = posts.find((item) => String(item.id) === String(postIdRaw));
    const comment = post?.commentsData?.find((item) => String(item.id) === String(commentIdRaw));
    if (!comment) return;
    if (comment.user !== (getSessionUser() || "Alex")) {
      showToast("Only your comment can be edited");
      return;
    }
    const nextValue = prompt("Edit comment:", comment.text);
    const text = clampText(nextValue, LIMITS.message);
    if (!text) return;
    comment.text = text;
    saveSocialData();
    renderFeed(searchInput.value);
    return;
  }

  const deleteBtn = event.target.closest("[data-comment-delete]");
  if (deleteBtn) {
    const [postIdRaw, commentIdRaw] = String(deleteBtn.dataset.commentDelete).split(":");
    const post = posts.find((item) => String(item.id) === String(postIdRaw));
    if (!post || !Array.isArray(post.commentsData)) return;
    const index = post.commentsData.findIndex((item) => String(item.id) === String(commentIdRaw));
    if (index === -1) return;
    const comment = post.commentsData[index];
    if (comment.user !== (getSessionUser() || "Alex")) {
      showToast("Only your comment can be deleted");
      return;
    }
    const removed = post.commentsData.splice(index, 1)[0];
    const replyCount = Array.isArray(removed.replies) ? removed.replies.length : 0;
    post.comments = Math.max(0, post.comments - 1 - replyCount);
    saveSocialData();
    renderFeed(searchInput.value);
    return;
  }

  if (event.target.classList.contains("report-btn") || event.target.classList.contains("block-btn")) {
    const card = event.target.closest("[data-post-id]");
    if (!card) return;
    const postId = String(card.dataset.postId || "");
    const post = posts.find((item) => String(item.id) === postId);
    if (!post) return;

    if (event.target.classList.contains("report-btn")) {
      reports.unshift({
        id: reportCounter++,
        postId,
        targetUser: post.user,
        reason: "User-reported content",
        status: "open",
      });
      addNotification("moderation", `Report filed for ${post.user}'s post`);
      showToast("Post reported to admin queue");
      saveSocialData();
      renderReports();
      renderNotifications();
      return;
    }

    if (event.target.classList.contains("block-btn")) {
      if (!blockedUsers.includes(post.user)) {
        blockedUsers.push(post.user);
        friendGraph[post.user] = "blocked";
      }
      addNotification("moderation", `Blocked ${post.user}`);
      showToast(`${post.user} blocked`);
      saveSocialData();
      renderSuggested();
      renderDms();
      renderFeed(searchInput.value);
      renderNotifications();
      return;
    }
  }

  if (event.target.classList.contains("video-mute-btn")) {
    const frame = event.target.closest(".video-frame");
    const video = frame?.querySelector(".feed-video");
    if (!video) return;
    video.muted = !video.muted;
    event.target.textContent = video.muted ? "Unmute" : "Mute";
    return;
  }

  const card = event.target.closest("[data-post-id]");
  if (!card) return;

  const postId = String(card.dataset.postId || "");
  const post = posts.find((item) => String(item.id) === postId);
  if (!post) return;

  if (event.target.classList.contains("like-btn")) {
    post.likes += 1;
  }

  if (event.target.classList.contains("comment-btn")) {
    if (isSnapPost(post)) {
      const currentUser = getSessionUser() || "Alex";
      if (post.user === currentUser) {
        showToast("Your snap uses quick reactions only");
        return;
      }
      const dmId = ensureDmThreadForUser(post.user);
      openDmDrawer(dmId);
      showToast(`Replying to ${post.user} in DM`);
      return;
    }
    const input = card.querySelector(`[data-comment-input="${postId}"]`);
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("Write a comment and tap Send");
    }
    return;
  }

  if (event.target.classList.contains("share-btn")) {
    openShareModal(post.id);
    return;
  }

  saveSocialData();
  renderFeed(searchInput.value);
});

if (topicDiscovery) {
  topicDiscovery.addEventListener("click", (event) => {
    const topic = event.target.closest("[data-topic]");
    if (!topic) return;
    selectedTopic = selectedTopic === topic.dataset.topic ? "" : topic.dataset.topic;
    showToast(selectedTopic ? `Topic filter: ${selectedTopic}` : "Topic filter cleared");
    renderFeed(searchInput.value);
  });
}

if (reportsList) {
  reportsList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-report-action]");
    if (!button) return;
    const reportId = Number(button.dataset.reportId);
    const report = reports.find((item) => item.id === reportId);
    if (!report) return;

    if (button.dataset.reportAction === "resolve") {
      report.status = "resolved";
      addNotification("moderation", `Resolved report for ${report.targetUser}`);
      showToast("Report resolved");
    }

    if (button.dataset.reportAction === "remove_post") {
      posts.splice(
        0,
        posts.length,
        ...posts.filter((item) => item.id !== report.postId)
      );
      report.status = "resolved";
      addNotification("moderation", `Removed post from ${report.targetUser}`);
      showToast("Post removed by admin");
      renderTopics();
      renderFeed(searchInput.value);
    }

    saveSocialData();
    renderReports();
    renderNotifications();
  });
}

notifCenterBtn.addEventListener("click", () => {
  openNotifCenter();
  floatingCloseBtn.classList.remove("app-hidden");
});

closeNotifCenterBtn.addEventListener("click", () => {
  closeNotifCenter();
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
});

notifCenterBackdrop.addEventListener("click", () => {
  closeNotifCenter();
  if (!isAnyOverlayOpen()) {
    floatingCloseBtn.classList.add("app-hidden");
  }
});

clearNotificationsBtn.addEventListener("click", () => {
  notifications = [];
  saveSocialData();
  renderNotifications();
  renderReports();
  showToast("Notifications cleared");
});

[prefMessages, prefFriends, prefModeration, prefSystem].forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    notificationPrefs = {
      messages: prefMessages.checked,
      friends: prefFriends.checked,
      moderation: prefModeration.checked,
      system: prefSystem.checked,
    };
    saveSocialData();
    showToast("Notification preferences updated");
  });
});

function startLiveUi() {
  setInterval(() => {
    heroIndex = (heroIndex + 1) % heroMessages.length;
    heroText.textContent = heroMessages[heroIndex];

    const nextOnline = Number(onlineCount.textContent) + Math.floor(Math.random() * 3 - 1);
    onlineCount.textContent = String(Math.max(12, nextOnline));

    const nextPosts = Number(postCount.textContent) + Math.floor(Math.random() * 3 - 1);
    postCount.textContent = String(Math.max(3, nextPosts));

    notes.unshift(`Private note updated (${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`);
    notes.splice(3);
    renderNotes();

    if (Math.random() > 0.72) {
      addNotification("system", "Realtime activity pulse in your circle");
      renderNotifications();
      saveSocialData();
    }
    updateLiveStatusCard();
  }, 3500);
}

migrateLegacyStorage();
migrateSchema();
loadSocialData();
updateAuthModeUi();
const hasSupabaseAuth = initSupabaseAuth();
if (hasSupabaseAuth) {
  restoreAuthSession();
} else {
  const existingUser = getSessionUser();
  if (existingUser) {
    showAppForUser(existingUser);
  } else {
    showAuth();
  }
}
const savedTheme = getTheme();
themeIndex = themes.indexOf(savedTheme);
if (themeIndex < 0) themeIndex = 0;
setTheme(themes[themeIndex]);
setNeonMode(getNeonMode());
renderStories();
renderSuggested();
renderTrends();
renderTopics();
renderReels();
renderLenses();
renderStreaks();
renderNotes();
renderDms();
syncNotificationPrefsUi();
renderNotifications();
renderReports();
renderBio();
renderProfilePhoto();
updateLiveStatusCard();
setupLayoutWidgets();
applySavedLayoutOrder();
applySavedRightLayoutOrder();
wireLayoutDragDrop();
renderFeed();
closeOverlays();
setNetworkStatus(navigator.onLine);
window.addEventListener("online", () => setNetworkStatus(true));
window.addEventListener("offline", () => setNetworkStatus(false));
startLiveUi();
