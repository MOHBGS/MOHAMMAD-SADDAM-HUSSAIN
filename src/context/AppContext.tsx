import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Story,
  Reel,
  CampusEvent,
  CollegeGroup,
  Conversation,
  Message,
  Notification,
  College,
  ActiveTab,
} from '../types';
import {
  CURRENT_LOGGED_IN_USER,
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_STORIES,
  MOCK_REELS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_MAP,
  MOCK_NOTIFICATIONS,
  MOCK_EVENTS,
  MOCK_GROUPS,
  COLLEGES,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  viewUserProfile: (userId: string) => void;

  // Data lists
  users: User[];
  posts: Post[];
  stories: Story[];
  reels: Reel[];
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getConversationMessages: (convId: string) => any[];
  notifications: Notification[];
  events: CampusEvent[];
  groups: CollegeGroup[];
  colleges: College[];
  bookmarks: string[];

  // Following list
  followingUserIds: string[];
  toggleFollowUser: (userId: string) => void;

  // Modals
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  isStoryViewerOpen: boolean;
  setIsStoryViewerOpen: (open: boolean) => void;
  activeStoryIndex: number;
  setActiveStoryIndex: (index: number) => void;
  isForgotPasswordOpen: boolean;
  setIsForgotPasswordOpen: (open: boolean) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  login: (email?: string, password?: string) => boolean;
  logout: () => Promise<boolean>;
  registerUser: (userData: Partial<User>) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  createPost: (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    location?: string;
    category?: any;
    poll?: { question: string; options: string[] };
  }) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  votePoll: (postId: string, optionId: string) => void;
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  sendMessage: (
    conversationId: string,
    text: string,
    media?: {
      mediaUrl: string;
      thumbnailUrl?: string;
      fileName?: string;
      fileSize?: number;
      mediaType?: string;
    }
  ) => void;
  retrySendMessage: (conversationId: string, messageId: string) => void;
  startChatWithUser: (user: User) => void;
  toggleEventInterest: (eventId: string) => void;
  toggleEventJoin: (eventId: string) => void;
  toggleGroupMembership: (groupId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  blockUser: (userId: string) => void;
  reportContent: (type: 'post' | 'user', id: string, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(CURRENT_LOGGED_IN_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [reels, setReels] = useState<Reel[]>(MOCK_REELS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [messagesMap, setMessagesMap] = useState<Record<string, any[]>>(MOCK_MESSAGES_MAP);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv1');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [events, setEvents] = useState<CampusEvent[]>(MOCK_EVENTS);
  const [groups, setGroups] = useState<CollegeGroup[]>(MOCK_GROUPS);
  const [colleges] = useState<College[]>(COLLEGES);
  const [bookmarks, setBookmarks] = useState<string[]>(['p3']);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>(['u2', 'u3', 'u4']);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist auth and sync initial session & updated user
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('cc_auth');
      const savedUserStr = localStorage.getItem('cc_current_user');
      if (savedAuth === 'false') {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setShowLanding(true);
      } else if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          if (parsedUser && parsedUser.id) {
            setCurrentUser(parsedUser);
            setUsers((prev) => prev.map((u) => (u.id === parsedUser.id ? parsedUser : u)));
          }
        } catch {}
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  // Centralized URL routing & route protection
  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname.toLowerCase();

      const protectedRoutes: Record<string, ActiveTab> = {
        '/home': 'home',
        '/profile': 'profile',
        '/messages': 'messages',
        '/notifications': 'notifications',
        '/my-college': 'my-college',
        '/settings': 'settings',
        '/explore': 'explore',
        '/events': 'events',
        '/groups': 'groups',
        '/bookmarks': 'bookmarks',
      };

      if (pathname === '/login') {
        if (!isAuthenticated) {
          setShowLanding(true);
          setIsLoginModalOpen(true);
        } else {
          window.history.replaceState(null, '', '/home');
          setActiveTab('home');
          setShowLanding(false);
          setIsLoginModalOpen(false);
        }
        return;
      }

      const matchedTab = protectedRoutes[pathname];
      if (matchedTab) {
        if (!isAuthenticated) {
          // SECURITY REQUIREMENT:
          // After logout, if user tries to open /home, /profile, /messages, etc.
          // without being authenticated, redirect immediately to /login
          window.history.replaceState(null, '', '/login');
          setShowLanding(true);
          setIsLoginModalOpen(true);
          setActiveTab('home');
        } else {
          setActiveTab(matchedTab);
          setShowLanding(false);
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [isAuthenticated]);

  const handleSetActiveTab = (tab: ActiveTab) => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', '/login');
      }
      setShowLanding(true);
      setIsLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/${tab === 'home' ? 'home' : tab}`);
    }
  };

  const login = (_email?: string, _password?: string): boolean => {
    setIsAuthenticated(true);
    setCurrentUser(CURRENT_LOGGED_IN_USER);
    setShowLanding(false);
    setIsLoginModalOpen(false);
    try {
      localStorage.setItem('cc_auth', 'true');
      localStorage.setItem('cc_session_token', `sess_${Date.now()}`);
    } catch {}
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/home');
    }
    return true;
  };

  const logout = async (): Promise<boolean> => {
    // 1. Sign out from the authentication system
    // Simulate real auth server call latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 2. Clear the active authentication/session state
    setIsAuthenticated(false);
    setCurrentUser(null);
    setViewingUserId(null);
    setActiveConversationId(null);

    // 3. Clear any relevant local session data
    try {
      localStorage.setItem('cc_auth', 'false');
      localStorage.removeItem('cc_session_token');
      localStorage.removeItem('cc_user_session');
      sessionStorage.clear();
    } catch {}

    // 4. Stop any active user-specific realtime listeners / close modals
    setIsCreatePostModalOpen(false);
    setIsStoryViewerOpen(false);
    setIsSignUpModalOpen(false);
    setIsOnboardingOpen(false);
    setIsForgotPasswordOpen(false);

    // 5. Prevent access to authenticated pages without logging in again
    setShowLanding(true);
    setIsLoginModalOpen(true);
    setActiveTab('home');

    // 6. Redirect the user to the Login page via browser URL
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '/login');
    }

    return true;
  };

  const registerUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      fullName: userData.fullName || 'New Student',
      username: (userData.fullName || 'student').toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random() * 90 + 10),
      email: userData.email || 'student@campus.edu',
      collegeId: userData.collegeId || 'du',
      collegeName: userData.collegeName || 'Delhi University',
      course: userData.course || 'B.Tech Computer Science',
      joiningYear: userData.joiningYear || 2024,
      currentYear: userData.currentYear || '1st Year',
      gender: userData.gender || 'female',
      dateOfBirth: userData.dateOfBirth,
      profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
      bio: userData.bio || 'Excited to join College Crush! Let’s connect on campus 🌸',
      interests: userData.interests || ['Campus Life', 'Photography', 'Coding & Hackathons'],
      followersCount: 0,
      followingCount: 3,
      postsCount: 0,
      isVerified: true,
      isCrushStatus: 'Available',
      isPrivate: false,
      whoCanMessage: 'everyone',
      whoCanFollow: 'everyone',
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setUsers((prev) => [newUser, ...prev]);
    setIsAuthenticated(true);
    setIsSignUpModalOpen(false);
    setIsOnboardingOpen(true);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updates };
    setCurrentUser(updated);

    // 1. Update user list
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));

    // 2. Persist updated user to localStorage
    try {
      localStorage.setItem('cc_current_user', JSON.stringify(updated));
    } catch {}

    // 3. Invalidate/update all posts and comments authored by this user
    setPosts((prev) =>
      prev.map((p) => {
        const isAuthor = p.userId === currentUser.id;
        const updatedComments = p.comments.map((c) =>
          c.userId === currentUser.id
            ? {
                ...c,
                userName: updated.fullName,
                userAvatar: updated.profilePhoto,
                userCollege: updated.collegeName,
              }
            : c
        );

        if (isAuthor) {
          return {
            ...p,
            userName: updated.fullName,
            userUsername: updated.username,
            userAvatar: updated.profilePhoto,
            userCollege: updated.collegeName,
            userCourse: updated.course,
            userYear: updated.currentYear,
            comments: updatedComments,
          };
        }
        return { ...p, comments: updatedComments };
      })
    );

    // 4. Update stories authored by user
    setStories((prev) =>
      prev.map((s) =>
        s.userId === currentUser.id
          ? {
              ...s,
              userName: updated.fullName,
              userAvatar: updated.profilePhoto,
              userCollege: updated.collegeName,
            }
          : s
      )
    );

    // 5. Update any conversations
    setConversations((prev) =>
      prev.map((c) =>
        c.participant.id === currentUser.id ? { ...c, participant: updated } : c
      )
    );
  };

  const viewUserProfile = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const createPost = (postData: {
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    location?: string;
    category?: any;
    poll?: { question: string; options: string[] };
  }) => {
    if (!currentUser) return;

    const newPost: Post = {
      id: `p_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userUsername: currentUser.username,
      userAvatar: currentUser.profilePhoto,
      userCollege: currentUser.collegeName,
      userCourse: currentUser.course,
      userYear: currentUser.currentYear,
      userVerified: currentUser.isVerified,
      content: postData.content,
      mediaUrl: postData.mediaUrl,
      mediaType: postData.mediaType,
      location: postData.location,
      category: postData.category || 'Campus Life',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      isSaved: false,
      comments: [],
      poll: postData.poll
        ? {
            question: postData.poll.question,
            options: postData.poll.options.map((opt, i) => ({
              id: `opt_${i}`,
              text: opt,
              votes: 0,
            })),
            totalVotes: 0,
          }
        : undefined,
      createdAt: 'Just now',
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => (prev ? { ...prev, postsCount: prev.postsCount + 1 } : null));
    setIsCreatePostModalOpen(false);
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.isLiked;
          return {
            ...post,
            isLiked: !wasLiked,
            likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  const savePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const wasSaved = post.isSaved;
          return {
            ...post,
            isSaved: !wasSaved,
          };
        }
        return post;
      })
    );
    setBookmarks((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userAvatar: currentUser.profilePhoto,
      userCollege: currentUser.collegeName,
      content: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const votePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.poll && !post.poll.userVotedOptionId) {
          const updatedOptions = post.poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...post,
            poll: {
              ...post.poll,
              options: updatedOptions,
              userVotedOptionId: optionId,
              totalVotes: post.poll.totalVotes + 1,
            },
          };
        }
        return post;
      })
    );
  };

  const likeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const wasLiked = reel.isLiked;
          return {
            ...reel,
            isLiked: !wasLiked,
            likesCount: wasLiked ? reel.likesCount - 1 : reel.likesCount + 1,
          };
        }
        return reel;
      })
    );
  };

  const saveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          return { ...reel, isSaved: !reel.isSaved };
        }
        return reel;
      })
    );
  };

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds((prev) => {
      const isFollowing = prev.includes(userId);
      const updated = isFollowing ? prev.filter((id) => id !== userId) : [...prev, userId];

      // Update following user followersCount
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              followersCount: isFollowing ? u.followersCount - 1 : u.followersCount + 1,
            };
          }
          return u;
        })
      );

      // Update current user followingCount
      setCurrentUser((prevCur) =>
        prevCur
          ? {
              ...prevCur,
              followingCount: isFollowing
                ? prevCur.followingCount - 1
                : prevCur.followingCount + 1,
            }
          : null
      );

      return updated;
    });
  };

  const getConversationMessages = (convId: string) => {
    return messagesMap[convId] || [];
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    media?: {
      mediaUrl: string;
      thumbnailUrl?: string;
      fileName?: string;
      fileSize?: number;
      mediaType?: string;
    }
  ) => {
    if (!currentUser || (!text.trim() && !media?.mediaUrl)) return;
    const isImage = !!media?.mediaUrl;
    const targetConv = conversations.find((c) => c.id === conversationId);

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      receiverId: targetConv?.participant.id,
      messageType: isImage ? 'image' : 'text',
      text: text.trim() || (isImage ? 'Shared an image' : ''),
      mediaUrl: media?.mediaUrl,
      thumbnailUrl: media?.thumbnailUrl || media?.mediaUrl,
      fileName: media?.fileName,
      fileSize: media?.fileSize,
      mediaType: media?.mediaType || (isImage ? 'image/jpeg' : undefined),
      mediaUrls: isImage ? [media.mediaUrl] : undefined,
      createdAt: 'Just now',
      deliveredAt: new Date().toISOString(),
      readStatus: false,
      uploadStatus: 'delivered',
    };

    setMessagesMap((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: isImage ? '📷 Image' : text.trim(),
              lastMessageTime: 'Just now',
              unreadCount: 0,
            }
          : c
      )
    );

    // Auto simulated real-time response after 2.2s
    setTimeout(() => {
      const activeConv = conversations.find((c) => c.id === conversationId);
      if (activeConv) {
        const replyText = isImage
          ? 'Love this campus photo! Looks amazing 📸✨'
          : `Awesome! Let's catch up on that at the campus cafe! ❤️`;

        const replyMsg: Message = {
          id: `m_${Date.now() + 1}`,
          conversationId,
          senderId: activeConv.participant.id,
          receiverId: currentUser.id,
          messageType: 'text',
          text: replyText,
          createdAt: 'Just now',
          readStatus: true,
          uploadStatus: 'read',
        };

        setMessagesMap((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: replyText,
                  lastMessageTime: 'Just now',
                }
              : c
          )
        );
      }
    }, 2200);
  };

  const retrySendMessage = (conversationId: string, messageId: string) => {
    setMessagesMap((prev) => {
      const list = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: list.map((m) =>
          m.id === messageId ? { ...m, uploadStatus: 'delivered' } : m
        ),
      };
    });
  };

  const startChatWithUser = (user: User) => {
    let existing = conversations.find((c) => c.participant.id === user.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${user.id}`,
        participant: user,
        lastMessage: 'Started conversation',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        isOnline: true,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setActiveTab('messages');
  };

  const toggleEventInterest = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const wasInterested = ev.isInterested;
          return {
            ...ev,
            isInterested: !wasInterested,
            interestedCount: wasInterested ? ev.interestedCount - 1 : ev.interestedCount + 1,
          };
        }
        return ev;
      })
    );
  };

  const toggleEventJoin = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const wasJoined = ev.isJoined;
          return {
            ...ev,
            isJoined: !wasJoined,
            joinedCount: wasJoined ? ev.joinedCount - 1 : ev.joinedCount + 1,
          };
        }
        return ev;
      })
    );
  };

  const toggleGroupMembership = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const wasMember = g.isMember;
          return {
            ...g,
            isMember: !wasMember,
            memberCount: wasMember ? g.memberCount - 1 : g.memberCount + 1,
          };
        }
        return g;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
  };

  const blockUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setPosts((prev) => prev.filter((p) => p.userId !== userId));
    setConversations((prev) => prev.filter((c) => c.participant.id !== userId));
  };

  const reportContent = (_type: 'post' | 'user', _id: string, _reason: string) => {
    // simulated reporting acknowledgement
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        showLanding,
        setShowLanding,
        activeTab,
        setActiveTab: handleSetActiveTab,
        viewingUserId,
        setViewingUserId,
        viewUserProfile,
        users,
        posts,
        stories,
        reels,
        conversations,
        activeConversationId,
        setActiveConversationId,
        getConversationMessages,
        notifications,
        events,
        groups,
        colleges,
        bookmarks,
        followingUserIds,
        toggleFollowUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isSignUpModalOpen,
        setIsSignUpModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
        isStoryViewerOpen,
        setIsStoryViewerOpen,
        activeStoryIndex,
        setActiveStoryIndex,
        isForgotPasswordOpen,
        setIsForgotPasswordOpen,
        searchQuery,
        setSearchQuery,
        login,
        logout,
        registerUser,
        updateUserProfile,
        createPost,
        likePost,
        savePost,
        addComment,
        votePoll,
        likeReel,
        saveReel,
        sendMessage,
        retrySendMessage,
        startChatWithUser,
        toggleEventInterest,
        toggleEventJoin,
        toggleGroupMembership,
        markNotificationRead,
        markAllNotificationsRead,
        blockUser,
        reportContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
