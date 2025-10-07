# 📝 Documentation des Types TypeScript

## 🎯 Vue d'ensemble

Les types TypeScript de Postelma fournissent une base solide pour la sécurité des types et la documentation du code, avec des interfaces strictes et des types utilitaires.

## 🏗️ Architecture

```
src/types/
├── Post.ts              # Types des publications
├── User.ts              # Types des utilisateurs
├── analytics.ts         # Types des analytics
├── leads.ts             # Types des leads
├── socialAccount.ts     # Types des comptes sociaux
├── user.ts              # Types des utilisateurs (détaillés)
└── index.ts             # Point d'entrée
```

## 🔧 Types Principaux

### **Post**
Types pour les publications sociales.

```typescript
import { Post, PostStatus, SocialPlatform } from '@/types';

// Statuts des publications
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'pending' | 'rejected';

// Plateformes sociales
type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';

// Interface principale
interface Post {
  id: string;
  content: string;
  scheduledTime: Date;
  platforms: SocialPlatform[];
  status: PostStatus;
  image?: string;
  images?: string[];
  campaign?: string;
  campaignColor?: string;
  author: string;
  captions?: { [key: string]: string };
  caption?: string;
  hashtags?: string[];
  dayColumn: string;
  timeSlot: number;
  createdAt?: Date;
  publishedAt?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  reach?: number;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    rate: number;
  };
}
```

**Propriétés principales :**
- `id: string` - Identifiant unique
- `content: string` - Contenu de la publication
- `scheduledTime: Date` - Date de publication programmée
- `platforms: SocialPlatform[]` - Plateformes cibles
- `status: PostStatus` - Statut actuel
- `image?: string` - Image principale
- `images?: string[]` - Images multiples
- `author: string` - Auteur de la publication
- `captions?: { [key: string]: string }` - Captions par plateforme
- `hashtags?: string[]` - Hashtags associés
- `engagement?: EngagementMetrics` - Métriques d'engagement

### **User**
Types pour les utilisateurs et l'authentification.

```typescript
import { User, UserRole, UserPermissions } from '@/types';

// Rôles utilisateur
type UserRole = 'owner' | 'manager' | 'creator' | 'viewer';

// Permissions utilisateur
interface UserPermissions {
  canPublish: boolean;
  canSchedule: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canManageAccounts: boolean;
  canViewAnalytics: boolean;
  canApproveContent: boolean;
  canManageBilling: boolean;
}

// Interface principale
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}
```

**Propriétés principales :**
- `id: string` - Identifiant unique
- `name: string` - Nom complet
- `email: string` - Adresse email
- `role: UserRole` - Rôle dans l'équipe
- `permissions: UserPermissions` - Permissions détaillées
- `avatar?: string` - Photo de profil
- `isActive: boolean` - État actif
- `lastLogin?: Date` - Dernière connexion
- `teamId?: string` - ID de l'équipe
- `preferences?: UserPreferences` - Préférences utilisateur
- `stats?: UserStats` - Statistiques utilisateur

### **Analytics**
Types pour les données d'analytics et de performance.

```typescript
import { PostAnalytics, AccountAnalytics, AnalyticsSummary } from '@/types';

// Analytics d'une publication
interface PostAnalytics {
  postId: string;
  platform: SocialPlatform;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  engagementRate: number;
  impressions: number;
  clicks: number;
  saves: number;
  timestamp: Date;
  period: AnalyticsPeriod;
}

// Analytics d'un compte
interface AccountAnalytics {
  accountId: string;
  platform: SocialPlatform;
  followers: number;
  following: number;
  posts: number;
  engagement: {
    total: number;
    average: number;
    rate: number;
  };
  reach: {
    total: number;
    average: number;
  };
  impressions: {
    total: number;
    average: number;
  };
  period: AnalyticsPeriod;
}

// Résumé global
interface AnalyticsSummary {
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  totalImpressions: number;
  averageEngagementRate: number;
  topPosts: PostAnalytics[];
  platformPerformance: PlatformPerformance[];
  engagementOverTime: EngagementData[];
  contentAnalysis: ContentAnalysis;
  bestTimes: BestTimeSlot[];
}
```

**Propriétés principales :**
- `PostAnalytics` - Métriques détaillées d'une publication
- `AccountAnalytics` - Métriques d'un compte social
- `AnalyticsSummary` - Vue d'ensemble des performances
- `EngagementData` - Données d'engagement dans le temps
- `PlatformPerformance` - Performance par plateforme
- `ContentAnalysis` - Analyse du contenu
- `BestTimeSlot` - Meilleurs moments pour publier

### **Leads**
Types pour la gestion des prospects.

```typescript
import { Lead, LeadStatus, LeadMetrics } from '@/types';

// Statuts des leads
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

// Métriques des leads
interface LeadMetrics {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  topSources: LeadSource[];
  performanceByCategory: CategoryPerformance[];
}

// Interface principale
interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  industry?: string;
  location?: string;
  status: LeadStatus;
  source: string;
  score: number;
  tags: string[];
  notes?: string;
  socialMedia?: SocialMediaHandles;
  createdAt: Date;
  updatedAt: Date;
  lastContact?: Date;
  nextFollowUp?: Date;
  assignedTo?: string;
  campaign?: string;
  customFields?: Record<string, any>;
}
```

