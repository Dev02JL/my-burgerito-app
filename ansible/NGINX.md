# Configuration Nginx pour Burgerito

## Vue d'ensemble

Nginx est configuré comme reverse proxy devant l'application Next.js qui tourne sur le port 3000 avec PM2.

## Fichiers de configuration

- **Template** : `templates/nginx-burgerito.conf.j2`
- **Destination** : `/etc/nginx/sites-available/burgerito`
- **Lien symbolique** : `/etc/nginx/sites-enabled/burgerito`

## Fonctionnalités

### 1. Reverse Proxy
- Proxy vers `http://127.0.0.1:3000` (application Next.js)
- Headers HTTP correctement transmis (X-Real-IP, X-Forwarded-For, etc.)

### 2. Support WebSocket
- Route `/api/socket` configurée pour le chat temps réel
- Headers `Upgrade` et `Connection` gérés correctement
- Timeouts étendus (3600s) pour maintenir les connexions longues

### 3. Support SSE (Server-Sent Events)
- Route `/api/order-status` configurée pour le suivi de commande en temps réel
- Buffering désactivé pour permettre le streaming
- Headers Cache-Control appropriés

### 4. Optimisations
- Cache pour les assets statiques (30 jours)
- Buffering optimisé pour les requêtes normales
- Taille maximale d'upload : 10M

### 5. Sécurité
- Version Nginx masquée (`server_tokens off`)
- Headers de sécurité :
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`

## Variables de configuration

Dans `vars.yml` :

```yaml
nginx_server_name: "_"  # "_" pour tous les domaines, ou un domaine spécifique
nginx_config_file: "/etc/nginx/sites-available/burgerito"
nginx_enabled: true
```

## Déploiement

La configuration Nginx est automatiquement déployée lors de l'exécution du playbook Ansible :

```bash
ansible-playbook -i inventory.yml playbook.yml
```

Les tâches Ansible :
1. Installent Nginx
2. Créent le fichier de configuration depuis le template
3. Activent le site (créent le lien symbolique)
4. Désactivent le site par défaut
5. Testent la configuration (`nginx -t`)
6. Redémarrent Nginx

## Logs

- **Access log** : `/var/log/nginx/burgerito-access.log`
- **Error log** : `/var/log/nginx/burgerito-error.log`

## Vérification

Après le déploiement, vérifier que Nginx fonctionne :

```bash
# Vérifier le statut
sudo systemctl status nginx

# Tester la configuration
sudo nginx -t

# Voir les logs
sudo tail -f /var/log/nginx/burgerito-access.log
sudo tail -f /var/log/nginx/burgerito-error.log
```

## Configuration HTTPS (optionnel)

Pour ajouter HTTPS avec Let's Encrypt, ajouter dans le template :

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # ... reste de la configuration
}

# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}
```
