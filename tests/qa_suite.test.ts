import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../src/lib/db';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '../src/lib/auth/auth';
import { callNvidiaAI, generateWeeklyReviewReflection } from '../src/lib/ai/aiService';
import { renderWelcomeEmail, renderWeeklyReviewEmail, sendEmail } from '../src/lib/email/emailService';

describe('QA TESTER SUITE: TRAJETTA FULL-STACK SYSTEM', () => {
  // -------------------------------------------------------------
  // 1. BANCO DE DADOS & SEED (PRISMA ORM)
  // -------------------------------------------------------------
  describe('1. Database Integrity & Seed Tests', () => {
    it('deve encontrar a conta de Administrador (Jim) pré-configurada', async () => {
      const admin = await prisma.user.findUnique({
        where: { email: 'admin@trajetta.app' },
      });

      expect(admin).toBeDefined();
      expect(admin?.email).toBe('admin@trajetta.app');
      expect(admin?.role).toBe('ADMIN');
      expect(admin?.name).toContain('Jim');
    });

    it('deve persistir e recuperar um hábito no banco com consistência de dados', async () => {
      const admin = await prisma.user.findUnique({ where: { email: 'admin@trajetta.app' } });
      expect(admin).toBeDefined();

      const testHabit = await prisma.habit.create({
        data: {
          userId: admin!.id,
          name: 'QA Test Habit - Corrida Matinal',
          area: 'Corpo',
          frequency: '3x por semana',
          targetValue: '45 min',
          streakWeeks: 12,
        },
      });

      expect(testHabit.id).toBeDefined();
      expect(testHabit.name).toBe('QA Test Habit - Corrida Matinal');
      expect(testHabit.streakWeeks).toBe(12);

      // Clean up
      await prisma.habit.delete({ where: { id: testHabit.id } });
    });
  });

  // -------------------------------------------------------------
  // 2. AUTENTICAÇÃO & SEGURANÇA (BCRYPT + JWT)
  // -------------------------------------------------------------
  describe('2. Authentication & Security Tests', () => {
    it('deve realizar hash seguro de senhas com salt', async () => {
      const rawPassword = 'TrajettaPassword123!';
      const hash = await hashPassword(rawPassword);

      expect(hash).not.toBe(rawPassword);
      expect(hash.startsWith('$2')).toBe(true);

      const isMatch = await verifyPassword(rawPassword, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await verifyPassword('WrongPassword', hash);
      expect(isWrongMatch).toBe(false);
    });

    it('a senha do Admin pré-configurado deve bater com TrajettaAdmin2026!', async () => {
      const admin = await prisma.user.findUnique({ where: { email: 'admin@trajetta.app' } });
      expect(admin).toBeDefined();

      const isValid = await verifyPassword('TrajettaAdmin2026!', admin!.passwordHash);
      expect(isValid).toBe(true);
    });

    it('deve criar e verificar tokens de sessão JWT com permissões corretas', async () => {
      const payload = {
        userId: 'test-usr-123',
        email: 'jim@trajetta.app',
        name: 'Jim',
        role: 'ADMIN',
      };

      const token = await createSessionToken(payload);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);

      const verified = await verifySessionToken(token);
      expect(verified).toBeDefined();
      expect(verified?.userId).toBe('test-usr-123');
      expect(verified?.role).toBe('ADMIN');
      expect(verified?.email).toBe('jim@trajetta.app');
    });

    it('deve rejeitar tokens adulterados ou inválidos', async () => {
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature';
      const result = await verifySessionToken(invalidToken);
      expect(result).toBeNull();
    });
  });

  // -------------------------------------------------------------
  // 3. INTELIGÊNCIA ARTIFICIAL (NVIDIA API & FALLBACKS)
  // -------------------------------------------------------------
  describe('3. AI Router & NVIDIA Integration Tests', () => {
    it('deve gerar respostas serenas sem sparkles (Zero Sparkles Audit)', async () => {
      const response = await callNvidiaAI([
        { role: 'user', content: 'Tive um deslize na minha dieta hoje. Devo recomeçar do zero?' },
      ]);

      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(15);
      // Strict Anti-AI check: No sparkles
      expect(response.includes('✨')).toBe(false);
    }, 30000);

    it('deve gerar reflexão de Weekly Review no tom Calm Power', async () => {
      const reflection = await generateWeeklyReviewReflection({
        wins: 'Completei todos os treinos da semana e finalizei o sprint de produto',
        challenges: 'Dificuldade para desligar as notificações à noite',
        completedRatio: '92%',
        streakWeeks: 14,
      });

      expect(reflection).toBeDefined();
      expect(reflection.length).toBeGreaterThan(25);
      expect(reflection.includes('✨')).toBe(false);
    }, 30000);
  });

  // -------------------------------------------------------------
  // 4. SISTEMA DE E-MAILS TRANSACIONAIS
  // -------------------------------------------------------------
  describe('4. Transactional Email System Tests', () => {
    it('deve renderizar o template de Boas-Vindas com tipografia e cores Calm Power', () => {
      const html = renderWelcomeEmail('Jim');

      expect(html).toContain('Jim');
      expect(html).toContain('#0D1015'); // Dark card background
      expect(html).toContain('#B8FF00'); // Trajetta accent
      expect(html).toContain('Sua vaga está garantida');
      expect(html).toContain('trajetta');
    });

    it('deve renderizar o template de Fechamento de Semana', () => {
      const html = renderWeeklyReviewEmail({
        userName: 'Jim',
        weekNumber: 14,
        streakWeeks: 14,
        reflection: 'Excelente consistência acumulada.',
      });

      expect(html).toContain('Semana 14 Concluída');
      expect(html).toContain('Jim');
      expect(html).toContain('Excelente consistência acumulada.');
      expect(html).toContain('#B8FF00');
    });

    it('deve disparar e-mail com fallback simulado em ambiente de desenvolvimento', async () => {
      const result = await sendEmail({
        to: 'admin@trajetta.app',
        subject: 'QA Test Subject',
        html: '<p>Teste de envio</p>',
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  // -------------------------------------------------------------
  // 5. DESIGN SYSTEM & POLISH AUDIT
  // -------------------------------------------------------------
  describe('5. Calm Power Design System Audit', () => {
    it('não deve conter nenhum uso de sparkles decorativo nas mensagens de sistema', () => {
      const forbiddenTokens = ['✨', 'sparkles', 'magic-star'];
      const welcome = renderWelcomeEmail('Tester');
      
      forbiddenTokens.forEach((token) => {
        expect(welcome.toLowerCase().includes(token)).toBe(false);
      });
    });
  });

  // -------------------------------------------------------------
  // 6. LISTA DE ESPERA (WAITLIST PIPELINE)
  // -------------------------------------------------------------
  describe('6. Waitlist Pipeline Tests', () => {
    it('deve registrar um novo lead na lista de espera com persistência no banco', async () => {
      const testEmail = `lead_${Date.now()}@exemplo.com`;
      const waitlistEntry = await prisma.waitlist.create({
        data: {
          email: testEmail,
          name: 'Lead VIP QA',
          source: 'landing_page',
        },
      });

      expect(waitlistEntry.id).toBeDefined();
      expect(waitlistEntry.email).toBe(testEmail);

      // Clean up
      await prisma.waitlist.delete({ where: { id: waitlistEntry.id } });
    });
  });
});
