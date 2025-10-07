# 🎣 Documentation des Hooks Personnalisés

## 🎯 Vue d'ensemble

Les hooks personnalisés de Postelma fournissent une interface React optimisée pour la gestion d'état, avec des types TypeScript stricts et une architecture modulaire.

## 🏗️ Architecture

```
src/hooks/
├── usePosts.ts           # Gestion des publications
├── useUsers.ts           # Gestion des utilisateurs
├── useSocialAccounts.ts  # Gestion des comptes sociaux
├── useAnalytics.ts       # Gestion des analytics
├── useMedia.ts           # Gestion des médias
├── useGlobalStats.ts     # Statistiques globales
├── useNotifications.ts   # Gestion des notifications
├── useTheme.ts           # Gestion du thème
├── useSettings.ts        # Gestion des paramètres
├── useImageLoader.ts     # Chargement d'images
├── useAuth.ts            # Authentification
└── index.ts              # Point d'entrée
```

## 🔧 Hooks Disponibles

### **usePosts**
Gestion complète des publications sociales.

```typescript
import { usePosts } from '@/hooks';

const MyComponent = () => {
  const {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPostsByStatus,
    getPostsByPlatform,
    approvePost,
    rejectPost,
    publishPost,
    schedulePost
  } = usePosts();

  // Créer une publication
  const handleCreatePost = async (postData) => {
    try {
      const newPost = await createPost(postData);
      console.log('Post créé:', newPost);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur: {error.message}</div>}
      {posts.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
};
```

**Propriétés disponibles :**
- `posts: Post[]` - Liste des publications
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `createPost(post: Omit<Post, 'id'>): Promise<Post>` - Créer une publication
- `updatePost(id: string, updates: Partial<Post>): Promise<Post | null>` - Modifier une publication
- `deletePost(id: string): Promise<boolean>` - Supprimer une publication
- `getPostsByStatus(status: PostStatus): Post[]` - Filtrer par statut
- `getPostsByPlatform(platform: SocialPlatform): Post[]` - Filtrer par plateforme
- `approvePost(id: string): Promise<Post | null>` - Approuver une publication
- `rejectPost(id: string, reason: string): Promise<Post | null>` - Rejeter une publication
- `publishPost(id: string): Promise<Post | null>` - Publier immédiatement
- `schedulePost(id: string, scheduledTime: Date): Promise<Post | null>` - Programmer une publication

### **useUsers**
Gestion des utilisateurs et de l'équipe.

```typescript
import { useUsers } from '@/hooks';

const TeamComponent = () => {
  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    inviteUser,
    acceptInvitation,
    removeInvitation,
    getUserStats
  } = useUsers();

  const handleInviteUser = async (email: string, role: UserRole) => {
    try {
      await inviteUser({ email, role });
      console.log('Invitation envoyée');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h2>Équipe ({users.length} membres)</h2>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.role}
        </div>
      ))}
    </div>
  );
};
```

**Propriétés disponibles :**
- `users: User[]` - Liste des utilisateurs
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `createUser(user: Omit<User, 'id'>): Promise<User>` - Créer un utilisateur
- `updateUser(id: string, updates: Partial<User>): Promise<User | null>` - Modifier un utilisateur
- `deleteUser(id: string): Promise<boolean>` - Supprimer un utilisateur
- `inviteUser(invitation: Omit<Invitation, 'id'>): Promise<Invitation>` - Inviter un utilisateur
- `acceptInvitation(invitationId: string, userData: Partial<User>): Promise<User>` - Accepter une invitation
- `removeInvitation(invitationId: string): Promise<boolean>` - Supprimer une invitation
- `getUserStats(): Promise<UserStats>` - Obtenir les statistiques

### **useSocialAccounts**
Gestion des comptes sociaux connectés.

