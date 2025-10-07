/**
 * Hook personnalisé pour la gestion des paramètres
 * Centralise la logique des paramètres de l'application
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '@/services';

export interface AppSettings {
  // Général
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  notificationTypes: {
    posts: boolean;
    comments: boolean;
    mentions: boolean;
    system: boolean;
  };
  
  // Posts
  autoSave: boolean;
  autoSaveInterval: number; // en minutes
  defaultPlatforms: string[];
  defaultHashtags: string[];
  
  // Analytics
  analyticsEnabled: boolean;
  dataRetention: number; // en jours
  exportFormat: 'json' | 'csv' | 'xlsx';
  
  // Sécurité
  sessionTimeout: number; // en minutes
  twoFactorAuth: boolean;
  passwordExpiry: number; // en jours
  
  // Performance
  cacheEnabled: boolean;
  cacheSize: number; // en MB
  lazyLoading: boolean;
  
  // Intégrations
  n8nWebhook: string;
  ayrshareApiKey: string;
  openaiApiKey: string;
  
  // Avancé
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  experimentalFeatures: boolean;
}

export interface UseSettingsOptions {
  autoLoad?: boolean;
  defaultSettings?: Partial<AppSettings>;
}

export interface UseSettingsReturn {
  // État
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  
  // Actions spécifiques
  updateLanguage: (language: string) => Promise<boolean>;
  updateTimezone: (timezone: string) => Promise<boolean>;
  toggleNotifications: (type: keyof AppSettings['notificationTypes']) => Promise<boolean>;
  updateDefaultPlatforms: (platforms: string[]) => Promise<boolean>;
  updateApiKeys: (keys: Partial<Pick<AppSettings, 'n8nWebhook' | 'ayrshareApiKey' | 'openaiApiKey'>>) => Promise<boolean>;
  
  // Utilitaires
  getSetting: <K extends keyof AppSettings>(key: K) => AppSettings[K];
  hasSetting: (key: keyof AppSettings) => boolean;
  exportSettings: () => Promise<string>;
  importSettings: (jsonData: string) => Promise<boolean>;
  validateSettings: () => Promise<{ valid: boolean; errors: string[] }>;
}

export const useSettings = (options: UseSettingsOptions = {}): UseSettingsReturn => {
  const { autoLoad = true, defaultSettings = {} } = options;
  
  // Paramètres par défaut
  const defaultAppSettings: AppSettings = {
    // Général
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    notificationTypes: {
      posts: true,
      comments: true,
      mentions: true,
      system: true
    },
    
    // Posts
    autoSave: true,
    autoSaveInterval: 5,
    defaultPlatforms: ['instagram', 'facebook'],
    defaultHashtags: ['#marketing', '#socialmedia'],
    
    // Analytics
    analyticsEnabled: true,
    dataRetention: 365,
    exportFormat: 'json',
    
    // Sécurité
    sessionTimeout: 480, // 8 heures
    twoFactorAuth: false,
    passwordExpiry: 90,
    
    // Performance
    cacheEnabled: true,
    cacheSize: 100,
    lazyLoading: true,
    
    // Intégrations
    n8nWebhook: '',
    ayrshareApiKey: '',
    openaiApiKey: '',
    
    // Avancé
    debugMode: false,
    logLevel: 'info',
    experimentalFeatures: false
  };
  
  // État principal
  const [settings, setSettingsState] = useState<AppSettings>({
    ...defaultAppSettings,
    ...defaultSettings
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await StorageService.load<AppSettings>('settings', defaultAppSettings);
      const savedSettings = result.data || defaultAppSettings;
      
      setSettingsState(savedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres');
      console.error('Erreur useSettings.loadSettings:', err);
    } finally {
      setLoading(false);
    }
  }, [defaultAppSettings]);

  // Sauvegarder les paramètres
  const saveSettings = useCallback(async (newSettings: AppSettings): Promise<boolean> => {
    try {
      const result = await StorageService.save('settings', newSettings);
      return result.success;
    } catch (err) {
      console.error('Erreur useSettings.saveSettings:', err);
      return false;
    }
  }, []);

  // Mettre à jour les paramètres
  const updateSettings = useCallback(async (updates: Partial<AppSettings>): Promise<boolean> => {
    try {
      setError(null);
      const updatedSettings = { ...settings, ...updates };
      
      const success = await saveSettings(updatedSettings);
      
      if (success) {
        setSettingsState(updatedSettings);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour des paramètres');
      console.error('Erreur useSettings.updateSettings:', err);
      return false;
    }
  }, [settings, saveSettings]);

  // Réinitialiser les paramètres
  const resetSettings = useCallback(async (): Promise<boolean> => {
    return updateSettings(defaultAppSettings);
  }, [updateSettings, defaultAppSettings]);

  // Mettre à jour la langue
  const updateLanguage = useCallback(async (language: string): Promise<boolean> => {
    return updateSettings({ language });
  }, [updateSettings]);

  // Mettre à jour le fuseau horaire
  const updateTimezone = useCallback(async (timezone: string): Promise<boolean> => {
    return updateSettings({ timezone });
  }, [updateSettings]);

  // Basculer les notifications
  const toggleNotifications = useCallback(async (type: keyof AppSettings['notificationTypes']): Promise<boolean> => {
    const currentValue = settings.notificationTypes[type];
    const updatedTypes = { ...settings.notificationTypes, [type]: !currentValue };
    return updateSettings({ notificationTypes: updatedTypes });
  }, [settings.notificationTypes, updateSettings]);

  // Mettre à jour les plateformes par défaut
  const updateDefaultPlatforms = useCallback(async (platforms: string[]): Promise<boolean> => {
    return updateSettings({ defaultPlatforms: platforms });
  }, [updateSettings]);

  // Mettre à jour les clés API
  const updateApiKeys = useCallback(async (keys: Partial<Pick<AppSettings, 'n8nWebhook' | 'ayrshareApiKey' | 'openaiApiKey'>>): Promise<boolean> => {
    return updateSettings(keys);
  }, [updateSettings]);

  // Obtenir un paramètre
  const getSetting = useCallback(<K extends keyof AppSettings>(key: K): AppSettings[K] => {
    return settings[key];
  }, [settings]);

  // Vérifier si un paramètre existe
  const hasSetting = useCallback((key: keyof AppSettings): boolean => {
    return key in settings;
  }, [settings]);

  // Exporter les paramètres
  const exportSettings = useCallback(async (): Promise<string> => {
    try {
      return JSON.stringify(settings, null, 2);
    } catch (err) {
      console.error('Erreur useSettings.exportSettings:', err);
      return '';
    }
  }, [settings]);

  // Importer les paramètres
  const importSettings = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const importedSettings = JSON.parse(jsonData);
      
      if (!importedSettings || typeof importedSettings !== 'object') {
        throw new Error('Format de paramètres invalide');
      }
      
      const success = await saveSettings(importedSettings);
      
      if (success) {
        setSettingsState(importedSettings);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import des paramètres');
      console.error('Erreur useSettings.importSettings:', err);
      return false;
    }
  }, [saveSettings]);

  // Valider les paramètres
  const validateSettings = useCallback(async (): Promise<{ valid: boolean; errors: string[] }> => {
    const errors: string[] = [];
    
    try {
      // Validation de la langue
      if (!settings.language || settings.language.length !== 2) {
        errors.push('Langue invalide');
      }
      
      // Validation du fuseau horaire
      try {
        Intl.DateTimeFormat(undefined, { timeZone: settings.timezone });
      } catch {
        errors.push('Fuseau horaire invalide');
      }
      
      // Validation de l'intervalle de sauvegarde automatique
      if (settings.autoSaveInterval < 1 || settings.autoSaveInterval > 60) {
        errors.push('Intervalle de sauvegarde automatique invalide (1-60 minutes)');
      }
      
      // Validation de la rétention des données
      if (settings.dataRetention < 30 || settings.dataRetention > 3650) {
        errors.push('Rétention des données invalide (30-3650 jours)');
      }
      
      // Validation du timeout de session
      if (settings.sessionTimeout < 15 || settings.sessionTimeout > 1440) {
        errors.push('Timeout de session invalide (15-1440 minutes)');
      }
      
      // Validation de la taille du cache
      if (settings.cacheSize < 10 || settings.cacheSize > 1000) {
        errors.push('Taille du cache invalide (10-1000 MB)');
      }
      
      // Validation des clés API (format basique)
      if (settings.n8nWebhook && !settings.n8nWebhook.startsWith('http')) {
        errors.push('URL webhook N8N invalide');
      }
      
      if (settings.ayrshareApiKey && settings.ayrshareApiKey.length < 10) {
        errors.push('Clé API Ayrshare invalide');
      }
      
      if (settings.openaiApiKey && !settings.openaiApiKey.startsWith('sk-')) {
        errors.push('Clé API OpenAI invalide');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (err) {
      console.error('Erreur useSettings.validateSettings:', err);
      return {
        valid: false,
        errors: ['Erreur lors de la validation des paramètres']
      };
    }
  }, [settings]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadSettings();
    }
  }, [autoLoad, loadSettings]);

  return {
    // État
    settings,
    loading,
    error,
    
    // Actions
    loadSettings,
    updateSettings,
    resetSettings,
    
    // Actions spécifiques
    updateLanguage,
    updateTimezone,
    toggleNotifications,
    updateDefaultPlatforms,
    updateApiKeys,
    
    // Utilitaires
    getSetting,
    hasSetting,
    exportSettings,
    importSettings,
    validateSettings
  };
};

export default useSettings;
