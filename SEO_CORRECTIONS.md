# Corrections SEO pour TableMaster

## Problèmes Identifiés et Solutions Implémentées

### ✅ 1. Sitemap Dynamique

**Problème**: Sitemap statique (`public/sitemap.xml`) non optimisé pour Next.js App Router.
**Solution**:

- Création de `src/app/sitemap.ts` (génération dynamique)
- Suppression du sitemap statique (backup dans `public/sitemap.xml.backup`)
- URLs incluses: `/`, `/legal`, `/privacy`, `/cookies`, `/cgv`, `/signup`, `/login`

### ✅ 2. Robots.txt Dynamique

**Problème**: Fichier `robots.txt` statique avec directives périmées.
**Solution**:

- Création de `src/app/robots.ts` (génération dynamique)
- Backup de l'ancien fichier (`public/robots.txt.backup`)
- Directive `Sitemap: https://tablemaster.fr/sitemap.xml` incluse

### ✅ 3. Configuration Nginx Optimisée

**Problèmes**:

1. Pas de redirection `www` vers `non-www`
2. Headers de sécurité en double avec Next.js
3. Configuration SSL non optimisée
4. Cache incorrect pour fichiers SEO

**Solutions** (voir `nginx-tablemaster-optimized.conf`):

#### a) Redirections

```nginx
# HTTP -> HTTPS + WWW -> NON-WWW
server {
    listen 80;
    server_name tablemaster.fr www.tablemaster.fr;
    return 301 https://tablemaster.fr$request_uri;
}

# WWW HTTPS -> NON-WWW HTTPS
server {
    listen 443 ssl http2;
    server_name www.tablemaster.fr;
    return 301 https://tablemaster.fr$request_uri;
}
```

#### b) Headers de Sécurité Harmonisés

- **HSTS** uniquement dans Nginx (pour toutes les réponses)
- **X-Frame-Options**, **X-Content-Type-Options**, etc. gérés par Next.js
- Suppression des doublons pour éviter les conflits

#### c) Cache Optimisé pour SEO

- `sitemap.xml`: Cache 1 heure
- `robots.txt`: Cache 24 heures
- `favicon/`: Cache 1 an (immutable)
- Fichiers statiques: Cache 1 an (immutable)

### ✅ 4. Headers HSTS Corrigés

**Problème**: Double header `Strict-Transport-Security` (Nginx + Next.js)
**Solution**:

- Suppression de HSTS dans `next.config.js` (lignes 81-83)
- HSTS géré uniquement par Nginx avec `always` flag

### ✅ 5. Métadonnées et Indexation

**Problèmes**:

- Pages `/signup` et `/login` marquées `noindex, nofollow` (déjà correct)
- Favicon accessible mais non indexable (normal)

**Vérifications**:

- ✅ `src/config/metadata.ts` correctement configuré
- ✅ Pages d'administration exclues du sitemap
- ✅ Canonicals corrects via `PageMetadata` component

## 🚀 Étapes de Déploiement

### Étape 1: Mettre à jour le Code Next.js

```bash
# Sur votre VPS, dans le répertoire du frontend
cd /chemin/vers/tablemaster-frontend

# Récupérer les modifications (git pull ou copie manuelle)
git pull origin main

# Ou copier manuellement les fichiers:
# - src/app/sitemap.ts
# - src/app/robots.ts
# - next.config.js (modifié)

# Installer les dépendances
npm install

# Redémarrer PM2
pm2 restart tablemaster-frontend
```

### Étape 2: Mettre à jour la Configuration Nginx

```bash
# Backup de l'ancienne configuration
sudo cp /etc/nginx/sites-available/tablemaster.fr /etc/nginx/sites-available/tablemaster.fr.backup

# Copier la nouvelle configuration
sudo cp nginx-tablemaster-optimized.conf /etc/nginx/sites-available/tablemaster.fr

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### Étape 3: Vérifier les Redirections

```bash
# Tester les redirections
curl -I http://tablemaster.fr              # Doit rediriger vers https://tablemaster.fr
curl -I http://www.tablemaster.fr          # Doit rediriger vers https://tablemaster.fr
curl -I https://www.tablemaster.fr         # Doit rediriger vers https://tablemaster.fr

# Tester les fichiers SEO
curl https://tablemaster.fr/sitemap.xml
curl https://tablemaster.fr/robots.txt
curl https://tablemaster.fr/favicon/favicon.ico
```

### Étape 4: Vérifier les En-têtes HTTP

```bash
# Vérifier les headers
curl -I https://tablemaster.fr/
# Doit inclure: Strict-Transport-Security, mais PAS X-Frame-Options (géré par Next.js)

