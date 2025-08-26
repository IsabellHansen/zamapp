import { SDK_CDN_URL } from './constants';
import { isValidFhevmWindow, isValidRelayerSDK } from './validation';
// FhevmWindowType import removed as it's unused

type TraceType = (message?: unknown, ...optionalParams: unknown[]) => void;

/**
 * RelayerSDK 加载器 - 负责从 Zama CDN 加载 SDK
 */
export class RelayerSDKLoader {
  private _trace?: TraceType;
  private _loadPromise?: Promise<void>;

  constructor(options: { trace?: TraceType } = {}) {
    this._trace = options.trace;
  }

  /**
   * 检查 SDK 是否已加载
   */
  public isLoaded(): boolean {
    if (typeof window === "undefined") {
      throw new Error("RelayerSDKLoader: can only be used in the browser");
    }
    
    const isLoaded = isValidFhevmWindow(window, this._trace);
    this._trace?.(`[RelayerSDKLoader] SDK loaded check: ${isLoaded}`);
    return isLoaded;
  }

  /**
   * 加载 RelayerSDK
   */
  public load(): Promise<void> {
    // 如果已经在加载过程中，返回现有的 Promise
    if (this._loadPromise) {
      this._trace?.("[RelayerSDKLoader] Load already in progress, returning existing promise");
      return this._loadPromise;
    }

    this._trace?.("[RelayerSDKLoader] Starting SDK load process...");
    
    // 确保只在浏览器环境中运行
    if (typeof window === "undefined") {
      this._trace?.("[RelayerSDKLoader] ❌ Not in browser environment");
      return Promise.reject(
        new Error("RelayerSDKLoader: can only be used in the browser")
      );
    }

    // 检查是否已经加载
    if ("relayerSDK" in window) {
      if (!isValidRelayerSDK((window as any).relayerSDK, this._trace)) {
        this._trace?.("[RelayerSDKLoader] ⚠️ Invalid existing relayerSDK object, clearing and reloading...");
        // 清除无效的SDK对象
        try {
          delete (window as any).relayerSDK;
          this._trace?.("[RelayerSDKLoader] Cleared invalid relayerSDK from window");
        } catch (e) {
          this._trace?.("[RelayerSDKLoader] Failed to clear relayerSDK:", e);
        }
        
        // 移除现有的脚本标签
        try {
          const existingScripts = document.querySelectorAll(`script[src="${SDK_CDN_URL}"]`);
          existingScripts.forEach(script => {
            this._trace?.("[RelayerSDKLoader] Removing invalid script tag");
            script.remove();
          });
          this._trace?.(`[RelayerSDKLoader] Removed ${existingScripts.length} invalid script tags`);
        } catch (e) {
          this._trace?.("[RelayerSDKLoader] Failed to remove script tags:", e);
        }
        
        // 重置加载状态并继续正常的加载流程
        this._loadPromise = undefined;
      } else {
        this._trace?.("[RelayerSDKLoader] ✅ SDK already loaded and valid");
        return Promise.resolve();
      }
    }

    // 创建加载 Promise
    this._loadPromise = this._performLoad();
    return this._loadPromise;
  }

