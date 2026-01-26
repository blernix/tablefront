# 🎨 TableMaster Design System
## Dark Scandinavian Minimalist

> Un design épuré et moderne combinant l'élégance du minimalisme scandinave avec la sophistication d'un thème sombre. Beaucoup d'espace, typographie light, et une palette de gris doux avec des accents verts naturels.

---

## 📐 Principes de Design

### 1. **Minimalisme**
- Moins c'est plus : chaque élément doit avoir une raison d'être
- Pas de décorations inutiles
- Focus sur le contenu et la hiérarchie

### 2. **Espace Blanc (Space Dark)**
- Utiliser généreusement l'espace pour "respirer"
- Padding 2-3x plus grand que la normale
- Ne jamais avoir peur du vide

### 3. **Contraste Subtil**
- Éviter le blanc pur sur noir pur (trop agressif)
- Utiliser des gris doux (zinc-800, zinc-900)
- Texte en gris clair (zinc-200, zinc-300) plutôt que blanc

### 4. **Typographie Légère**
- Font weights : `font-light` (300) et `font-normal` (400) principalement
- Éviter les `font-bold` sauf pour les CTA
- Grande taille pour compenser la légèreté

### 5. **Flat Design**
- Ombres quasi inexistantes ou très subtiles
- Pas de gradients (sauf exceptions sur les boutons CTA)
- Bordures fines et discrètes

---

## 🎨 Palette de Couleurs

### Backgrounds
```css
/* Background principal */
--bg-primary: #18181B         /* zinc-900 */

/* Background secondaire (cards, sections) */
--bg-secondary: #27272A       /* zinc-800 */

/* Background tertiaire (hover states) */
--bg-tertiary: #3F3F46        /* zinc-700 */
```

### Texte
```css
/* Texte principal */
--text-primary: #E4E4E7       /* zinc-200 */

/* Texte secondaire */
--text-secondary: #A1A1AA     /* zinc-400 */

/* Texte désactivé/muted */
--text-muted: #71717A         /* zinc-500 */
```

### Accents (Vert Sapin Naturel)
```css
/* Vert principal */
--accent-primary: #10B981     /* emerald-500 */

/* Vert foncé (hover) */
--accent-dark: #059669        /* emerald-600 */

/* Vert très foncé */
--accent-darker: #047857      /* emerald-700 */

/* Vert clair (backgrounds) */
--accent-light: #D1FAE5       /* emerald-100 */
```

### Bordures
```css
/* Bordure principale */
--border-primary: #3F3F46     /* zinc-700 */

/* Bordure secondaire (plus subtile) */
--border-secondary: #27272A   /* zinc-800 */

/* Bordure accent */
--border-accent: #059669      /* emerald-600 avec opacity */
```

### Statuts (Status Colors)
```css
--success: #10B981            /* emerald-500 */
--warning: #F59E0B            /* amber-500 */
--error: #EF4444              /* red-500 */
--info: #3B82F6               /* blue-500 */
```

---

## ✍️ Typographie

### Font Family
```css
/* Utiliser la police système par défaut */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
```

### Font Sizes
```css
/* Texte courant */
--text-base: 1rem (16px)      /* text-base */
--text-lg: 1.125rem (18px)    /* text-lg */
--text-xl: 1.25rem (20px)     /* text-xl */

/* Titres */
--text-2xl: 1.5rem (24px)     /* text-2xl */
--text-3xl: 1.875rem (30px)   /* text-3xl */
--text-4xl: 2.25rem (36px)    /* text-4xl */
--text-5xl: 3rem (48px)       /* text-5xl */
--text-6xl: 3.75rem (60px)    /* text-6xl */
--text-7xl: 4.5rem (72px)     /* text-7xl */
```

### Font Weights
```css
/* Poids de police */
--font-light: 300             /* font-light */
--font-normal: 400            /* font-normal */
--font-medium: 500            /* font-medium - RARE */
--font-semibold: 600          /* font-semibold - CTA UNIQUEMENT */
```

### Line Heights
```css
/* Leading (hauteur de ligne) */
--leading-tight: 1.25         /* leading-tight - Titres */
--leading-normal: 1.5         /* leading-normal - Texte courant */
--leading-relaxed: 1.75       /* leading-relaxed - Paragraphes */
```

### Hiérarchie Typographique

#### H1 - Hero Title
```jsx
<h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-zinc-200 leading-tight tracking-tight">
  Votre titre
</h1>
```

#### H2 - Section Title
```jsx
<h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-200 leading-tight tracking-tight">
  Section Title
</h2>
```

