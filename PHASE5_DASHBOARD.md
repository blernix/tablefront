# Phase 5 : Dashboard Adaptatif - COMPLÉTÉE ✅

**Date** : 30 janvier 2026
**Durée** : ~2 heures

---

## 🎯 Objectif

Adapter le dashboard frontend pour différencier les comptes "managed" et "self-service" :
- Cacher la section menus pour les comptes self-service
- Afficher un indicateur d'abonnement pour les self-service
- Ajouter une section "Widget & Intégration" pour les self-service
- Bouton "Gérer mon abonnement" redirigeant vers le portail Stripe

---

## 📦 Fichiers modifiés

### 1. **src/types/index.ts** (Type Restaurant mis à jour)

Ajout des nouveaux champs créés en Phase 1 à l'interface TypeScript :

```typescript
export interface Restaurant {
  // ... champs existants
  accountType: 'managed' | 'self-service';
  subscription?: {
    plan: 'starter' | 'pro';
    status: 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    trialEndsAt?: string;
  };
  widgetConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
  // ... reste des champs
}
```

**Raison** : Le frontend doit connaître les nouveaux champs ajoutés au modèle Restaurant backend.

---

### 2. **src/components/dashboard/Sidebar.tsx** (Navigation conditionnelle)

**Modifications** :
- Import de `useState`, `useEffect` pour gérer l'état du restaurant
- Import de `apiClient` et `Restaurant` type
- Fetch du restaurant au mount du composant
- Filtrage de la navigation pour masquer "Menus" si `accountType === 'self-service'`

**Code clé** :

```typescript
const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

// Fetch restaurant data to check accountType
useEffect(() => {
  const fetchRestaurant = async () => {
    if (user?.restaurantId) {
      try {
        const response = await apiClient.getMyRestaurant();
        setRestaurant(response.restaurant);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      }
    }
  };
  fetchRestaurant();
}, [user?.restaurantId]);

// Filter navigation based on user role and accountType
const filteredNavigation = useMemo(() => {
  let filtered = navigation.filter((item) =>
    user?.role ? item.allowedRoles.includes(user.role as any) : false
  );

  // Hide "Menus" for self-service accounts
  if (restaurant?.accountType === 'self-service') {
    filtered = filtered.filter((item) => item.name !== 'Menus');
  }

  return filtered;
}, [user?.role, restaurant?.accountType]);
```

**Résultat** :
- ✅ Comptes managed : voient "Tableau de bord", "Réservations", "Menus", "Paramètres"
- ✅ Comptes self-service : voient "Tableau de bord", "Réservations", "Paramètres" (pas de Menus)

---

### 3. **src/app/dashboard/page.tsx** (Dashboard principal adaptatif)

**Modifications** :

#### A. Imports ajoutés
```typescript
import { Code, Crown, Settings as SettingsIcon } from 'lucide-react';
```

#### B. État pour le portail Stripe
```typescript
const [isPortalLoading, setIsPortalLoading] = useState(false);
```

