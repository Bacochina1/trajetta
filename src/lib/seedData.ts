import { Goal, Habit, Journey, LifeScoreData, TimelineEvent, UserProfile, WeeklyPlan } from '@/types';

export const INITIAL_USER: UserProfile = {
  name: '',
  avatarText: 'T',
  role: 'Membro Fundador',
  isOnboarded: false,
  target12Months: '',
  primaryFocusArea: 'corpo',
  completedWeeksCount: 0,
};

// INITIAL DATA IS EMPTY FOR CLEAN ACCOUNTS & PROPER ONBOARDING
export const INITIAL_GOALS: Goal[] = [];
export const INITIAL_HABITS: Habit[] = [];
export const INITIAL_JOURNEYS: Journey[] = [];
export const INITIAL_TIMELINE: TimelineEvent[] = [];

export const INITIAL_WEEKLY_PLAN: WeeklyPlan = {
  id: 'plan-w1',
  weekNumber: 1,
  year: 2026,
  northStarGoal: 'Construir consistência nos primeiros hábitos e manter clareza nas prioridades diárias.',
  areaPriorities: {
    corpo: 'Manter hidratação regular, sono de qualidade e movimento físico.',
    dinheiro: 'Acompanhar despesas diárias e evitar gastos impulsivos.',
    carreira: 'Garantir blocos diários de foco nas prioridades essenciais.',
    vida: 'Desconectar de telas antes de dormir e preservar tempo com quem importa.',
  },
  isCompleted: false,
};

export const INITIAL_LIFE_SCORE: LifeScoreData = {
  corpo: {
    score: 75,
    status: 'evolving',
    label: 'Em evolução',
    trend: 'stable',
    insight: 'Construindo o ritmo inicial de energia, sono e disposição.',
  },
  dinheiro: {
    score: 70,
    status: 'evolving',
    label: 'Em evolução',
    trend: 'stable',
    insight: 'Acompanhando o fluxo financeiro e criando reserva.',
  },
  carreira: {
    score: 75,
    status: 'evolving',
    label: 'Em evolução',
    trend: 'stable',
    insight: 'Foco no progresso e organização das prioridades.',
  },
  vida: {
    score: 70,
    status: 'evolving',
    label: 'Em evolução',
    trend: 'stable',
    insight: 'Equilíbrio e tempo de qualidade no dia a dia.',
  },
};

// DEMO DATA (Used ONLY when user explicitly requests demo preview)
export const DEMO_USER: UserProfile = {
  name: 'Matheus',
  avatarText: 'M',
  role: 'Membro Fundador',
  isOnboarded: true,
  target12Months: 'Alcançar R$ 50k em patrimônio e assumir liderança de produto.',
  primaryFocusArea: 'carreira',
  completedWeeksCount: 14,
};

export const DEMO_GOALS: Goal[] = [
  {
    id: 'goal-demo-1',
    title: 'Reserva & Patrimônio de R$ 50.000',
    description: 'Construir a reserva financeira de segurança em liquidez diária e aportes consistentes.',
    lifeArea: 'dinheiro',
    status: 'active',
    startDate: '2025-11-01',
    targetDate: '2026-12-31',
    progress: 72,
    whyItMatters: 'Ter tranquilidade mental e autonomia para tomar decisões de carreira sem pressão financeira imediata.',
    milestones: [
      { id: 'm1-1', title: 'Primeiros R$ 15.000 acumulados', targetValue: 'R$ 15k', completed: true, order: 1 },
      { id: 'm1-2', title: 'Bater R$ 30.000 em reserva líquida', targetValue: 'R$ 30k', completed: true, order: 2 },
      { id: 'm1-3', title: 'Atingir R$ 40.000 com aportes automáticos mensais', targetValue: 'R$ 40k', completed: true, order: 3 },
      { id: 'm1-4', title: 'Meta final: R$ 50.000 consolidados', targetValue: 'R$ 50k', completed: false, order: 4 },
    ],
    actions: [
      { id: 'a1-1', title: 'Aportar economia da semana', completedToday: false },
    ],
  },
  {
    id: 'goal-demo-2',
    title: 'Transição para Head de Produto',
    description: 'Liderar a estratégia do produto principal e estruturar o time de crescimento.',
    lifeArea: 'carreira',
    status: 'active',
    startDate: '2026-02-01',
    targetDate: '2026-09-30',
    progress: 65,
    whyItMatters: 'Subir de patamar profissional e influenciar a visão executiva.',
    milestones: [
      { id: 'm2-1', title: 'Apresentar plano de produto para diretoria', completed: true, order: 1 },
      { id: 'm2-2', title: 'Concluir mentoria com líderes do setor', completed: true, order: 2 },
      { id: 'm2-3', title: 'Entregar lançamento da nova versão', completed: false, order: 3 },
    ],
    actions: [
      { id: 'a2-1', title: 'Revisar métricas antes da reunião estratégica', completedToday: true },
    ],
  },
];