curl -I https://tablemaster.fr/embed/reservations/test
# Doit inclure: Content-Security-Policy: frame-ancestors *; (pour iframe)
```

### Étape 5: Soumettre à Google Search Console

1. **Resoumettre le Sitemap**:
   - Google Search Console → Sitemaps → Resoumettre `https://tablemaster.fr/sitemap.xml`
2. **Demander une Nouvelle Indexation**:
   - Pour les URLs problématiques: `/`, `/cookies`, `/privacy`, `/legal`, `/cgv`
   - Utiliser l'outil "Inspection d'URL" → "Demander une indexation"

3. **Vérifier la Couverture**:
   - Surveiller les erreurs d'exploration dans les 48-72h

## 🔍 Problèmes DNS à Vérifier (Critique!)

### Problème: `http://5tashabbus.apptest.uz/` apparaît comme canonical

**Causes possibles**:

1. Enregistrement CNAME pour `www.tablemaster.fr` pointant vers `5tashabbus.apptest.uz`
2. Ancien certificat SSL contaminé
3. Cache DNS ou cache Google

**Actions requises**:

```bash
# 1. Vérifier les enregistrements DNS
dig www.tablemaster.fr CNAME
dig www.tablemaster.fr A
dig www.tablemaster.fr AAAA

# 2. Vérifier la configuration SSL
sudo certbot certificates

# 3. Vérifier les fichiers de configuration Nginx
grep -r "5tashabbus" /etc/nginx/
```

**Solution DNS**:

- S'assurer que `www.tablemaster.fr` pointe vers la même IP que `tablemaster.fr`
- Supprimer tout enregistrement CNAME pointant vers des domaines externes
- Configurer une redirection 301 explicite dans Nginx (déjà fait)

## 📊 Monitoring Post-Déploiement

1. **Google Search Console**:
   - Vérifier l'état d'indexation dans 7 jours
   - Surveiller les erreurs d'exploration

2. **Logs Nginx**:

   ```bash
   sudo tail -f /var/log/nginx/tablemaster.access.log | grep -E "(sitemap|robots|favicon)"
   ```

3. **Performances**:
   - Tester les vitesses de chargement (PageSpeed Insights)
   - Vérifier le cache des fichiers statiques

## 📞 Support et Dépannage

### Problèmes Courants et Solutions

| Problème               | Solution                                                        |
| ---------------------- | --------------------------------------------------------------- |
| Erreur 502 Bad Gateway | Vérifier que PM2 tourne: `pm2 status`                           |
| Sitemap non accessible | Vérifier `src/app/sitemap.ts`, redémarrer Next.js               |
| Redirections en boucle | Vérifier la configuration Nginx, tester avec `curl -I`          |
| Headers manquants      | Vérifier `next.config.js` et `nginx-tablemaster-optimized.conf` |

### Commandes Utiles

```bash
# Vérifier l'état des services
sudo systemctl status nginx
pm2 status

# Voir les logs
sudo journalctl -u nginx -f
pm2 logs tablemaster-frontend

# Tester la configuration
sudo nginx -t
curl -I https://tablemaster.fr/sitemap.xml
```

## ✅ Résumé des Changements

### Fichiers Modifiés/Créés:

- `src/app/sitemap.ts` - NOUVEAU (sitemap dynamique)
- `src/app/robots.ts` - NOUVEAU (robots.txt dynamique)
- `next.config.js` - MODIFIÉ (retrait HSTS en double)
- `nginx-tablemaster-optimized.conf` - NOUVEAU (configuration optimisée)

### Fichiers Backup/Supprimés:

- `public/sitemap.xml` → `public/sitemap.xml.backup`
- `public/robots.txt` → `public/robots.txt.backup`

### Configuration Serveur:

- Redirections WWW → NON-WWW implémentées
- Headers de sécurité harmonisés
- Cache optimisé pour le SEO
- SSL optimisé (HTTP/2, cipher suites modernes)

## ⏱️ Délais d'Indexation

- **Redirections**: Immédiates (301 permanentes)
- **Sitemap**: Google met à jour en 24-48h
- **Indexation complète**: 3-7 jours
- **Cache DNS**: Jusqu'à 48h (TTL)

**Note**: Les problèmes DNS (`5tashabbus.apptest.uz`) doivent être résolus en priorité, car ils empêchent une indexation correcte de la version `www`.
