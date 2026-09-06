'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Send,
  Plus,
  Trash2,
  Phone,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react';

interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  status: 'waitlist' | 'vip' | 'contatado' | 'convertido' | 'arquivado';
  tags: string[];
  notes: string | null;
  position: number | null;
  createdAt: string;
}

export default function CrmDashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [activeEditingLead, setActiveEditingLead] = useState<Lead | null>(null);

  // Email form
  const [emailSubject, setEmailSubject] = useState('Você garantiu sua vaga na Lista VIP da Trajetta');
  const [emailMessage, setEmailMessage] = useState(
`Olá {{nome}},

Queremos confirmar que sua posição prioritária para o lançamento da Trajetta está reservada com sucesso.

Nossa equipe está preparando a primeira onda de acessos para este lote de fundadores. Em breve você receberá seu link exclusivo para iniciar sua jornada.

Atenciosamente,
Equipe Trajetta`);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState('');

  // New Lead form
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadTag, setNewLeadTag] = useState('VIP');

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/crm/leads');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.ok && Array.isArray(data.leads)) {
        setLeads(data.leads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/crm/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.phone || '').includes(searchQuery);

      const matchesTag = selectedTag === 'all' || lead.tags.includes(selectedTag);
      const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;

      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [leads, searchQuery, selectedTag, selectedStatus]);

  // All distinct tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [leads]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Status update
  const handleUpdateStatus = async (id: string, status: Lead['status']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch('/api/admin/crm/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  };

  // Add tag inline
  const handleAddTag = async (id: string) => {
    const tag = prompt('Digite a nova tag para este lead (ex: Quente, WhatsApp, Lote 2):');
    if (!tag || !tag.trim()) return;
    const clean = tag.trim();

    const target = leads.find((l) => l.id === id);
    if (!target) return;

    const nextTags = Array.from(new Set([...target.tags, clean]));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, tags: nextTags } : l)));

    await fetch('/api/admin/crm/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, tags: nextTags }),
    });
  };

  // Delete lead
  const handleDeleteLead = async (id: string, email: string) => {
    if (!confirm(`Tem certeza que deseja excluir o lead ${email}?`)) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/crm/leads?id=${id}`, { method: 'DELETE' });
  };

  // Create lead manually
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadEmail) return;

    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLeadName || 'Lead Manual',
          email: newLeadEmail,
          phone: newLeadPhone || undefined,
          tags: [newLeadTag, 'Manual'],
          source: 'admin_crm',
          status: 'waitlist',
        }),
      });
      const data = await res.json();
      if (data.ok && data.lead) {
        setLeads((prev) => [data.lead, ...prev]);
        setIsNewLeadModalOpen(false);
        setNewLeadName('');
        setNewLeadEmail('');
        setNewLeadPhone('');
      }
    } catch (err) {
      alert('Erro ao salvar lead.');
    }
  };

  // Send Broadcast Email
  const handleSendEmail = async () => {
    const recipients = leads
      .filter((l) => selectedIds.has(l.id))
      .map((l) => ({ email: l.email, name: l.name || 'Membro' }));

    if (recipients.length === 0) {
      alert('Selecione pelo menos um lead para enviar o e-mail.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatusMessage('');

    try {
      const res = await fetch('/api/admin/crm/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: emailSubject,
          messageHtml: emailMessage.replace(/\n/g, '<br/>'),
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setEmailStatusMessage(`✅ Sucesso! ${data.totalSent} e-mails processados (${data.totalFailed} falhas).`);
        setTimeout(() => {
          setIsEmailModalOpen(false);
          setEmailStatusMessage('');
        }, 2500);
      } else {
        setEmailStatusMessage(`❌ Erro: ${data.error}`);
      }
    } catch (err) {
      setEmailStatusMessage('❌ Falha na conexão de envio.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Export CSV
  const exportCsv = () => {
    const headers = ['Posicao', 'Nome', 'Email', 'Telefone', 'Status', 'Tags', 'Origem', 'Data'];
    const rows = filteredLeads.map((l) => [
      l.position || '',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      l.email,
      l.phone || '',
      l.status,
      `"${l.tags.join(', ')}"`,
      l.source,
      new Date(l.createdAt).toLocaleString('pt-BR'),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_trajetta_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#060709] text-white flex flex-col font-sans selection:bg-[#B8FF00] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0D1015]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/trajetta-logo-transparent.png" alt="Trajetta" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm tracking-[0.16em] uppercase text-white">TRAJETTA CRM</span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[10px] font-mono text-[#B8FF00]">
            ● PROD ENGINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            <span>Ver Landing Page</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={fetchLeads}
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/10 hover:border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0D1015] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
              <span>TOTAL DE LEADS</span>
              <Users className="w-4 h-4 text-[#B8FF00]" />
            </div>
            <div className="text-3xl font-bold text-white tabular-numbers">{leads.length}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Cadastrados na base interna</div>
          </div>

          <div className="bg-[#0D1015] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
              <span>LISTA VIP</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-300 tabular-numbers">
              {leads.filter((l) => l.tags.includes('VIP') || l.status === 'vip' || l.status === 'waitlist').length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Aguardando lote de acesso</div>
          </div>

          <div className="bg-[#0D1015] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
              <span>COM WHATSAPP</span>
              <Phone className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-300 tabular-numbers">
              {leads.filter((l) => Boolean(l.phone)).length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Prontos para contato 1-a-1</div>
          </div>

          <div className="bg-[#0D1015] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
              <span>SELECIONADOS</span>
              <CheckCircle2 className="w-4 h-4 text-[#B8FF00]" />
            </div>
            <div className="text-3xl font-bold text-white tabular-numbers">{selectedIds.size}</div>
            <div className="text-[11px] text-[#B8FF00] mt-1">Prontos para disparo de email</div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="bg-[#0D1015] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search & Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou tel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#B8FF00]/50"
              />
            </div>

            {/* Tag filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">Todas as Tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  Tag: {t}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="waitlist">Lista de Espera</option>
              <option value="vip">VIP</option>
              <option value="contatado">Contatado</option>
              <option value="convertido">Convertido</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsNewLeadModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#14181F] hover:bg-[#1b212b] border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Novo Lead</span>
            </button>

            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 bg-[#14181F] hover:bg-[#1b212b] border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-400" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-md"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Disparar E-mail ({selectedIds.size})</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#0D1015] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090C10] border-b border-white/10 text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded accent-[#B8FF00] cursor-pointer"
                    />
                  </th>
                  <th className="p-4">Fila</th>
                  <th className="p-4">Lead (Nome & Email)</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Data</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-neutral-500 font-mono">
                      {loading ? 'Carregando leads da base...' : 'Nenhum lead encontrado com estes filtros.'}
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedIds.has(lead.id);
                    const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, '') : null;
                    const waText = encodeURIComponent(
                      `Olá ${lead.name || ''}! Aqui é da equipe Trajetta. Sua vaga na Lista VIP está reservada com prioridade!`
                    );
                    const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}?text=${waText}` : null;

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-[#B8FF00]/[0.03]' : ''}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(lead.id)}
                            className="rounded accent-[#B8FF00] cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-mono font-bold text-neutral-400">
                          #{lead.position || '—'}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-white text-[13px]">{lead.name || 'Membro VIP'}</div>
                          <div className="text-neutral-400 font-mono text-[11.5px] mt-0.5">{lead.email}</div>
                        </td>
                        <td className="p-4 font-mono text-neutral-300">
                          {lead.phone ? (
                            <a
                              href={waLink!}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                              title="Abrir no WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </a>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap items-center gap-1.5 max-w-[200px]">
                            {lead.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10.5px] font-mono text-neutral-300"
                              >
                                {t}
                              </span>
                            ))}
                            <button
                              onClick={() => handleAddTag(lead.id)}
                              className="text-neutral-500 hover:text-[#B8FF00] text-xs px-1"
                              title="Adicionar tag"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                            className="bg-[#14181F] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-medium text-neutral-300 focus:outline-none"
                          >
                            <option value="waitlist">Lista de Espera</option>
                            <option value="vip">VIP / Founder</option>
                            <option value="contatado">Contatado</option>
                            <option value="convertido">Convertido</option>
                            <option value="arquivado">Arquivado</option>
                          </select>
                        </td>
                        <td className="p-4 text-neutral-500 font-mono text-[11px]">
                          {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedIds(new Set([lead.id]));
                                setIsEmailModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#B8FF00]"
                              title="Enviar e-mail para este lead"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.email)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                              title="Excluir lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: Email Broadcast */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1015] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-[#B8FF00] font-mono text-xs uppercase tracking-wider">
              <Mail className="w-4 h-4" />
              <span>Disparar E-mail para {selectedIds.size} Lead(s)</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Assunto</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8FF00]/60"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Mensagem (use &#123;&#123;nome&#125;&#125; para personalizar)
                </label>
                <textarea
                  rows={8}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#B8FF00]/60 resize-none leading-relaxed"
                />
              </div>

              {emailStatusMessage && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-mono">
                  {emailStatusMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingEmail ? 'Enviando...' : 'Enviar Agora'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: New Lead */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1015] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsNewLeadModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-white mb-4">Adicionar Lead Manualmente</h3>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Nome</label>
                <input
                  type="text"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Nome do lead"
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={newLeadEmail}
                  onChange={(e) => setNewLeadEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Tag Inicial</label>
                <input
                  type="text"
                  value={newLeadTag}
                  onChange={(e) => setNewLeadTag(e.target.value)}
                  placeholder="VIP, Amigo, Fundador..."
                  className="w-full bg-[#14181F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#B8FF00] hover:bg-[#a3e600] text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
