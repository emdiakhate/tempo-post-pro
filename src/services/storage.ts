/**
 * Service de base pour la gestion du stockage
 * Abstrait localStorage avec gestion d'erreurs et fallbacks
 */

export interface StorageError {
  code: string;
  message: string;
  originalError?: Error;
}

export interface StorageResult<T> {
  data?: T;
  error?: StorageError;
  success: boolean;
}

export class StorageService {
  private static readonly PREFIX = 'postelma_';
  private static readonly MAX_RETRIES = 3;

  /**
   * Sauvegarder des données dans localStorage
   */
  static async save<T>(key: string, data: T): Promise<StorageResult<T>> {
    const fullKey = this.PREFIX + key;
    
    try {
      const serialized = JSON.stringify(data);
      
      // Vérifier la taille (localStorage a une limite de ~5-10MB)
      if (serialized.length > 5 * 1024 * 1024) { // 5MB
        return {
          success: false,
          error: {
            code: 'STORAGE_QUOTA_EXCEEDED',
            message: 'Données trop volumineuses pour localStorage'
          }
        };
      }

      localStorage.setItem(fullKey, serialized);
      
      return {
        data,
        success: true
      };
    } catch (error) {
      return this.handleStorageError(error, 'save', fullKey);
    }
  }

  /**
   * Charger des données depuis localStorage
   */
  static async load<T>(key: string, defaultValue?: T): Promise<StorageResult<T>> {
    const fullKey = this.PREFIX + key;
    
    try {
      const item = localStorage.getItem(fullKey);
      
      if (item === null) {
        return {
          data: defaultValue,
          success: true
        };
      }

      const parsed = JSON.parse(item);
      
      return {
        data: parsed,
        success: true
      };
    } catch (error) {
      return this.handleStorageError(error, 'load', fullKey, defaultValue);
    }
  }

  /**
   * Supprimer des données de localStorage
   */
  static async remove(key: string): Promise<StorageResult<boolean>> {
    const fullKey = this.PREFIX + key;
    
    try {
      localStorage.removeItem(fullKey);
      
      return {
        data: true,
        success: true
      };
    } catch (error) {
      return this.handleStorageError(error, 'remove', fullKey);
    }
  }

  /**
   * Vérifier si une clé existe
   */
  static async exists(key: string): Promise<StorageResult<boolean>> {
    const fullKey = this.PREFIX + key;
    
    try {
      const exists = localStorage.getItem(fullKey) !== null;
      
      return {
        data: exists,
        success: true
      };
    } catch (error) {
      return this.handleStorageError(error, 'exists', fullKey);
    }
  }

  /**
   * Obtenir toutes les clés avec le préfixe
   */
  static async getAllKeys(): Promise<StorageResult<string[]>> {
    try {
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.substring(this.PREFIX.length));
      
      return {
        data: keys,
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORAGE_ACCESS_ERROR',
          message: 'Impossible d\'accéder aux clés de stockage',
          originalError: error as Error
        }
      };
    }
  }

  /**
   * Nettoyer toutes les données avec le préfixe
   */
  static async clear(): Promise<StorageResult<boolean>> {
    try {
      const keys = await this.getAllKeys();
      
      if (!keys.success) {
        return {
          success: false,
          error: keys.error
        };
      }

      for (const key of keys.data || []) {
        await this.remove(key);
      }
      
      return {
        data: true,
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORAGE_CLEAR_ERROR',
          message: 'Impossible de nettoyer le stockage',
          originalError: error as Error
        }
      };
    }
  }

  /**
   * Obtenir la taille utilisée en bytes
   */
  static async getUsedSpace(): Promise<StorageResult<number>> {
    try {
      let totalSize = 0;
      
      for (const key in localStorage) {
        if (key.startsWith(this.PREFIX)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
      
      return {
        data: totalSize,
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORAGE_SIZE_ERROR',
          message: 'Impossible de calculer la taille du stockage',
          originalError: error as Error
        }
      };
    }
  }

  /**
   * Gestion centralisée des erreurs de stockage
   */
  private static handleStorageError(
    error: unknown, 
    operation: string, 
    key: string, 
    fallbackData?: any
  ): StorageResult<any> {
    const errorObj = error as Error;
    
    let errorCode = 'STORAGE_UNKNOWN_ERROR';
    let errorMessage = `Erreur lors de l'opération ${operation}`;

    if (errorObj.name === 'QuotaExceededError') {
      errorCode = 'STORAGE_QUOTA_EXCEEDED';
      errorMessage = 'Espace de stockage insuffisant';
    } else if (errorObj.name === 'SecurityError') {
      errorCode = 'STORAGE_SECURITY_ERROR';
      errorMessage = 'Accès au stockage refusé (mode privé)';
    } else if (errorObj.name === 'SyntaxError') {
      errorCode = 'STORAGE_SYNTAX_ERROR';
      errorMessage = 'Données corrompues dans le stockage';
    }

    console.error(`StorageService.${operation} failed:`, {
      key,
      error: errorObj,
      operation
    });

    return {
      data: fallbackData,
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        originalError: errorObj
      }
    };
  }

  /**
   * Migrer des données d'une ancienne version
   */
  static async migrate<T>(
    oldKey: string, 
    newKey: string, 
    transformer?: (data: any) => T
  ): Promise<StorageResult<T | null>> {
    try {
      const oldData = await this.load(oldKey);
      
      if (!oldData.success || !oldData.data) {
        return {
          data: null,
          success: true
        };
      }

      const transformedData = transformer ? transformer(oldData.data) : (oldData.data as T);
      const saveResult = await this.save(newKey, transformedData);
      
      if (saveResult.success) {
        await this.remove(oldKey);
      }
      
      return {
        data: transformedData,
        success: saveResult.success,
        error: saveResult.error
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STORAGE_MIGRATION_ERROR',
          message: 'Erreur lors de la migration des données',
          originalError: error as Error
        }
      };
    }
  }
}

export default StorageService;