**Propriétés principales :**
- `id: string` - Identifiant unique
- `name: string` - Nom complet
- `email?: string` - Adresse email
- `phone?: string` - Numéro de téléphone
- `company?: string` - Entreprise
- `status: LeadStatus` - Statut actuel
- `source: string` - Source du lead
- `score: number` - Score de qualification
- `tags: string[]` - Tags associés
- `socialMedia?: SocialMediaHandles` - Réseaux sociaux
- `assignedTo?: string` - Assigné à
- `campaign?: string` - Campagne associée

### **SocialAccount**
Types pour les comptes sociaux connectés.

```typescript
import { SocialAccount, ConnectionStatus, SocialPlatform } from '@/types';

// Statuts de connexion
type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'pending';

// Interface principale
interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatar?: string;
  status: ConnectionStatus;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  permissions: string[];
  followers?: number;
  following?: number;
  posts?: number;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  settings?: AccountSettings;
  metrics?: AccountMetrics;
}
```

**Propriétés principales :**
- `id: string` - Identifiant unique
- `platform: SocialPlatform` - Plateforme sociale
- `username: string` - Nom d'utilisateur
- `displayName: string` - Nom d'affichage
- `status: ConnectionStatus` - Statut de connexion
- `accessToken?: string` - Token d'accès
- `permissions: string[]` - Permissions accordées
- `followers?: number` - Nombre d'abonnés
- `lastSync?: Date` - Dernière synchronisation
- `isActive: boolean` - État actif
- `settings?: AccountSettings` - Paramètres du compte
- `metrics?: AccountMetrics` - Métriques du compte

## 🔧 Types Utilitaires

### **Types de Base**
```typescript
// Types primitifs
type ID = string;
type Timestamp = Date;
type URL = string;
type Email = string;
type Phone = string;

// Types de statut
type Status = 'active' | 'inactive' | 'pending' | 'suspended';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Types de période
type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';
type TimeRange = {
  start: Date;
  end: Date;
};
```

### **Types de Filtres**
```typescript
// Filtres génériques
interface BaseFilters {
  search?: string;
  status?: string;
  dateRange?: TimeRange;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filtres spécifiques
interface PostFilters extends BaseFilters {
  platforms?: SocialPlatform[];
  author?: string;
  campaign?: string;
  hashtags?: string[];
}

interface UserFilters extends BaseFilters {
  role?: UserRole;
  isActive?: boolean;
  teamId?: string;
}

interface LeadFilters extends BaseFilters {
  status?: LeadStatus;
  source?: string;
  assignedTo?: string;
  score?: {
    min: number;
    max: number;
  };
}
```

### **Types de Réponse**
```typescript
// Réponse générique
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Réponse paginée
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Réponse d'erreur
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### **Types de Configuration**
```typescript
// Configuration de l'application
interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  features: {
    analytics: boolean;
    leads: boolean;
    team: boolean;
    billing: boolean;
  };
  limits: {
    maxPosts: number;
    maxUsers: number;
    maxStorage: number;
  };
}

// Configuration des plateformes
interface PlatformConfig {
  name: string;
  color: string;
  icon: string;
  maxCaptionLength: number;
  maxHashtags: number;
  supportedFormats: string[];
  maxFileSize: number;
  dimensions: {
    [key: string]: { width: number; height: number };
  };
}
```

## 🧪 Types de Test

### **Types de Mock**
```typescript
// Données de test
interface MockData {
  users: User[];
  posts: Post[];
  leads: Lead[];
  socialAccounts: SocialAccount[];
  analytics: PostAnalytics[];
}

// Configuration de test
interface TestConfig {
  mockData: MockData;
  apiResponses: Record<string, any>;
  timeouts: Record<string, number>;
  retries: Record<string, number>;
}
```

### **Types de Validation**
```typescript
// Schémas de validation
interface ValidationSchema {
  [key: string]: {
    type: string;
    required: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

// Résultat de validation
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

## 📊 Types de Statistiques

### **Types de Métriques**
```typescript
// Métriques de base
interface BaseMetrics {
  total: number;
  average: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

// Métriques d'engagement
interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  impressions: number;
  clicks: number;
  saves: number;
  rate: number;
}

// Métriques de performance
interface PerformanceMetrics {
  engagement: EngagementMetrics;
  reach: BaseMetrics;
  impressions: BaseMetrics;
  clicks: BaseMetrics;
  conversions: BaseMetrics;
}
```

### **Types de Rapports**
```typescript
// Rapport de performance
interface PerformanceReport {
  period: AnalyticsPeriod;
  summary: AnalyticsSummary;
  trends: TrendData[];
  insights: Insight[];
  recommendations: Recommendation[];
}

// Données de tendance
interface TrendData {
  date: Date;
  value: number;
  change: number;
  changePercent: number;
}

// Insight
interface Insight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}
```

## 🔒 Types de Sécurité

### **Types d'Autorisation**
```typescript
// Permissions
interface Permissions {
  [resource: string]: {
    [action: string]: boolean;
  };
}

// Rôles
interface Role {
  name: string;
  permissions: Permissions;
  description: string;
  level: number;
}

// Contexte de sécurité
interface SecurityContext {
  user: User;
  permissions: Permissions;
  restrictions: SecurityRestriction[];
  audit: AuditLog[];
}
```

### **Types d'Audit**
```typescript
// Log d'audit
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  result: 'success' | 'failure';
}
```

## 📚 Ressources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

**Dernière mise à jour :** 2025-01-08  
**Version :** 1.0.0  
**Auteur :** Postelma Team
