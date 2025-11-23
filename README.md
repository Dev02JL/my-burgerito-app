## Burgerito – Frontend (Next.js 15 + React 19)

Application e-commerce simple (catalogue burgers, panier, auth et commandes) connectée à une API Node.

### Prérequis
- Node 18+
- Créez un fichier `.env.local` à la racine avec:
```
NEXT_PUBLIC_API_BASE_URL=https://node-eemi.vercel.app
```

### Démarrer en local
```bash
npm install
npm run dev
# http://localhost:3000
```

### Scripts utiles
- `npm run dev`: lancement en développement
- `npm run build && npm start`: build et exécution en production
- `npm run lint`: lint

### Fonctionnalités principales
- Catalogue produits (SSR/ISR) et page de détail avec badge “indisponible”.
- Panier client persistant 7j via cookie `burgerito.cart.v1` (quantités, total, mini-panier).
- Authentification via cookies HttpOnly:
  - `POST /api/session/login` et `POST /api/session/register` (proxys vers l’API).
  - `GET /api/session/me` pour récupérer l’utilisateur courant.
  - `POST /api/session/logout` pour se déconnecter.
- Middleware de protection (redirection vers `/connexion` si non connecté): `"/panier"`, `"/commande/**"`, `"/profile/**"`.
- Commande: création via proxy `POST /api/orders/create` (transmet le cookie au backend).
- Profil: historique de commandes (groupé par date) via proxys `/api/proxy/orders/*`.
- Chat temps réel (WebSocket):
  - Endpoint serveur `pages/api/socket.ts` (ws).
  - Widget flottant `ChatSupport` accessible (aria-live, focus).
- Suivi de commande en temps réel (SSE):
  - Endpoint `pages/api/order-status/[id].ts`.
  - Page `/commande/suivi/[id]` qui affiche les 4 statuts: “En préparation”, “En cuisson”, “Prête à être livrée”, “Livrée”.
- Accessibilité: labels, focus visibles, aria-live pour chat et suivi, boutons désactivés avec `aria-disabled` lorsque nécessaire.

### Structure (extraits)
- `src/app/page.tsx`: page d’accueil (catalogue)
- `src/app/burger/[slug]/page.tsx`: détail d’un produit
- `src/app/panier/page.tsx`: panier complet
- `src/app/profile/page.tsx`: historique des commandes
- `src/components/MiniCart.tsx`: mini-panier
- `src/lib/cart.tsx`: contexte panier (`add`, `updateQty`, `remove`, `clear`)
- `src/pages/api/socket.ts`: serveur WebSocket (chat)
- `src/pages/api/order-status/[id].ts`: serveur SSE (statuts de commande)
- `src/app/api/session/*`: endpoints de session (cookies HttpOnly)
- `src/app/api/orders/create/route.ts`: proxy création de commande
- `src/app/api/proxy/orders/*`: proxys lecture d’historique
- `src/middleware.ts`: routes protégées côté serveur

### Notes
- Les images distantes utilisent `next/image` (domaine blob autorisé). En cas d’erreur domaine, utilisez `unoptimized` ou ajoutez le domaine dans `next.config.ts`.
- L’API attend des IDs MongoDB pour créer une commande. Le panier mappe automatiquement le nom → id via `/api/products`.

---

### Tester pas à pas (parcours complet)
1) Lancer l’app
   - `npm install && npm run dev` puis ouvrir `http://localhost:3000`.

2) Créer un compte et se connecter
   - Aller sur `/inscription` et créer un compte (mot de passe ≥ 6).
   - Le cookie `auth_token` est posé (HttpOnly). Le header affiche votre nom.

3) Parcourir le catalogue
   - Accueil `/`: produits chargés via `NEXT_PUBLIC_API_BASE_URL`.
   - Ouvrir une fiche produit (`/burger/<slug>`), vérifier le badge “indisponible” quand présent.

4) Gérer le panier (cookie)
   - Cliquer “Ajouter au panier” depuis la carte ou la fiche produit.
   - Ouvrir le mini-panier (icône en haut à droite): modifier quantités, supprimer, consulter le total.
   - Le panier persiste 7 jours dans le cookie `burgerito.cart.v1`.

5) Passer commande (routes protégées)
   - Aller sur `/panier` (redirigé vers `/connexion` si déconnecté).
   - Cliquer “Commander”: la route interne `POST /api/orders/create` appelle l’API en transmettant le cookie.
   - Après création, redirection vers `/commande/suivi/<id>`.

6) Suivi en temps réel (SSE)
   - Sur `/commande/suivi/<id>`, observer l’évolution automatique des statuts (préparation → cuisson → prête → livrée).

7) Historique (profil)
   - Aller sur `/profile`: l’historique de commandes et leurs items sont chargés via proxys avec le cookie.

8) Chat temps réel (WebSocket)
   - Ouvrir le bouton “bulle” en bas à droite.
   - Ouvrir la même page dans un second onglet et envoyer un message: le message apparaît en temps réel dans les deux fenêtres (canal “Support” ou “Général”).
   - Sur certains navigateurs (e.g. Brave), désactivez les protections (Shields) si la connexion WS est bloquée en local.

9) Déconnexion
   - Via le header, cliquer “Déconnexion” → `POST /api/session/logout` supprime le cookie.

---

### Sécurité & sessions
- Les sessions utilisent un cookie HttpOnly `auth_token` géré côté serveur (proxys et middleware).
- Les routes sensibles sont protégées dans `src/middleware.ts`.
- Le panier ne contient pas de données sensibles et reste côté client (cookie SameSite=Lax).
