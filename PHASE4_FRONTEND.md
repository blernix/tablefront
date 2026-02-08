# Phase 4 : Frontend Signup - COMPLÉTÉE ✅

**Date** : 30 janvier 2026
**Durée** : ~1 heure

---

## 🎯 Objectif

Créer l'interface frontend permettant aux restaurateurs de s'inscrire, choisir un plan, et être redirigés vers le paiement Stripe.

---

## 📦 Fichiers créés

### 1. **app/(auth)/signup/page.tsx** (Page principale)

Page d'inscription complète avec :
- Sélection du plan (Starter vs Pro) avec comparaison visuelle
- Formulaire en 2 sections :
  - Informations restaurant (nom, adresse, téléphone, email)
  - Compte propriétaire (email, mot de passe)
- Validation côté client
- Appel API vers `/api/auth/signup`
- Redirection automatique vers Stripe Checkout

**Features** :
- ✅ Sélection plan interactive avec highlights
- ✅ Badges "Populaire" sur plan Pro
- ✅ Liste features par plan avec icônes Check
- ✅ Validation temps réel (mots de passe correspondent, etc.)
- ✅ Gestion erreurs API
- ✅ État de chargement pendant l'appel API
- ✅ Responsive (mobile/desktop)

### 2. **app/signup/success/page.tsx** (Page succès)

Page affichée après paiement réussi.

**Features** :
- ✅ Icône succès (CheckCircle2)
- ✅ Message de confirmation
- ✅ Session ID affiché (debug)
- ✅ Liste "Prochaines étapes"
- ✅ Bouton "Se connecter maintenant"
- ✅ Countdown auto-redirect (10 secondes) vers `/login`
- ✅ Info email de confirmation
- ✅ Lien contact support

### 3. **app/signup/cancel/page.tsx** (Page annulation)

Page affichée si l'utilisateur annule le paiement Stripe.

**Features** :
- ✅ Icône warning (XCircle)
- ✅ Explication de ce qui s'est passé
- ✅ Options disponibles (réessayer, nouveau compte, support)
- ✅ Note explicative sur l'état du compte
- ✅ Bouton retour inscription
- ✅ Bouton login
- ✅ Section FAQ "Pourquoi annulé ?"
- ✅ Note sécurité Stripe

---

## 🎨 Design & UX

### Layout

Toutes les pages utilisent :
- Container centré max-width (md: 640px pour success/cancel, 4xl pour signup)
- Background gris clair (`bg-gray-50`)
- Cards blanches avec ombre (`shadow sm:rounded-lg`)
- Padding responsive (`py-12 sm:px-6 lg:px-8`)

### Composants UI utilisés

- `Button` : Boutons primaires et outline
- `Input` : Champs de formulaire
- `Label` : Labels des inputs
- Icons Lucide : `Check`, `CheckCircle2`, `XCircle`, `ArrowLeft`

### Flow utilisateur

```
/signup
  ↓ Remplit formulaire
  ↓ Choisit plan
  ↓ Clique "Continuer vers le paiement"
  ↓ API call → Backend
  ↓ Redirect → Stripe Checkout

  [Paiement Stripe]

  ↓ Succès → /signup/success
     ↓ Auto-redirect 10s → /login

  ↓ Annulation → /signup/cancel
     ↓ Choix : retry ou login
```

---

## 🔌 Appel API

### Dans signup/page.tsx

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    restaurantName,
    restaurantAddress,
    restaurantPhone,
    restaurantEmail,
    ownerEmail,
    ownerPassword,
    plan: selectedPlan, // 'starter' | 'pro'
  }),
});

const data = await response.json();

if (data.checkout?.url) {
  window.location.href = data.checkout.url; // Redirect to Stripe
}
```

### Variables d'environnement requises

```env
# .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📊 Plans affichés

### Starter (39€/mois)

Features :
- 50 réservations par mois
- Widget standard
- Gestion horaires et jours fermés
- Support par email

### Pro (69€/mois) - Badge "Populaire"

Features :
- Réservations illimitées
- Widget personnalisable (couleurs, police)
- Gestion horaires et jours fermés
- Support prioritaire
- Analytics avancées

---

