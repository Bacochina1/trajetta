'use client';

import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_STORAGE_KEY = 'trajetta_tour_completed';
const TOUR_EVENT_NAME = 'trajetta_tour_status_change';

export const isTourCompleted = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markTourCompleted = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    window.dispatchEvent(new CustomEvent(TOUR_EVENT_NAME));
  } catch {}
};

export const resetTourCompleted = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(TOUR_EVENT_NAME));
  } catch {}
};

export function useTourStatus() {
  const [completed, setCompleted] = useState<boolean>(true);

  useEffect(() => {
    setCompleted(isTourCompleted());
    const handler = () => {
      setCompleted(isTourCompleted());
    };
    window.addEventListener(TOUR_EVENT_NAME, handler);
    return () => window.removeEventListener(TOUR_EVENT_NAME, handler);
  }, []);

  return { isTourCompleted: completed, markTourCompleted, resetTourCompleted };
}

export const startGuidedTour = (navigateToToday?: unknown) => {
  if (typeof window === 'undefined') return;

  const navFn = typeof navigateToToday === 'function' ? (navigateToToday as () => void) : undefined;

  const runTour = () => {
    const allSteps = [
      {
        element: '[data-tour="today-header"]',
        popover: {
          title: '🧭 Bem-vindo à Trajetta',
          description: 'Seu sistema pessoal de evolução. Aqui não cobramos perfeição, não zeramos streaks nem acumulamos ansiedade. O foco é direção lúcida e ritmo sustentável.',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      },
      {
        element: '[data-tour="today-movements"]',
        popover: {
          title: '⚡ Rito Diário & Movimentos',
          description: 'Seus hábitos essenciais e ações do dia. Marque com 1 toque. Se o dia for difícil, cumpra o piso mínimo sem culpa.',
          side: 'bottom' as const,
          align: 'start' as const,
        },
      },
      {
        element: '[data-tour="active-journey"]',
        popover: {
          title: '🎯 Jornadas de Foco em Ciclos',
          description: 'Desafios temporais de 21 a 90 dias com início e fim. O sistema permite 1 avanço por dia calendário e possui recuperação humana de deslizes.',
          side: 'left' as const,
          align: 'start' as const,
        },
      },
      {
        element: '[data-tour="sidebar-nav"]',
        popover: {
          title: '📋 Navegação do Sistema',
          description: 'Alterne entre seu Dia (Hoje), Planejamento Leve de Domingo (Semana), Metas com marcos claros, Hábitos e LifeScore.',
          side: 'right' as const,
          align: 'start' as const,
        },
      },
      {
        element: '[data-tour="ai-trigger"]',
        popover: {
          title: '🧠 Trajetta AI (Quiet Intelligence)',
          description: 'Inteligência com memória ativa que conhece seus ciclos e metas. Abra para conversar com serenidade e calibrar o próximo passo sem ruído.',
          side: 'top' as const,
          align: 'end' as const,
        },
      },
      {
        element: '[data-tour="topbar-user"]',
        popover: {
          title: '👤 Seu Perfil & Configurações',
          description: 'Acesse suas configurações, consulte seu status de membro ou reinicie este tour guiado a qualquer momento nas configurações!',
          side: 'bottom' as const,
          align: 'end' as const,
        },
      },
    ];

    const validSteps = allSteps.filter(s => document.querySelector(s.element) !== null);
    if (validSteps.length === 0) return;

    const handleTourFinish = () => {
      markTourCompleted();
    };

    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: 'Concluir Tour',
      nextBtnText: 'Próximo →',
      prevBtnText: '← Voltar',
      progressText: 'Passo {{current}} de {{total}}',
      steps: validSteps,
      onDestroyed: handleTourFinish,
      onCloseClick: () => {
        handleTourFinish();
        driverObj.destroy();
      },
      onDoneClick: () => {
        handleTourFinish();
        driverObj.destroy();
      },
    });

    driverObj.drive();
  };

  if (navFn) {
    navFn();
    setTimeout(runTour, 250);
  } else {
    runTour();
  }
};
