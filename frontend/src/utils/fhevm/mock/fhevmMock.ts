import type { FhevmInstance, FhevmEncryptedInput } from '../types';

/**
 * Mock FHEVM 实例 - 用于本地开发和测试
 */
class MockFhevmInstance implements FhevmInstance {
  private chainId: number;
  private rpcUrl: string;
  private metadata: any;
  private publicKey: string;
  private publicParams: string;

  constructor(options: {
    chainId: number;
    rpcUrl: string;
    metadata: any;
  }) {
    this.chainId = options.chainId;
    this.rpcUrl = options.rpcUrl;
    this.metadata = options.metadata;
    
    // 生成模拟的公钥和参数
    this.publicKey = "0x" + "mock".repeat(16);
    this.publicParams = "0x" + "params".repeat(32);
    
    console.log("[MockFhevmInstance] Created mock instance", {
      chainId: this.chainId,
      rpcUrl: this.rpcUrl,
      aclAddress: this.metadata.ACLAddress
    });
  }

  encrypt8(value: number): string {
    console.log("[MockFhevmInstance] encrypt8:", value);
    return "0x" + value.toString(16).padStart(64, '0');
  }

  encrypt16(value: number): string {
    console.log("[MockFhevmInstance] encrypt16:", value);
    return "0x" + value.toString(16).padStart(64, '0');
  }

  encrypt32(value: number): string {
    console.log("[MockFhevmInstance] encrypt32:", value);
    return "0x" + value.toString(16).padStart(64, '0');
  }

  encrypt64(value: bigint): string {
    console.log("[MockFhevmInstance] encrypt64:", value);
    return "0x" + value.toString(16).padStart(64, '0');
  }

  encryptBool(value: boolean): string {
    console.log("[MockFhevmInstance] encryptBool:", value);
    return "0x" + (value ? "01" : "00").repeat(32);
  }

  createEncryptedInput(contractAddress: string, userAddress: string): FhevmEncryptedInput {
    console.log("[MockFhevmInstance] createEncryptedInput for:", { contractAddress, userAddress });
    return new MockFhevmEncryptedInput(contractAddress, userAddress);
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getPublicParams(keyId?: number): string {
    return this.publicParams;
  }

  async decrypt(ciphertext: string, type: string): Promise<number | boolean> {
    console.log("[MockFhevmInstance] decrypt:", { ciphertext: ciphertext.substring(0, 20) + '...', type });
    
    // 简单的模拟解密逻辑
    if (type === 'bool' || type === 'ebool') {
      return ciphertext.endsWith('01');
    }
    
    // 对于数字类型，从密文中提取模拟值
    const hex = ciphertext.replace('0x', '');
    const value = parseInt(hex.substring(0, 8), 16);
    return value;
  }
}

/**
 * Mock 加密输入实现
 */
class MockFhevmEncryptedInput implements FhevmEncryptedInput {
  private contractAddress: string;
  private userAddress: string;
  private inputs: Array<{ value: any; type: string }> = [];

  constructor(contractAddress: string, userAddress: string) {
    this.contractAddress = contractAddress;
    this.userAddress = userAddress;
  }

  add8(value: number): FhevmEncryptedInput {
    console.log("[MockFhevmEncryptedInput] add8:", value);
    this.inputs.push({ value, type: 'euint8' });
    return this;
  }

  add16(value: number): FhevmEncryptedInput {
    console.log("[MockFhevmEncryptedInput] add16:", value);
    this.inputs.push({ value, type: 'euint16' });
    return this;
  }

  add32(value: number): FhevmEncryptedInput {
    console.log("[MockFhevmEncryptedInput] add32:", value);
    this.inputs.push({ value, type: 'euint32' });
    return this;
  }

  add64(value: bigint): FhevmEncryptedInput {
    console.log("[MockFhevmEncryptedInput] add64:", value);
    this.inputs.push({ value, type: 'euint64' });
    return this;
  }

  addBool(value: boolean): FhevmEncryptedInput {
    console.log("[MockFhevmEncryptedInput] addBool:", value);
    this.inputs.push({ value, type: 'ebool' });
    return this;
  }

  async encrypt(): Promise<{ handles: string[]; inputProof: string; }> {
    console.log("[MockFhevmEncryptedInput] encrypt() called with inputs:", this.inputs);
    
    const handles: string[] = [];
    
    // 为每个输入生成模拟句柄
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      let handle: string;
      
      if (input.type === 'ebool') {
        handle = "0x" + (input.value ? "01" : "00").repeat(32);
      } else {
        const valueHex = typeof input.value === 'bigint' 
          ? input.value.toString(16)
          : input.value.toString(16);
        handle = "0x" + valueHex.padStart(64, '0');
      }
      
      handles.push(handle);
    }
    
    // 生成模拟证明
    const proofData = {
      contractAddress: this.contractAddress,
      userAddress: this.userAddress,
      inputs: this.inputs,
      timestamp: Date.now()
    };
    
    const inputProof = "0x" + Buffer.from(JSON.stringify(proofData)).toString('hex');
    
    console.log("[MockFhevmEncryptedInput] encrypt() result:", {
      handlesCount: handles.length,
      handles: handles.map(h => h.substring(0, 20) + '...'),
      proofLength: inputProof.length
    });
    
    return { handles, inputProof };
  }
}

/**
 * 创建模拟 FHEVM 实例
 */
export async function createFhevmMockInstance(options: {
  chainId: number;
  rpcUrl: string;
  metadata: {
    ACLAddress: string;
    InputVerifierAddress: string;
    KMSVerifierAddress: string;
  };
}): Promise<FhevmInstance> {
  console.log("[createFhevmMockInstance] Creating mock FHEVM instance...");
  
  // 模拟异步初始化延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const instance = new MockFhevmInstance(options);
  
  console.log("[createFhevmMockInstance] ✅ Mock instance created successfully");
  return instance;
}