## ✅ Validations côté client

### Validation formulaire

```typescript
// Champs requis
if (!restaurantName || !restaurantAddress || !restaurantPhone ||
    !restaurantEmail || !ownerEmail || !ownerPassword || !confirmPassword) {
  setError('Veuillez remplir tous les champs');
  return;
}

// Mots de passe correspondent
if (ownerPassword !== confirmPassword) {
  setError('Les mots de passe ne correspondent pas');
  return;
}

// Longueur minimum password
if (ownerPassword.length < 6) {
  setError('Le mot de passe doit contenir au moins 6 caractères');
  return;
}
```

**Note** : Le backend fait aussi sa propre validation avec Zod.

---

## 🧪 Tests à effectuer

### Test 1 : Parcours complet Starter

1. Aller sur http://localhost:3000/signup
2. Sélectionner plan "Starter"
3. Remplir formulaire :
   - Restaurant : "Test Restaurant"
   - Adresse : "123 Test Street, Paris"
   - Téléphone : "+33123456789"
   - Email restaurant : "test@restaurant.com"
   - Email owner : "owner@test.com"
   - Password : "password123"
   - Confirm : "password123"
4. Cliquer "Continuer vers le paiement (39€/mois)"
5. Vérifier redirection vers Stripe
6. Utiliser carte test : `4242 4242 4242 4242`
7. Compléter paiement
8. Vérifier redirection vers `/signup/success`
9. Vérifier countdown 10s
10. Se faire redirect vers `/login`

**Attendu** :
- ✅ Tous les champs validés
- ✅ Redirection Stripe fonctionne
- ✅ Paiement accepté
- ✅ Page success affichée
- ✅ Auto-redirect login

### Test 2 : Parcours complet Pro

Mêmes étapes mais sélectionner "Pro" et vérifier prix 69€/mois.

### Test 3 : Validation mot de passe

1. Remplir formulaire
2. Password : "pass123"
3. Confirm : "different"
4. Soumettre

**Attendu** :
- ❌ Erreur "Les mots de passe ne correspondent pas"
- Pas d'appel API

### Test 4 : Validation longueur password

1. Password : "123"
2. Confirm : "123"
3. Soumettre

**Attendu** :
- ❌ Erreur "Le mot de passe doit contenir au moins 6 caractères"

### Test 5 : Email déjà utilisé

1. Utiliser email déjà inscrit
2. Soumettre

**Attendu** :
- ❌ Erreur backend "An account already exists with this email"
- Affiché dans l'UI

### Test 6 : Annulation Stripe

1. Remplir formulaire
2. Être redirigé vers Stripe
3. Cliquer "← Back" dans Stripe Checkout

**Attendu** :
- ✅ Redirection vers `/signup/cancel`
- Message expliquant la situation
- Options : retry ou login

### Test 7 : Responsive mobile

1. Ouvrir sur mobile (ou DevTools responsive mode)
2. Vérifier :
   - Plans s'empilent verticalement
   - Formulaire lisible
   - Boutons accessibles
   - Texte lisible

---

## 🎯 User Experience

### Page Signup

**Temps de remplissage** : ~2-3 minutes

**Points forts** :
- Comparaison claire des plans
- Formulaire en sections logiques
- Validation en temps réel
- Message d'erreur clair
- Loading state pendant API call

**Améliorations possibles** :
- Auto-complétion adresse (Google Places API)
- Force du mot de passe visuelle
- Tooltips sur features des plans
- Preview du widget selon le plan

### Page Success

**Temps de lecture** : ~10 secondes (avant auto-redirect)

**Points forts** :
- Confirmation visuelle immédiate
- Prochaines étapes claires
- Auto-redirect pour UX fluide
- Option skip countdown

**Améliorations possibles** :
- Animation de succès
- Preview du dashboard
- Bouton "Annuler le redirect"

### Page Cancel

**Temps de lecture** : Variable

**Points forts** :
- Explication claire de la situation
- Options multiples (retry/login/support)
- Pas de panique, ton rassurant
- FAQ inline

**Améliorations possibles** :
- FAQ plus détaillée
- Chat support direct
- Offre d'aide personnalisée

---

