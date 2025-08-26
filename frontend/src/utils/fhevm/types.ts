import { Eip1193Provider } from "ethers";

// FHEVM Instance Types
export interface FhevmInstance {
  encrypt8(value: number): string;
  encrypt16(value: number): string; 
  encrypt32(value: number): string;
  encrypt64(value: bigint): string;
  encryptBool(value: boolean): string;
  createEncryptedInput(contractAddress: string, userAddress: string): FhevmEncryptedInput;
  getPublicKey(): string;
  getPublicParams(keyId?: number): string;
  decrypt(ciphertext: string, type: string): Promise<number | boolean>;
}

export interface FhevmEncryptedInput {
  add8(value: number): FhevmEncryptedInput;
  add16(value: number): FhevmEncryptedInput;
  add32(value: number): FhevmEncryptedInput;
  add64(value: bigint): FhevmEncryptedInput;
  addBool(value: boolean): FhevmEncryptedInput;
  encrypt(): Promise<{
    handles: string[];
    inputProof: string;
  }>;
}

export interface FhevmInstanceConfig {
  network: string | Eip1193Provider;
  publicKey: string;
  publicParams: string;
  aclContractAddress: string;
  kmsVerifierAddress: string;
}

// Relayer SDK Types  
export interface FhevmRelayerSDKType {
  initSDK(options?: FhevmInitSDKOptions): Promise<boolean>;
  createInstance(config: FhevmInstanceConfig): Promise<FhevmInstance>;
  SepoliaConfig: {
    aclContractAddress: string;
    kmsVerifierAddress: string;
  };
  __initialized__?: boolean;
}

export interface FhevmWindowType extends Window {
  relayerSDK: FhevmRelayerSDKType;
}

export interface FhevmInitSDKOptions {
  debug?: boolean;
  timeout?: number;
}

// Hook Types
export type FhevmGoState = "idle" | "loading" | "ready" | "error";

export interface UseFhevmParams {
  provider: string | Eip1193Provider | undefined;
  chainId: number | undefined;
  enabled?: boolean;
  initialMockChains?: Readonly<Record<number, string>>;
}

export interface UseFhevmReturn {
  instance: FhevmInstance | undefined;
  refresh: () => void;
  error: Error | undefined;
  status: FhevmGoState;
}

// Utility Types
export interface PublicKeyCache {
  publicKey: string;
  publicParams: string;
  timestamp: number;
  aclAddress: string;
}

export interface EncryptedInputResult {
  handle: string;
  proof: string;
}

export type FhevmLoadSDKType = () => Promise<void>;
export type FhevmInitSDKType = (options?: FhevmInitSDKOptions) => Promise<boolean>;

// Error Types
export class FhevmError extends Error {
  code: string;
  constructor(code: string, message?: string, options?: { cause?: unknown }) {
    super(message);
    this.code = code;
    this.name = "FhevmError";
    if (options?.cause) {
      (this as any).cause = options.cause;
    }
  }
}