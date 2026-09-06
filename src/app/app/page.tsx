'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { MobileNav } from '@/components/layout/MobileNav';

import { TodayView } from '@/components/views/TodayView';
import { WeekView } from '@/components/views/WeekView';
import { GoalsView } from '@/components/views/GoalsView';
import { HabitsView } from '@/components/views/HabitsView';
import { JourneysView } from '@/components/views/JourneysView';
import { TimelineView } from '@/components/views/TimelineView';
import { LifeScoreView } from '@/components/views/LifeScoreView';
import { AiCoachView } from '@/components/views/AiCoachView';
import { ProfileView } from '@/components/views/ProfileView';

import { WeeklyReviewModal } from '@/components/views/WeeklyReviewModal';
import { OnboardingModal } from '@/components/views/OnboardingModal';
import { NewGoalModal } from '@/components/views/NewGoalModal';
import { AuthModal } from '@/components/views/AuthModal';
import { PaywallModal } from '@/components/views/PaywallModal';
import { AuthGateView } from '@/components/views/AuthGateView';
import { FloatingAiTrigger } from '@/components/ui/FloatingAiTrigger';

export default function TrajettaAppPage() {
  const {
    activeView,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    authLoading,
    login,
  } = useTrajetta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // While checking session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#060709] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#B8FF00] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#8E9499] uppercase tracking-wider">Verificando sessão...</span>
      </div>
    );
  }

  // If user is not authenticated, show the login gate
  if (!isAuthenticated) {
    return <AuthGateView onLoginSuccess={login} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0F10] text-[#F2F1ED] flex">
      {/* Desktop & Mobile Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[250px]">
        {/* Topbar */}
        <Topbar onOpenMobile={() => setMobileMenuOpen(true)} />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-12">
          {activeView === 'hoje' && <TodayView />}
          {activeView === 'semana' && <WeekView />}
          {activeView === 'metas' && <GoalsView />}
          {activeView === 'habitos' && <HabitsView />}
          {activeView === 'jornadas' && <JourneysView />}
          {activeView === 'timeline' && <TimelineView />}
          {activeView === 'lifescore' && <LifeScoreView />}
          {activeView === 'ia' && <AiCoachView />}
          {activeView === 'voce' && <ProfileView onOpenPaywall={() => setIsPaywallOpen(true)} />}
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <MobileNav />

      {/* Floating AI Mascot Trigger Sphere */}
      <FloatingAiTrigger />

      {/* Global Modals */}
      <WeeklyReviewModal />
      <OnboardingModal />
      <NewGoalModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </div>
  );
}