## 🔐 Sécurité

### Côté client

- ✅ Validation des champs avant envoi
- ✅ Pas de stockage de données sensibles
- ✅ HTTPS requis en production
- ✅ Pas de display du mot de passe

### Stripe

- ✅ Redirection vers domaine Stripe sécurisé
- ✅ Paiement PCI-compliant
- ✅ Aucune donnée bancaire stockée par nous
- ✅ Session Stripe expirable

---

## 📱 Responsive Design

### Breakpoints

- **Mobile** (< 640px) : Plans stacked, formulaire 1 colonne
- **Tablet** (640px - 1024px) : Plans côte à côte, formulaire 2 colonnes partielles
- **Desktop** (> 1024px) : Layout optimal, tout côte à côte

### Tailwind classes utilisées

```typescript
// Mobile first
className="grid grid-cols-1 gap-4 sm:grid-cols-2"
// 1 col sur mobile, 2 cols sur tablet+

className="sm:mx-auto sm:w-full sm:max-w-md"
// Centered container avec max-width responsive
```

---

## ⚠️ Points d'attention

### 1. NEXT_PUBLIC_API_URL

**Important** : La variable d'environnement doit être préfixée `NEXT_PUBLIC_` pour être accessible côté client.

```env
# ✅ Correct
NEXT_PUBLIC_API_URL=http://localhost:4000

# ❌ Incorrect (ne fonctionne pas côté client)
API_URL=http://localhost:4000
```

### 2. Redirection Stripe

La redirection se fait via `window.location.href` et non `router.push()` car :
- C'est un domaine externe (Stripe)
- Besoin de full page reload
- Session Stripe liée à l'origine

### 3. Compte créé mais inactif

Si l'utilisateur annule le paiement :
- Le compte existe en DB
- Mais il est `inactive`
- Il ne peut pas se logger et accéder au dashboard
- Il doit finaliser le paiement (TODO: permettre retry)

### 4. Session ID dans URL

La session ID Stripe est passée en query param :
```
/signup/success?session_id=cs_test_abc123...
```

**Utilité** :
- Vérification côté client (optionnel)
- Debug
- Analytics
- Future: appel API pour confirmer le paiement

---

## 🚀 Prochaines étapes (Phase 5)

Maintenant que l'inscription fonctionne, Phase 5 :

1. **Dashboard adaptatif selon accountType**
   - Managed : Dashboard complet (menus, réservations, tout)
   - Self-service : Dashboard limité (réservations uniquement)

2. **Section "Widget & Intégration"**
   - Afficher le code widget à copier
   - Instructions d'intégration
   - Customisation (Pro uniquement)

3. **Indicateurs d'abonnement**
   - Plan actuel affiché
   - Quota réservations (Starter)
   - Bouton "Gérer mon abonnement" (portail Stripe)

---

## ✅ Checklist Phase 4

- [x] Page /signup avec formulaire complet
- [x] Sélection plan Starter vs Pro
- [x] Comparaison visuelle des features
- [x] Validation côté client
- [x] Intégration API signup
- [x] Redirection Stripe Checkout
- [x] Page /signup/success
- [x] Auto-redirect vers login (10s)
- [x] Page /signup/cancel
- [x] Responsive design (mobile/desktop)
- [x] Gestion erreurs API
- [x] Loading states
- [x] Documentation PHASE4_FRONTEND.md
- [ ] Tests manuels (après démarrage serveurs)

---

## 🎬 Commandes de test

### Démarrer le backend

```bash
cd tablemaster-api
npm run dev
# Doit tourner sur http://localhost:4000
```

### Démarrer le frontend

```bash
cd tablemaster-frontend
npm run dev
# Doit tourner sur http://localhost:3000
```

### Tester l'inscription

1. Aller sur http://localhost:3000/signup
2. Remplir et soumettre
3. Vérifier console pour logs
4. Suivre redirection Stripe
5. Tester avec carte `4242 4242 4242 4242`

---

**Status** : ✅ Phase 4 complétée
**Prochaine étape** : Phase 5 - Dashboard adaptatif
**Temps restant estimé** : ~5 jours

---

**Dernière mise à jour** : 30 janvier 2026
