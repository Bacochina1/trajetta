import React from 'react';
import Link from 'next/link';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { ArrowLeft, ShieldCheck, CheckCircle2, RotateCcw, Mail } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso, Cancelamento & Reembolso | Trajetta',
  description: 'Conheça a política transparente de cancelamento, direito de arrependimento e termos de serviço do Trajetta.',
  alternates: {
    canonical: 'https://trajettacompany.com.br/termos',
    languages: {
      'pt-BR': 'https://trajettacompany.com.br/termos',
      en: 'https://trajettacompany.com.br/en/terms',
      'x-default': 'https://trajettacompany.com.br/termos',
    },
  },
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-white/8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#8E9499] hover:text-[#F2F1ED] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao início</span>
          </Link>
          <TrajettaLogo size={28} showWordmark />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/20 text-[#B8FF00] text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Transparência Total & Código de Defesa do Consumidor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED]">
            Termos de Uso, Cancelamento & Reembolso
          </h1>
          <p className="text-sm text-[#8E9499]">
            Última atualização: Outubro de 2026 • Trajetta Company
          </p>
        </div>

        {/* Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Cancelamento em 1 Clique</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Direto no seu painel em Configurações. Sem retenções forçadas ou ligações.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <RotateCcw size={14} />
              <span>7 Dias de Arrependimento</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Reembolso integral e imediato nos primeiros 7 dias após a cobrança, conforme o CDC.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0F10] border border-white/8 space-y-1.5">
            <div className="text-[#B8FF00] font-bold text-xs flex items-center gap-1.5">
              <Mail size={14} />
              <span>Recibos Automáticos</span>
            </div>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Fatura oficial e recibo em PDF emitidos via Stripe e enviados ao seu e-mail a cada ciclo.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#C9CDD1] leading-relaxed">
          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              1. Política de Cancelamento de Assinatura
            </h2>
            <p>
              No Trajetta, acreditamos em relações de longo prazo baseadas na confiança e no valor real entregue à sua vida. Você tem total autonomia para gerenciar ou cancelar sua assinatura a qualquer momento.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#8E9499]">
              <li><strong>Como cancelar:</strong> Acesse seu aplicativo, vá em <em>Configurações (Você) &gt; Assinatura & Faturamento &gt; Cancelar Assinatura</em>, ou utilize o <em>Portal Stripe</em> integrado.</li>
              <li><strong>Efeito do cancelamento:</strong> Nenhuma nova renovação ou cobrança será efetuada em seu cartão de crédito.</li>
              <li><strong>Manutenção do acesso:</strong> Ao cancelar, seu acesso ao Trajetta Pro continuará plenamente ativo até o término do ciclo já contratado (final do mês ou do ano vigente).</li>
              <li><strong>Seus dados continuam seus:</strong> Ao término do plano, seu histórico de metas, hábitos e reflexões não é excluído. Você pode exportar seus dados em JSON/CSV a qualquer instante.</li>
            </ul>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              2. Direito de Arrependimento e Reembolso (CDC art. 49)
            </h2>
            <p>
              Em total conformidade com o artigo 49 do Código de Defesa do Consumidor brasileiro e o Decreto do Comércio Eletrônico (Decreto nº 7.962/2013), você tem até <strong>7 (sete) dias corridos</strong> a partir da data de qualquer cobrança para solicitar o cancelamento com <strong>estorno de 100% do valor pago</strong>.
            </p>
            <p className="text-xs text-[#8E9499]">
              Para solicitar o estorno nos primeiros 7 dias, basta enviar uma mensagem com seu e-mail cadastrado para <strong>contato@trajettacompany.com.br</strong> ou abrir o Portal do Assinante no app. O reembolso é estornado diretamente na fatura do cartão utilizado via Stripe.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              3. Período de Degustação Gratuita (3 Dias de Teste)
            </h2>
            <p>
              Os planos com período de degustação concedem 3 dias de experiência completa do Trajetta Pro sem cobrança antecipada. Você pode experimentar todas as funcionalidades sem risco. Caso cancele antes do 3º dia, nada será debitado.
            </p>
          </section>

          <section className="space-y-3 p-6 rounded-2xl bg-[#0D0F10] border border-white/6">
            <h2 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              4. Contato & Suporte Oficial
            </h2>
            <p>
              Dúvidas sobre faturamento, solicitações de segunda via de recibo ou suporte operacional podem ser encaminhadas diretamente ao nosso time:
            </p>
            <div className="p-4 rounded-xl bg-[#14181F] border border-white/8 text-xs space-y-1">
              <p><strong>Trajetta Company</strong></p>
              <p>E-mail: <a href="mailto:contato@trajettacompany.com.br" className="text-[#B8FF00] hover:underline">contato@trajettacompany.com.br</a></p>
              <p>Plataforma de Pagamentos: Stripe Payments Brasil Ltda.</p>
            </div>
          </section>
        </div>

        {/* Back CTA */}
        <div className="pt-6 text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B8FF00] text-[#060709] font-bold text-xs hover:bg-[#c6ff24] transition-all"
          >
            <span>Acessar o Trajetta App</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
