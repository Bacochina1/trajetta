export type Locale = 'pt' | 'en';

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  nav: {
    features: string;
    method: string;
    ai: string;
    areas: string;
    pricing: string;
    faq: string;
    accessApp: string;
    startTrial: string;
  };
  hero: {
    badge: string;
    headlineStart: string;
    headlineHighlight: string;
    headlineEnd: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pill1: string;
    pill2: string;
    pill3: string;
    statsUsers: string;
    statsLabel: string;
  };
  pain: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  method: {
    badge: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  areas: {
    badge: string;
    title: string;
    subtitle: string;
    body: string;
    money: string;
    career: string;
    life: string;
  };
  aiSection: {
    badge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    saveBadge: string;
    monthlyPlanName: string;
    monthlyPlanDesc: string;
    annualPlanName: string;
    annualPlanDesc: string;
    foundingTitle: string;
    foundingSubtitle: string;
    ctaTrial: string;
    guaranteeNotice: string;
  };
  app: {
    today: string;
    week: string;
    goals: string;
    habits: string;
    journeys: string;
    timeline: string;
    lifescore: string;
    aiCoach: string;
    profile: string;
    logout: string;
    planWeek: string;
    reviewSunday: string;
    minFloor: string;
    noGuilt: string;
    installApp: string;
    installAppDesc: string;
    language: string;
  };
  pwa: {
    installTitle: string;
    installDesc: string;
    installButton: string;
    dismiss: string;
    iosInstructions: string;
    iosStep1: string;
    iosStep2: string;
    alreadyInstalled: string;
  };
}
