import React from 'react';
import Link from 'next/link';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { ArrowLeft, ShieldCheck, CheckCircle2, RotateCcw, Mail } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service, Cancellation & Refund Policy | Trajetta',
  description:
    'Learn about Trajetta’s transparent 1-click cancellation policy, 7-day money-back guarantee, and terms of service.',
  alternates: {
    canonical: 'https://trajettacompany.com.br/en/terms',
    languages: {
      en: 'https://trajettacompany.com.br/en/terms',
      'pt-BR': 'https://trajettacompany.com.br/termos',
      'x-default': 'https://trajettacompany.com.br/termos',
    },
  },
};

export default function EnglishTermsPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-white/8">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 text-xs text-[#8E9499] hover:text-[#F2F1ED] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
          <TrajettaLogo size={28} showWordmark />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/20 text-[#B8FF00] text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Complete Transparency & Consumer Rights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED]">
            Terms of Service, Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-[#8E9499]">
            Last updated: October 2026 • Trajetta Company
          </p>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>1-Click Cancellation</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Directly in your dashboard under Settings. No phone calls, no retention friction.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <RotateCcw size={14} />
              <span>7-Day Money-Back Guarantee</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Full and unconditional refund within 7 days of any charge upon request.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <Mail size={14} />
              <span>Automated Invoices & Receipts</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Official Stripe PDF invoices and receipts delivered to your email address each cycle.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#C9CDD1] leading-relaxed">
          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              1. Subscription Cancellation Policy
            </h2>
            <p>
              At Trajetta, we believe in building long-term relationships based on genuine value. You retain full autonomy to manage or cancel your subscription at any time.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#8E9499]">
              <li><strong>How to cancel:</strong> Go to <em>Settings (You) &gt; Subscription & Billing &gt; Cancel Subscription</em> with 1 click directly in the app.</li>
              <li><strong>Cancellation effect:</strong> No future automatic renewals or charges will occur on your card.</li>
              <li><strong>Access retention:</strong> Your access to Trajetta Pro remains fully active until the end of the paid billing cycle.</li>
              <li><strong>Data ownership:</strong> Your goals, habits, and reflections are never deleted. You can export your full data in JSON/CSV at any time.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              2. 7-Day Money-Back Guarantee
            </h2>
            <p>
              You have up to <strong>7 calendar days</strong> from the date of any initial subscription charge to request a <strong>100% full refund</strong>.
            </p>
            <p className="text-xs text-[#8E9499]">
              To claim your refund, email <strong>contato@trajettacompany.com.br</strong> with your account email address. Refunds are returned directly to the payment method used via Stripe.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              3. 3-Day Free Trial
            </h2>
            <p>
              Trial plans include 3 days of unrestricted access to Trajetta Pro without upfront payment. If you cancel before day 3, zero charges apply.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              4. Official Support
            </h2>
            <p>
              Billing inquiries, second-copy invoices, or technical questions can be directed to:
            </p>
            <div className="p-4 rounded-xl bg-[#14181F] border border-white/8 text-xs space-y-1">
              <p><strong>Trajetta Company</strong></p>
              <p>Email: <a href="mailto:contato@trajettacompany.com.br" className="text-[#B8FF00] hover:underline">contato@trajettacompany.com.br</a></p>
              <p>Payment Processor: Stripe Payments Brasil Ltda. / Stripe Inc.</p>
            </div>
          </section>
        </div>

        {/* Back CTA */}
        <div className="pt-6 text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B8FF00] text-[#060709] font-bold text-xs hover:bg-[#c6ff24] transition-all"
          >
            <span>Open Trajetta App</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
