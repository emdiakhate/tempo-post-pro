# Hooks Personnalisés - Documentation

## Vue d'ensemble

Les hooks personnalisés centralisent la logique métier et l'état de l'application Postelma. Ils fournissent une interface cohérente pour interagir avec les services et gérer l'état local.

## Architecture

```
src/hooks/
├── usePosts.ts           # Gestion des posts
├── useUsers.ts           # Gestion des utilisateurs
├── useSocialAccounts.ts  # Gestion des comptes sociaux
├── useAnalytics.ts       # Gestion des analytics
├── useMedia.ts           # Gestion des médias
├── useGlobalStats.ts     # Statistiques globales
├── useNotifications.ts   # Gestion des notifications
├── useTheme.ts           # Gestion du thème
├── useSettings.ts        # Gestion des paramètres
├── index.ts              # Export et configuration
└── README.md             # Cette documentation
```

## Hooks Disponibles

### 1. usePosts

Gestion complète des posts avec filtrage et actions.

```typescript
import { usePosts } from '@/hooks';

const MyComponent = () => {
  const {
    posts,
    loading,
    error,
    stats,
    loadPosts,
    savePost,
    deletePost,
    duplicatePost,
    publishPost,
    approvePost,
    rejectPost,
    setFilters,
    clearFilters,
    filteredPosts
  } = usePosts({
    autoLoad: true,
    initialFilters: { status: ['published'] }
  });

  // Utilisation
  const handleSavePost = async (post) => {
    const success = await savePost(post);
    if (success) {
      console.log('Post sauvegardé');
    }
  };

  return (
    <div>
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur: {error}</div>}
      {filteredPosts.map(post => (
        <div key={post.id}>{post.content}</div>
      ))}
    </div>
  );
};
```

**Fonctionnalités :**
- CRUD complet des posts
- Filtrage avancé (statut, plateforme, date, recherche)
- Actions (publier, approuver, rejeter, dupliquer)
- Statistiques automatiques
- Gestion d'erreurs

### 2. useUsers

Gestion des utilisateurs et de l'équipe.

```typescript
import { useUsers } from '@/hooks';

const MyComponent = () => {
  const {
    users,
    teamMembers,
    invitations,
    loading,
    error,
    stats,
    loadUsers,
    saveUser,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
    addTeamMember,
    createInvitation
  } = useUsers();

  const handleCreateUser = async (userData) => {
    const success = await saveUser(userData);
    if (success) {
      console.log('Utilisateur créé');
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.role}
        </div>
      ))}
    </div>
  );
};
```

**Fonctionnalités :**
- Gestion des utilisateurs et rôles
- Système d'invitations
- Gestion de l'équipe
- Filtrage et recherche
- Statistiques des utilisateurs

### 3. useSocialAccounts

Gestion des comptes sociaux connectés.

```typescript
import { useSocialAccounts } from '@/hooks';

const MyComponent = () => {
  const {
    accounts,
    loading,
    error,
    stats,
    loadAccounts,
    connectAccount,
    disconnectAccount,
    syncAccount,
    syncAllAccounts,
    renameAccount
  } = useSocialAccounts();

  const handleConnect = async (accountData) => {
    const newAccount = await connectAccount(accountData);
    if (newAccount) {
      console.log('Compte connecté');
    }
  };

  return (
    <div>
      {accounts.map(account => (
        <div key={account.id}>
          {account.username} - {account.platform}
        </div>
      ))}
    </div>
  );
};
```

**Fonctionnalités :**
- Connexion/déconnexion des comptes
- Synchronisation des données
- Gestion des statuts
- Filtrage par plateforme
- Statistiques par plateforme

### 4. useAnalytics

Gestion des analytics et métriques.

```typescript
import { useAnalytics } from '@/hooks';

const MyComponent = () => {
  const {
    analytics,
    summary,
    loading,
    error,
    loadAnalytics,
    savePostAnalytics,
    calculateAggregatedMetrics,
    getAnalyticsForPeriod,
    exportAnalytics
  } = useAnalytics();

  const handleExport = async () => {
    const data = await exportAnalytics();
    // Télécharger le fichier
  };

  return (
    <div>
      {summary && (
        <div>
          Engagement total: {summary.totalEngagement}
          Impressions: {summary.totalImpressions}
        </div>
      )}
    </div>
  );
};
```

**Fonctionnalités :**
- Stockage des métriques
- Calcul de métriques agrégées
- Filtrage par période et plateforme
- Export/Import des données
- Génération de données mock

### 5. useMedia

Gestion des médias (images/vidéos).

```typescript
import { useMedia } from '@/hooks';

const MyComponent = () => {
  const {
    media,
    loading,
    error,
    stats,
    loadMedia,
    uploadFile,
    uploadFiles,
    deleteMedia,
    updateMedia,
    searchMedia
  } = useMedia();

  const handleUpload = async (file) => {
    const mediaItem = await uploadFile(file, {
      tags: ['marketing'],
      description: 'Image de marketing'
    });
    if (mediaItem) {
      console.log('Média uploadé');
    }
  };

  return (
    <div>
      {media.map(item => (
        <div key={item.id}>
          <img src={item.url} alt={item.name} />
          {item.name}
        </div>
      ))}
    </div>
  );
};
```

