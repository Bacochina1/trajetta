# TRAJETTA — DESIGN SYSTEM SPECIFICATION (v1.0)
*Sistema de Design Oficial da Trajetta: Fundações, Tokens, Escalas e Arquitetura de Interface.*

---

## 1. Princípios de Design & Direção Visual

A Trajetta não é um rastreador de hábitos genérico nem um dashboard corporativo denso. É um **sistema pessoal de evolução** com estética **Calm Power** — um equilíbrio entre a clareza analítica de ferramentas de alta precisão (Linear, Vercel) e a humanidade tátil de publicações editoriais contemporâneas.

### Os Três Pilares da Identidade
1. **Adulto:** Sem ilustrações infantis, sem gamificação punitiva, sem avatares caricatos. A experiência é sóbria, elegante e respeita o tempo do usuário.
2. **Simples:** Uma hierarquia implacável. Ao abrir o aplicativo, a resposta para *"O que preciso fazer hoje?"* deve ser evidente em menos de 3 segundos.
3. **Emocional:** A Trajetta guarda a história de vida da pessoa. A tipografia e os micro-detalhes transmitem peso, continuidade e reverência pela trajetória do usuário.

---

## 2. Tokens de Cores (Color Tokens)

### 2.1 Superfícies Dark-First (Canvas & Layers)
O sistema foi concebido primordialmente em modo escuro profundo, evitando o preto chapado (#000000) nas áreas amplas de leitura para reduzir a fadiga visual.

| Token | HEX | Descrição & Uso |
| :--- | :--- | :--- |
| `--base-bg` | `#0D0F10` | Fundo principal da aplicação. Profundo, calmo e neutro. |
| `--surface` | `#171A1D` | Superfície primária dos cards e containers de conteúdo. |
| `--surface-card` | `#14171A` | Superfície intermediária para cards secundários e painéis de dados. |
| `--surface-elevated` | `#1F2328` | Superfície elevada para modais, dropdowns e popovers flutuantes. |
| `--surface-subtle` | `#111315` | Superfície rebaixada para inputs, campos de texto e fundos de listas. |
| `--surface-border` | `rgba(255, 255, 255, 0.08)` | Bordas estruturais sutis (1px). |
| `--surface-border-hover` | `rgba(255, 255, 255, 0.16)` | Realce de borda no hover de elementos interativos. |

---

### 2.2 Cores de Marca & North Star
O **Verde Trajetta** é a cor mestra da aplicação, associada diretamente à evolução, ação consciente e à métrica North Star (**Semanas Concluídas**).

| Token | HEX | Descrição & Uso |
| :--- | :--- | :--- |
| `--trajetta-lime` | `#B8FF00` | Acento primário de alta energia. Usado em botões principais, status concluídos e nós de progresso. |
| `--trajetta-lime-hover` | `#C6FF19` | Estado de hover ativo do acento primário. |
| `--trajetta-lime-glow` | `rgba(184, 255, 0, 0.15)` | Brilho difuso em badges ativas e cartões de destaque semanal. |
| `--trajetta-lime-subtle` | `rgba(184, 255, 0, 0.08)` | Fundo de pílulas ativas e estados de seleção. |

---

### 2.3 Acentos Semânticos das 4 Grandes Áreas
Cada área da vida possui uma cor de acento dedicada e harmônica, permitindo identificação imediata sem poluição visual.

| Área da Vida | Token | HEX | Cor | Uso & Significado |
| :--- | :--- | :--- | :--- | :--- |
| **Corpo** | `--area-corpo` | `#58D6A7` | Mint Vital | Saúde física, musculação, corrida, sono, nutrição e energia vital. |
| **Dinheiro** | `--area-dinheiro` | `#F08A76` | Coral Terroso | Finanças, investimentos, economia deliberada e patrimônio. |
| **Carreira** | `--area-carreira` | `#A98CF7` | Lilás Intelectual | Trabalho profundo, liderança, projetos, estudos e carreira executiva. |
| **Vida** | `--area-vida` | `#6FAEF7` | Azul Céu | Família, relacionamentos, hobbies, descanso e paz mental. |
| **Conquistas** | `--area-gold` | `#C9A45A` | Ouro Acobreado | Marcos de longo prazo atingidos, badges e celebrações. |

---

### 2.4 Tipografia e Escala de Cores de Texto

| Token | HEX | Descrição & Uso |
| :--- | :--- | :--- |
| `--text-primary` | `#F2F1ED` | Títulos, textos principais e valores de alta prioridade (96% luminosidade). |
| `--text-secondary` | `#8E9499` | Subtítulos, metadados, rótulos de navegação e descrições secundárias. |
| `--text-muted` | `#5F656B` | Divisores textuais, carimbos de hora e estados desabilitados. |
| `--text-inverse` | `#0D0F10` | Texto em alto contraste sobre botões e badges em Verde Trajetta. |

---

## 3. Tipografia & Escala Editorial

### Fontes Oficiais
- **Primária (Headings & UI):** `Manrope, -apple-system, sans-serif`
  - *Pesos:* 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).
