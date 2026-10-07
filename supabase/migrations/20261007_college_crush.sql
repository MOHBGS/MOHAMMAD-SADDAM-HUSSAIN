-- ==============================================================================
-- COLLEGE CRUSH - PRODUCTION SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Tagline: "Good Vibes. Same Campus. Better People. ❤️"
-- Migration: 20261007_college_crush.sql
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. COLLEGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.colleges (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    logo_path TEXT,
    cover_image_path TEXT,
    student_count INTEGER DEFAULT 0,
    established INTEGER,
    description TEXT,
    verified_badge BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. PROFILES TABLE (Linked with auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20), -- Stored in international format e.g. +91XXXXXXXXXX
    college_id VARCHAR(64) REFERENCES public.colleges(id) ON DELETE SET NULL,
    college_name VARCHAR(255),
    course VARCHAR(100) NOT NULL,
    joining_year INTEGER NOT NULL,
    current_year VARCHAR(50) NOT NULL, -- '1st Year', '2nd Year', etc.
    gender VARCHAR(30) DEFAULT 'prefer-not-to-say',
    date_of_birth DATE,
    profile_photo_path TEXT,
    cover_photo_path TEXT,
    bio VARCHAR(250) DEFAULT '',
    interests TEXT[] DEFAULT '{}',
    is_crush_status VARCHAR(50) DEFAULT 'Available',
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    who_can_message VARCHAR(30) DEFAULT 'everyone',
    who_can_follow VARCHAR(30) DEFAULT 'everyone',
    verification_method VARCHAR(20) DEFAULT 'email', -- 'email' or 'whatsapp'
    is_profile_complete BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON public.profiles(college_id);

-- ==============================================================================
-- 3. OTP VERIFICATION AUDIT & METADATA (NO raw OTP values stored!)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.otp_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_reference VARCHAR(255) NOT NULL, -- Hash or masked email/phone
    channel VARCHAR(20) NOT NULL, -- 'email' or 'whatsapp'
    purpose VARCHAR(50) NOT NULL, -- 'signup', 'forgot_password', 'security_login'
    provider_reference VARCHAR(255), -- Twilio Verification SID or SMTP message ID
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    ip_hash VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_events_user_ref ON public.otp_events(user_reference, channel);
CREATE INDEX IF NOT EXISTS idx_otp_events_expires_at ON public.otp_events(expires_at);

-- ==============================================================================
-- 4. POSTS & COMMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(20) DEFAULT 'image', -- 'image' or 'video'
    category VARCHAR(50) DEFAULT 'Campus Life',
    location VARCHAR(100),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- ==============================================================================
-- 5. FOLLOWS / SOCIAL GRAPH
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- ==============================================================================
-- 6. STORIES TABLE (Ephemeral Campus Stories - 24hr expiry)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    media_url TEXT,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image', -- 'image', 'video', 'text'
    caption TEXT,
    text_content TEXT,
    bg_color VARCHAR(100) DEFAULT 'from-pink-500 to-rose-600',
    views_count INTEGER DEFAULT 0,
    visibility VARCHAR(30) DEFAULT 'everyone', -- 'everyone', 'followers', 'close_friends'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_stories_user_id ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON public.stories(expires_at);

CREATE TABLE IF NOT EXISTS public.story_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(story_id, viewer_id)
);

-- ==============================================================================
-- 7. CHAT & PRIVATE MESSAGING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_one UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_two UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message TEXT DEFAULT '',
    last_message_time TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(participant_one, participant_two)
);

CREATE INDEX IF NOT EXISTS idx_conv_p1 ON public.conversations(participant_one);
CREATE INDEX IF NOT EXISTS idx_conv_p2 ON public.conversations(participant_two);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text' or 'image'
    text TEXT DEFAULT '',
    media_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    read_status BOOLEAN DEFAULT false,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);

-- ==============================================================================
-- 8. NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL, -- 'like', 'comment', 'follow', 'crush_match'
    text TEXT NOT NULL,
    target_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Colleges: Read-only for authenticated and public
CREATE POLICY "Colleges are viewable by everyone" 
    ON public.colleges FOR SELECT USING (true);

-- Profiles:
-- Anyone authenticated can view public profiles
CREATE POLICY "Public profiles are viewable by authenticated users" 
    ON public.profiles FOR SELECT TO authenticated USING (true);

-- User can ONLY insert their own profile
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- User can ONLY update their own profile (NEVER someone else's)
CREATE POLICY "Users can update only their own profile" 
    ON public.profiles FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Posts:
CREATE POLICY "Posts viewable by authenticated" 
    ON public.posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own posts" 
    ON public.posts FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" 
    ON public.posts FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" 
    ON public.posts FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

-- Comments & Likes:
CREATE POLICY "Comments viewable by authenticated" 
    ON public.comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create comments" 
    ON public.comments FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view likes" 
    ON public.post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can toggle own likes" 
    ON public.post_likes FOR ALL TO authenticated 
    USING (auth.uid() = user_id);

-- Follows:
CREATE POLICY "Follows viewable by authenticated" 
    ON public.follows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own follows" 
    ON public.follows FOR ALL TO authenticated 
    USING (auth.uid() = follower_id);

-- Stories:
CREATE POLICY "Active stories viewable by authenticated users" 
    ON public.stories FOR SELECT TO authenticated 
    USING (expires_at > NOW());

CREATE POLICY "Users can create own story" 
    ON public.stories FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own story" 
    ON public.stories FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

-- Story Views:
CREATE POLICY "Story owners can see views" 
    ON public.story_views FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.stories 
            WHERE stories.id = story_views.story_id AND stories.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can record own view" 
    ON public.story_views FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = viewer_id);

-- CONVERSATIONS & CHAT PRIVACY (CRITICAL):
-- Only participants can see the conversation
CREATE POLICY "Conversations viewable only by participants" 
    ON public.conversations FOR SELECT TO authenticated 
    USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Conversations insertable by participants" 
    ON public.conversations FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

-- MESSAGES PRIVACY:
-- Only sender or receiver can see the message
CREATE POLICY "Messages viewable only by sender or receiver" 
    ON public.messages FOR SELECT TO authenticated 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Can only send messages as yourself into authorized conversation
CREATE POLICY "Users can only send messages as themselves" 
    ON public.messages FOR INSERT TO authenticated 
    WITH CHECK (
        auth.uid() = sender_id AND 
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())
        )
    );

-- Notifications:
CREATE POLICY "Users can only see their own notifications" 
    ON public.notifications FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification read status" 
    ON public.notifications FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 10. STORAGE BUCKET POLICIES (Supabase Storage)
-- ==============================================================================

-- 1. Avatars Bucket: avatars/{user_id}/...
-- Publicly readable, editable ONLY by avatar owner
-- Policy (avatars):
-- INSERT / UPDATE: (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
-- SELECT: bucket_id = 'avatars'

-- 2. Post Media Bucket: post-media/{user_id}/...
-- Publicly readable by authenticated users, insertable only by owner

-- 3. Story Media Bucket: story-media/{user_id}/...
-- Readable while unexpired, insertable and deletable only by owner

-- 4. Chat Media Bucket: chat-media/{conversation_id}/...
-- STRICT ACCESS: Only participants of conversation_id can read/download chat images!
-- Non-participants cannot view chat media even with the path.