#### C. Indicateur d'abonnement (après le header)
```typescript
{restaurant?.accountType === 'self-service' && restaurant.subscription && (
  <Card className="border-[#0066FF] bg-gradient-to-r from-blue-50 to-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-[#0066FF] bg-[#0066FF]">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#2A2A2A]">
              Plan {restaurant.subscription.plan === 'starter' ? 'Starter' : 'Pro'}
            </h3>
            <p className="text-sm text-[#666666]">
              Statut : <Badge variant={restaurant.subscription.status === 'active' ? 'success' : 'warning'}>
                {restaurant.subscription.status === 'active' ? 'Actif' : restaurant.subscription.status}
              </Badge>
            </p>
            {restaurant.subscription.currentPeriodEnd && (
              <p className="text-xs text-[#666666] mt-1">
                Renouvellement le {new Date(restaurant.subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManageSubscription}
          disabled={isPortalLoading}
        >
          <SettingsIcon className="h-4 w-4" />
          {isPortalLoading ? 'Chargement...' : 'Gérer mon abonnement'}
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

**Affiche** :
- Plan actuel (Starter ou Pro)
- Statut de l'abonnement (badge coloré)
- Date de renouvellement
- Bouton "Gérer mon abonnement"

#### D. Masquage de la carte "Menu"
```typescript
{/* Only show menu stats for managed accounts */}
{restaurant?.accountType !== 'self-service' && (
  <Card className="card-hover p-8">
    {/* Menu stats card */}
  </Card>
)}
```

**Résultat** :
- ✅ Comptes managed : voient la carte avec stats menus
- ✅ Comptes self-service : ne voient pas cette carte

#### E. Section "Widget & Intégration"
```typescript
{restaurant?.accountType === 'self-service' && (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-[#0066FF]" />
            Widget de réservation
          </CardTitle>
          <CardDescription>Intégrez le widget sur votre site web</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Code d'intégration */}
      <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4 rounded-md">
        <p className="text-sm font-medium text-[#2A2A2A] mb-2">Code d'intégration</p>
        <div className="bg-[#2A2A2A] text-white p-3 rounded text-xs font-mono overflow-x-auto">
          {`<script src="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/widget.js" data-api-key="${restaurant.apiKey}"></script>`}
        </div>
        <p className="text-xs text-[#666666] mt-2">
          Copiez ce code et collez-le dans le code HTML de votre site web, juste avant la balise <code>&lt;/body&gt;</code>
        </p>
      </div>

      {/* Personnalisation Pro */}
      {restaurant.subscription?.plan === 'pro' && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <p className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Personnalisation Pro
          </p>
          <p className="text-xs text-blue-800 mb-3">
            Avec votre plan Pro, vous pouvez personnaliser les couleurs et la police du widget.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/settings/widget')}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Personnaliser le widget
          </Button>
        </div>
      )}

      {/* API Key et URL embed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="border border-[#E5E5E5] p-3 rounded">
          <p className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
            Clé API
          </p>
          <p className="text-sm text-[#2A2A2A] font-mono mt-1 break-all">
            {restaurant.apiKey}
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-3 rounded">
          <p className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
            URL embed
          </p>
          <p className="text-sm text-[#2A2A2A] font-mono mt-1 break-all">
            {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/embed/reservations/{restaurant.apiKey}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

**Affiche** :
- Code JavaScript à copier-coller
- Instructions d'intégration
- Badge "Personnalisation Pro" si plan Pro
- Clé API
- URL embed

#### F. Handler pour le portail Stripe
```typescript
const handleManageSubscription = async () => {
  if (isPortalLoading) return;

  setIsPortalLoading(true);
  try {
    const response = await apiClient.billing.createPortalSession();
    if (response.url) {
      window.location.href = response.url;
    }
  } catch (error) {
    console.error('Error opening Stripe portal:', error);
    alert('Erreur lors de l\'ouverture du portail de gestion. Veuillez réessayer.');
    setIsPortalLoading(false);
  }
};
```

**Fonctionnement** :
1. Appelle l'API `/api/billing/create-portal`
2. Récupère l'URL du portail Stripe
3. Redirige l'utilisateur vers le portail
4. Gère les erreurs avec une alerte

---

### 4. **src/lib/api/billing.ts** (Nouveau module API)

Nouveau fichier créé pour gérer les opérations de facturation :

```typescript
import { ApiClient } from './base';

export class BillingApi extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async createPortalSession(): Promise<{ url: string }> {
    const response = await this.request<{ url: string }>('POST', '/api/billing/create-portal', {});
    return response;
  }

  async getSubscription(): Promise<any> {
    const response = await this.request('GET', '/api/billing/subscription', {});
    return response;
  }

  async cancelSubscription(): Promise<any> {
    const response = await this.request('POST', '/api/billing/cancel', {});
    return response;
  }

  async getPlans(): Promise<any> {
    const response = await this.request('GET', '/api/billing/plans', {});
    return response;
  }
}
```

**Méthodes** :
- `createPortalSession()` : Génère URL du portail client Stripe
- `getSubscription()` : Récupère les détails de l'abonnement
- `cancelSubscription()` : Annule l'abonnement
- `getPlans()` : Liste les plans disponibles

---

### 5. **src/lib/api/index.ts** (Intégration du module billing)

**Modifications** :
- Import de `BillingApi`
- Ajout de la propriété `public billing: BillingApi`
- Initialisation dans le constructeur
- Ajout aux méthodes `setToken()` et `setOnUnauthorized()`

**Code ajouté** :

```typescript
import { BillingApi } from './billing';

class UnifiedApiClient {
  // ... autres propriétés
  public billing: BillingApi;

  constructor(baseUrl: string) {
    // ... autres initialisations
    this.billing = new BillingApi(baseUrl);
  }

  setToken(token: string | null) {
    // ... autres modules
    this.billing.setToken(token);
  }

  setOnUnauthorized(callback: () => void) {
    // ... autres modules
    this.billing.setOnUnauthorized(callback);
  }
}
```

**Permet** :
- Utiliser `apiClient.billing.createPortalSession()` partout dans l'app
- Gestion automatique du token JWT
- Callback d'erreur 401 unifié

---

## 🎨 Design & UX

### Indicateur d'abonnement

**Apparence** :
- Card avec bordure bleue et gradient de fond
- Icône Crown (couronne)
- Plan affiché (Starter/Pro)
- Badge de statut coloré :
  - Vert : `active`
  - Jaune : `trial`, `past_due`
  - Rouge : `cancelled`, `expired`
- Date de renouvellement
- Bouton "Gérer mon abonnement"

**États** :
- Normal : Bouton cliquable
- Chargement : Bouton disabled, texte "Chargement..."
- Erreur : Alert JavaScript

### Section Widget

**Structure** :
1. **Titre** : "Widget de réservation" avec icône Code
2. **Code d'intégration** : Bloc noir avec code HTML/JS
3. **Instructions** : Texte explicatif sous le code
4. **Badge Pro** (si plan Pro) : Encart bleu avec info personnalisation
5. **Infos techniques** : Grid 2 colonnes (Clé API, URL embed)

**Responsive** :
- Mobile : Grid 1 colonne
- Desktop : Grid 2 colonnes

---

## 🔌 Endpoints API utilisés

### GET /api/restaurants/my

Récupère les données du restaurant de l'utilisateur connecté.

**Utilisé dans** :
- `Sidebar.tsx` : Pour déterminer l'accountType
- `page.tsx` : Pour afficher toutes les infos du dashboard

**Réponse** :
```json
{
  "restaurant": {
    "_id": "...",
    "name": "Mon Restaurant",
    "accountType": "self-service",
    "subscription": {
      "plan": "pro",
      "status": "active",
      "currentPeriodEnd": "2026-02-28T00:00:00.000Z"
    },
    "apiKey": "abc123...",
    // ... autres champs
  }
}
```

### POST /api/billing/create-portal

Crée une session Stripe Customer Portal et retourne l'URL.

**Body** : `{}`

**Réponse** :
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

**Flow** :
1. Frontend appelle l'endpoint
2. Backend crée la session Stripe avec `stripeCustomerId`
3. Backend retourne l'URL
4. Frontend redirige (`window.location.href`)
5. Utilisateur gère son abonnement sur Stripe
6. Stripe redirige vers `FRONTEND_URL/dashboard`

---

## ✅ Checklist Phase 5

- [x] Mise à jour du type Restaurant dans types/index.ts
- [x] Sidebar : Fetch restaurant et filtrage navigation
- [x] Sidebar : Masquage "Menus" pour self-service
- [x] Dashboard : Indicateur d'abonnement pour self-service
- [x] Dashboard : Masquage carte "Menu" pour self-service
- [x] Dashboard : Section "Widget & Intégration" pour self-service
- [x] Dashboard : Bouton "Gérer mon abonnement" fonctionnel
- [x] Création du module API billing.ts
- [x] Intégration du module billing dans api/index.ts
- [x] Handler `handleManageSubscription` avec gestion d'erreurs
- [x] Documentation PHASE5_DASHBOARD.md

---

## 🧪 Tests à effectuer

### Test 1 : Compte Managed

1. Se connecter avec un compte managed (créé par admin)
2. Aller sur `/dashboard`

**Attendu** :
- ✅ Sidebar affiche : Tableau de bord, Réservations, Menus, Paramètres
- ✅ Dashboard affiche la carte "Menu" avec stats
- ✅ Pas d'indicateur d'abonnement
- ✅ Pas de section "Widget & Intégration"

### Test 2 : Compte Self-Service Starter

1. S'inscrire via `/signup` avec plan Starter
2. Compléter le paiement Stripe
3. Se connecter

**Attendu** :
- ✅ Sidebar affiche : Tableau de bord, Réservations, Paramètres (PAS de Menus)
- ✅ Dashboard affiche indicateur "Plan Starter", statut "Actif"
- ✅ Dashboard n'affiche PAS la carte "Menu"
- ✅ Dashboard affiche section "Widget & Intégration"
- ✅ Code widget affiché avec `apiKey`
- ✅ Pas de badge "Personnalisation Pro"

### Test 3 : Compte Self-Service Pro

1. S'inscrire via `/signup` avec plan Pro
2. Compléter le paiement Stripe
3. Se connecter

**Attendu** :
- ✅ Sidebar affiche : Tableau de bord, Réservations, Paramètres (PAS de Menus)
- ✅ Dashboard affiche indicateur "Plan Pro", statut "Actif"
- ✅ Dashboard affiche badge "Personnalisation Pro"
- ✅ Bouton "Personnaliser le widget" présent

### Test 4 : Bouton "Gérer mon abonnement"

1. Se connecter avec compte self-service
2. Cliquer sur "Gérer mon abonnement"

**Attendu** :
- ✅ Bouton passe en état "Chargement..."
- ✅ Redirection vers Stripe Customer Portal
- ✅ Portal affiche les détails de l'abonnement
- ✅ Possibilité d'annuler, mettre à jour paiement, voir factures
- ✅ Retour sur `/dashboard` après action

### Test 5 : Responsive

1. Ouvrir sur mobile (ou DevTools)
2. Vérifier toutes les sections

**Attendu** :
- ✅ Indicateur d'abonnement : layout vertical
- ✅ Section widget : code scrollable horizontalement
- ✅ Grid API Key/URL : 1 colonne sur mobile

---

## 🎯 User Experience

### Pour les comptes Managed

**Expérience inchangée** :
- Dashboard identique à avant Phase 5
- Accès complet à toutes les fonctionnalités
- Pas de notion d'abonnement visible

### Pour les comptes Self-Service

**Nouvelle expérience** :
- Visibilité immédiate sur le plan actuel
- Accès facile au code du widget (copier-coller)
- Bouton direct pour gérer l'abonnement
- UI propre et focalisée sur les réservations

**Points forts** :
- Simplicité : Pas de menu à gérer
- Clarté : Plan affiché en haut du dashboard
- Autonomie : Gestion d'abonnement en 1 clic
- Instructions claires pour intégrer le widget

**Améliorations possibles** :
- Bouton "Copier" pour le code widget
- Preview du widget en temps réel
- Stats d'utilisation du widget
- Graphique des réservations via widget

---

## 🔐 Sécurité

### Côté Frontend

- ✅ Pas de logique métier sensible
- ✅ Affichage conditionnel basé sur `accountType`
- ✅ Token JWT transmis automatiquement par `apiClient`
- ✅ Gestion erreur 401 (session expirée)

### Côté Backend (Phase 2)

- ✅ Endpoint `/api/billing/create-portal` protégé par JWT
- ✅ Vérification que le user possède un `stripeCustomerId`
- ✅ Session Stripe liée au bon customer
- ✅ Retour automatique vers `FRONTEND_URL/dashboard`

---

## 📊 Impact sur les performances

**Sidebar** :
- +1 requête API au mount (`getMyRestaurant`)
- Cache possible avec React Query (amélioration future)

**Dashboard** :
- Aucune requête supplémentaire (données déjà fetched)
- Rendu conditionnel léger (React optimise)

**Billing API** :
- Module léger (~50 lignes)
- Pas d'impact sur bundle size

---

## 🚀 Prochaines étapes (Phase 6)

Maintenant que le dashboard est adapté, Phase 6 :

1. **Créer la page embed `/embed/reservations/:apiKey`**
   - Page publique (pas de login requis)
   - Affiche le formulaire de réservation
   - Utilise l'apiKey pour identifier le restaurant

2. **Créer le script `widget.js`**
   - Script embeddable sur sites externes
   - Charge la page embed en iframe
   - Applique les styles personnalisés (Pro)

3. **Page de personnalisation widget (Pro)**
   - `/dashboard/settings/widget`
   - Formulaire pour couleurs, police
   - Preview en temps réel

4. **Appliquer widgetConfig**
   - CSS variables injectées dans l'iframe
   - Couleurs primaire/secondaire
   - Police personnalisée
   - Border radius

---

**Status** : ✅ Phase 5 complétée
**Prochaine étape** : Phase 6 - Widget de réservation
**Temps restant estimé** : ~4 jours

---

**Dernière mise à jour** : 30 janvier 2026
