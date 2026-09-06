'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveView,
  Goal,
  Habit,
  Journey,
  LifeArea,
  LifeScoreData,
  TimelineEvent,
  UserProfile,
  WeeklyPlan,
  WeeklyReview,
} from '@/types';
import {
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_JOURNEYS,
  INITIAL_LIFE_SCORE,
  INITIAL_TIMELINE,
  INITIAL_USER,
  INITIAL_WEEKLY_PLAN,
  DEMO_USER,
  DEMO_GOALS,
  DEMO_HABITS,
  DEMO_JOURNEYS,
  DEMO_WEEKLY_PLAN,
  DEMO_TIMELINE,
} from '@/lib/seedData';

type TrajettaContextType = {
  user: UserProfile;
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  goals: Goal[];
  habits: Habit[];
  journeys: Journey[];
  weeklyPlan: WeeklyPlan;
  weeklyReviews: WeeklyReview[];
  timeline: TimelineEvent[];
  lifeScore: LifeScoreData;
  activeView: ActiveView;
  isReviewModalOpen: boolean;
  isOnboardingOpen: boolean;
  isNewGoalModalOpen: boolean;
  isAuthModalOpen: boolean;
  isAiPopupOpen: boolean;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (userData?: any) => void;
  logout: () => Promise<void>;
  setActiveView: (view: ActiveView) => void;
  toggleHabitToday: (habitId: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  toggleGoalActionToday: (goalId: string, actionId: string) => void;
  updateGoalProgress: (goalId: string, newProgress: number) => void;
  createGoal: (goalData: Partial<Goal>) => void;
  updateGoal: (goalId: string, patch: Partial<Goal>) => void;
  deleteGoal: (goalId: string) => void;
  createHabit: (habitData: Partial<Habit>) => void;
  updateHabit: (habitId: string, patch: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  createJourney: (journeyData: Partial<Journey>) => void;
  incrementJourneyDay: (journeyId: string) => void;
  recordJourneySlip: (journeyId: string) => void;
  updateWeeklyPriority: (area: LifeArea, text: string) => void;
  completeCurrentWeek: () => void;
  submitWeeklyReview: (reviewData: Partial<WeeklyReview>) => void;
  addTimelineEvent: (eventData: Partial<TimelineEvent>) => void;
  completeOnboarding: (data: {
    name: string;
    target12Months: string;
    primaryArea: LifeArea;
    selectedHabits?: { title: string; lifeArea: LifeArea; frequencyPerWeek: number }[];
    firstGoalTitle?: string;
    firstGoalArea?: LifeArea;
    firstGoalTargetDate?: string;
    firstGoalMilestones?: string[];
  }) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsNewGoalModalOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsAiPopupOpen: (open: boolean) => void;
  resetToDemoData: () => void;
  resetToZero: () => void;
};

const TrajettaContext = createContext<TrajettaContextType | undefined>(undefined);

export function TrajettaProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [journeys, setJourneys] = useState<Journey[]>(INITIAL_JOURNEYS);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(INITIAL_WEEKLY_PLAN);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [lifeScore, setLifeScore] = useState<LifeScoreData>(INITIAL_LIFE_SCORE);
  const [activeView, setActiveView] = useState<ActiveView>('hoje');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAiPopupOpen, setIsAiPopupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Check backend session on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.ok && data.user) {
          setIsAuthenticated(true);
          localStorage.setItem('trajetta_auth_session', 'true');
          setUser((prev) => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            title: data.user.role === 'ADMIN' ? 'Membro Fundador (Admin)' : 'Explorador',
            avatar: data.user.avatar || prev.avatar,
            role: data.user.role || prev.role || 'USER',
          }));
        } else {
          // Backend expressly rejected or has no active session: strictly lock out!
          localStorage.removeItem('trajetta_auth_session');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // In case of network error, only allow if previously verified
        const localAuth = localStorage.getItem('trajetta_auth_session');
        setIsAuthenticated(localAuth === 'true');
      })
      .finally(() => {
        if (isMounted) {
          setAuthLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData?: any) => {
    if (userData) {
      setUser((prev) => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        title: userData.role === 'ADMIN' ? 'Membro Fundador (Admin)' : (prev.title || 'Explorador'),
        avatar: userData.avatar || prev.avatar,
        role: userData.role || 'USER',
      }));
    }
    localStorage.setItem('trajetta_auth_session', 'true');
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('trajetta_auth_session');
    setIsAuthenticated(false);
  };

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      // Purge legacy storage key if present
      if (typeof window !== 'undefined') {
        localStorage.removeItem('trajetta_store_v1');
      }

      const saved = localStorage.getItem('trajetta_store_v2');
      if (saved) {
        const parsed = JSON.parse(saved);

        // Detect if user has legacy marathon demo data or is not onboarded
        const hasLegacyMarathon =
          Array.isArray(parsed.goals) &&
          parsed.goals.some(
            (g: any) =>
              g.id === 'goal-1' ||
              (typeof g.title === 'string' &&
                (g.title.toLowerCase().includes('maratona') ||
                 g.title.toLowerCase().includes('21 km') ||
                 g.title.toLowerCase().includes('21km')))
          );

        if (hasLegacyMarathon || !parsed.user?.isOnboarded) {
          // Clear legacy runner data and enforce fresh clean onboarding
          setGoals([]);
          setHabits([]);
          setJourneys([]);
          setTimeline([]);
          setUser((prev) => ({
            ...prev,
            name: parsed.user?.name || prev.name || '',
            isOnboarded: false,
          }));
          setIsOnboardingOpen(true);
        } else {
          if (parsed.user) setUser(parsed.user);
          if (parsed.goals) setGoals(parsed.goals);
          if (parsed.habits) setHabits(parsed.habits);
          if (parsed.journeys) setJourneys(parsed.journeys);
          if (parsed.weeklyPlan) setWeeklyPlan(parsed.weeklyPlan);
          if (parsed.weeklyReviews) setWeeklyReviews(parsed.weeklyReviews);
          if (parsed.timeline) setTimeline(parsed.timeline);
          if (parsed.lifeScore) setLifeScore(parsed.lifeScore);
        }
      } else {
        // No v2 saved state in this browser: trigger fresh onboarding with empty data!
        setGoals([]);
        setHabits([]);
        setJourneys([]);
        setTimeline([]);
        setIsOnboardingOpen(true);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
      setGoals([]);
      setHabits([]);
      setJourneys([]);
      setTimeline([]);
      setIsOnboardingOpen(true);
    }
    setMounted(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!mounted) return;
    try {
      const dataToSave = {
        user,
        goals,
        habits,
        journeys,
        weeklyPlan,
        weeklyReviews,
        timeline,
        lifeScore,
      };
      localStorage.setItem('trajetta_store_v2', JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [mounted, user, goals, habits, journeys, weeklyPlan, weeklyReviews, timeline, lifeScore]);

  // Current day index in JS: 0=Domingo, 1=Segunda, etc.
  const todayIndex = new Date().getDay();

  const toggleHabitToday = (habitId: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const exists = h.daysCompletedThisWeek.includes(todayIndex);
        const newDays = exists
          ? h.daysCompletedThisWeek.filter(d => d !== todayIndex)
          : [...h.daysCompletedThisWeek, todayIndex];
        return {
          ...h,
          daysCompletedThisWeek: newDays,
        };
      })
    );
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const total = updatedMilestones.length;
        const done = updatedMilestones.filter(m => m.completed).length;
        const newProgress = total > 0 ? Math.round((done / total) * 100) : g.progress;
        return {
          ...g,
          milestones: updatedMilestones,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'active',
        };
      })
    );
  };

  const toggleGoalActionToday = (goalId: string, actionId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          actions: g.actions.map(a =>
            a.id === actionId ? { ...a, completedToday: !a.completedToday } : a
          ),
        };
      })
    );
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, newProgress)) } : g))
    );
  };

  const createGoal = (goalData: Partial<Goal>) => {
    const newId = 'goal-' + Date.now();
    const newGoal: Goal = {
      id: newId,
      title: goalData.title || 'Nova Meta',
      description: goalData.description || '',
      lifeArea: goalData.lifeArea || 'corpo',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: goalData.targetDate || '2026-12-31',
      progress: 0,
      whyItMatters: goalData.whyItMatters || 'Porque faz parte da trajetória que quero construir.',
      milestones: goalData.milestones || [
        { id: newId + '-m1', title: 'Primeiro marco de avanço', completed: false, order: 1 },
        { id: newId + '-m2', title: 'Segundo marco de consolidação', completed: false, order: 2 },
      ],
      actions: goalData.actions || [
        { id: newId + '-a1', title: 'Primeira ação de consistência', completedToday: false },
      ],
    };
    setGoals(prev => [newGoal, ...prev]);

    // Log timeline event
    addTimelineEvent({
      title: `Nova meta definida: ${newGoal.title}`,
      description: newGoal.whyItMatters,
      type: 'goal_created',
      lifeArea: newGoal.lifeArea,
      tag: 'Meta Criada',
    });
  };

  const updateGoal = (goalId: string, patch: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === goalId ? { ...g, ...patch } : g)));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const createHabit = (habitData: Partial<Habit>) => {
    const newId = 'habit-' + Date.now();
    const newHabit: Habit = {
      id: newId,
      title: habitData.title || 'Novo Hábito',
      lifeArea: habitData.lifeArea || 'corpo',
      frequencyPerWeek: habitData.frequencyPerWeek || 4,
      daysCompletedThisWeek: [],
      targetDescription: habitData.targetDescription || `${habitData.frequencyPerWeek || 4}x por semana`,
      streakWeeks: 0,
      iconName: habitData.iconName || 'CheckCircle',
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (habitId: string, patch: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === habitId ? { ...h, ...patch } : h)));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  };

  const createJourney = (journeyData: Partial<Journey>) => {
    const total = journeyData.totalDays || 21;
    const newJourney: Journey = {
      id: 'journey-' + Date.now(),
      title: journeyData.title || 'Nova Jornada',
      description: journeyData.description || '',
      lifeArea: journeyData.lifeArea || 'corpo',
      totalDays: total,
      currentDay: 1,
      slipDays: 0,
      status: 'active',
      badgeText: `Dia 1 de ${total} · Em andamento`,
    };
    setJourneys(prev => [...prev, newJourney]);
  };

  const incrementJourneyDay = (journeyId: string) => {
    setJourneys(prev =>
      prev.map(j => {
        if (j.id !== journeyId) return j;
        const nextDay = Math.min(j.totalDays, j.currentDay + 1);
        const isComplete = nextDay >= j.totalDays;
        return {
          ...j,
          currentDay: nextDay,
          status: isComplete ? 'completed' : 'active',
        };
      })
    );
  };

  const recordJourneySlip = (journeyId: string) => {
    setJourneys(prev =>
      prev.map(j => {
        if (j.id !== journeyId) return j;
        return {
          ...j,
          slipDays: j.slipDays + 1,
        };
      })
    );
  };

  const updateWeeklyPriority = (area: LifeArea, text: string) => {
    setWeeklyPlan(prev => ({
      ...prev,
      areaPriorities: {
        ...prev.areaPriorities,
        [area]: text,
      },
    }));
  };

  const completeCurrentWeek = () => {
    setUser(prev => ({
      ...prev,
      completedWeeksCount: prev.completedWeeksCount + 1,
    }));
    setWeeklyPlan(prev => ({ ...prev, isCompleted: true }));

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B8FF00', '#58D6A7', '#A98CF7', '#F08A76'],
      });
    } catch (e) {
      // Ignora se indisponível
    }

    // Add to timeline
    addTimelineEvent({
      title: `Semana ${weeklyPlan.weekNumber} Concluída!`,
      description: `Você fechou sua ${user.completedWeeksCount + 1}ª semana de evolução contínua na Trajetta.`,
      type: 'achievement',
      lifeArea: user.primaryFocusArea,
      tag: 'Semana Concluída',
    });
  };

  const submitWeeklyReview = (reviewData: Partial<WeeklyReview>) => {
    const newReview: WeeklyReview = {
      id: 'rev-' + Date.now(),
      weekNumber: weeklyPlan.weekNumber,
      year: weeklyPlan.year,
      date: new Date().toISOString().split('T')[0],
      advancedGoalsCount: reviewData.advancedGoalsCount ?? 3,
      habitsRate: reviewData.habitsRate ?? 85,
      topArea: reviewData.topArea ?? 'corpo',
      neglectedArea: reviewData.neglectedArea ?? 'dinheiro',
      reflectionWhatAdvanced: reviewData.reflectionWhatAdvanced || '',
      reflectionWhatDistracted: reviewData.reflectionWhatDistracted || '',
      reflectionProudOf: reviewData.reflectionProudOf || '',
      reflectionNextWeekAdjustment: reviewData.reflectionNextWeekAdjustment || '',
      aiReflection:
        reviewData.aiReflection ||
        `Sua reflexão da semana ${weeklyPlan.weekNumber} foi consolidada com sucesso. O ponto central é sustentar os hábitos fundamentais com calma e proteger os momentos de recuperação.`,
    };
    setWeeklyReviews(prev => [newReview, ...prev]);
    completeCurrentWeek();
  };

  const addTimelineEvent = (eventData: Partial<TimelineEvent>) => {
    const now = new Date();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const newEvent: TimelineEvent = {
      id: 't-' + Date.now(),
      date: now.toISOString().split('T')[0],
      year: now.getFullYear(),
      month: months[now.getMonth()],
      title: eventData.title || 'Marco de Evolução',
      description: eventData.description || '',
      type: eventData.type || 'achievement',
      lifeArea: eventData.lifeArea || 'corpo',
      tag: eventData.tag || 'Registro',
    };
    setTimeline(prev => [newEvent, ...prev]);
  };

  const completeOnboarding = (data: {
    name: string;
    target12Months: string;
    primaryArea: LifeArea;
    selectedHabits?: { title: string; lifeArea: LifeArea; frequencyPerWeek: number }[];
    firstGoalTitle?: string;
    firstGoalArea?: LifeArea;
    firstGoalTargetDate?: string;
    firstGoalMilestones?: string[];
  }) => {
    const cleanedName = data.name.trim() || 'Explorador';
    const updatedUser: UserProfile = {
      ...user,
      name: cleanedName,
      avatarText: cleanedName.charAt(0).toUpperCase(),
      target12Months: data.target12Months.trim(),
      primaryFocusArea: data.primaryArea,
      isOnboarded: true,
      completedWeeksCount: 0,
    };
    setUser(updatedUser);

    // Replace goals with the user's real goal if provided
    const newGoals: Goal[] = [];
    if (data.firstGoalTitle && data.firstGoalTitle.trim()) {
      const gId = 'goal-' + Date.now();
      const milestonesList = (data.firstGoalMilestones && data.firstGoalMilestones.length > 0)
        ? data.firstGoalMilestones.map((m, idx) => ({
            id: `${gId}-m${idx + 1}`,
            title: m,
            completed: false,
            order: idx + 1,
          }))
        : [
            { id: `${gId}-m1`, title: 'Primeiro avanço mensurável', completed: false, order: 1 },
            { id: `${gId}-m2`, title: 'Consolidação e consistência', completed: false, order: 2 },
          ];

      newGoals.push({
        id: gId,
        title: data.firstGoalTitle.trim(),
        description: data.target12Months ? `Meta ligada ao seu alvo de 12 meses: ${data.target12Months}` : '',
        lifeArea: data.firstGoalArea || data.primaryArea,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: data.firstGoalTargetDate || '2026-12-31',
        progress: 0,
        whyItMatters: data.target12Months || 'Importante para a minha trajetória pessoal.',
        milestones: milestonesList,
        actions: [
          { id: `${gId}-a1`, title: `Dar o primeiro passo em ${data.firstGoalTitle.trim()}`, completedToday: false },
        ],
      });
    }
    setGoals(newGoals);

    // Replace habits with the user's selected habits
    const newHabits: Habit[] = [];
    if (data.selectedHabits && data.selectedHabits.length > 0) {
      data.selectedHabits.forEach((h, idx) => {
        newHabits.push({
          id: 'habit-' + (Date.now() + idx),
          title: h.title,
          lifeArea: h.lifeArea,
          frequencyPerWeek: h.frequencyPerWeek || 4,
          daysCompletedThisWeek: [],
          targetDescription: `${h.frequencyPerWeek || 4}x por semana`,
          streakWeeks: 0,
          iconName: 'CheckCircle',
        });
      });
    }
    setHabits(newHabits);

    // Initial starter journey for focus
    setJourneys([
      {
        id: 'journey-' + Date.now(),
        title: '21 Dias de Foco & Construção',
        description: 'Construir consistência nos seus novos hábitos sem abrir mão do descanso.',
        lifeArea: data.primaryArea,
        totalDays: 21,
        currentDay: 1,
        slipDays: 0,
        status: 'active',
        badgeText: 'Dia 1 de 21 · Jornada Iniciada',
      },
    ]);

    // Initial timeline event
    const now = new Date();
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    setTimeline([
      {
        id: 't-' + Date.now(),
        date: now.toISOString().split('T')[0],
        year: now.getFullYear(),
        month: months[now.getMonth()],
        title: `Trajetória Iniciada: ${cleanedName}`,
        description: data.target12Months ? `Alvo 12 meses: "${data.target12Months}"` : 'Conta criada e onboarding configurado com sucesso.',
        type: 'milestone',
        lifeArea: data.primaryArea,
        tag: 'Boas-vindas',
      },
    ]);

    // Update weekly plan intention
    setWeeklyPlan(prev => ({
      ...prev,
      northStarGoal: data.target12Months
        ? `Foco: Avançar rumo a "${data.target12Months.slice(0, 70)}"`
        : 'Construir consistência nos primeiros hábitos diários.',
    }));

    setIsOnboardingOpen(false);
  };

  const resetToZero = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trajetta_store_v2');
      localStorage.removeItem('trajetta_store_v1');
    }
    const freshUser: UserProfile = {
      name: '',
      avatarText: 'T',
      role: 'Membro Fundador',
      isOnboarded: false,
      target12Months: '',
      primaryFocusArea: 'corpo',
      completedWeeksCount: 0,
    };
    setUser(freshUser);
    setGoals([]);
    setHabits([]);
    setJourneys([]);
    setWeeklyPlan(INITIAL_WEEKLY_PLAN);
    setWeeklyReviews([]);
    setTimeline([]);
    setLifeScore(INITIAL_LIFE_SCORE);
    setIsOnboardingOpen(true);
  };

  const resetToDemoData = () => {
    setUser(DEMO_USER);
    setGoals(DEMO_GOALS);
    setHabits(DEMO_HABITS);
    setJourneys(DEMO_JOURNEYS);
    setWeeklyPlan(DEMO_WEEKLY_PLAN);
    setWeeklyReviews([]);
    setTimeline(DEMO_TIMELINE);
    setLifeScore(INITIAL_LIFE_SCORE);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('trajetta_store_v2');
      localStorage.removeItem('trajetta_store_v1');
    }
  };

  const value = useMemo(
    () => ({
      user,
      goals,
      habits,
      journeys,
      weeklyPlan,
      weeklyReviews,
      timeline,
      lifeScore,
      activeView,
      isReviewModalOpen,
      isOnboardingOpen,
      isNewGoalModalOpen,
      isAuthModalOpen,
      userProfile: user,
      setUserProfile: (patch: Partial<UserProfile>) => setUser((prev) => ({ ...prev, ...patch })),
      setActiveView,
      toggleHabitToday,
      toggleGoalMilestone,
      toggleGoalActionToday,
      updateGoalProgress,
      createGoal,
      updateGoal,
      deleteGoal,
      createHabit,
      updateHabit,
      deleteHabit,
      createJourney,
      incrementJourneyDay,
      recordJourneySlip,
      updateWeeklyPriority,
      completeCurrentWeek,
      submitWeeklyReview,
      addTimelineEvent,
      completeOnboarding,
      setIsReviewModalOpen,
      setIsOnboardingOpen,
      setIsNewGoalModalOpen,
      setIsAuthModalOpen,
      isAiPopupOpen,
      setIsAiPopupOpen,
      isAuthenticated,
      authLoading,
      login,
      logout,
      resetToDemoData,
      resetToZero,
    }),
    [
      user,
      goals,
      habits,
      journeys,
      weeklyPlan,
      weeklyReviews,
      timeline,
      lifeScore,
      activeView,
      isReviewModalOpen,
      isOnboardingOpen,
      isNewGoalModalOpen,
      isAuthModalOpen,
      isAiPopupOpen,
      isAuthenticated,
      authLoading,
    ]
  );

  return <TrajettaContext.Provider value={value}>{children}</TrajettaContext.Provider>;
}

export function useTrajetta() {
  const context = useContext(TrajettaContext);
  if (!context) {
    throw new Error('useTrajetta must be used within a TrajettaProvider');
  }
  return context;
}
