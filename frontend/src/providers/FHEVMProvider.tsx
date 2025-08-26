import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useWalletContext } from './WalletProvider';
import { useFhevm, isFhevmSupported, getChainName } from '../hooks/useFhevm';
import type { FhevmInstance } from '../utils/fhevm/types';
import { diagnosticSDK } from '../utils/fhevm/validation';
import { getValidEip1193Provider } from '../utils/fhevm/providerUtils';
import { RelayerSDKLoader } from '../utils/fhevm/relayerSDKLoader';

interface FHEVMContextType {
  isReady: boolean;
  isLoading: boolean;
  networkSupported: boolean;
  encryptedCount: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  performEncryptAdd: (value: number) => Promise<void>;
  performEncryptSub: (value: number) => Promise<void>;
  refreshState: () => Promise<void>;
  // 新增的 SDK 相关状态
  fhevmInstance: FhevmInstance | undefined;
  fhevmStatus: 'idle' | 'loading' | 'ready' | 'error';
  fhevmError: Error | undefined;
  sdkDiagnostics: () => void;
  forceReloadSDK: () => Promise<void>;
}

const FHEVMContext = createContext<FHEVMContextType | undefined>(undefined);

export const useFHEVMContext = () => {
  const context = useContext(FHEVMContext);
  if (!context) {
    throw new Error('useFHEVMContext must be used within a FHEVMProvider');
  }
  return context;
};

interface FHEVMProviderProps {
  children: React.ReactNode;
}

