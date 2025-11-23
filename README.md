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
- Catalogue produits (fetch serveur, ISR)
- Détail produit (fetch serveur) avec badge “indisponible”
- Panier client (mini-panier sous l’icône, modification des quantités, total)
- Authentification (register/login) via l’API puis affichage du nom + déconnexion
- Profil: historique de commandes (groupé par date)
- Commande: création d’une commande via `POST /api/orders`

### Structure (extraits)
- `src/app/page.tsx`: page d’accueil (catalogue)
- `src/app/burger/[slug]/page.tsx`: détail d’un produit
- `src/app/panier/page.tsx`: panier complet
- `src/app/profile/page.tsx`: historique des commandes
- `src/components/MiniCart.tsx`: mini-panier
- `src/lib/cart.tsx`: contexte panier (`add`, `updateQty`, `remove`, `clear`)

### Notes
- Les images distantes utilisent `next/image` (domaine blob autorisé). En cas d’erreur domaine, utilisez `unoptimized` ou ajoutez le domaine dans `next.config.ts`.
- L’API attend des IDs MongoDB pour créer une commande. Le panier mappe automatiquement le nom → id via `/api/products`.