```typescript
import { useSocialAccounts } from '@/hooks';

const AccountsComponent = () => {
  const {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    refreshAccountData,
    getAccountsByPlatform,
    getAccountStats
  } = useSocialAccounts();

  const handleConnectAccount = async (platform: SocialPlatform) => {
    try {
      // Simulation de connexion OAuth
      const account = await addAccount({
        platform,
        username: 'myaccount',
        accessToken: 'token123',
        status: 'connected'
      });
      console.log('Compte connecté:', account);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h2>Comptes Connectés ({accounts.length})</h2>
      {accounts.map(account => (
        <div key={account.id}>
          {account.platform}: {account.username}
        </div>
      ))}
    </div>
  );
};
```

**Propriétés disponibles :**
- `accounts: SocialAccount[]` - Liste des comptes
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `addAccount(account: Omit<SocialAccount, 'id'>): Promise<SocialAccount>` - Ajouter un compte
- `updateAccount(id: string, updates: Partial<SocialAccount>): Promise<SocialAccount | null>` - Modifier un compte
- `deleteAccount(id: string): Promise<boolean>` - Supprimer un compte
- `refreshAccountData(id: string): Promise<SocialAccount | null>` - Rafraîchir les données
- `getAccountsByPlatform(platform: SocialPlatform): SocialAccount[]` - Filtrer par plateforme
- `getAccountStats(): Promise<SocialAccountStats>` - Obtenir les statistiques

### **useAnalytics**
Gestion des données d'analytics et de performance.

```typescript
import { useAnalytics } from '@/hooks';

const AnalyticsComponent = () => {
  const {
    analytics,
    loading,
    error,
    recordPostAnalytics,
    getPostAnalytics,
    getAccountAnalytics,
    getOverallSummary,
    getEngagementOverTime,
    getPerformanceByPlatform,
    getTopPosts,
    getContentAnalysis,
    getBestTimesToPost
  } = useAnalytics();

  const handleRecordAnalytics = async (postId: string) => {
    try {
      await recordPostAnalytics(postId, {
        likes: 150,
        comments: 25,
        shares: 10,
        views: 1000,
        engagementRate: 0.15
      });
      console.log('Analytics enregistrées');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h2>Analytics</h2>
      {analytics && (
        <div>
          <p>Total Engagement: {analytics.totalEngagement}</p>
          <p>Average Rate: {analytics.averageEngagementRate}%</p>
        </div>
      )}
    </div>
  );
};
```

**Propriétés disponibles :**
- `analytics: AnalyticsSummary | null` - Résumé des analytics
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `recordPostAnalytics(postId: string, analytics: PostAnalytics): Promise<void>` - Enregistrer les analytics
- `getPostAnalytics(postId: string): Promise<PostAnalytics | null>` - Obtenir les analytics d'un post
- `getAccountAnalytics(accountId: string, period: AnalyticsPeriod): Promise<AccountAnalytics>` - Analytics d'un compte
- `getOverallSummary(period?: AnalyticsPeriod): Promise<AnalyticsSummary>` - Résumé global
- `getEngagementOverTime(period: AnalyticsPeriod): Promise<EngagementData[]>` - Évolution de l'engagement
- `getPerformanceByPlatform(period: AnalyticsPeriod): Promise<PlatformPerformance[]>` - Performance par plateforme
- `getTopPosts(limit: number, period: AnalyticsPeriod): Promise<PostAnalytics[]>` - Meilleurs posts
- `getContentAnalysis(period: AnalyticsPeriod): Promise<ContentAnalysis>` - Analyse du contenu
- `getBestTimesToPost(platform: SocialPlatform): Promise<BestTimeSlot[]>` - Meilleurs moments pour publier

### **useMedia**
Gestion de la bibliothèque de médias.

```typescript
import { useMedia } from '@/hooks';

const MediaComponent = () => {
  const {
    media,
    loading,
    error,
    uploadMedia,
    deleteMedia,
    getMediaByType,
    getMediaStats
  } = useMedia();

  const handleUpload = async (file: File) => {
    try {
      const mediaItem = await uploadMedia({
        file,
        type: 'image',
        source: 'upload'
      });
      console.log('Média uploadé:', mediaItem);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h2>Bibliothèque Médias ({media.length} éléments)</h2>
      {media.map(item => (
        <div key={item.id}>
          {item.title} - {item.type}
        </div>
      ))}
    </div>
  );
};
```