#### H3 - Card Title
```jsx
<h3 className="text-2xl md:text-3xl font-light text-zinc-200">
  Card Title
</h3>
```

#### Body Text - Large
```jsx
<p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed">
  Texte principal
</p>
```

#### Body Text - Normal
```jsx
<p className="text-base md:text-lg text-zinc-400 font-light leading-normal">
  Texte normal
</p>
```

---

## 📦 Spacing & Layout

### Principe du Généreux Spacing
> Dans un design minimaliste dark, l'espace est ton meilleur ami. **Multiplier par 2-3** les spacing habituels.

### Padding Standards
```css
/* Sections */
--section-padding-y: py-32 md:py-40        /* 128-160px */
--section-padding-x: px-8 md:px-12         /* 32-48px */

/* Containers */
--container-padding: px-8 md:px-12 lg:px-16

/* Cards */
--card-padding: p-10 md:p-12 lg:p-16       /* 40-64px */

/* Buttons */
--button-padding-default: px-8 py-4        /* 32px x 16px */
--button-padding-lg: px-12 py-6            /* 48px x 24px */
```

### Gaps & Spacing
```css
/* Entre éléments d'une section */
--gap-section: gap-20 md:gap-24 lg:gap-32  /* 80-128px */

/* Entre cards */
--gap-cards: gap-8 md:gap-10 lg:gap-12     /* 32-48px */

/* Dans un groupe d'éléments */
--gap-group: gap-6 md:gap-8                /* 24-32px */

/* Entre lignes de texte */
--gap-text: space-y-8 md:space-y-10        /* 32-40px */
```

### Margin Bottom Standards
```css
/* Après un titre de section */
--mb-section-title: mb-20 md:mb-24         /* 80-96px */

/* Après un sous-titre */
--mb-subtitle: mb-12 md:mb-16              /* 48-64px */

/* Après un paragraphe */
--mb-paragraph: mb-8                       /* 32px */
```

---

## 🃏 Composants

### 1. Cards

#### Standard Card
```jsx
<div className="bg-zinc-800 rounded-3xl p-10 md:p-12 border border-zinc-700">
  {/* Content */}
</div>
```

**Caractéristiques :**
- Background : `bg-zinc-800`
- Border : `border border-zinc-700` (1px, très fine)
- Border Radius : `rounded-3xl` (24px)
- Padding : `p-10 md:p-12` (40-48px)
- **Pas d'ombre** ou ombre très subtile

#### Card avec Hover
```jsx
<div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300">
  {/* Content */}
</div>
```

**Hover Effect :**
- Border change : `hover:border-emerald-600/50`
- Pas de scale, pas de translate-y
- Transition douce : `transition-all duration-300`

#### Card Highlighted
```jsx
<div className="bg-zinc-800 rounded-3xl p-10 border-2 border-emerald-600/30">
  {/* Content */}
</div>
```

---

### 2. Buttons

#### Primary Button (CTA)
```jsx
<button className="bg-emerald-600 hover:bg-emerald-500 text-white font-normal px-8 py-4 rounded-full transition-colors duration-300">
  Action
</button>
```

**Caractéristiques :**
- Background : `bg-emerald-600`
- Hover : `hover:bg-emerald-500` (pas de scale)
- Text : `text-white font-normal`
- Padding : `px-8 py-4`
- Border Radius : `rounded-full`
- **Transition sur colors uniquement** : `transition-colors duration-300`

#### Secondary Button (Outline)
```jsx
<button className="border-2 border-zinc-600 hover:border-emerald-600 text-zinc-200 hover:text-emerald-500 font-normal px-8 py-4 rounded-full transition-all duration-300">
  Action
</button>
```

**Caractéristiques :**
- Border : `border-2 border-zinc-600`
- Hover : `hover:border-emerald-600`
- Text : `text-zinc-200 hover:text-emerald-500`
- Pas de background

#### Large Button
```jsx
<button className="bg-emerald-600 hover:bg-emerald-500 text-white font-normal text-lg px-12 py-6 rounded-full transition-colors duration-300">
  Large Action
</button>
```

---

### 3. Inputs & Forms

#### Text Input
```jsx
<input
  type="text"
  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-600/50 transition-colors"
  placeholder="Votre texte"
/>
```

**Caractéristiques :**
- Background : `bg-zinc-800`
- Border : `border border-zinc-700`
- Border Radius : `rounded-2xl` (16px)
- Padding : `px-6 py-4`
- Focus : `focus:border-emerald-600/50`
- **Pas de ring**, juste border change

