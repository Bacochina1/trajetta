export type LifeArea = 'corpo' | 'dinheiro' | 'carreira' | 'vida';

export type AreaConfig = {
  id: LifeArea;
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  examples: string;
};

export type GoalStatus = 'active' | 'completed' | 'paused';

export type GoalMilestone = {
  id: string;
  title: string;
  targetValue?: string;
  completed: boolean;
  order: number;
};

export type GoalAction = {
  id: string;
  title: string;
  dayOfWeek?: number;
  completedToday?: boolean;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  lifeArea: LifeArea;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  progress: number;
  whyItMatters: string;
  milestones: GoalMilestone[];
  actions: GoalAction[];
};

export type Habit = {
  id: string;
  title: string;
  lifeArea: LifeArea;
  frequencyPerWeek: number;
  daysCompletedThisWeek: number[]; // 0 = Domingo, 1 = Segunda, ... 6 = Sabado
  targetDescription: string;
  streakWeeks: number;
  iconName: string;
};

export type JourneyStatus = 'active' | 'completed';

export type Journey = {
  id: string;
  title: string;
  description: string;
  lifeArea: LifeArea;
  totalDays: number;
  currentDay: number;
  slipDays: number;
  status: JourneyStatus;
  badgeText: string;
};

export type WeeklyPlan = {
  id: string;
  weekNumber: number;
  year: number;
  northStarGoal: string;
  areaPriorities: Record<LifeArea, string>;
  isCompleted: boolean;
  perceivedCapacity?: 'leve' | 'normal' | 'intensa';
  weekIntention?: string;
};

export type WeeklyReview = {
  id: string;
  weekNumber: number;
  year: number;
  date: string;
  advancedGoalsCount: number;
  habitsRate: number;
  topArea: LifeArea;
  neglectedArea: LifeArea;
  reflectionWhatAdvanced: string;
  reflectionWhatDistracted: string;
  reflectionProudOf: string;
  reflectionNextWeekAdjustment: string;
  aiReflection: string;
};

export type TimelineEventType = 
  | 'goal_created' 
  | 'goal_completed' 
  | 'milestone' 
  | 'journey_completed' 
  | 'achievement' 
  | 'life_event' 
  | 'habit_streak';

export type TimelineEvent = {
  id: string;
  date: string;
  year: number;
  month: string;
  title: string;
  description: string;
  type: TimelineEventType;
  lifeArea?: LifeArea;
  tag?: string;
};

export type LifeScoreArea = {
  score: number;
  status: 'attention' | 'evolving' | 'strong';
  label: string;
  trend: 'up' | 'stable' | 'down';
  insight: string;
};

export type LifeScoreData = Record<LifeArea, LifeScoreArea>;

export type UserProfile = {
  name: string;
  email?: string;
  avatar?: string;
  avatarText: string;
  role: string;
  title?: string;
  isOnboarded: boolean;
  target12Months: string;
  primaryFocusArea: LifeArea;
  completedWeeksCount: number;
  timezone?: string;
  subscriptionPlan?: 'trial' | 'pro_monthly' | 'pro_annual' | 'founding';
  trialDaysRemaining?: number;
};

export type ActiveView = 
  | 'hoje'
  | 'semana'
  | 'metas'
  | 'habitos'
  | 'jornadas'
  | 'review'
  | 'timeline'
  | 'lifescore'
  | 'ia'
  | 'voce';

