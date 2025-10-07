/**
 * Index des services
 * Exporte tous les services de la couche de données
 */

// Services de base
import StorageService from './storage';
export { default as StorageService } from './storage';
export type { StorageError, StorageResult } from './storage';

// Services métier
import PostsService from './posts';
export { default as PostsService } from './posts';
export type { PostFilters, PostStats } from './posts';

import UsersService from './users';
export { default as UsersService } from './users';
export type { UserFilters, UserStats } from './users';

import SocialAccountsService from './socialAccounts';
export { default as SocialAccountsService } from './socialAccounts';
export type { SocialAccountFilters, SocialAccountStats } from './socialAccounts';

import AnalyticsService from './analytics';
export { default as AnalyticsService } from './analytics';
export type { AnalyticsFilters, AnalyticsPeriod } from './analytics';

// Service principal pour l'injection de dépendances
export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T | undefined {
    return this.services.get(name);
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  unregister(name: string): boolean {
    return this.services.delete(name);
  }

  clear(): void {
    this.services.clear();
  }
}

// Configuration des services
export const configureServices = () => {
  const container = ServiceContainer.getInstance();
  
  // Enregistrer les services
  container.register('storage', StorageService);
  container.register('posts', PostsService);
  container.register('users', UsersService);
  container.register('socialAccounts', SocialAccountsService);
  container.register('analytics', AnalyticsService);
  
  return container;
};

// Hook pour utiliser les services
export const useService = <T>(serviceName: string): T => {
  const container = ServiceContainer.getInstance();
  const service = container.get<T>(serviceName);
  
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  
  return service;
};

export default {
  StorageService,
  PostsService,
  UsersService,
  SocialAccountsService,
  AnalyticsService,
  ServiceContainer,
  configureServices,
  useService
};
