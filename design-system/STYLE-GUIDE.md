# TRAJETTA — STYLE GUIDE & DESIGN MANUAL (v1.0)
*Manual de Estilo Oficial da Trajetta: Tom de Voz, Regras Visuais, Iconografia e Guia Anti-IA.*

---

## 1. O Padrão "Calm Power"

A Trajetta segue a filosofia visual de **Calm Power** (Poder Sereno). A interface não grita por atenção; ela oferece um refúgio de clareza e foco para o usuário refletir sobre sua própria vida.

### Princípios Inegociáveis
- **Menos, mas com acabamento impecável:** Menos elementos na tela, porém cada um com alinhamento ótico milimétrico, contraste semântico preciso e feedback tátil prazeroso.
- **Estrutura antes de adorno:** Nunca adicione um gradiente, badge ou sombra apenas para "preencher espaço". Se o elemento não responde a *"O que preciso fazer hoje?"* ou não comprova evolução, ele deve ser removido.
- **Consistência, não punição militar:** A interface celebra a constância da jornada e acolhe os deslizes humanos sem estresse visual.

---

## 2. Tom de Voz & Redação de Interface (UX Copy)

| Contexto | O que NÃO fazer ❌ | O que a Trajetta faz ✅ | Racional |
| :--- | :--- | :--- | :--- |
| **Hábitos** | "🔥 365 dias de sequência ou você falhou!" | "43 treinos realizados · 14 semanas avançando" | Evidência acumulada de evolução em vez de chantagem emocional. |
| **Deslizes** | "Você perdeu o streak! Recomece do zero." | "17 dias construídos · 1 deslize · Continue sua jornada" | Recuperação compassiva; a trajetória de 17 dias não se apaga por 1 dia difícil. |
| **Notificações** | "🚨 Você esqueceu seu hábito! Abra o app agora!" | "Sua semana está quase terminando. Quer ver o que avançou?" | Lembrete contextual e maduro, sem desespero. |
| **Insights de IA** | "✨ Olá! Sou sua assistente mágica de inteligência artificial!" | "Trajetta IA: Nas últimas semanas sua frequência caiu de 4 para 2 treinos. Vamos ajustar a meta para manter o ritmo sem sobrecarga?" | Análise concreta de fatos históricos sem clichês de IA. |

---

## 3. Diretrizes de Iconografia

### 3.1 Proibição Estrita de "Sparkles"
> [!IMPORTANT]
> **Proibição Absoluta:** O ícone de estrelinhas mágicas (`Sparkles` / `✨`) é proibido na Trajetta. Recursos cognitivos, insights e reflexões da IA devem utilizar ícones de metáfora cerebral, orientação e foco:
> - `Brain` (processamento e memória contextual)
> - `Compass` (direção e trajetória)
> - `Aperture` (foco)
> - `Layers` (estrutura de áreas)

### 3.2 Espessura de Traço (Stroke Width) Casada ao Texto (`better-ui`)
- Ao lado de texto Regular (peso 400): use `strokeWidth={1.8}` ou `1.5`.
- Ao lado de texto Bold / SemiBold (peso 700 / 800): use `strokeWidth={2.2}` ou `2.5`.
- Ícones usam sempre `currentColor` e herdam o estado do elemento pai.

---

## 4. Tabela de Boas Práticas: DOs and DON'Ts

### DOs (Práticas Recomendadas)
- **DO:** Use `active:scale-[0.96]` em botões e cards clicáveis para transmitir sensação tátil de software nativo.
- **DO:** Formate valores de métricas e porcentagens com `tabular-nums` e `letter-spacing: -0.04em`.
- **DO:** Adicione um contorno milimétrico em imagens e cards escuros (`border: 1px solid rgba(255, 255, 255, 0.08)`) para definir limites espaciais sem pesar.
- **DO:** Limite o comprimento de linhas de texto (body copy) a 60-75 caracteres para garantir conforto de leitura.
- **DO:** Destaque palavras-chave de títulos combinando peso bold com palavras em peso regular/atenuado (`<h1>Seu próximo <span className="text-[#B8FF00]">movimento.</span></h1>`).

### DON'Ts (Erros a Evitar)
- **DON'T:** Nunca use gradientes de texto coloridos (rainbow gradients) em títulos.
- **DON'T:** Nunca use cantos arredondados desproporcionais ou inconsistentes (ex: card com 8px e botão interno com 16px).
- **DON'T:** Nunca use animações de entrada que atrasem a visualização dos dados (sem delays em cascata ou fades de carregamento).
- **DON'T:** Nunca crie gráficos ou badges que punam o usuário com cores vermelhas agressivas por dias de descanso.
- **DON'T:** Nunca misture mais de uma biblioteca de ícones na mesma superfície.

---

## 5. Checklist Anti-IA (Filtro de Qualidade)

Antes de aprovar qualquer tela ou componente, faça o checklist para garantir que o resultado pareça desenhado por um designer humano de elite:

- [ ] **Sem "side-stripe borders":** Nenhuma borda lateral colorida grossa sem propósito funcional.
- [ ] **Sem gradientes violeta genéricos:** As cores seguem os tokens Trajetta (Lime, Mint, Coral, Lilás, Azul).
- [ ] **Sem "cards fantasmas":** Cards com borda de 1px e sombra desfocada excessiva eliminados.
- [ ] **Sem textos de marketing vazios:** Copy contextualizada com a vida real do usuário (pesos, quilômetros, aportes em R$, metas de carreira).
- [ ] **Alinhamento ótico verificado:** Ícones assimétricos acompanhados de texto ajustados com margem ótica de 1px a 2px.
- [ ] **Responsividade fluida:** O layout funciona tão perfeitamente em 375px (iPhone) quanto em 1440px (Desktop).