**Propriétés disponibles :**
- `media: MediaItem[]` - Liste des médias
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `uploadMedia(data: UploadMediaData): Promise<MediaItem>` - Uploader un média
- `deleteMedia(id: string): Promise<boolean>` - Supprimer un média
- `getMediaByType(type: MediaType): MediaItem[]` - Filtrer par type
- `getMediaStats(): Promise<MediaStats>` - Obtenir les statistiques

### **useGlobalStats**
Statistiques globales de l'application.

```typescript
import { useGlobalStats } from '@/hooks';

const DashboardComponent = () => {
  const {
    stats,
    loading,
    error,
    refreshStats
  } = useGlobalStats();

  return (
    <div>
      <h2>Tableau de Bord</h2>
      {stats && (
        <div>
          <p>Total Posts: {stats.totalPosts}</p>
          <p>Total Users: {stats.totalUsers}</p>
          <p>Total Engagement: {stats.totalEngagement}</p>
          <p>Growth Rate: {stats.growthRate}%</p>
        </div>
      )}
    </div>
  );
};
```

**Propriétés disponibles :**
- `stats: GlobalStats | null` - Statistiques globales
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `refreshStats(): Promise<void>` - Rafraîchir les statistiques

### **useNotifications**
Gestion des notifications utilisateur.

```typescript
import { useNotifications } from '@/hooks';

const NotificationComponent = () => {
  const {
    notifications,
    loading,
    error,
    addNotification,
    markAsRead,
    clearAll,
    getUnreadCount
  } = useNotifications();

  const handleAddNotification = (message: string, type: NotificationType) => {
    addNotification({
      message,
      type,
      duration: 5000
    });
  };

  return (
    <div>
      <h2>Notifications ({getUnreadCount()} non lues)</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          {notification.message}
        </div>
      ))}
    </div>
  );
};
```

**Propriétés disponibles :**
- `notifications: Notification[]` - Liste des notifications
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `addNotification(notification: Omit<Notification, 'id'>): Promise<Notification>` - Ajouter une notification
- `markAsRead(id: string): Promise<void>` - Marquer comme lu
- `clearAll(): Promise<void>` - Effacer toutes les notifications
- `getUnreadCount(): number` - Nombre de notifications non lues

### **useTheme**
Gestion du thème de l'application.

```typescript
import { useTheme } from '@/hooks';

const ThemeComponent = () => {
  const {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
    colors
  } = useTheme();

  return (
    <div>
      <h2>Thème Actuel: {theme}</h2>
      <button onClick={() => setTheme('dark')}>Mode Sombre</button>
      <button onClick={() => setTheme('light')}>Mode Clair</button>
      <button onClick={toggleTheme}>Basculer</button>
    </div>
  );
};
```

**Propriétés disponibles :**
- `theme: ThemeMode` - Thème actuel
- `setTheme(theme: ThemeMode): void` - Changer le thème
- `toggleTheme(): void` - Basculer le thème
- `isDark: boolean` - Mode sombre actif
- `isLight: boolean` - Mode clair actif
- `colors: ColorScheme` - Couleurs du thème

### **useSettings**
Gestion des paramètres de l'application.

```typescript
import { useSettings } from '@/hooks';

const SettingsComponent = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings
  } = useSettings();

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      await updateSettings(newSettings);
      console.log('Paramètres mis à jour');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <h2>Paramètres</h2>
      {settings && (
        <div>
          <p>Langue: {settings.language}</p>
          <p>Fuseau horaire: {settings.timezone}</p>
          <p>Notifications: {settings.notifications ? 'Activées' : 'Désactivées'}</p>
        </div>
      )}
    </div>
  );
};
```

**Propriétés disponibles :**
- `settings: AppSettings | null` - Paramètres actuels
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle
- `updateSettings(settings: Partial<AppSettings>): Promise<void>` - Mettre à jour les paramètres
- `resetSettings(): Promise<void>` - Réinitialiser les paramètres

