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
import { Skeleton, TodayViewSkeleton } from '@/components/ui/Skeleton';

export default function TrajettaAppPage() {
  const {
    activeView,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    authLoading,
    login,
    setUserProfile,
  } = useTrajetta();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Check for Stripe checkout return
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setUserProfile({
              subscriptionPlan: data.plan || 'pro_annual',
              trialDaysRemaining: 365,
            });
            if (data.user) {
              login(data.user);
            }
            setPaymentNotice('Sua assinatura Trajetta Pro foi ativada com sucesso! Aproveite.');
            import('canvas-confetti').then((confettiModule) => {
              const runConfetti = confettiModule.default || confettiModule;
              runConfetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#B8FF00', '#F2F1ED', '#38EF7D'],
              });
            }).catch(() => {});
          }
        })
        .catch((e) => console.error('Verification error:', e))
        .finally(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => setPaymentNotice(null), 8000);
        });
    } else if (paymentStatus === 'cancelled') {
      setPaymentNotice('O processo de checkout foi cancelado. Você pode assinar quando desejar.');
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setPaymentNotice(null), 5000);
    }
  }, [setUserProfile, login]);

  // While checking session: render full Calm Power layout skeleton instead of empty screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F10] text-[#F2F1ED] flex">
        {/* Mock Sidebar Skeleton */}
        <div className="hidden md:flex w-[250px] bg-[#111315] border-r border-white/8 flex-col p-5 space-y-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 pb-5 border-b border-white/8">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="space-y-2 pt-4 flex-1">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-xl mt-auto" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 border-b border-white/8 px-6 flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="flex-1 p-3 sm:p-8 max-w-6xl w-full mx-auto">
            <TodayViewSkeleton />
          </div>
        </div>
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
        <main className="flex-1 px-3 py-4 sm:p-8 max-w-6xl w-full mx-auto pb-28 md:pb-12 space-y-4">
          {paymentNotice && (
            <div className="p-4 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/40 text-[#B8FF00] text-xs font-semibold flex items-center justify-between gap-3 shadow-lg">
              <span>{paymentNotice}</span>
              <button
                type="button"
                onClick={() => setPaymentNotice(null)}
                className="text-white/60 hover:text-white text-xs px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>
          )}
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