export const DEMO_HABITS: Habit[] = [
  {
    id: 'habit-demo-1',
    title: 'Treino de Força / Musculação',
    lifeArea: 'corpo',
    frequencyPerWeek: 4,
    daysCompletedThisWeek: [1, 2, 4],
    targetDescription: '4x por semana · 60 min',
    streakWeeks: 9,
    iconName: 'Dumbbell',
  },
  {
    id: 'habit-demo-2',
    title: 'Aporte Financeiro Semanal',
    lifeArea: 'dinheiro',
    frequencyPerWeek: 1,
    daysCompletedThisWeek: [5],
    targetDescription: '1x por semana',
    streakWeeks: 14,
    iconName: 'Coins',
  },
  {
    id: 'habit-demo-3',
    title: 'Bloco de Foco Profundo Sem Notificações',
    lifeArea: 'carreira',
    frequencyPerWeek: 5,
    daysCompletedThisWeek: [1, 2, 3, 4],
    targetDescription: '5x por semana · 90 min',
    streakWeeks: 6,
    iconName: 'Crosshair',
  },
  {
    id: 'habit-demo-4',
    title: 'Leitura de Livro ou Diário Noturno',
    lifeArea: 'vida',
    frequencyPerWeek: 6,
    daysCompletedThisWeek: [1, 2, 3, 5],
    targetDescription: '6x por semana · 20 min',
    streakWeeks: 4,
    iconName: 'BookOpen',
  },
];

export const DEMO_JOURNEYS: Journey[] = [
  {
    id: 'journey-demo-1',
    title: '30 Dias de Movimento Consciente',
    description: 'Prática ininterrupta de atividade física moderada ou intensa todo santo dia.',
    lifeArea: 'corpo',
    totalDays: 30,
    currentDay: 17,
    slipDays: 1,
    status: 'active',
    badgeText: 'Dia 17 de 30 · Trajetória em andamento',
  },
  {
    id: 'journey-demo-2',
    title: '21 Dias Sem Telas na Cama',
    description: 'Deixar o celular na sala após as 22h30 para um descanso fisiológico profundo.',
    lifeArea: 'vida',
    totalDays: 21,
    currentDay: 12,
    slipDays: 0,
    status: 'active',
    badgeText: 'Dia 12 de 21 · Foco impecável',
  },
];

export const DEMO_WEEKLY_PLAN: WeeklyPlan = {
  id: 'plan-demo-w14',
  weekNumber: 14,
  year: 2026,
  northStarGoal: 'Manter a constância do volume de treinos e fechar o plano de produto sem atrasar o sono.',
  areaPriorities: {
    corpo: 'Completar 4 treinos na semana e manter descanso adequado.',
    dinheiro: 'Aportar na reserva líquida e evitar delivery durante a semana.',
    carreira: 'Finalizar o documento de estratégia de produto para alinhamento.',
    vida: 'Jantar com a família na sexta-feira com atenção plena.',
  },
  isCompleted: false,
};

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 't-demo-1',
    date: '2024-03-15',
    year: 2024,
    month: 'Março',
    title: 'Primeiro dia de musculação e decisão de mudança',
    description: 'Iniciei os treinos e decidi que a saúde seria prioridade não negociável.',
    type: 'habit_streak',
    lifeArea: 'corpo',
    tag: 'Começo',
  },
  {
    id: 't-demo-2',
    date: '2024-08-20',
    year: 2024,
    month: 'Agosto',
    title: 'Primeiros R$ 10.000 investidos',
    description: 'Bati a primeira meta financeira e criei a conta de investimentos dedicada.',
    type: 'milestone',
    lifeArea: 'dinheiro',
    tag: 'Marco Financeiro',
  },
  {
    id: 't-demo-3',
    date: '2025-02-01',
    year: 2025,
    month: 'Fevereiro',
    title: 'Promoção para Gerente de Produto Sênior',
    description: 'Assumi a liderança da tribo de experiência e novos canais.',
    type: 'achievement',
    lifeArea: 'carreira',
    tag: 'Carreira',
  },
];
