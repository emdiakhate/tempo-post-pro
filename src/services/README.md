# 📚 Documentation des Services

## 🎯 Vue d'ensemble

La couche de services de Postelma fournit une abstraction complète pour la gestion des données, avec une architecture modulaire et des types TypeScript stricts.

## 🏗️ Architecture

```
src/services/
├── storage.ts          # Service de base pour localStorage
├── posts.ts           # Gestion des publications
├── users.ts           # Gestion des utilisateurs
├── socialAccounts.ts  # Gestion des comptes sociaux
├── analytics.ts       # Gestion des analytics
└── index.ts           # Point d'entrée et injection de dépendances
```

## 🔧 Services Disponibles

### **StorageService**
Service de base pour toutes les opérations de stockage local.

```typescript
import { StorageService } from '@/services';

// Sauvegarder des données
const result = await StorageService.save('posts', postsData);

// Charger des données
const posts = await StorageService.load<Post[]>('posts');

// Supprimer des données
await StorageService.remove('posts');
```

**Méthodes disponibles :**
- `save<T>(key: string, data: T): Promise<StorageResult<boolean>>`
- `load<T>(key: string): Promise<StorageResult<T | null>>`
- `remove(key: string): Promise<StorageResult<boolean>>`
- `getAllKeys(): Promise<StorageResult<string[]>>`
- `clear(): Promise<StorageResult<boolean>>`
- `getUsedSpace(): Promise<StorageResult<number>>`
- `migrate<T>(oldKey: string, newKey: string, transformer?: (data: any) => T): Promise<StorageResult<T | null>>`

### **PostsService**
Gestion complète des publications sociales.

```typescript
import { PostsService } from '@/services';

// Créer une publication
const newPost = await PostsService.createPost({
  content: 'Mon nouveau post',
  platforms: ['instagram', 'facebook'],
  scheduledTime: new Date()
});

// Récupérer les posts par statut
const publishedPosts = await PostsService.getPostsByStatus('published');

// Approuver un post
await PostsService.approvePost(postId, userId);
```

**Méthodes disponibles :**
- `getAllPosts(): Promise<Post[]>`
- `getPostById(id: string): Promise<Post | null>`
- `createPost(post: Omit<Post, 'id'>): Promise<Post>`
- `updatePost(id: string, updates: Partial<Post>): Promise<Post | null>`
- `deletePost(id: string): Promise<boolean>`
- `getPostsByStatus(status: PostStatus): Promise<Post[]>`
- `getPostsByPlatform(platform: SocialPlatform): Promise<Post[]>`
- `approvePost(id: string, approvedBy: string): Promise<Post | null>`
- `rejectPost(id: string, rejectedBy: string, reason: string): Promise<Post | null>`
- `publishPost(id: string): Promise<Post | null>`
- `schedulePost(id: string, scheduledTime: Date): Promise<Post | null>`

### **UsersService**
Gestion des utilisateurs et de l'équipe.

```typescript
import { UsersService } from '@/services';

// Créer un utilisateur
const user = await UsersService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'creator'
});

// Inviter un utilisateur
await UsersService.inviteUser({
  email: 'new@example.com',
  role: 'creator'
});

// Obtenir les statistiques
const stats = await UsersService.getUserStats();
```

**Méthodes disponibles :**
- `getAllUsers(): Promise<User[]>`
- `getUserById(id: string): Promise<User | null>`
- `createUser(user: Omit<User, 'id'>): Promise<User>`
- `updateUser(id: string, updates: Partial<User>): Promise<User | null>`
- `deleteUser(id: string): Promise<boolean>`
- `inviteUser(invitation: Omit<Invitation, 'id'>): Promise<Invitation>`
- `acceptInvitation(invitationId: string, userData: Partial<User>): Promise<User>`
- `removeInvitation(invitationId: string): Promise<boolean>`
- `getUserStats(): Promise<UserStats>`

### **SocialAccountsService**
Gestion des comptes sociaux connectés.

```typescript
import { SocialAccountsService } from '@/services';

// Ajouter un compte
const account = await SocialAccountsService.addAccount({
  platform: 'instagram',
  username: 'myaccount',
  accessToken: 'token123'
});

// Rafraîchir les données
await SocialAccountsService.refreshAccountData(accountId);

// Obtenir les comptes par plateforme
const instagramAccounts = await SocialAccountsService.getAccountsByPlatform('instagram');
```

**Méthodes disponibles :**
- `getAllAccounts(): Promise<SocialAccount[]>`
- `getAccountById(id: string): Promise<SocialAccount | null>`
- `addAccount(account: Omit<SocialAccount, 'id'>): Promise<SocialAccount>`
- `updateAccount(id: string, updates: Partial<SocialAccount>): Promise<SocialAccount | null>`
- `deleteAccount(id: string): Promise<boolean>`
- `refreshAccountData(id: string): Promise<SocialAccount | null>`
- `getAccountsByPlatform(platform: SocialPlatform): Promise<SocialAccount[]>`
- `getAccountStats(): Promise<SocialAccountStats>`

### **AnalyticsService**
Gestion des données d'analytics et de performance.

```typescript
import { AnalyticsService } from '@/services';

// Enregistrer les analytics d'un post
await AnalyticsService.recordPostAnalytics(postId, {
  likes: 150,
  comments: 25,
  shares: 10,
  views: 1000
});

// Obtenir le résumé global
const summary = await AnalyticsService.getOverallSummary();

// Obtenir les meilleurs moments pour publier
const bestTimes = await AnalyticsService.getBestTimesToPost('instagram');
```

