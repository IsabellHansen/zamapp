import { Eip1193Provider, JsonRpcProvider } from "ethers";
import type {
  FhevmInstance,
  FhevmInitSDKOptions,
  FhevmWindowType
} from "./types";
import { isValidFhevmWindow, isValidAddress } from "./validation";
import { RelayerSDKLoader } from "./relayerSDKLoader";
import { FHEVM_CONFIG } from "./constants";

// 错误类定义
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

export class FhevmAbortError extends Error {
  constructor(message = "FHEVM operation was cancelled") {
    super(message);
    this.name = "FhevmAbortError";
  }
}

function throwFhevmError(
  code: string,
  message?: string,
  cause?: unknown
): never {
  throw new FhevmError(code, message, cause ? { cause } : undefined);
}

// SDK 状态类型
type FhevmRelayerStatusType =
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating";

/**
 * 检查 FHEVM 是否已初始化
 */
const isFhevmInitialized = (): boolean => {
  if (!isValidFhevmWindow(window, console.log)) {
    return false;
  }
  return (window as FhevmWindowType).relayerSDK.__initialized__ === true;
};

/**
 * 加载 RelayerSDK
 */
const loadFhevmSDK = async (): Promise<void> => {
  const loader = new RelayerSDKLoader({ trace: console.log });
  return loader.load();
};

/**
 * 初始化 RelayerSDK
 */
const initFhevmSDK = async (options?: FhevmInitSDKOptions): Promise<boolean> => {
  if (!isValidFhevmWindow(window, console.log)) {
    throw new Error("window.relayerSDK is not available");
  }

  const relayerSDK = (window as FhevmWindowType).relayerSDK;
  const result = await relayerSDK.initSDK(options);
  relayerSDK.__initialized__ = result;
  
  if (!result) {
    throw new Error("window.relayerSDK.initSDK failed");
  }
  
  return true;
};

/**
 * 获取 Chain ID
 */