#### Label
```jsx
<label className="block text-zinc-300 font-light text-lg mb-3">
  Nom du champ
</label>
```

---

### 4. Badges

#### Standard Badge
```jsx
<span className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal border border-zinc-700">
  Badge
</span>
```

#### Success Badge
```jsx
<span className="inline-flex items-center px-4 py-1.5 bg-emerald-600/10 text-emerald-500 rounded-full text-sm font-normal border border-emerald-600/20">
  Confirmé
</span>
```

---

### 5. Navbar/Header

```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
  <div className="container mx-auto px-8 py-6">
    <nav className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
          {/* Icon */}
        </div>
        <span className="text-2xl font-light text-zinc-200 tracking-tight">
          TableMaster
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-10">
        <a href="#" className="text-zinc-400 hover:text-emerald-500 font-light text-lg transition-colors duration-300">
          Lien
        </a>
      </div>
    </nav>
  </div>
</header>
```

**Caractéristiques :**
- Background semi-transparent : `bg-zinc-900/90`
- Backdrop blur : `backdrop-blur-sm`
- Border bottom : `border-b border-zinc-800`
- Padding généreux : `py-6`
- Navigation links : hover sur colors uniquement

---

## 🎭 Shadows (Ombres)

> **Principe : Éviter les ombres autant que possible**. Le design scandinave est flat.

### Quand utiliser des ombres ?
- Modals (pour détacher du fond)
- Dropdowns
- Floating elements (très rare)

### Ombres Autorisées
```css
/* Ombre très subtile */
shadow-sm shadow-zinc-950/20

/* Ombre pour modal */
shadow-xl shadow-zinc-950/40

/* Ombre pour dropdown */
shadow-lg shadow-zinc-950/30
```

### ⛔ À ÉVITER
- Ombres colorées (shadow-emerald-500/50) ❌
- Ombres trop prononcées ❌
- Ombres sur tous les éléments ❌

---

## 🔲 Borders & Radius

### Border Width
```css
/* Standard */
border                /* 1px - DÉFAUT */

/* Emphasized */
border-2              /* 2px - CTA outline, highlighted cards */
```

### Border Radius
```css
/* Buttons, Badges, Pills */
rounded-full          /* Complètement rond */

/* Cards, Inputs */
rounded-2xl           /* 16px */
rounded-3xl           /* 24px */

/* Petits éléments */
rounded-xl            /* 12px */

/* Logo, Icons */
rounded-full          /* Rond pour logos */
```

**Règle :** Plus l'élément est grand, plus le radius est grand.

---

## 🎬 Animations & Transitions

### Principes
- **Subtiles et rapides** (200-300ms)
- Transition sur `colors` ou `opacity` principalement
- **Éviter** : scale, rotate, translate (sauf exceptions)

### Transitions Standard
```css
/* Sur colors (texte, background, border) */
transition-colors duration-300

/* Sur tout (hover cards) */
transition-all duration-300

/* Sur opacity (fade in/out) */
transition-opacity duration-200
```

### Animations Autorisées

#### Fade In
```jsx
className="animate-fade-in"
```

#### Slide Up (sections)
```jsx
className="animate-slide-up"
```

### ⛔ À ÉVITER
- Bounce ❌
- Pulse (sauf loader) ❌
- Rotation (sauf loader) ❌
- Scale sur hover ❌
- Translate-y sur hover ❌

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first */
sm: 640px     /* Tablet */
md: 768px     /* Tablet landscape / Desktop small */
lg: 1024px    /* Desktop */
xl: 1280px    /* Desktop large */
2xl: 1536px   /* Desktop XL */
```

### Approche Mobile-First
Toujours commencer par le mobile, puis ajouter les breakpoints :

```jsx
// ✅ CORRECT
<h1 className="text-4xl md:text-6xl lg:text-8xl">

// ❌ INCORRECT
<h1 className="lg:text-8xl md:text-6xl text-4xl">
```

### Spacing Responsive
```jsx
// Padding qui grandit
className="p-8 md:p-12 lg:p-16"

