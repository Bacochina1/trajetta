import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export type PlanKey = 'monthly' | 'annual' | 'founding';

export const STRIPE_PLANS = {
  monthly: {
    id: 'monthly' as PlanKey,
    name: 'Trajetta Pro Mensal',
    priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_1UMKvSEEJcnNYjeXXDRH9QoK',
    amount: 2990, // R$ 29,90
    interval: 'month' as const,
    trialDays: 14,
    subscriptionPlanKey: 'pro_monthly' as const,
  },
  annual: {
    id: 'annual' as PlanKey,
    name: 'Trajetta Pro Anual',
    priceId: process.env.STRIPE_PRICE_ANNUAL || 'price_1UMKvTEEJcnNYjeXTIlMynOF',
    amount: 23990, // R$ 239,90
    interval: 'year' as const,
    trialDays: 14,
    subscriptionPlanKey: 'pro_annual' as const,
  },
  founding: {
    id: 'founding' as PlanKey,
    name: 'Trajetta Membro Fundador',
    priceId: process.env.STRIPE_PRICE_FOUNDING || 'price_1UMKvTEEJcnNYjeXfWaO5Q24',
    amount: 14900, // R$ 149,00
    interval: 'year' as const,
    trialDays: 0,
    subscriptionPlanKey: 'founding' as const,
  },
};