async function getChainId(providerOrUrl: Eip1193Provider | string): Promise<number> {
  console.log('[getChainId] Input type:', typeof providerOrUrl, providerOrUrl);
  
  if (typeof providerOrUrl === "string") {
    console.log('[getChainId] Using RPC URL:', providerOrUrl);
    const provider = new JsonRpcProvider(providerOrUrl);
    return Number((await provider.getNetwork()).chainId);
  }
  
  // 详细检查 EIP-1193 provider
  if (!providerOrUrl) {
    console.error('[getChainId] Provider is null or undefined');
    throw new Error('Provider is null or undefined');
  }
  
  if (typeof providerOrUrl !== 'object') {
    console.error('[getChainId] Provider is not an object:', typeof providerOrUrl);
    throw new Error('Provider must be an object with request method');
  }
  
  if (typeof providerOrUrl.request !== 'function') {
    console.error('[getChainId] Provider.request is not a function:', typeof providerOrUrl.request);
    console.error('[getChainId] Provider properties:', Object.keys(providerOrUrl));
    throw new Error('Invalid provider: must be EIP-1193 compatible provider with request method');
  }
  
  try {
    console.log('[getChainId] Calling provider.request for eth_chainId...');
    const chainId = await providerOrUrl.request({ method: "eth_chainId" });
    console.log('[getChainId] Received chainId:', chainId);
    return Number.parseInt(chainId as string, 16);
  } catch (error) {
    console.error('[getChainId] Failed to get chainId from provider:', error);
    throw new Error(`Failed to get chainId: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 获取 Web3 客户端版本
 */
async function getWeb3Client(rpcUrl: string): Promise<string> {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const version = await rpc.send("web3_clientVersion", []);
    return version;
  } catch (e) {
    throwFhevmError(
      "WEB3_CLIENTVERSION_ERROR",
      `The URL ${rpcUrl} is not a Web3 node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

/**
 * 尝试获取 FHEVM Hardhat 节点的中继器元数据
 */
async function tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl: string): Promise<
  | {
      ACLAddress: `0x${string}`;
      InputVerifierAddress: `0x${string}`;
      KMSVerifierAddress: `0x${string}`;
    }
  | undefined
> {
  const version = await getWeb3Client(rpcUrl);
  if (
    typeof version !== "string" ||
    !version.toLowerCase().includes("hardhat")
  ) {
    // 不是 Hardhat 节点
    return undefined;
  }
  
  try {
    const metadata = await getFHEVMRelayerMetadata(rpcUrl);
    if (!metadata || typeof metadata !== "object") {
      return undefined;
    }
    
    const requiredFields = [
      "ACLAddress",
      "InputVerifierAddress", 
      "KMSVerifierAddress"
    ];
    
    for (const field of requiredFields) {
      if (!(field in metadata) || 
          typeof (metadata as any)[field] !== "string" || 
          !(metadata as any)[field].startsWith("0x")) {
        return undefined;
      }
    }
    
    return metadata as any;
  } catch {
    // 不是 FHEVM Hardhat 节点
    return undefined;
  }
}

/**
 * 获取 FHEVM 中继器元数据
 */
async function getFHEVMRelayerMetadata(rpcUrl: string) {
  const rpc = new JsonRpcProvider(rpcUrl);
  try {
    const metadata = await rpc.send("fhevm_relayer_metadata", []);
    return metadata;
  } catch (e) {
    throwFhevmError(
      "FHEVM_RELAYER_METADATA_ERROR",
      `The URL ${rpcUrl} is not a FHEVM Hardhat node or is not reachable. Please check the endpoint.`,
      e
    );
  } finally {
    rpc.destroy();
  }
}

// 解析结果类型
type MockResolveResult = { isMock: true; chainId: number; rpcUrl: string };
type GenericResolveResult = { isMock: false; chainId: number; rpcUrl?: string };
type ResolveResult = MockResolveResult | GenericResolveResult;

/**
 * 解析网络配置
 */
async function resolve(
  providerOrUrl: Eip1193Provider | string,
  mockChains?: Record<number, string>
): Promise<ResolveResult> {
  // 解析 Chain ID
  const chainId = await getChainId(providerOrUrl);
  
  // 解析 RPC URL
  let rpcUrl = typeof providerOrUrl === "string" ? providerOrUrl : undefined;
  
  const _mockChains: Record<number, string> = {
    31337: "http://localhost:8545",
    ...(mockChains ?? {}),
  };
  
  // 检查是否为模拟链
  if (_mockChains.hasOwnProperty(chainId)) {
    if (!rpcUrl) {
      rpcUrl = _mockChains[chainId];
    }
    return { isMock: true, chainId, rpcUrl };
  }
  
  return { isMock: false, chainId, rpcUrl };
}

/**
 * 创建 FHEVM 实例的核心函数
 */
export const createFhevmInstance = async (parameters: {
  provider: Eip1193Provider | string;
  mockChains?: Record<number, string>;
  signal: AbortSignal;
  onStatusChange?: (status: FhevmRelayerStatusType) => void;
}): Promise<FhevmInstance> => {
  const {
    signal,
    onStatusChange,
    provider: providerOrUrl,
    mockChains,
  } = parameters;

  const throwIfAborted = () => {
    if (signal.aborted) throw new FhevmAbortError();
  };

  const notify = (status: FhevmRelayerStatusType) => {
    if (onStatusChange) onStatusChange(status);
  };

  console.log("[createFhevmInstance] Starting FHEVM instance creation...");

  // 解析网络配置
  const { isMock, rpcUrl, chainId } = await resolve(providerOrUrl, mockChains);
  console.log(`[createFhevmInstance] Resolved network: chainId=${chainId}, isMock=${isMock}`);

  throwIfAborted();

  // 如果是模拟网络，尝试 Hardhat 节点
  if (isMock && rpcUrl) {
    console.log(`[createFhevmInstance] Checking for FHEVM Hardhat node at: ${rpcUrl}`);
    
    try {
      const fhevmRelayerMetadata = await tryFetchFHEVMHardhatNodeRelayerMetadata(rpcUrl);
      
      if (fhevmRelayerMetadata) {
        console.log("[createFhevmInstance] Found FHEVM Hardhat node, using mock implementation");
        notify("creating");
        
        // 动态导入 Mock 实现避免打包到生产版本
        const fhevmMock = await import("./mock/fhevmMock");
        const mockInstance = await fhevmMock.createFhevmMockInstance({
          rpcUrl,
          chainId,
          metadata: fhevmRelayerMetadata,
        });
        
        throwIfAborted();
        return mockInstance;
      }
    } catch (error) {
      console.warn("[createFhevmInstance] Hardhat node check failed:", error);
    }
  }

  // 对于 Sepolia 或其他支持的网络，使用真实 SDK
  if (chainId === FHEVM_CONFIG.SEPOLIA.chainId) {
    console.log("[createFhevmInstance] Using real RelayerSDK for Sepolia...");
    
    throwIfAborted();

    // 确保 SDK 已加载
    if (!isValidFhevmWindow(window, console.log)) {
      notify("sdk-loading");
      await loadFhevmSDK();
      throwIfAborted();
      notify("sdk-loaded");
    }

    // 确保 SDK 已初始化
    if (!isFhevmInitialized()) {
      notify("sdk-initializing");
      await initFhevmSDK({ debug: process.env.NODE_ENV === 'development' });
      throwIfAborted();
      notify("sdk-initialized");
    }

    const relayerSDK = (window as unknown as FhevmWindowType).relayerSDK;
    
    // 验证 ACL 地址
    const aclAddress = relayerSDK.SepoliaConfig.aclContractAddress;
    if (!isValidAddress(aclAddress)) {
      throw new Error(`Invalid ACL address: ${aclAddress}`);
    }

    console.log(`[createFhevmInstance] Using ACL address: ${aclAddress}`);

    console.log("[createFhevmInstance] Creating instance without cached public key - SDK will generate new one");

    throwIfAborted();

    // 创建实例配置 - 不使用缓存的公钥，让SDK生成新的
    const config = {
      ...relayerSDK.SepoliaConfig,
      network: providerOrUrl,
      publicKey: '',  // Let SDK generate new key
      publicParams: '',  // Let SDK generate new params
    };

    notify("creating");
    console.log("[createFhevmInstance] Creating RelayerSDK instance...");

    // 创建 FHEVM 实例
    const instance = await relayerSDK.createInstance(config);

    // TODO: 保存实际的公钥和参数 (暂时跳过以避免类型问题)
    console.log("[createFhevmInstance] Skipping public key caching for now");

    throwIfAborted();

    console.log("[createFhevmInstance] ✅ FHEVM instance created successfully!");
    return instance;
  }

  // 不支持的网络
  throw new Error(`Unsupported network: chainId=${chainId}`);
};