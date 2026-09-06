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
} from '@/lib/seedData';

type TrajettaContextType = {
  user: UserProfile;
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
  setActiveView: (view: ActiveView) => void;
  toggleHabitToday: (habitId: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;
  toggleGoalActionToday: (goalId: string, actionId: string) => void;
  updateGoalProgress: (goalId: string, newProgress: number) => void;
  createGoal: (goalData: Partial<Goal>) => void;
  createHabit: (habitData: Partial<Habit>) => void;
  incrementJourneyDay: (journeyId: string) => void;
  recordJourneySlip: (journeyId: string) => void;
  updateWeeklyPriority: (area: LifeArea, text: string) => void;
  completeCurrentWeek: () => void;
  submitWeeklyReview: (reviewData: Partial<WeeklyReview>) => void;
  addTimelineEvent: (eventData: Partial<TimelineEvent>) => void;
  completeOnboarding: (data: { name: string; target12Months: string; primaryArea: LifeArea; firstGoalTitle: string }) => void;
  setIsReviewModalOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsNewGoalModalOpen: (open: boolean) => void;
  resetToDemoData: () => void;
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

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('trajetta_store_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.journeys) setJourneys(parsed.journeys);
        if (parsed.weeklyPlan) setWeeklyPlan(parsed.weeklyPlan);
        if (parsed.weeklyReviews) setWeeklyReviews(parsed.weeklyReviews);
        if (parsed.timeline) setTimeline(parsed.timeline);
        if (parsed.lifeScore) setLifeScore(parsed.lifeScore);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
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
      localStorage.setItem('trajetta_store_v1', JSON.stringify(dataToSave));
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

  const createHabit = (habitData: Partial<Habit>) => {
    const newId = 'habit-' + Date.now();
    const newHabit: Habit = {
      id: newId,
      title: habitData.title || 'Novo Hábito',
      lifeArea: habitData.lifeArea || 'corpo',
      frequencyPerWeek: habitData.frequencyPerWeek || 4,
      daysCompletedThisWeek: [],
      targetDescription: habitData.targetDescription || `${habitData.frequencyPerWeek || 4}x por semana`,
      streakWeeks: 1,
      iconName: habitData.iconName || 'CheckCircle',
    };
    setHabits(prev => [...prev, newHabit]);
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
        'Seu ritmo nesta semana mostrou forte consistência no corpo. Você compensou os dias pesados de trabalho mantendo os treinos curtos. Para a próxima semana, priorize reservar o aporte financeiro logo na segunda-feira para não deixar para o final do mês.',
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

  const completeOnboarding = (data: { name: string; target12Months: string; primaryArea: LifeArea; firstGoalTitle: string }) => {
    setUser(prev => ({
      ...prev,
      name: data.name || 'Matheus',
      avatarText: (data.name || 'Matheus').charAt(0).toUpperCase(),
      target12Months: data.target12Months,
      primaryFocusArea: data.primaryArea,
      isOnboarded: true,
    }));

    if (data.firstGoalTitle) {
      createGoal({
        title: data.firstGoalTitle,
        lifeArea: data.primaryArea,
        whyItMatters: data.target12Months,
      });
    }

    setIsOnboardingOpen(false);
  };

  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setGoals(INITIAL_GOALS);
    setHabits(INITIAL_HABITS);
    setJourneys(INITIAL_JOURNEYS);
    setWeeklyPlan(INITIAL_WEEKLY_PLAN);
    setWeeklyReviews([]);
    setTimeline(INITIAL_TIMELINE);
    setLifeScore(INITIAL_LIFE_SCORE);
    localStorage.removeItem('trajetta_store_v1');
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
      setActiveView,
      toggleHabitToday,
      toggleGoalMilestone,
      toggleGoalActionToday,
      updateGoalProgress,
      createGoal,
      createHabit,
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
      resetToDemoData,
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
