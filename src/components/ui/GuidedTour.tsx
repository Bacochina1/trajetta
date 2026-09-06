'use client';

import React from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startGuidedTour = () => {
  if (typeof window === 'undefined') return;

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    doneBtnText: 'Concluir Tour ✨',
    nextBtnText: 'Próximo →',
    prevBtnText: '← Voltar',
    progressText: 'Passo {{current}} de {{total}}',
    steps: [
      {
        element: '[data-tour="today-header"]',
        popover: {
          title: '🧭 Bem-vindo à Trajetta',
          description: 'Seu sistema pessoal de evolução. Aqui não cobramos perfeição, não zeramos streaks nem acumulamos ansiedade. O foco é direção lúcida e ritmo sustentável.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '[data-tour="today-movements"]',
        popover: {
          title: '⚡ Rito Diário & Movimentos',
          description: 'Seus hábitos essenciais e ações do dia. Marque com 1 toque. Se o dia for difícil, cumpra o piso mínimo sem culpa.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '[data-tour="active-journey"]',
        popover: {
          title: '🎯 Jornadas de Foco em Ciclos',
          description: 'Desafios temporais de 21 a 90 dias com início e fim. O sistema permite 1 avanço por dia calendário e possui recuperação humana de deslizes.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: '[data-tour="sidebar-nav"]',
        popover: {
          title: '📋 Navegação do Sistema',
          description: 'Alterne entre seu Dia (Hoje), Planejamento Leve de Domingo (Semana), Metas com marcos claros, Hábitos e LifeScore.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: '[data-tour="ai-trigger"]',
        popover: {
          title: '🧠 Trajetta AI (Quiet Intelligence)',
          description: 'Inteligência com memória ativa que conhece seus ciclos e metas. Abra para conversar com serenidade e calibrar o próximo passo sem ruído.',
          side: 'top',
          align: 'end',
        },
      },
      {
        element: '[data-tour="topbar-user"]',
        popover: {
          title: '👤 Seu Perfil & Tour Guiado',
          description: 'Acesse suas configurações, consulte seu status de membro ou reinicie este tour guiado a qualquer momento!',
          side: 'bottom',
          align: 'end',
        },
      },
    ],
  });

  driverObj.drive();
};
