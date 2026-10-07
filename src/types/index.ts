export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  city: string;
  state: string;
  logo: string;
  coverImage: string;
  studentCount: number;
  established: number;
  description: string;
  verifiedBadge: boolean;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string; // International format e.g. +91XXXXXXXXXX
  collegeId: string;
  collegeName: string;
  course: string;
  joiningYear: number;
  currentYear: string; // e.g., '1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year', 'Postgraduate'
  gender?: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
  dateOfBirth?: string;
  profilePhoto: string;
  coverPhoto?: string;
  bio: string;
  interests: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  isCrushStatus?: 'Available' | 'Focusing on Studies' | 'Ask me' | 'Taken';
  isPrivate: boolean;
  whoCanMessage: 'everyone' | 'verified_only' | 'following_only';
  whoCanFollow: 'everyone' | 'approval_required';
  verificationMethod?: 'email' | 'whatsapp';
  isProfileComplete?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  userCollege: string;
  userCourse: string;
  userYear: string;
  userVerified: boolean;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  location?: string;
  category?: 'Campus Life' | 'Crush Confession' | 'Academic' | 'Fest & Events' | 'Memes' | 'Question';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    userVotedOptionId?: string;
    totalVotes: number;
  };
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCollege: string;
  hasUnseen: boolean;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'text';
  caption?: string;
  textContent?: string;
  bgColor?: string; // Gradient or background color for text stories
  textOverlay?: string;
  viewsCount?: number;
  visibility?: 'everyone' | 'followers' | 'close_friends';
  createdAt: string;
  expiresAt: string;
}

export interface Reel {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  userCollege: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  category: 'For You' | 'Following' | 'Campus';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  messageType?: 'text' | 'image';
  text: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType?: string;
  fileName?: string;
  fileSize?: number;
  mediaUrls?: string[];
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  readStatus: boolean;
  uploadStatus?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  reaction?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'event' | 'crush_match';
  sourceUser: {
    id: string;
    name: string;
    avatar: string;
    college: string;
  };
  targetPostId?: string;
  text: string;
  timeAgo: string;
  readStatus: boolean;
  createdAt: string;
}

export interface CampusEvent {
  id: string;
  collegeId: string;
  collegeName: string;
  title: string;
  description: string;
  category: 'Fest' | 'Hackathon' | 'Cultural' | 'Sports' | 'Workshop' | 'Party';
  eventDate: string;
  time: string;
  location: string;
  posterUrl: string;
  organizer: string;
  interestedCount: number;
  joinedCount: number;
  isInterested?: boolean;
  isJoined?: boolean;
}

export interface CollegeGroup {
  id: string;
  collegeId: string;
  collegeName: string;
  name: string;
  description: string;
  category: 'Coding & Tech' | 'Arts & Photography' | 'Music & Dance' | 'Sports & Fitness' | 'Debate & Literature' | 'Entrepreneurship';
  memberCount: number;
  icon: string;
  coverImage: string;
  isMember?: boolean;
  leaderName: string;
}

export type ActiveTab =
  | 'home'
  | 'explore'
  | 'messages'
  | 'notifications'
  | 'my-college'
  | 'profile'
  | 'events'
  | 'groups'
  | 'bookmarks'
  | 'settings';

export interface SendOtpPayload {
  channel: 'email' | 'whatsapp';
  destination: string; // email address or phone number in +91... format
  purpose: 'signup' | 'forgot_password' | 'security_login';
}

export interface VerifyOtpPayload {
  channel: 'email' | 'whatsapp';
  destination: string;
  code: string;
  purpose: 'signup' | 'forgot_password' | 'security_login';
}

export interface SystemConfigStatus {
  supabaseConnected: boolean;
  databaseConnected: boolean;
  storageConnected: boolean;
  realtimeConnected: boolean;
  emailProviderConfigured: boolean;
  emailProviderType: string;
  whatsappProviderConfigured: boolean;
  whatsappStatus: 'Configured' | 'Configuration Required';
  whatsappSenderApproved: boolean;
  productionDomainConfigured: boolean;
  httpsActive: boolean;
  environment: 'development' | 'production' | 'preview';
}

