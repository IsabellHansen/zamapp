import { Eip1193Provider } from "ethers";

/**
 * 获取有效的 EIP-1193 Provider
 */
export function getValidEip1193Provider(): Eip1193Provider | undefined {
  if (typeof window === 'undefined') {
    console.warn('[getValidEip1193Provider] Not in browser environment');
    return undefined;
  }

  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    console.warn('[getValidEip1193Provider] No ethereum provider found in window');
    return undefined;
  }

  // 检查是否为有效的 EIP-1193 provider
  if (typeof ethereum.request !== 'function') {
    console.warn('[getValidEip1193Provider] Provider does not have request method');
    return undefined;
  }

  console.log('[getValidEip1193Provider] ✅ Found valid EIP-1193 provider');
  return ethereum;
}

/**
 * 检查 provider 是否为有效的 EIP-1193 provider
 */
export function isValidEip1193Provider(provider: any): provider is Eip1193Provider {
  return (
    provider &&
    typeof provider === 'object' &&
    typeof provider.request === 'function'
  );
}

/**
 * 获取当前连接的钱包信息
 */
export async function getWalletInfo(): Promise<{
  isMetaMask: boolean;
  isConnected: boolean;
  accounts: string[];
  chainId: string | null;
} | null> {
  const provider = getValidEip1193Provider();
  
  if (!provider) {
    return null;
  }

  try {
    const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
    const chainId = await provider.request({ method: 'eth_chainId' }) as string;
    
    return {
      isMetaMask: !!(provider as any).isMetaMask,
      isConnected: accounts.length > 0,
      accounts,
      chainId
    };
  } catch (error) {
    console.error('[getWalletInfo] Error getting wallet info:', error);
    return null;
  }
}

/**
 * 诊断 provider 状态
 */
export function diagnoseProvider(trace?: (message: string) => void): {
  hasWindow: boolean;
  hasEthereum: boolean;
  hasRequest: boolean;
  providerType: string;
  isMetaMask: boolean;
  errors: string[];
} {
  const log = trace || console.log;
  const errors: string[] = [];
  
  log('[Provider Diagnostics] Starting provider diagnostics...');
  
  const hasWindow = typeof window !== 'undefined';
  if (!hasWindow) {
    errors.push('Not in browser environment');
  }
  
  const ethereum = hasWindow ? (window as any).ethereum : undefined;
  const hasEthereum = !!ethereum;
  if (!hasEthereum && hasWindow) {
    errors.push('No ethereum provider found in window');
  }
  
  const hasRequest = hasEthereum && typeof ethereum.request === 'function';
  if (!hasRequest && hasEthereum) {
    errors.push('Ethereum provider missing request method');
  }
  
  const providerType = hasEthereum ? 
    (ethereum.constructor?.name || 'Unknown') : 'None';
  
  const isMetaMask = hasEthereum && !!ethereum.isMetaMask;
  
  const result = {
    hasWindow,
    hasEthereum,
    hasRequest,
    providerType,
    isMetaMask,
    errors
  };
  
  log('[Provider Diagnostics] Results:', result);
  return result;
}