import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { Sidebar } from './components/common/Sidebar';
import { RightSidebar } from './components/common/RightSidebar';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';

// Pages
import { HomeFeed } from './components/feed/HomeFeed';
import { ExplorePage } from './components/explore/ExplorePage';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { MyCollegePage } from './components/mycollege/MyCollegePage';
import { MessagesPage } from './components/messages/MessagesPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { EventsPage } from './components/events/EventsPage';
import { GroupsPage } from './components/groups/GroupsPage';
import { BookmarksPage } from './components/bookmarks/BookmarksPage';
import { SettingsPage } from './components/settings/SettingsPage';

// Modals
import { LoginModal } from './components/auth/LoginModal';
import { SignUpModal } from './components/auth/SignUpModal';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { StoryViewerModal } from './components/feed/StoryViewerModal';

const AppContent: React.FC = () => {
  const { isAuthenticated, showLanding, activeTab } = useApp();

  if (!isAuthenticated || showLanding) {
    return (
      <>
        <LandingPage />
        <LoginModal />
        <SignUpModal />
        <OnboardingFlow />
        <ForgotPasswordModal />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeFeed />;
      case 'explore':
        return <ExplorePage />;
      case 'my-college':
        return <MyCollegePage />;
      case 'messages':
        return <MessagesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'events':
        return <EventsPage />;
      case 'groups':
        return <GroupsPage />;
      case 'bookmarks':
        return <BookmarksPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomeFeed />;
    }
  };

  // Determine whether to show right sidebar
  const showRightSidebar =
    activeTab === 'home' ||
    activeTab === 'explore' ||
    activeTab === 'bookmarks' ||
    activeTab === 'events' ||
    activeTab === 'groups';

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans selection:bg-pink-100 selection:text-pink-700">
      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Desktop Left Sidebar */}
        <Sidebar />

        {/* Center Main Application Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Universal Header */}
          <Header />

          {/* View Container */}
          <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>

        {/* Desktop Right Sidebar for Trends, Suggestions & Campus Events */}
        {showRightSidebar && <RightSidebar />}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <LoginModal />
      <SignUpModal />
      <OnboardingFlow />
      <ForgotPasswordModal />
      <CreatePostModal />
      <StoryViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
