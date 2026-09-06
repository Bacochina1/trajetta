# Trajetta Style Guide & Práticas de Engenharia Frontend

## 1. Regras Visuais Invioláveis
1. **Nunca use fundo preto sólido atrás do logo.** O logo da Trajetta é um vetor/PNG transparente que se integra organicamente aos cabeçalhos e barras de navegação.
2. **Nunca permita animações intrusivas de entrada (fade-in ao scroll, zoom ou revelação lenta).** A interface deve renderizar instantaneamente em seu estado final.
3. **Respeite a hierarquia de CTA.** Cada visualização ou modal deve possuir exatamente UMA ação primária em `#B8FF00`. Ações secundárias devem ser neutras (`variant="secondary"`).
4. **Alinhamento de formulários:** Botões de envio de modais devem ser posicionados na parte inferior esquerda, acompanhando a linha natural de leitura do olho.

---

## 2. Tokens de Cor no Código (Tailwind)
```tsx
// Canvas de Fundo
bg-[#060709] // Background absoluto da landing page e auth gate
bg-[#0D0F10] // Background principal do dashboard do aplicativo

// Superfícies e Cards
bg-[#0e1218] // Card base
bg-[#14181f] // Card elevado / container de inputs
bg-[#171A1D] // Painel secundário
bg-[#1F2328] // Hover de itens interativos

// Acentos Semânticos
text-[#B8FF00]   // North Star / Destaque Primário
bg-[#B8FF00]     // Botão CTA Dominante
text-[#58D6A7]   // Corpo & Saúde
text-[#F08A76]   // Dinheiro & Patrimônio
text-[#A98CF7]   // Carreira & Negócios
text-[#6FAEF7]   // Vida & Equilíbrio

// Textos
text-[#F2F1ED]   // Texto Primário (100% legível)
text-[#8E9499]   // Texto Secundário (Labels, descrições, metadados)
text-neutral-500 // Texto Terciário / Desabilitado
```

---

## 3. Guia de Implementação de Componentes

### 3.1 Botões (`Button.tsx`)
```tsx
// Primary CTA (Única por tela)
<Button variant="primary" size="lg">COMEÇAR AGORA</Button>

// Secondary / Ações de Apoio
<Button variant="secondary" size="md">Ver Detalhes</Button>

// Ghost / Navegação
<Button variant="ghost" size="sm">Cancelar</Button>
```

### 3.2 Badges de Área (`AreaBadge.tsx`)
```tsx
<AreaBadge area="corpo" />     // Exibe pill verde esmeralda com ícone Activity
<AreaBadge area="dinheiro" />  // Exibe pill terracota com ícone Landmark
<AreaBadge area="carreira" />  // Exibe pill lavanda com ícone Briefcase
<AreaBadge area="vida" />      // Exibe pill azul sereno com ícone HeartHandshake
```

### 3.3 Logo Oficial (`TrajettaLogo.tsx`)
```tsx
// Logo padrão com wordmark
<TrajettaLogo size={32} showWordmark />

// Logo compacto apenas com ícone (Topbar / Favicon)
<TrajettaLogo size={28} />
```

---

## 4. Governança e Privacidade de Dados (LGPD)
- Todas as memórias semânticas da IA devem ser acessíveis e apagáveis pelo usuário na rota de Configurações (`/app` $ightarrow$ Você & Preferências $ightarrow$ Memória da IA).
- O usuário possui direito de exportação completa do histórico em JSON com um único clique.