**Méthodes disponibles :**
- `recordPostAnalytics(postId: string, analytics: PostAnalytics): Promise<void>`
- `getPostAnalytics(postId: string): Promise<PostAnalytics | null>`
- `getAccountAnalytics(accountId: string, period: AnalyticsPeriod): Promise<AccountAnalytics>`
- `getOverallSummary(period?: AnalyticsPeriod): Promise<AnalyticsSummary>`
- `getEngagementOverTime(period: AnalyticsPeriod): Promise<EngagementData[]>`
- `getPerformanceByPlatform(period: AnalyticsPeriod): Promise<PlatformPerformance[]>`
- `getTopPosts(limit: number, period: AnalyticsPeriod): Promise<PostAnalytics[]>`
- `getContentAnalysis(period: AnalyticsPeriod): Promise<ContentAnalysis>`
- `getBestTimesToPost(platform: SocialPlatform): Promise<BestTimeSlot[]>`

## 🔄 Injection de Dépendances

### **ServiceContainer**
Le conteneur de services permet l'injection de dépendances et la gestion centralisée.

```typescript
import { ServiceContainer, useService } from '@/services';

// Configuration des services
const container = ServiceContainer.getInstance();
container.register('posts', PostsService);
container.register('users', UsersService);

// Utilisation dans un composant
const MyComponent = () => {
  const postsService = useService<PostsService>('posts');
  // ...
};
```

### **Configuration Automatique**
Les services sont automatiquement configurés via `configureServices()`.

```typescript
import { configureServices } from '@/services';

// Configuration automatique
const container = configureServices();
```

## 📊 Types et Interfaces

### **Types Principaux**
```typescript
// Résultat d'opération
interface StorageResult<T> {
  data?: T;
  success: boolean;
  error?: StorageError;
}

// Filtres pour les requêtes
interface PostFilters {
  status?: PostStatus;
  platform?: SocialPlatform;
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Statistiques
interface PostStats {
  total: number;
  byStatus: Record<PostStatus, number>;
  byPlatform: Record<SocialPlatform, number>;
  engagement: {
    total: number;
    average: number;
  };
}
```

### **Gestion d'Erreurs**
```typescript
interface StorageError {
  code: string;
  message: string;
  originalError?: Error;
}

// Codes d'erreur courants
const ERROR_CODES = {
  STORAGE_SAVE_ERROR: 'STORAGE_SAVE_ERROR',
  STORAGE_LOAD_ERROR: 'STORAGE_LOAD_ERROR',
  STORAGE_REMOVE_ERROR: 'STORAGE_REMOVE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR'
} as const;
```

## 🚀 Utilisation avec les Hooks

### **Hooks Personnalisés**
Les services sont utilisés via des hooks personnalisés pour une meilleure intégration React.

```typescript
import { usePosts, useUsers, useAnalytics } from '@/hooks';

const MyComponent = () => {
  const { posts, createPost, updatePost, deletePost } = usePosts();
  const { users, createUser } = useUsers();
  const { analytics, recordAnalytics } = useAnalytics();
  
  // ...
};
```

### **Gestion d'État**
Les hooks gèrent automatiquement :
- L'état de chargement
- Les erreurs
- La synchronisation avec le stockage local
- La mise en cache
- La validation des données

## 🔧 Configuration

### **Préfixe de Stockage**
```typescript
const STORAGE_PREFIX = 'postelma_';
```

### **Migration de Données**
```typescript
// Migration d'une ancienne version
const result = await StorageService.migrate(
  'old_posts',
  'posts',
  (oldData) => ({
    ...oldData,
    // Transformation des données
    createdAt: new Date(oldData.createdAt)
  })
);
```

### **Gestion de l'Espace**
```typescript
// Vérifier l'espace utilisé
const spaceUsed = await StorageService.getUsedSpace();
console.log(`Espace utilisé: ${spaceUsed} bytes`);

// Nettoyer le cache
await StorageService.clear();
```

## 🧪 Tests

### **Tests Unitaires**
```typescript
describe('PostsService', () => {
  beforeEach(() => {
    // Nettoyer le localStorage
    localStorage.clear();
  });

  it('should create a post', async () => {
    const post = await PostsService.createPost({
      content: 'Test post',
      platforms: ['instagram'],
      scheduledTime: new Date()
    });

    expect(post.id).toBeDefined();
    expect(post.content).toBe('Test post');
  });
});
```

### **Tests d'Intégration**
```typescript
describe('Service Integration', () => {
  it('should handle complete workflow', async () => {
    // Créer un utilisateur
    const user = await UsersService.createUser({...});
    
    // Créer un post
    const post = await PostsService.createPost({...});
    
    // Enregistrer les analytics
    await AnalyticsService.recordPostAnalytics(post.id, {...});
    
    // Vérifier les données
    const stats = await AnalyticsService.getOverallSummary();
    expect(stats.totalPosts).toBe(1);
  });
});
```

## 📈 Performance

### **Optimisations**
- **Lazy Loading** : Chargement des données à la demande
- **Caching** : Mise en cache des requêtes fréquentes
- **Debouncing** : Éviter les appels multiples
- **Compression** : Compression des données volumineuses

### **Monitoring**
```typescript
// Surveiller les performances
const startTime = performance.now();
await PostsService.getAllPosts();
const endTime = performance.now();
console.log(`Temps d'exécution: ${endTime - startTime}ms`);
```

## 🔒 Sécurité

### **Validation des Données**
- Validation TypeScript stricte
- Sanitisation des entrées
- Vérification des permissions
- Chiffrement des données sensibles

### **Gestion des Erreurs**
- Logging des erreurs
- Récupération gracieuse
- Notifications utilisateur
- Rollback automatique

## 📚 Ressources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Error Handling Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

---

**Dernière mise à jour :** 2025-01-08  
**Version :** 1.0.0  
**Auteur :** Postelma Team