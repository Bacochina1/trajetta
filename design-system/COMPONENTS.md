# TRAJETTA — COMPONENT ANATOMY & PATTERNS
*Catálogo e Especificação Técnica das Primitivas de Interface da Trajetta.*

---

## 1. Primitivas Básicas (`src/components/ui/`)

### 1.1 Button (`Button.tsx`)
Componente com resposta tátil nativa baseada na regra `better-ui`:
- **Feedback ao Pressionar:** `active:scale-[0.96]` com easing `cubic-bezier(0.2, 0, 0, 1)`.
- **Variantes:**
  - `primary`: Fundo `#B8FF00` (Verde Trajetta), texto preto profundo `#0D0F10`, peso bold (`700`), sombra difusa `shadow-[0_0_20px_rgba(184,255,0,0.18)]`.
  - `secondary`: Fundo elevado `#1F2328`, borda `border-white/10`, texto `#F2F1ED`.
  - `ghost`: Fundo transparente, texto `#8E9499`, hover com texto `#F2F1ED` e fundo sutil.
  - `outline`: Borda `border-white/15`, texto claro.
  - `danger`: Fundo vermelho escuro atenuado (`bg-red-500/10`), texto coral.

---

### 1.2 AreaBadge (`AreaBadge.tsx`)
Tag de identificação rápida para as 4 áreas da vida:
- **Corpo:** Mint (`#58D6A7`) + Ícone `Activity`.
- **Dinheiro:** Coral (`#F08A76`) + Ícone `Landmark`.
- **Carreira:** Lilás (`#A98CF7`) + Ícone `Briefcase`.
- **Vida:** Azul (`#6FAEF7`) + Ícone `HeartHandshake`.
- **Tamanhos:** `sm` (11px text), `md` (12px text), `lg` (14px text).

---

### 1.3 CheckCircle (`CheckCircle.tsx`)
Gatilho circular interativo de 20px para hábitos e tarefas diárias:
- **Estado Inativo:** Borda fina `border-white/25`, fundo translúcido sutil `bg-white/5`.
- **Estado Ativo:** Preenchimento completo na cor de acento (`#B8FF00` por padrão ou cor da área), ícone `Check` de 13px em `#0D0F10`.
- **Microinteração:** `active:scale-[0.92]` no clique.

---

### 1.4 ProgressBar (`ProgressBar.tsx`)
Barra de progresso com extremidades em pílula perfeita (`rounded-full`):
- **Trilho:** Fundo rebaixado `#1F2328` com padding interno de 2px.
- **Preenchimento:** Gradiente ou cor sólida Trajetta Lime (`#B8FF00`) com glow sutil (`shadow-[0_0_10px_rgba(184,255,0,0.3)]`).

---

### 1.5 Modal (`Modal.tsx`)
Container de diálogo baseado na regra do raio concêntrico:
- **Raio Externo:** `20px` com borda `border-white/10`.
- **Backdrop:** `bg-[#0D0F10]/80` com `backdrop-blur-sm`.
- **Acessibilidade:** Fecha automaticamente ao pressionar a tecla `Escape` ou clicar no backdrop.

---

## 2. Padrões de Layout Composto (`src/components/layout/`)

### 2.1 Sidebar Ancorada
- Largura fixa de `250px` em desktop com fundo escuro `#111315` e divisor `border-r border-white/8`.
- Lockup oficial no topo com a marca Trajetta (figura estilizada alcançando a estrela-guia) e pontos de paginação `•••••`.
- Card fixo da Métrica North Star (`14 semanas concluídas`).
- Botão da Trajetta IA no rodapé com indicador de status pulsante em verde.
- Chip de perfil do usuário.

### 2.2 Topbar Pegajosa (`sticky top-0`)
- Altura de `64px` (`h-16`) com efeito de vidro escuro (`backdrop-blur-md`).
- Data do dia formatada em linguagem natural (*"Sábado, 29 de agosto · Semana 14 de 52"*).
- Botões de ação rápida: *"Restaurar Demo"*, *"Nova Meta"* e *"Fechar Semana"*.
