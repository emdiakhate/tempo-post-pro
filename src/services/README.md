# Services Layer - Documentation

## Vue d'ensemble

La couche de services abstrait la gestion des données et fournit une API cohérente pour toutes les opérations de stockage et de récupération de données dans l'application Postelma.

## Architecture

```
src/services/
├── storage.ts          # Service de base pour localStorage
├── posts.ts           # Gestion des posts
├── users.ts           # Gestion des utilisateurs
├── socialAccounts.ts  # Gestion des comptes sociaux
├── analytics.ts       # Gestion des analytics
├── index.ts           # Export et configuration
└── README.md          # Cette documentation
```

## Services Disponibles

### 1. StorageService

Service de base pour la gestion du stockage localStorage avec gestion d'erreurs.

```typescript
import { StorageService } from '@/services';

// Sauvegarder des données
const result = await StorageService.save('posts', postsData);

// Charger des données
const result = await StorageService.load('posts', defaultValue);

// Supprimer des données
const result = await StorageService.remove('posts');

// Vérifier l'existence
const result = await StorageService.exists('posts');
```

**Fonctionnalités :**
- Gestion d'erreurs centralisée
- Préfixe automatique pour éviter les conflits
- Vérification de la taille des données
- Migration de données
- Calcul de l'espace utilisé

### 2. PostsService

Gestion complète des posts avec filtrage et statistiques.

```typescript
import { PostsService } from '@/services';

// Récupérer tous les posts
const posts = await PostsService.getAllPosts();

// Filtrer les posts
const filteredPosts = await PostsService.getFilteredPosts({
  status: ['published', 'scheduled'],
  platforms: ['instagram', 'facebook'],
  search: 'marketing'
});

// Sauvegarder un post
const saved = await PostsService.savePost(post);

// Publier un post
const published = await PostsService.publishPost(postId);

// Dupliquer un post
const duplicated = await PostsService.duplicatePost(postId);
```

**Fonctionnalités :**
- CRUD complet des posts
- Filtrage avancé (statut, plateforme, date, recherche)
- Gestion des statuts (draft, scheduled, published, pending, rejected, failed)
- Système d'approbation
- Statistiques automatiques
- Import/Export JSON

### 3. UsersService

Gestion des utilisateurs et de l'équipe.

```typescript
import { UsersService } from '@/services';

// Récupérer tous les utilisateurs
const users = await UsersService.getAllUsers();

// Filtrer les utilisateurs
const filteredUsers = await UsersService.getFilteredUsers({
  role: ['manager', 'creator'],
  isActive: true,
  search: 'john'
});

// Mettre à jour le rôle
const updated = await UsersService.updateUserRole(userId, 'manager');

// Gestion des invitations
const invitation = await UsersService.createInvitation({
  id: 'inv_123',
  email: 'user@example.com',
  role: 'creator',
  status: 'pending',
  invitedBy: 'admin',
  invitedAt: new Date()
});
```

**Fonctionnalités :**
- Gestion des utilisateurs et rôles
- Système d'invitations
- Gestion de l'équipe
- Statistiques des utilisateurs
- Recherche et filtrage

### 4. SocialAccountsService

Gestion des comptes sociaux connectés.

```typescript
import { SocialAccountsService } from '@/services';

// Récupérer tous les comptes
const accounts = await SocialAccountsService.getAllAccounts();

// Connecter un compte
const newAccount = await SocialAccountsService.connectAccount({
  platform: 'instagram',
  username: 'myaccount',
  displayName: 'My Account',
  // ... autres propriétés
});

// Synchroniser tous les comptes
const syncResult = await SocialAccountsService.syncAllAccounts();

// Filtrer par plateforme
const instagramAccounts = await SocialAccountsService.getAccountsByPlatform('instagram');
```

**Fonctionnalités :**
- Gestion des comptes sociaux
- Synchronisation des données
- Gestion des statuts de connexion
- Statistiques par plateforme
- Renommage des comptes

### 5. AnalyticsService

Gestion des analytics et métriques.

```typescript
import { AnalyticsService } from '@/services';

// Récupérer les analytics d'un post
const analytics = await AnalyticsService.getPostAnalytics(postId);

// Récupérer les analytics filtrés
const filteredAnalytics = await AnalyticsService.getFilteredAnalytics({
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-01-31'),
  platforms: ['instagram', 'facebook']
});

// Calculer les métriques agrégées
const metrics = await AnalyticsService.calculateAggregatedMetrics(analytics);

// Obtenir le résumé
const summary = await AnalyticsService.getAnalyticsSummary();
```

**Fonctionnalités :**
- Stockage des métriques de performance
- Calcul de métriques agrégées
- Filtrage par période et plateforme
- Résumés automatiques
- Génération de données mock
- Import/Export des données

## Utilisation avec le Container

```typescript
import { configureServices, useService } from '@/services';

// Configuration initiale
const container = configureServices();

// Utilisation dans un composant
const PostsService = useService('posts');
const posts = await PostsService.getAllPosts();
```

## Gestion d'Erreurs

Tous les services utilisent un système de gestion d'erreurs cohérent :

```typescript
interface StorageResult<T> {
  data?: T;
  error?: StorageError;
  success: boolean;
}

// Exemple d'utilisation
const result = await PostsService.getAllPosts();
if (result.success) {
  // Utiliser result.data
} else {
  // Gérer result.error
  console.error(result.error?.message);
}
```

## Types d'Erreurs

- `STORAGE_QUOTA_EXCEEDED` : Espace de stockage insuffisant
- `STORAGE_SECURITY_ERROR` : Accès refusé (mode privé)
- `STORAGE_SYNTAX_ERROR` : Données corrompues
- `STORAGE_ACCESS_ERROR` : Erreur d'accès général
- `STORAGE_MIGRATION_ERROR` : Erreur de migration

## Migration de Données

```typescript
// Migrer des données d'une ancienne version
const result = await StorageService.migrate(
  'old_posts_key',
  'new_posts_key',
  (oldData) => {
    // Transformer les données si nécessaire
    return oldData.map(post => ({
      ...post,
      newField: 'defaultValue'
    }));
  }
);
```

## Performance

- **Lazy Loading** : Les données sont chargées à la demande
- **Mise en cache** : Les statistiques sont mises en cache
- **Optimisation** : Filtrage côté service pour réduire les transferts
- **Compression** : Gestion automatique de la taille des données

## Tests

Chaque service peut être testé indépendamment :

```typescript
// Mock du StorageService pour les tests
const mockStorage = {
  save: jest.fn(),
  load: jest.fn(),
  remove: jest.fn()
};

// Test d'un service
describe('PostsService', () => {
  it('should save a post', async () => {
    const post = { id: '1', content: 'Test' };
    const result = await PostsService.savePost(post);
    expect(result).toBe(true);
  });
});
```

## Évolutivité

La couche de services est conçue pour être facilement remplaçable par une API backend :

1. **Interface commune** : Tous les services suivent la même interface
2. **Abstraction** : Le StorageService peut être remplacé par un APIService
3. **Configuration** : Utilisation du container pour l'injection de dépendances
4. **Types stricts** : TypeScript pour la sécurité des types

## Prochaines Étapes

1. **API Backend** : Remplacer localStorage par des appels API
2. **Cache** : Implémenter un système de cache plus sophistiqué
3. **Synchronisation** : Ajouter la synchronisation en temps réel
4. **Offline** : Gestion du mode hors ligne
5. **Performance** : Optimisations avancées
