/**
 * Hook personnalisé pour la gestion du thème
 * Centralise la logique du thème et des préférences d'affichage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageService } from '@/services';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red';
export type FontSize = 'small' | 'medium' | 'large';

export interface ThemePreferences {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
  compactMode: boolean;
}

export interface UseThemeOptions {
  autoLoad?: boolean;
  defaultTheme?: ThemePreferences;
}

export interface UseThemeReturn {
  // État
  theme: ThemePreferences;
  loading: boolean;
  error: string | null;
  
  // Actions
  setTheme: (theme: Partial<ThemePreferences>) => Promise<boolean>;
  setMode: (mode: ThemeMode) => Promise<boolean>;
  setColorScheme: (colorScheme: ColorScheme) => Promise<boolean>;
  setFontSize: (fontSize: FontSize) => Promise<boolean>;
  toggleReducedMotion: () => Promise<boolean>;
  toggleHighContrast: () => Promise<boolean>;
  toggleCompactMode: () => Promise<boolean>;
  resetTheme: () => Promise<boolean>;
  
  // Utilitaires
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  getThemeClasses: () => string;
  exportTheme: () => Promise<string>;
  importTheme: (jsonData: string) => Promise<boolean>;
}

export const useTheme = (options: UseThemeOptions = {}): UseThemeReturn => {
  const { autoLoad = true, defaultTheme } = options;
  
  // Thème par défaut
  const defaultThemeConfig: ThemePreferences = {
    mode: 'system',
    colorScheme: 'blue',
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    compactMode: false
  };
  
  // État principal
  const [theme, setThemeState] = useState<ThemePreferences>(
    defaultTheme || defaultThemeConfig
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger le thème
  const loadTheme = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await StorageService.load<ThemePreferences>('theme', defaultThemeConfig);
      const savedTheme = result.data || defaultThemeConfig;
      
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du thème');
      console.error('Erreur useTheme.loadTheme:', err);
    } finally {
      setLoading(false);
    }
  }, [defaultThemeConfig]);

  // Appliquer le thème au DOM
  const applyTheme = useCallback((themeConfig: ThemePreferences) => {
    try {
      const root = document.documentElement;
      
      // Mode sombre/clair
      if (themeConfig.mode === 'dark' || 
          (themeConfig.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      
      // Schéma de couleurs
      root.setAttribute('data-color-scheme', themeConfig.colorScheme);
      
      // Taille de police
      root.setAttribute('data-font-size', themeConfig.fontSize);
      
      // Mouvement réduit
      if (themeConfig.reducedMotion) {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }
      
      // Contraste élevé
      if (themeConfig.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
      
      // Mode compact
      if (themeConfig.compactMode) {
        root.classList.add('compact-mode');
      } else {
        root.classList.remove('compact-mode');
      }
    } catch (err) {
      console.error('Erreur useTheme.applyTheme:', err);
    }
  }, []);

  // Sauvegarder le thème
  const saveTheme = useCallback(async (themeConfig: ThemePreferences): Promise<boolean> => {
    try {
      const result = await StorageService.save('theme', themeConfig);
      return result.success;
    } catch (err) {
      console.error('Erreur useTheme.saveTheme:', err);
      return false;
    }
  }, []);

  // Mettre à jour le thème
  const setTheme = useCallback(async (newTheme: Partial<ThemePreferences>): Promise<boolean> => {
    try {
      setError(null);
      const updatedTheme = { ...theme, ...newTheme };
      
      const success = await saveTheme(updatedTheme);
      
      if (success) {
        setThemeState(updatedTheme);
        applyTheme(updatedTheme);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du thème');
      console.error('Erreur useTheme.setTheme:', err);
      return false;
    }
  }, [theme, saveTheme, applyTheme]);

  // Définir le mode
  const setMode = useCallback(async (mode: ThemeMode): Promise<boolean> => {
    return setTheme({ mode });
  }, [setTheme]);

  // Définir le schéma de couleurs
  const setColorScheme = useCallback(async (colorScheme: ColorScheme): Promise<boolean> => {
    return setTheme({ colorScheme });
  }, [setTheme]);

  // Définir la taille de police
  const setFontSize = useCallback(async (fontSize: FontSize): Promise<boolean> => {
    return setTheme({ fontSize });
  }, [setTheme]);

  // Basculer le mouvement réduit
  const toggleReducedMotion = useCallback(async (): Promise<boolean> => {
    return setTheme({ reducedMotion: !theme.reducedMotion });
  }, [setTheme, theme.reducedMotion]);

  // Basculer le contraste élevé
  const toggleHighContrast = useCallback(async (): Promise<boolean> => {
    return setTheme({ highContrast: !theme.highContrast });
  }, [setTheme, theme.highContrast]);

  // Basculer le mode compact
  const toggleCompactMode = useCallback(async (): Promise<boolean> => {
    return setTheme({ compactMode: !theme.compactMode });
  }, [setTheme, theme.compactMode]);

  // Réinitialiser le thème
  const resetTheme = useCallback(async (): Promise<boolean> => {
    return setTheme(defaultThemeConfig);
  }, [setTheme, defaultThemeConfig]);

  // Obtenir les classes CSS du thème
  const getThemeClasses = useCallback((): string => {
    const classes = [];
    
    // Mode
    if (theme.mode === 'dark' || 
        (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      classes.push('dark');
    } else {
      classes.push('light');
    }
    
    // Schéma de couleurs
    classes.push(`color-scheme-${theme.colorScheme}`);
    
    // Taille de police
    classes.push(`font-size-${theme.fontSize}`);
    
    // Options
    if (theme.reducedMotion) classes.push('reduced-motion');
    if (theme.highContrast) classes.push('high-contrast');
    if (theme.compactMode) classes.push('compact-mode');
    
    return classes.join(' ');
  }, [theme]);

  // Exporter le thème
  const exportTheme = useCallback(async (): Promise<string> => {
    try {
      return JSON.stringify(theme, null, 2);
    } catch (err) {
      console.error('Erreur useTheme.exportTheme:', err);
      return '';
    }
  }, [theme]);

  // Importer le thème
  const importTheme = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const importedTheme = JSON.parse(jsonData);
      
      if (!importedTheme || typeof importedTheme !== 'object') {
        throw new Error('Format de thème invalide');
      }
      
      const success = await saveTheme(importedTheme);
      
      if (success) {
        setThemeState(importedTheme);
        applyTheme(importedTheme);
      }
      
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'import du thème');
      console.error('Erreur useTheme.importTheme:', err);
      return false;
    }
  }, [saveTheme, applyTheme]);

  // Propriétés calculées
  const isDark = useMemo(() => {
    return theme.mode === 'dark' || 
           (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [theme.mode]);

  const isLight = useMemo(() => {
    return theme.mode === 'light' || 
           (theme.mode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [theme.mode]);

  const isSystem = useMemo(() => {
    return theme.mode === 'system';
  }, [theme.mode]);

  // Écouter les changements de préférences système
  useEffect(() => {
    if (theme.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme(theme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme, applyTheme]);

  // Chargement automatique
  useEffect(() => {
    if (autoLoad) {
      loadTheme();
    }
  }, [autoLoad, loadTheme]);

  return {
    // État
    theme,
    loading,
    error,
    
    // Actions
    setTheme,
    setMode,
    setColorScheme,
    setFontSize,
    toggleReducedMotion,
    toggleHighContrast,
    toggleCompactMode,
    resetTheme,
    
    // Utilitaires
    isDark,
    isLight,
    isSystem,
    getThemeClasses,
    exportTheme,
    importTheme
  };
};

export default useTheme;
