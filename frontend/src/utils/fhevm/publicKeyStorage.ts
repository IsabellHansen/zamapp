import type { PublicKeyCache } from './types';
import { STORAGE_KEYS } from './constants';

// PublicKey 缓存管理 - 简化版本
export class PublicKeyStorage {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  
  /**
   * 获取缓存的公钥 - 返回简化格式
   */
  static async get(aclAddress: string): Promise<PublicKeyCache | null> {
    try {
      console.log(`[PublicKeyStorage] Getting cached key for ACL: ${aclAddress}`);
      
      const cacheKey = this.getCacheKey(aclAddress);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        console.log('[PublicKeyStorage] No cached key found');
        return null;
      }

      const parsedCache: PublicKeyCache = JSON.parse(cached);
      
      // 检查缓存是否过期
      const now = Date.now();
      if (now - parsedCache.timestamp > this.CACHE_DURATION) {
        console.log('[PublicKeyStorage] Cached key expired, removing...');
        localStorage.removeItem(cacheKey);
        return null;
      }

      console.log('[PublicKeyStorage] ✅ Valid cached key found');
      return parsedCache;
    } catch (error) {
      console.error('[PublicKeyStorage] Error getting cached key:', error);
      return null;
    }
  }

  /**
   * 设置公钥缓存 - 简化版本
   */
  static async set(
    aclAddress: string, 
    publicKey: any, 
    publicParams: any
  ): Promise<void> {
    try {
      console.log(`[PublicKeyStorage] Caching key for ACL: ${aclAddress}`);
      
      // 暂时简化，不实际缓存复杂的数据结构
      const cache: PublicKeyCache = {
        publicKey: 'cached',
        publicParams: 'cached',
        timestamp: Date.now(),
        aclAddress
      };

      const cacheKey = this.getCacheKey(aclAddress);
      localStorage.setItem(cacheKey, JSON.stringify(cache));
      
      console.log('[PublicKeyStorage] ✅ Key cached successfully (simplified)');
    } catch (error) {
      console.error('[PublicKeyStorage] Error caching key:', error);
    }
  }

  /**
   * 清除指定地址的缓存
   */
  static clear(aclAddress: string): void {
    try {
      const cacheKey = this.getCacheKey(aclAddress);
      localStorage.removeItem(cacheKey);
      console.log(`[PublicKeyStorage] Cache cleared for ACL: ${aclAddress}`);
    } catch (error) {
      console.error('[PublicKeyStorage] Error clearing cache:', error);
    }
  }

  /**
   * 清除所有公钥缓存
   */
  static clearAll(): void {
    try {
      const keysToRemove: string[] = [];
      
      // 找出所有以公钥前缀开始的键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.PUBLIC_KEY)) {
          keysToRemove.push(key);
        }
      }

      // 删除找到的键
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`[PublicKeyStorage] Cleared ${keysToRemove.length} cached keys`);
    } catch (error) {
      console.error('[PublicKeyStorage] Error clearing all cache:', error);
    }
  }

  /**
   * 获取缓存键名
   */
  private static getCacheKey(aclAddress: string): string {
    return `${STORAGE_KEYS.PUBLIC_KEY}_${aclAddress.toLowerCase()}`;
  }

  /**
   * 获取缓存统计信息
   */
  static getStats(): {
    totalCached: number;
    cacheEntries: Array<{
      aclAddress: string;
      timestamp: number;
      isExpired: boolean;
    }>;
  } {
    const cacheEntries: Array<{
      aclAddress: string;
      timestamp: number; 
      isExpired: boolean;
    }> = [];
    
    try {
      const now = Date.now();
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.PUBLIC_KEY)) {
          try {
            const cached = localStorage.getItem(key);
            if (cached) {
              const parsedCache: PublicKeyCache = JSON.parse(cached);
              cacheEntries.push({
                aclAddress: parsedCache.aclAddress,
                timestamp: parsedCache.timestamp,
                isExpired: now - parsedCache.timestamp > this.CACHE_DURATION
              });
            }
          } catch (parseError) {
            console.warn(`[PublicKeyStorage] Failed to parse cached entry: ${key}`);
          }
        }
      }
    } catch (error) {
      console.error('[PublicKeyStorage] Error getting stats:', error);
    }

    return {
      totalCached: cacheEntries.length,
      cacheEntries
    };
  }
}