### **useImageLoader**
Chargement optimisé d'images.

```typescript
import { useImageLoader } from '@/hooks';

const ImageComponent = () => {
  const { imageUrl, loading, error } = useImageLoader('https://example.com/image.jpg');

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return <img src={imageUrl} alt="Image" />;
};
```

**Propriétés disponibles :**
- `imageUrl: string | null` - URL de l'image
- `loading: boolean` - État de chargement
- `error: Error | null` - Erreur éventuelle

### **useAuth**
Authentification et gestion des utilisateurs.

```typescript
import { useAuth } from '@/hooks';

const AuthComponent = () => {
  const {
    currentUser,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    canAccess
  } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      console.log('Connexion réussie');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bonjour {currentUser?.name}!</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          Connexion
        </button>
      )}
    </div>
  );
};
```

**Propriétés disponibles :**
- `currentUser: User | null` - Utilisateur actuel
- `isAuthenticated: boolean` - État d'authentification
- `login(email: string, password: string): Promise<void>` - Connexion
- `logout(): Promise<void>` - Déconnexion
- `hasPermission(permission: string): boolean` - Vérifier une permission
- `canAccess(resource: string, action?: string): boolean` - Vérifier l'accès à une ressource

## 🔄 Gestion d'État

### **État Local**
Chaque hook gère son propre état local avec React.

```typescript
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
```

### **Synchronisation**
Les hooks se synchronisent automatiquement avec le stockage local.

```typescript
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await service.getAll();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
```

### **Cache et Performance**
- Mise en cache des données fréquemment utilisées
- Debouncing des requêtes
- Optimisation des re-rendus
- Lazy loading des données volumineuses

## 🧪 Tests

### **Tests Unitaires**
```typescript
import { renderHook, act } from '@testing-library/react';
import { usePosts } from '@/hooks';

describe('usePosts', () => {
  it('should create a post', async () => {
    const { result } = renderHook(() => usePosts());

    await act(async () => {
      const post = await result.current.createPost({
        content: 'Test post',
        platforms: ['instagram'],
        scheduledTime: new Date()
      });

      expect(post.id).toBeDefined();
      expect(post.content).toBe('Test post');
    });
  });
});
```

### **Tests d'Intégration**
```typescript
describe('Hook Integration', () => {
  it('should handle complete workflow', async () => {
    const { result: postsResult } = renderHook(() => usePosts());
    const { result: analyticsResult } = renderHook(() => useAnalytics());

    // Créer un post
    const post = await postsResult.current.createPost({...});
    
    // Enregistrer les analytics
    await analyticsResult.current.recordPostAnalytics(post.id, {...});
    
    // Vérifier les données
    expect(postsResult.current.posts).toHaveLength(1);
    expect(analyticsResult.current.analytics).toBeDefined();
  });
});
```

## 📈 Performance

### **Optimisations**
- **Memoization** : `useMemo` et `useCallback` pour éviter les re-calculs
- **Lazy Loading** : Chargement des données à la demande
- **Debouncing** : Éviter les appels multiples
- **Caching** : Mise en cache des résultats

### **Monitoring**
```typescript
// Surveiller les performances
const startTime = performance.now();
await createPost(postData);
const endTime = performance.now();
console.log(`Temps d'exécution: ${endTime - startTime}ms`);
```

## 🔒 Sécurité

### **Validation des Données**
- Validation TypeScript stricte
- Sanitisation des entrées
- Vérification des permissions
- Gestion des erreurs

### **Gestion des Erreurs**
```typescript
try {
  const result = await createPost(postData);
  return result;
} catch (error) {
  console.error('Erreur lors de la création du post:', error);
  throw new Error('Impossible de créer le post');
}
```

## 📚 Ressources

- [React Hooks](https://react.dev/reference/react)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Performance Best Practices](https://react.dev/learn/render-and-commit)

---

**Dernière mise à jour :** 2025-01-08  
**Version :** 1.0.0  
**Auteur :** Postelma Team