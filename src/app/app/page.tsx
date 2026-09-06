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

export default function TrajettaAppPage() {
  const { activeView, isAuthModalOpen, setIsAuthModalOpen } = useTrajetta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

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

      {/* Global Modals */}
      <WeeklyReviewModal />
      <OnboardingModal />
      <NewGoalModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
    </div>
  );
}