**Fonctionnalités :**
- Upload de fichiers
- Gestion des métadonnées
- Filtrage par type et source
- Recherche dans les médias
- Statistiques d'utilisation

### 6. useGlobalStats

Statistiques globales de l'application.

```typescript
import { useGlobalStats } from '@/hooks';

const MyComponent = () => {
  const {
    stats,
    loading,
    error,
    loadStats,
    refreshStats,
    getStatsForPeriod,
    exportStats
  } = useGlobalStats({
    autoLoad: true,
    refreshInterval: 300000 // 5 minutes
  });

  return (
    <div>
      {stats && (
        <div>
          <h3>Statistiques Globales</h3>
          <p>Posts: {stats.posts.total}</p>
          <p>Utilisateurs: {stats.users.total}</p>
          <p>Comptes: {stats.socialAccounts.total}</p>
          <p>Engagement: {stats.analytics.totalEngagement}</p>
        </div>
      )}
    </div>
  );
};
```

**Fonctionnalités :**
- Statistiques agrégées
- Actualisation automatique
- Statistiques par période
- Export des données

### 7. useNotifications

Gestion des notifications système.

```typescript
import { useNotifications } from '@/hooks';

const MyComponent = () => {
  const {
    notifications,
    loading,
    error,
    stats,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotifications({
    autoLoad: true,
    maxNotifications: 100,
    autoMarkAsRead: false
  });

  const handleAddNotification = () => {
    addNotification({
      type: 'success',
      title: 'Succès',
      message: 'Opération réussie',
      persistent: false
    });
  };

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification.id} className={notification.read ? 'read' : 'unread'}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};
```

**Fonctionnalités :**
- Création de notifications
- Gestion des types (info, success, warning, error)
- Marquage comme lu
- Filtrage et recherche
- Export/Import

### 8. useTheme

Gestion du thème et des préférences d'affichage.

```typescript
import { useTheme } from '@/hooks';

const MyComponent = () => {
  const {
    theme,
    loading,
    error,
    setMode,
    setColorScheme,
    setFontSize,
    toggleReducedMotion,
    toggleHighContrast,
    toggleCompactMode,
    isDark,
    isLight,
    getThemeClasses
  } = useTheme();

  const handleThemeChange = async (mode) => {
    await setMode(mode);
  };

  return (
    <div className={getThemeClasses()}>
      <button onClick={() => handleThemeChange('dark')}>
        Mode sombre
      </button>
      <button onClick={() => handleThemeChange('light')}>
        Mode clair
      </button>
    </div>
  );
};
```

**Fonctionnalités :**
- Mode sombre/clair/système
- Schémas de couleurs
- Taille de police
- Options d'accessibilité
- Export/Import du thème

### 9. useSettings

Gestion des paramètres de l'application.

```typescript
import { useSettings } from '@/hooks';

const MyComponent = () => {
  const {
    settings,
    loading,
    error,
    updateSettings,
    updateLanguage,
    updateTimezone,
    toggleNotifications,
    updateApiKeys,
    validateSettings
  } = useSettings();

  const handleLanguageChange = async (language) => {
    await updateLanguage(language);
  };

  return (
    <div>
      <select 
        value={settings.language} 
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
```

**Fonctionnalités :**
- Paramètres généraux
- Notifications
- Posts
- Analytics
- Sécurité
- Performance
- Intégrations
- Validation des paramètres

## Utilisation avec le Container

```typescript
import { useHooks } from '@/hooks';

const MyComponent = () => {
  const hooks = useHooks();
  
  // Utiliser les hooks
  const posts = hooks.usePosts();
  const users = hooks.useUsers();
  const theme = hooks.useTheme();
  
  return <div>...</div>;
};
```

## Gestion d'Erreurs

Tous les hooks utilisent un système de gestion d'erreurs cohérent :

```typescript
const { loading, error, data } = usePosts();

if (loading) return <div>Chargement...</div>;
if (error) return <div>Erreur: {error}</div>;
return <div>{data.map(item => ...)}</div>;
```

## Performance

- **Lazy Loading** : Les données sont chargées à la demande
- **Mise en cache** : Les statistiques sont mises en cache
- **Optimisation** : Filtrage côté hook pour réduire les re-renders
- **Memoization** : Utilisation de `useMemo` et `useCallback`

## Tests

Chaque hook peut être testé indépendamment :

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePosts } from '@/hooks';

describe('usePosts', () => {
  it('should load posts', async () => {
    const { result } = renderHook(() => usePosts());
    
    await act(async () => {
      await result.current.loadPosts();
    });
    
    expect(result.current.posts).toBeDefined();
  });
});
```

## Évolutivité

Les hooks sont conçus pour être facilement étendus :

1. **Interface commune** : Tous les hooks suivent la même interface
2. **Abstraction** : Les services peuvent être remplacés
3. **Configuration** : Options flexibles pour chaque hook
4. **Types stricts** : TypeScript pour la sécurité des types

## Prochaines Étapes

1. **Tests unitaires** : Ajouter des tests pour chaque hook
2. **Optimisations** : Améliorer les performances
3. **Documentation** : Ajouter des exemples d'utilisation
4. **Intégration** : Connecter avec les composants existants