- **Numérica & Tabular (Métricas, Prazos & Percentuais):** `DM Sans, sans-serif`
  - *Atributos obrigatórios em métricas:* `font-variant-numeric: tabular-nums` e `letter-spacing: -0.04em`.

### Escala Modular

```css
/* Display / Hero */
--text-display: clamp(2rem, 4vw, 3.25rem); /* 32px a 52px */
--leading-display: 0.96;
--tracking-display: -0.07em;

/* H1 / Título de Página */
--text-h1: clamp(1.75rem, 3vw, 2.5rem);    /* 28px a 40px */
--leading-h1: 1.05;
--tracking-h1: -0.05em;

/* H2 / Título de Seção */
--text-h2: 1.25rem;                        /* 20px */
--leading-h2: 1.2;
--tracking-h2: -0.03em;

/* Body Regular */
--text-body: 0.875rem;                     /* 14px */
--leading-body: 1.5;

/* Micro / Eyebrows / Metadados */
--text-micro: 0.625rem;                    /* 10px */
--tracking-micro: 0.18em;
--leading-micro: 1;
```

---

## 4. Geometria, Espaçamento & Raios Concêntricos

### 4.1 Regra do Raio Concêntrico (`better-ui`)
Para evitar dissonância visual em elementos aninhados, aplica-se a fórmula:
$$	ext{Raio Externo} = 	ext{Raio Interno} + 	ext{Padding}$$

- **Container Modal:** `border-radius: 20px` com `padding: 24px`
  - Elementos internos (inputs, botões): `border-radius: 10px`.
- **Card Principal:** `border-radius: 16px` com `padding: 16px`
  - Botões ou pílulas internas: `border-radius: 8px`.
- **Botões e Chips Isolados:** `border-radius: 8px` a `10px`.
- **Pílulas de Status e Checks:** `border-radius: 9999px` (`rounded-full`).

---

## 5. Microinterações & Diretriz de Movimento

1. **Feedback Tátil em Botões e Cliques (`better-ui`):**
   - Ao pressionar (`active`): escala imediata para `scale(0.96)`.
   - Curva de transição: `cubic-bezier(0.2, 0, 0, 1)` com duração de `150ms`.
   - Propriedades de transição explicitadas nominalmente: `transition-property: transform, background-color, border-color`.
2. **Sem Animações Gratuitas de Entrada:**
   - O conteúdo renderiza imediatamente em seu estado final.
   - Nada de atrasos artificiais com fade-in, stagger ou reveals ao scroll que bloqueiem a leitura.
3. **Sem Sparkles:**
   - Recursos cognitivos e de IA usam ícones limpos como `Brain`, `Compass` e `Aperture`.