  /**
   * 执行实际的加载过程
   */
  private _performLoad(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._trace?.(`[RelayerSDKLoader] Loading SDK from: ${SDK_CDN_URL}`);
      
      // 检查是否已有相同的脚本标签
      const existingScript = document.querySelector(
        `script[src="${SDK_CDN_URL}"]`
      );
      
      if (existingScript) {
        this._trace?.("[RelayerSDKLoader] Script tag already exists, checking window object...");
        
        // 等待一下让脚本完全加载
        setTimeout(() => {
          if (!isValidFhevmWindow(window, this._trace)) {
            reject(new Error(
              "RelayerSDKLoader: Script exists but window.relayerSDK is invalid"
            ));
            return;
          }
          this._trace?.("[RelayerSDKLoader] ✅ Existing script is valid");
          resolve();
        }, 100);
        return;
      }

      // 创建新的脚本标签
      const script = document.createElement("script");
      script.src = SDK_CDN_URL;
      script.type = "text/javascript";
      script.async = true;

      // 成功加载处理
      script.onload = () => {
        this._trace?.("[RelayerSDKLoader] Script loaded, validating SDK...");
        
        // 小延迟确保 SDK 完全初始化
        setTimeout(() => {
          if (!isValidFhevmWindow(window, this._trace)) {
            this._trace?.("[RelayerSDKLoader] ❌ Script loaded but window.relayerSDK is invalid");
            reject(new Error(
              `RelayerSDKLoader: Script loaded from ${SDK_CDN_URL} but window.relayerSDK is invalid`
            ));
            return;
          }
          
          this._trace?.("[RelayerSDKLoader] ✅ SDK loaded and validated successfully");
          resolve();
        }, 50);
      };

      // 加载失败处理
      script.onerror = (error) => {
        this._trace?.("[RelayerSDKLoader] ❌ Script load failed:", error);
        reject(new Error(
          `RelayerSDKLoader: Failed to load SDK from ${SDK_CDN_URL}`
        ));
      };

      // 超时处理
      const timeout = setTimeout(() => {
        this._trace?.("[RelayerSDKLoader] ❌ Load timeout");
        reject(new Error(
          `RelayerSDKLoader: Load timeout for ${SDK_CDN_URL}`
        ));
      }, 30000); // 30秒超时

      const originalOnload = script.onload;
      script.onload = (event) => {
        clearTimeout(timeout);
        if (originalOnload) {
          originalOnload.call(script, event);
        }
      };

      const originalOnError = script.onerror;
      script.onerror = (error) => {
        clearTimeout(timeout);
        if (originalOnError) {
          originalOnError.call(script, error);
        }
      };

      // 添加脚本到 DOM
      this._trace?.("[RelayerSDKLoader] Adding script to DOM...");
      document.head.appendChild(script);
    });
  }

  /**
   * 强制重新加载 SDK
   */
  public forceReload(): Promise<void> {
    this._trace?.("[RelayerSDKLoader] Force reloading SDK...");
    
    // 清除现有的加载 Promise
    this._loadPromise = undefined;
    
    // 移除现有的脚本标签
    const existingScripts = document.querySelectorAll(`script[src="${SDK_CDN_URL}"]`);
    existingScripts.forEach(script => {
      this._trace?.("[RelayerSDKLoader] Removing existing script tag");
      script.remove();
    });
    
    // 清除 window 对象上的 SDK
    if (typeof window !== "undefined" && "relayerSDK" in window) {
      delete (window as any).relayerSDK;
      this._trace?.("[RelayerSDKLoader] Cleared window.relayerSDK");
    }
    
    // 重新加载
    return this.load();
  }

  /**
   * 获取加载器状态信息
   */
  public getStatus(): {
    isLoaded: boolean;
    isLoading: boolean;
    hasWindow: boolean;
    hasScript: boolean;
    sdkMethods: string[];
  } {
    const hasWindow = typeof window !== "undefined";
    const isLoaded = hasWindow && this.isLoaded();
    const isLoading = !!this._loadPromise && !isLoaded;
    const hasScript = hasWindow && !!document.querySelector(`script[src="${SDK_CDN_URL}"]`);
    
    let sdkMethods: string[] = [];
    if (hasWindow && "relayerSDK" in window) {
      const sdk = (window as any).relayerSDK;
      if (sdk && typeof sdk === 'object') {
        sdkMethods = Object.getOwnPropertyNames(sdk).filter(prop => 
          typeof sdk[prop] === 'function'
        );
      }
    }

    return {
      isLoaded,
      isLoading,
      hasWindow,
      hasScript,
      sdkMethods
    };
  }
}