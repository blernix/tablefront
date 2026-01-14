# TableMaster - Progressive Web App (PWA)

TableMaster est maintenant une Progressive Web App complète ! Cela signifie que les utilisateurs peuvent installer l'application sur leur mobile ou ordinateur et l'utiliser comme une application native.

## Fonctionnalités PWA

✅ **Installation sur mobile et desktop**
- L'app peut être installée directement depuis le navigateur
- Icône sur l'écran d'accueil
- Lancement en mode standalone (sans barre d'URL)

✅ **Mode offline**
- Les assets statiques sont mis en cache
- L'application fonctionne même sans connexion Internet (limité)

✅ **Performance optimisée**
- Chargement rapide grâce au cache
- Service Worker pour la gestion des ressources

## Comment tester la PWA

### 1. En développement local

La PWA est **désactivée en développement** pour éviter les problèmes de cache. Pour tester la PWA localement :

```bash
# Build production
npm run build

# Démarrer en mode production
npm start
```

Puis ouvrez `http://localhost:3000` dans votre navigateur.

### 2. Sur mobile (Android/iOS)

#### Android (Chrome)
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu (3 points verticaux)
3. Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil"
4. L'icône TableMaster apparaîtra sur votre écran d'accueil

#### iOS (Safari)
1. Ouvrez l'application dans Safari
2. Appuyez sur le bouton Partager (icône en bas)
3. Sélectionnez "Sur l'écran d'accueil"
4. Confirmez l'ajout

### 3. Sur Desktop (Chrome/Edge)

1. Ouvrez l'application dans Chrome ou Edge
2. Cherchez l'icône d'installation dans la barre d'adresse (à droite)
3. Cliquez sur "Installer TableMaster"
4. L'application s'ouvrira dans une fenêtre dédiée

## Vérifier que la PWA fonctionne

### Chrome DevTools

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Application**
3. Dans le panneau de gauche :
   - **Manifest** : Vérifiez que le manifest.json est chargé
   - **Service Workers** : Vérifiez qu'un Service Worker est actif
   - **Cache Storage** : Vérifiez que les ressources sont mises en cache

### Lighthouse Audit

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet **Lighthouse**
3. Sélectionnez "Progressive Web App"
4. Cliquez sur "Analyze page load"
5. Vous devriez obtenir un score élevé (>80)

## Configuration PWA

### Fichiers principaux

- **`next.config.js`** : Configuration next-pwa
- **`public/manifest.json`** : Métadonnées de l'application
- **`public/icons/`** : Icônes PWA (8 tailles différentes)
- **`public/icon.svg`** : Icône source SVG
- **`src/app/layout.tsx`** : Métadonnées et liens PWA

### Modifier les icônes

Pour personnaliser l'icône de l'application :

1. Modifiez le fichier `public/icon.svg`
2. Régénérez les icônes :
   ```bash
   node scripts/generate-icons.js
   ```

### Modifier les couleurs

Les couleurs de l'application sont définies dans `public/manifest.json` :
- **`theme_color`** : Couleur de la barre d'outils (actuellement bleu #2563eb)
- **`background_color`** : Couleur de fond au démarrage (actuellement blanc #ffffff)

## Service Worker

Le Service Worker est généré automatiquement par next-pwa :
- En **production** : Service Worker actif, mise en cache des ressources
- En **développement** : Service Worker désactivé pour éviter les problèmes

Les fichiers générés sont dans `.gitignore` et ne doivent pas être committés :
- `public/sw.js`
- `public/workbox-*.js`
- `public/worker-*.js`

## Stratégies de cache

next-pwa utilise Workbox avec les stratégies suivantes :
- **Pages HTML** : Network First (toujours frais si connecté)
- **JS/CSS** : Cache First (chargement rapide)
- **Images** : Cache First avec expiration
- **API** : Network Only (toujours frais)

## Dépannage

### L'icône d'installation n'apparaît pas
- Vérifiez que vous êtes en mode production (`npm run build && npm start`)
- Vérifiez que HTTPS est activé (requis pour PWA)
- Ouvrez les DevTools > Application pour voir les erreurs

### Le Service Worker ne se met pas à jour
- Fermez tous les onglets de l'application
- Rouvrez l'application
- Ou forcez la mise à jour dans DevTools > Application > Service Workers

### Problèmes de cache en développement
- La PWA est désactivée en développement
- Si vous voyez des problèmes de cache, videz le cache du navigateur

## Déploiement

Pour que la PWA fonctionne en production :
1. ✅ HTTPS activé (obligatoire pour PWA)
2. ✅ Service Worker généré automatiquement par next-pwa
3. ✅ manifest.json accessible à `/manifest.json`
4. ✅ Icônes accessibles dans `/icons/`

## Ressources

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [PWA Guidelines (MDN)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
