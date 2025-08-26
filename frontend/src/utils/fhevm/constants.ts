export const SDK_CDN_URL = "https://cdn.zama.ai/relayer-sdk-js/0.1.2/relayer-sdk-js.umd.cjs";

export const FHEVM_CONFIG = {
  // Sepolia Network Configuration
  SEPOLIA: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrls: ["https://sepolia.infura.io/v3/", "https://eth-sepolia.g.alchemy.com/v2/"],
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
  },
  
  // Local Development
  LOCAL: {
    chainId: 31337,
    name: "Hardhat Local",
    rpcUrls: ["http://127.0.0.1:8545", "http://localhost:8545"],
    mockChains: {
      31337: "http://localhost:8545"
    }
  }
};

export const STORAGE_KEYS = {
  PUBLIC_KEY: 'fhevm_public_key',
  PUBLIC_PARAMS: 'fhevm_public_params',
  SDK_INITIALIZED: 'fhevm_sdk_initialized'
} as const;