export const FHEVMProvider: React.FC<FHEVMProviderProps> = ({ children }) => {
  const { provider, account, chainId } = useWalletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [encryptedCount, setEncryptedCount] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  
  // 获取有效的 EIP-1193 provider
  const eip1193Provider = getValidEip1193Provider();
  
  // 使用新的 FHEVM Hook
  const { 
    instance: fhevmInstance, 
    status: fhevmStatus, 
    error: fhevmError
  } = useFhevm({
    provider: eip1193Provider,
    chainId: chainId || undefined,
    enabled: !!provider && !!account && !!chainId && !!eip1193Provider,
    initialMockChains: {
      31337: "http://localhost:8545"
    }
  });
  
  // 计算派生状态
  const networkSupported = isFhevmSupported(chainId || undefined);
  const isReady = networkSupported && fhevmStatus === 'ready' && !!fhevmInstance;
  
  console.log('[FHEVMProvider] State:', {
    chainId,
    networkSupported,
    fhevmStatus,
    isReady,
    hasInstance: !!fhevmInstance,
    hasProvider: !!provider,
    hasAccount: !!account
  });

  // 刷新状态函数 - 需要先定义，因为其他函数会用到
  const refreshState = useCallback(async () => {
    if (!provider || !account) return;
    
    try {
      const timestamp = Date.now();
      const mockHandle = ethers.id(`encrypted_${timestamp}_${account}`);
      setEncryptedCount(mockHandle);
    } catch (error) {
      console.error('Error refreshing state:', error);
    }
  }, [provider, account]);

  // SDK 诊断功能
  const sdkDiagnostics = useCallback(() => {
    console.log('=== 🔍 FHEVM 完整诊断 ===');
    
    // Provider 诊断 - 暂时简化
    console.log('📡 Provider Status:', {
      hasEip1193Provider: !!eip1193Provider,
      providerType: typeof eip1193Provider
    });
    
    // SDK 诊断
    const diagnostics = diagnosticSDK(console.log);
    console.log('⚙️ SDK Status:', {
      windowExists: diagnostics.windowExists,
      relayerSDKExists: diagnostics.relayerSDKExists,
      sdkMethods: diagnostics.sdkMethods,
      sdkConfig: diagnostics.sdkConfig,
      initialized: diagnostics.initialized,
      issues: diagnostics.issues
    });
    
    // 网络和状态诊断
    console.log('🌐 Network & State:', {
      chainId: chainId,
      chainName: getChainName(chainId || undefined),
      networkSupported: networkSupported,
      fhevmStatus: fhevmStatus,
      fhevmError: fhevmError?.message,
      hasEip1193Provider: !!eip1193Provider,
      isReady: isReady
    });
    
    // 在控制台显示诊断结果
    toast.info(`🔍 完整诊断完成，查看控制台获取详细信息`);
  }, [chainId, networkSupported, fhevmStatus, fhevmError, eip1193Provider, isReady]);

  // 强制重新加载SDK功能
  const forceReloadSDK = useCallback(async () => {
    console.log('🔄 强制重新加载 RelayerSDK...');
    toast.info('正在重新加载 RelayerSDK...');
    
    try {
      const loader = new RelayerSDKLoader({ 
        trace: console.log 
      });
      await loader.forceReload();
      toast.success('✅ RelayerSDK 重新加载成功');
    } catch (error) {
      console.error('强制重新加载SDK失败:', error);
      toast.error('❌ SDK 重新加载失败');
    }
  }, []);

  const createEncryptedInput = useCallback(async (value: number, contractAddress: string) => {
    if (!fhevmInstance) {
      throw new Error('FHEVM instance not available');
    }
    
    if (!account) {
      throw new Error('Wallet account not available');
    }
    
    try {
      console.log('[FHEVMProvider] Creating encrypted input using FHEVM SDK:', {
        value,
        contractAddress,
        userAddress: account,
        chainId
      });
      
      // 使用真正的 FHEVM SDK 创建加密输入
      const encryptedInput = fhevmInstance.createEncryptedInput(contractAddress, account);
      encryptedInput.add32(value);
      
      const result = await encryptedInput.encrypt();
      
      console.log('[FHEVMProvider] Encrypted input created successfully:', {
        handlesCount: result.handles.length,
        proofLength: result.inputProof.length,
        handlePreview: result.handles[0]?.substring(0, 20) + '...',
        proofPreview: result.inputProof.substring(0, 20) + '...'
      });
      
      return {
        handle: result.handles[0],
        proof: result.inputProof
      };
    } catch (error) {
      console.error('[FHEVMProvider] Error creating encrypted input:', error);
      throw error;
    }
  }, [fhevmInstance, account, chainId]);

  const performEncryptAdd = useCallback(async (value: number) => {
    if (!provider || !networkSupported) {
      toast.error('Network not supported for FHEVM operations');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐➕ Starting FHEVM Add operation...');
      
      const contractAddress = "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1";
      const encryptedInput = await createEncryptedInput(value, contractAddress);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: contractAddress,
        data: ethers.concat([
          ethers.id("add(bytes32,bytes)").slice(0, 10),
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "bytes"],
            [encryptedInput.handle, encryptedInput.proof]
          )
        ]),
        gasPrice: ethers.parseUnits('150', 'gwei'),
        gasLimit: BigInt(3000000),
        type: 0
      });
      
      toast.info(`🔐➕ Add transaction submitted: ${tx.hash.substring(0, 10)}...`);
      
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        toast.success('🎉 FHEVM Add operation successful!');
        setInputValue('');
        await refreshState();
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (error: any) {
      console.error('FHEVM Add operation failed:', error);
      
      if (error.message.includes('dropped') || error.message.includes('replaced')) {
        toast.error('🚫 Transaction dropped or replaced');
      } else if (error.message.includes('execution reverted')) {
        toast.error('🔧 FHEVM Add execution failed');
      } else {
        toast.error('🔐➕ FHEVM Add failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [provider, networkSupported, createEncryptedInput, refreshState]);

  const performEncryptSub = useCallback(async (value: number) => {
    if (!provider || !networkSupported) {
      toast.error('Network not supported for FHEVM operations');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐➖ Starting FHEVM Sub operation...');
      
      const contractAddress = "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1";
      const encryptedInput = await createEncryptedInput(value, contractAddress);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: contractAddress,
        data: ethers.concat([
          ethers.id("subtract(bytes32,bytes)").slice(0, 10),
          ethers.AbiCoder.defaultAbiCoder().encode(
            ["bytes32", "bytes"],
            [encryptedInput.handle, encryptedInput.proof]
          )
        ]),
        gasPrice: ethers.parseUnits('150', 'gwei'),
        gasLimit: BigInt(3000000),
        type: 0
      });
      
      toast.info(`🔐➖ Sub transaction submitted: ${tx.hash.substring(0, 10)}...`);
      
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        toast.success('🎉 FHEVM Sub operation successful!');
        setInputValue('');
        await refreshState();
      } else {
        throw new Error('Transaction failed');
      }
      
    } catch (error: any) {
      console.error('FHEVM Sub operation failed:', error);
      
      if (error.message.includes('dropped') || error.message.includes('replaced')) {
        toast.error('🚫 Transaction dropped or replaced');
      } else if (error.message.includes('execution reverted')) {
        toast.error('🔧 FHEVM Sub execution failed');
      } else {
        toast.error('🔐➖ FHEVM Sub failed: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [provider, networkSupported, createEncryptedInput, refreshState]);

  useEffect(() => {
    if (isReady) {
      refreshState();
    }
  }, [isReady, refreshState]);

  const contextValue: FHEVMContextType = {
    isReady,
    isLoading,
    networkSupported,
    encryptedCount,
    inputValue,
    setInputValue,
    performEncryptAdd,
    performEncryptSub,
    refreshState,
    // 新增的 SDK 相关值
    fhevmInstance,
    fhevmStatus,
    fhevmError,
    sdkDiagnostics,
    forceReloadSDK,
  };

  return (
    <FHEVMContext.Provider value={contextValue}>
      {children}
    </FHEVMContext.Provider>
  );
};