// Gap qui grandit
className="gap-6 md:gap-8 lg:gap-12"
```

---

## 🎯 Exemples Pratiques

### Page d'accueil (Hero Section)

```jsx
<section className="relative pt-40 pb-32 px-8 container mx-auto">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

      {/* Hero Content */}
      <div className="space-y-10">
        {/* Badge */}
        <div className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal border border-zinc-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Solution sur-mesure
        </div>

        {/* Titre */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-zinc-200 leading-tight tracking-tight">
          Votre site web
          <span className="block mt-3 text-emerald-500 font-normal">
            professionnel
          </span>
        </h1>

        {/* Description */}
        <p className="text-2xl text-zinc-400 leading-relaxed font-light">
          Je développe votre site vitrine sur-mesure pour votre restaurant.
        </p>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-5 pt-6">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-normal py-6 px-10 rounded-full transition-colors duration-300">
            Démarrer mon projet
          </button>

          <button className="border-2 border-zinc-600 hover:border-emerald-600 text-zinc-200 hover:text-emerald-500 font-normal py-6 px-10 rounded-full transition-all duration-300">
            En savoir plus
          </button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10">
          <div className="flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <span className="text-lg font-light text-zinc-300">Site web sur-mesure</span>
          </div>
        </div>
      </div>

      {/* Hero Visual */}
      <div className="relative">
        <div className="rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-800">
          {/* Visual content */}
        </div>
      </div>
    </div>
  </div>
</section>
```

### Card (Step/Feature)

```jsx
<div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
  {/* Icon/Number */}
  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-light">
    1
  </div>

  {/* Title */}
  <h3 className="text-3xl font-light text-zinc-200 mb-6">
    Titre de la card
  </h3>

  {/* Description */}
  <p className="text-zinc-400 text-lg leading-relaxed font-light">
    Description de la fonctionnalité ou de l'étape.
  </p>
</div>
```

---

## 🚫 Ce qu'il faut ÉVITER

### ❌ Gradients sur les backgrounds
```jsx
// ❌ MAUVAIS
<div className="bg-gradient-to-r from-emerald-600 to-teal-600">

// ✅ BON
<div className="bg-emerald-600">
```

### ❌ Font-bold partout
```jsx
// ❌ MAUVAIS
<h1 className="font-bold">

// ✅ BON
<h1 className="font-light">
```

### ❌ Ombres colorées
```jsx
// ❌ MAUVAIS
<div className="shadow-xl shadow-emerald-500/50">

// ✅ BON
<div className="border border-zinc-700">
```

### ❌ Trop d'animations
```jsx
// ❌ MAUVAIS
<div className="hover:scale-105 hover:rotate-3 hover:-translate-y-2 hover:shadow-2xl">

// ✅ BON
<div className="hover:border-emerald-600/50 transition-colors duration-300">
```

### ❌ Padding trop serré
```jsx
// ❌ MAUVAIS
<div className="p-4">

// ✅ BON
<div className="p-10 md:p-12">
```

### ❌ Blanc pur sur noir pur
```jsx
// ❌ MAUVAIS
<div className="bg-black text-white">

// ✅ BON
<div className="bg-zinc-900 text-zinc-200">
```

---

## 📋 Checklist d'Application

Avant de finaliser une page, vérifier :

- [ ] Background principal en `zinc-900`
- [ ] Texte principal en `zinc-200` (pas blanc pur)
- [ ] Accent vert `emerald-500/600` utilisé avec parcimonie
- [ ] Font-weight principalement `font-light` ou `font-normal`
- [ ] Padding généreux (2-3x la normale)
- [ ] Border radius : `rounded-2xl` ou `rounded-3xl` pour cards
- [ ] Boutons en `rounded-full`
- [ ] Pas d'ombres (ou très subtiles)
- [ ] Bordures fines (`border` ou `border-2`)
- [ ] Transitions douces sur `colors` uniquement
- [ ] Pas de scale/rotate sur hover
- [ ] Hiérarchie typographique respectée (sizes)
- [ ] Spacing responsive (augmente avec breakpoints)

---

## 🎓 Ressources & Inspiration

### Références de Design
- **Stripe** (payments) - Excellent dark mode minimaliste
- **Linear** (project management) - Référence en design dark clean
- **Vercel** - Design system minimaliste moderne
- **Cal.com** - Dark mode épuré

### Outils
- **Tailwind CSS** - Framework utilisé
- **Lucide Icons** - Icons minimalistes
- **Coolors.co** - Palette de couleurs

---

## 📝 Notes Finales

### Philosophie
> "Le design minimaliste dark ne signifie pas ennuyeux. C'est élégant, sophistiqué et met en valeur le contenu. Chaque élément doit avoir une raison d'exister."

### Priorités
1. **Lisibilité** avant tout (contraste suffisant)
2. **Espace** généreux (ne pas avoir peur du vide)
3. **Cohérence** (mêmes patterns partout)
4. **Performance** (animations légères)
5. **Accessibilité** (contraste WCAG AA minimum)

---

**Version:** 1.0
**Dernière mise à jour:** 2026-01-26
**Auteur:** TableMaster Design Team
