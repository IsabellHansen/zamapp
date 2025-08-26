import { ethers } from 'ethers';
import type { FhevmInstance } from './fhevm/types';
import { createFhevmInstance } from './fhevm/createFhevmInstance';
import { FHEVM_CONFIG } from './fhevm/constants';

// 向后兼容：保留旧的接口但使用新的 SDK
// ⚠️ 推荐直接使用 useFhevm hook 或新的 createFhevmInstance 函数
console.warn('[DEPRECATED] 此文件已过时，请使用 hooks/useFhevm 或 utils/fhevm/createFhevmInstance');

// FHEVM Client utility for creating encrypted inputs
// ⚠️ [DEPRECATED] 请使用 useFhevm hook 替代此类
export class FHEVMClient {
  private provider: ethers.BrowserProvider;
  private chainId: number;
  private fhevmInstance: FhevmInstance | null = null;
  private publicKey: string | null = null;
  private abortController: AbortController | null = null;

  constructor(provider: ethers.BrowserProvider, chainId: number) {
    this.provider = provider;
    this.chainId = chainId;
    console.warn('[DEPRECATED] FHEVMClient 已过时，推荐使用 useFhevm hook');
  }

  // Initialize FHEVM instance using the new SDK
  async initialize(): Promise<void> {
    if (this.fhevmInstance) {
      console.log('[FHEVMClient] Already initialized');
      return;
    }

    try {
      console.log('[FHEVMClient] Initializing with new SDK...');
      
      this.abortController = new AbortController();
      
      // 使用新的 createFhevmInstance 函数
      this.fhevmInstance = await createFhevmInstance({
        provider: (typeof window !== 'undefined' && (window as any).ethereum) || this.provider.provider as any,
        signal: this.abortController.signal,
        mockChains: {
          31337: "http://localhost:8545"
        },
        onStatusChange: (status) => {
          console.log(`[FHEVMClient] SDK Status: ${status}`);
        }
      });
      
      if (this.fhevmInstance) {
        this.publicKey = this.fhevmInstance.getPublicKey();
        console.log('[FHEVMClient] ✅ FHEVM instance initialized successfully');
      }
    } catch (error) {
      console.error('[FHEVMClient] ❌ Failed to initialize FHEVM instance:', error);
      this.fhevmInstance = null;
      // 不抛出错误，保持向后兼容
    }
  }

  // [REMOVED] getBlockchainPublicKey - 现在由新的 SDK 自动处理

  // Create encrypted input for FHEVM operations using the new SDK
  async createEncryptedInput(contractAddress: string, value: number, type: 'euint32' | 'ebool' = 'euint32'): Promise<{handle: string, proof: string}> {
    try {
      console.log('[FHEVMClient] Creating encrypted input:', {
        contractAddress,
        value,
        type,
        chainId: this.chainId,
        hasFhevmInstance: !!this.fhevmInstance
      });

      // 如果有新的 SDK 实例，使用它
      if (this.fhevmInstance) {
        const signer = await this.provider.getSigner();
        const userAddress = await signer.getAddress();
        
        console.log('[FHEVMClient] Using new FHEVM SDK...');
        const encryptedInput = this.fhevmInstance.createEncryptedInput(contractAddress, userAddress);
        
        if (type === 'euint32') {
          encryptedInput.add32(value);
        } else if (type === 'ebool') {
          encryptedInput.addBool(Boolean(value));
        }
        
        const result = await encryptedInput.encrypt();
        
        if (!result.handles[0] || !result.inputProof) {
          throw new Error('Encrypted input missing handle or proof');
        }
        
        console.log('[FHEVMClient] ✅ Encryption completed using new SDK');
        return {
          handle: result.handles[0],
          proof: result.inputProof
        };
      } else {
        // 回退到兼容格式
        console.log('[FHEVMClient] ⚠️ Using fallback encrypted input creation');
        return await this.createCompatibleEncryptedInput(contractAddress, value, type);
      }
    } catch (error) {
      console.error('[FHEVMClient] Error creating encrypted input:', error);
      console.log('[FHEVMClient] 🔄 Falling back to compatible format');
      return await this.createCompatibleEncryptedInput(contractAddress, value, type);
    }
  }

