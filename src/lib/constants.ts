import { AreaConfig, LifeArea } from '@/types';

export const LIFE_AREAS: Record<LifeArea, AreaConfig> = {
  corpo: {
    id: 'corpo',
    label: 'Corpo',
    color: '#B8FF00', // Trajetta Lime
    badgeBg: 'rgba(184, 255, 0, 0.1)',
    badgeText: '#B8FF00',
    borderColor: 'rgba(184, 255, 0, 0.25)',
    description: 'Academia, corrida, sono, nutrição e energia vital.',
    examples: '3 a 4 treinos semanais, 7h30 de sono, 3L de água.',
  },
  dinheiro: {
    id: 'dinheiro',
    label: 'Dinheiro',
    color: '#F08A76', // Coral
    badgeBg: 'rgba(240, 138, 118, 0.1)',
    badgeText: '#F08A76',
    borderColor: 'rgba(240, 138, 118, 0.25)',
    description: 'Economizar, investir, controlar despesas e construir patrimônio.',
    examples: 'Guardar R$ 500/mês, bater reserva de R$ 50k, zerar dívidas.',
  },
  carreira: {
    id: 'carreira',
    label: 'Carreira',
    color: '#A98CF7', // Lilás
    badgeBg: 'rgba(169, 140, 247, 0.1)',
    badgeText: '#A98CF7',
    borderColor: 'rgba(169, 140, 247, 0.25)',
    description: 'Trabalho de alto impacto, liderança, projetos e networking.',
    examples: 'Concluir tese estratégica, 90 min de foco profundo diário.',
  },
  vida: {
    id: 'vida',
    label: 'Vida',
    color: '#6FAEF7', // Azul
    badgeBg: 'rgba(111, 174, 247, 0.1)',
    badgeText: '#6FAEF7',
    borderColor: 'rgba(111, 174, 247, 0.25)',
    description: 'Família, relacionamentos, hobbies, leitura e paz mental.',
    examples: 'Jantar em família sem telas, leitura antes de dormir, descanso.',
  },
};

export const NORTH_STAR_DESCRIPTION = 
  'Semanas concluídas é a métrica mestra da Trajetta. O ano não é 1º de janeiro, são 52 semanas onde cada uma conta.';
