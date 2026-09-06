# Trajetta Design System (TDS) • v1.0

## 1. Filosofia: Calm Power
A Trajetta foi concebida para adultos ambiciosos que buscam consistência sustentável em suas vidas. Não usamos gamificação barata, cores berrantes, confetes gratuitos ou emojis de brilho (✨/✦).
A interface transmite **calma, autoridade, sobriedade e precisão matemática**.

---

## 2. Regra 60-30-10 de Cor
- **60% Superfície / Canvas:**
  - Background Primário: `#060709` / `#0D0F10`
  - Background Secundário: `#0e1218`
- **30% Estrutura & Elevação:**
  - Cards & Modais: `#14181f` / `#171A1D`
  - Elementos Interativos Elevados: `#1F2328` / `#202428`
  - Bordas Sutis: `rgba(255, 255, 255, 0.08)` / `border-white/10`
- **10% North Star Accent:**
  - Primary Neon Lime: `#B8FF00` (Usado estritamente na CTA dominante, marcos de progresso e indicador de status).

### 2.1 Paleta Semântica das 4 Dimensões de Vida
- **Corpo & Saúde:** `#58D6A7` (Menta / Esmeralda Calmo)
- **Dinheiro & Patrimônio:** `#F08A76` (Coral / Terracota Equilibrado)
- **Carreira & Negócios:** `#A98CF7` (Lavanda / Roxo Estratégico)
- **Vida & Equilíbrio:** `#6FAEF7` (Azul Claro / Serenidade)

---

## 3. Tipografia & Escala Modular
- **Família Primária:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Família Numérica / Tabular:** `JetBrains Mono`, `monospace` (usada para horários, streaks, porcentagens e códigos)
- **Hierarquia:**
  - Display / Hero: 56px – 70px / tracking `[-0.03em]` / line-height `1.06`
  - H1 / Título de Seção: 32px – 40px / tracking `[-0.02em]`
  - H2 / Subtítulos: 20px – 24px / font-weight `600`
  - Body: 14px – 16px / line-height `1.5` – `1.6` / color `#F2F1ED` ou `#8E9499`
  - Micro / Labels: 10px – 11px / font-mono / uppercase / tracking `[0.08em]`

---

## 4. Grid Espacial & Elevação
- **Grid de 4pt:** Todos os paddings, margins e gaps são múltiplos de 4 (4, 8, 12, 16, 20, 24, 32, 48, 64).
- **Elevações:**
  - `depth-0`: Flat surface, `border border-white/8`.
  - `depth-1`: Cards e menus, `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4)`.
  - `depth-2`: Modais e popovers, `box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6)`.
- **Focus Rings:** `focus:ring-1 focus:ring-[#B8FF00] focus:border-[#B8FF00]` sem deslocamento de layout.

---

## 5. Ergonomia de Componentes
- **Botões:**
  - Proporção de padding 1em vertical / 2em horizontal.
  - Altura mínima interativa de 44px (touch target seguro).
  - Primary CTA: `#B8FF00` com texto `#0D0F10` (apenas 1 por tela/região).
  - Secondary: `#171A1D` com borda sutil e texto `#F2F1ED`.
- **Formulários:**
  - Altura de inputs: 40px – 44px.
  - Proporção 2:1 de espaçamento: label mais próximo do input correspondente do que do campo anterior.
  - Placeholders a 40-50% de opacidade passiva.
- **Badges:** Formato pill (`rounded-full`) com 10-15% de opacidade no background e contraste >4.5:1.

---

## 6. Diretrizes de IA & Memória
- **Zero Sparkles:** Proibição irrestrita de `✨` ou `✦`.
- **Tom de Voz:** Direto, estratégico, sem falsa urgência e sem condescendência.
- **RAG com Memória Viva:**
  - Nível 1: Resumo Vivo do Usuário
  - Nível 2: Fatos Objetivos Estruturados (SQL)
  - Nível 3: Padrões e Memórias Semânticas com confiança e decay de relevância