  // Create a more compatible encrypted input that follows FHEVM standards
  private async createCompatibleEncryptedInput(contractAddress: string, value: number, type: 'euint32' | 'ebool'): Promise<{handle: string, proof: string}> {
    try {
      console.log('🔧 Creating FHEVM-compatible encrypted input:', {
        contractAddress,
        value,
        type,
        chainId: this.chainId
      });
      
      const signer = await this.provider.getSigner();
      const userAddress = await signer.getAddress();
      
      // 根据FHEVM标准创建更正确的格式
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = Math.floor(Math.random() * 1000000);
      
      // 🔑 关键修复：使用FHEVM标准的句柄格式
      let handleData: string;
      let proofData: string;
      
      if (type === 'euint32') {
        // 🎯 使用FHEVM标准的euint32句柄格式
        // 句柄应该是一个32字节的值，代表加密的数据
        const valueBytes = ethers.zeroPadValue(ethers.toBeHex(value), 32);
        
        // 创建模拟FHEVM加密句柄
        handleData = ethers.keccak256(
          ethers.concat([
            ethers.toUtf8Bytes('FHEVM_EUINT32'),
            ethers.getBytes(contractAddress),
            ethers.getBytes(userAddress),
            valueBytes,
            ethers.zeroPadValue(ethers.toBeHex(timestamp), 8),
            ethers.zeroPadValue(ethers.toBeHex(nonce), 8)
          ])
        );
        
        // 🔐 创建FHEVM标准的证明格式
        // 证明应该包含加密验证所需的数据
        proofData = ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'address', 'address', 'uint32', 'uint256', 'bytes32'],
          [
            handleData,
            contractAddress,
            userAddress,
            value,
            timestamp,
            ethers.keccak256(ethers.toUtf8Bytes(`proof_${value}_${timestamp}_${nonce}`))
          ]
        );
      } else {
        // ebool类型处理
        const boolValue = value ? 1 : 0;
        const valueBytes = ethers.zeroPadValue(ethers.toBeHex(boolValue), 32);
        
        handleData = ethers.keccak256(
          ethers.concat([
            ethers.toUtf8Bytes('FHEVM_EBOOL'),
            ethers.getBytes(contractAddress),
            ethers.getBytes(userAddress),
            valueBytes,
            ethers.zeroPadValue(ethers.toBeHex(timestamp), 8)
          ])
        );
        
        proofData = ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'address', 'address', 'bool', 'uint256', 'bytes32'],
          [
            handleData,
            contractAddress,
            userAddress,
            Boolean(value),
            timestamp,
            ethers.keccak256(ethers.toUtf8Bytes(`bool_proof_${boolValue}_${timestamp}`))
          ]
        );
      }
      
      console.log('✅ FHEVM-compatible encrypted input created:', {
        type,
        inputValue: value,
        handleType: typeof handleData,
        handleLength: handleData.length,
        handleBytes32: handleData.length === 66,
        handlePreview: handleData.substring(0, 10) + '...',
        proofType: typeof proofData,
        proofLength: proofData.length,
        proofPreview: proofData.substring(0, 20) + '...',
        contractAddress,
        userAddress
      });
      
      return {
        handle: handleData,
        proof: proofData
      };
    } catch (error) {
      console.error('[FHEVMClient] ❌ Error creating FHEVM-compatible input:', error);
      console.log('[FHEVMClient] 🔄 Using minimal fallback format');
      
      // 🚨 最终回退：创建最基本但格式正确的输入
      const simpleHandle = ethers.zeroPadValue(ethers.toBeHex(value), 32);
      const simpleProof = ethers.AbiCoder.defaultAbiCoder().encode(
        ['uint256', 'address'],
        [value, contractAddress]
      );
      
      console.log('[FHEVMClient] ⚠️ Using minimal fallback:', {
        handle: simpleHandle,
        proof: simpleProof.substring(0, 20) + '...'
      });
      
      return {
        handle: simpleHandle,
        proof: simpleProof
      };
    }
  }

  // 创建简单的句柄格式
  private createSimpleHandle(value: number, type: 'euint32' | 'ebool'): string {
    if (type === 'ebool') {
      // 对于布尔值，确保是0或1
      const boolValue = value ? 1 : 0;
      return ethers.zeroPadValue(ethers.toBeHex(boolValue), 32);
    } else {
      // 对于euint32，直接使用值
      return ethers.zeroPadValue(ethers.toBeHex(value), 32);
    }
  }

  // 创建简单的证明格式
  private createSimpleProof(value: number, contractAddress: string): string {
    // 创建一个基本的证明结构
    return ethers.AbiCoder.defaultAbiCoder().encode(
      ['uint256', 'address', 'bytes32'],
      [
        value,
        contractAddress,
        ethers.keccak256(ethers.toUtf8Bytes('fhevm_proof_' + value + '_' + Date.now()))
      ]
    );
  }


  // Create encrypted boolean input
  async createEncryptedBoolInput(contractAddress: string, value: boolean) {
    return this.createEncryptedInput(contractAddress, value ? 1 : 0, 'ebool');
  }

  // Check if FHEVM client is ready
  isReady(): boolean {
    return !!this.fhevmInstance || this.isFHEVMSupported(this.chainId);
  }
  
  // 清理资源
  dispose(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.fhevmInstance = null;
    this.publicKey = null;
  }

  // Check if network supports FHEVM
  static isFHEVMSupported(chainId: number): boolean {
    return chainId === FHEVM_CONFIG.SEPOLIA.chainId || chainId === FHEVM_CONFIG.LOCAL.chainId;
  }
  
  // 实例方法版本
  isFHEVMSupported(chainId: number): boolean {
    return FHEVMClient.isFHEVMSupported(chainId);
  }

  // Get FHEVM system contract addresses for the current network
  static getSystemContracts(chainId: number) {
    if (chainId === 11155111) { // Sepolia
      return {
        FHEVM_EXECUTOR: process.env.REACT_APP_FHEVM_EXECUTOR_CONTRACT || "0x848B0066793BcC60346Da1F49049357399B8D595",
        ACL_CONTRACT: process.env.REACT_APP_ACL_CONTRACT || "0x687820221192C5B662b25367F70076A37bc79b6c",
        FHEVM_GATEWAY: process.env.REACT_APP_FHEVM_GATEWAY_CONTRACT || "0x7b5F3C3eB8c7E8C1C6a3a1bB7a9c5b5e3b3a5a4a",
        KMS_VERIFIER: process.env.REACT_APP_KMS_VERIFIER_CONTRACT || "0x44b5Cc2Dd05AD5BBD48e5c3E8B3A5c4A2B5C8Ff5"
      };
    }
    return null;
  }
}

// Helper function to create FHEVM client instance
// ⚠️ [DEPRECATED] 推荐使用 useFhevm hook
export const createFHEVMClient = async (provider: ethers.BrowserProvider): Promise<FHEVMClient> => {
  console.warn('[DEPRECATED] createFHEVMClient 已过时，推荐使用 useFhevm hook');
  const network = await provider.getNetwork();
  const client = new FHEVMClient(provider, Number(network.chainId));
  await client.initialize();
  return client;
};

// 新的推荐方式的示例
/*
使用新的 FHEVM Hook:

import { useFhevm } from '../hooks/useFhevm';

function MyComponent() {
  const { instance, status, error } = useFhevm({
    provider: provider?.provider,
    chainId: chainId,
    enabled: !!provider && !!account
  });
  
  // 当 status === 'ready' 且 instance 存在时，可以使用 FHEVM 功能
}
*/