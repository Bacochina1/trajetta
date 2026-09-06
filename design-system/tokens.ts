/**
 * TRAJETTA DESIGN TOKENS
 * Tokens centrais da Trajetta prontos para consumo em código, pacotes e componentes.
 */

export const trajettaTokens = {
  colors: {
    // Surfaces & Canvas
    baseBg: '#0D0F10',
    surface: '#171A1D',
    surfaceCard: '#14171A',
    surfaceElevated: '#1F2328',
    surfaceSubtle: '#111315',

    // Text hierarchy
    textPrimary: '#F2F1ED',
    textSecondary: '#8E9499',
    textMuted: '#5F656B',
    textInverse: '#0D0F10',

    // Structural borders
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    borderActive: 'rgba(184, 255, 0, 0.35)',

    // Trajetta North Star Lime
    lime: '#B8FF00',
    limeHover: '#C6FF19',
    limeGlow: 'rgba(184, 255, 0, 0.15)',
    limeSubtle: 'rgba(184, 255, 0, 0.08)',

    // Life Areas
    areas: {
      corpo: {
        color: '#58D6A7', // Mint
        bg: 'rgba(88, 214, 167, 0.1)',
        border: 'rgba(88, 214, 167, 0.25)',
      },
      dinheiro: {
        color: '#F08A76', // Coral
        bg: 'rgba(240, 138, 118, 0.1)',
        border: 'rgba(240, 138, 118, 0.25)',
      },
      carreira: {
        color: '#A98CF7', // Lilás
        bg: 'rgba(169, 140, 247, 0.1)',
        border: 'rgba(169, 140, 247, 0.25)',
      },
      vida: {
        color: '#6FAEF7', // Azul Céu
        bg: 'rgba(111, 174, 247, 0.1)',
        border: 'rgba(111, 174, 247, 0.25)',
      },
      gold: {
        color: '#C9A45A', // Conquistas
        bg: 'rgba(201, 164, 90, 0.1)',
        border: 'rgba(201, 164, 90, 0.25)',
      },
    },
  },

  typography: {
    fonts: {
      primary: 'var(--font-manrope), sans-serif',
      tabular: 'var(--font-dm-sans), sans-serif',
    },
    sizes: {
      display: 'clamp(2rem, 4vw, 3.25rem)',
      h1: 'clamp(1.75rem, 3vw, 2.5rem)',
      h2: '1.25rem',
      body: '0.875rem',
      sm: '0.75rem',
      micro: '0.625rem',
    },
    lineHeights: {
      display: '0.96',
      h1: '1.05',
      h2: '1.2',
      body: '1.5',
    },
    letterSpacings: {
      display: '-0.07em',
      h1: '-0.05em',
      h2: '-0.03em',
      tabular: '-0.04em',
      micro: '0.18em',
    },
  },

  radius: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    card: '16px',
    modal: '20px',
    full: '9999px',
  },

  shadows: {
    card: '0 10px 30px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(255, 255, 255, 0.03)',
    modal: '0 25px 60px rgba(0, 0, 0, 0.6)',
    limeGlow: '0 0 20px rgba(184, 255, 0, 0.18)',
    subtleGlow: '0 0 15px rgba(255, 255, 255, 0.05)',
  },

  motion: {
    tactilePressScale: '0.96',
    durationFast: '150ms',
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

export type TrajettaTokens = typeof trajettaTokens;
