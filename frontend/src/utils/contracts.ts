import { ethers } from 'ethers';

// Contract ABIs
export const CounterABI = [
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "value",
        "type": "uint32"
      }
    ],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint32",
        "name": "value",
        "type": "uint32"
      }
    ],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const EncryptedVotingABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_topic",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_durationInHours",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "name": "DecryptionRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "yesVotes",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "noVotes",
        "type": "uint64"
      }
    ],
    "name": "ResultsDecrypted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      }
    ],
    "name": "VoteCasted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "VotingCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "yesVotes",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "noVotes",
        "type": "uint64"
      },
      {
        "internalType": "bytes[]",
        "name": "signatures",
        "type": "bytes[]"
      }
    ],
    "name": "callbackDecryptVotes",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyStop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getResults",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "yesVotes",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "noVotes",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTimeLeft",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVotingInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "enum EncryptedVoting.VotingStatus",
        "name": "currentStatus",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "userHasVoted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isVotingActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestVoteDecryption",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEbool",
        "name": "support",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const FHECounterABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "countValue",
        "type": "uint32"
      },
      {
        "internalType": "bytes[]",
        "name": "signatures",
        "type": "bytes[]"
      }
    ],
    "name": "callbackDecryptCount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint32",
        "name": "inputEuint32",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "decrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decryptedCount",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCounterStatus",
    "outputs": [
      {
        "internalType": "enum FHECounter.CounterStatus",
        "name": "currentStatus",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDecryptedCount",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHCUInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "sequentialLimit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "globalLimit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "addCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "subCost",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "externalEuint32",
        "name": "inputEuint32",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "increment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isCountDecrypted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestCountDecryption",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [
      {
        "internalType": "enum FHECounter.CounterStatus",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses (updated from Sepolia deployment)
export const CONTRACT_ADDRESSES = {
  Counter: "0xB7bbcD7C5F2110056F6D0Ff98C76a68b94f1C090", // Sepolia deployment
  FHECounter: "0x5b37c38859BB9B55E32Ae8425e0BDA022b9FB910", // Updated from bitter aware exercise youth reason arch seek ice loop vapor lady climb 
  EncryptedVoting: "0x48FBCF9e1d6F36D692D93cf8b760de3D99dF5CF0", // Sepolia deployment
  FHEVMFeatureDemo: "0xCDD1B253dA4aD4C6af9Ec98cFCd924F8A4c25073", // Sepolia deployment
  // Mock contracts as fallback (will be deployed later)
  MockFHECounter: "0x0000000000000000000000000000000000000000", // To be updated
  MockEncryptedVoting: "0x0000000000000000000000000000000000000000" // To be updated
};

// FHEVM System Contracts on Sepolia (Official Zama addresses)
export const FHEVM_ADDRESSES = {
  FHEVM_EXECUTOR: "0x848B0066793BcC60346Da1F49049357399B8D595",
  ACL_CONTRACT: "0x687820221192C5B662b25367F70076A37bc79b6c", 
  HCU_LIMIT_CONTRACT: "0x594BB474275918AF9609814E68C61B1587c5F838",
  KMS_VERIFIER: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
  INPUT_VERIFIER: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
  DECRYPTION_ORACLE: "0xa02Cda4Ca3a71D7C46997716F4283aa851C28812",
  DECRYPTION_ADDRESS: "0x5b37c38859BB9B55E32Ae8425e0BDA022b9FB910", // Updated from bitter aware exercise youth reason arch seek ice loop vapor lady climb
  INPUT_VERIFICATION_ADDRESS: "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
  RELAYER_URL: "https://relayer.testnet.zama.cloud"
};

// Network configuration
export const SUPPORTED_NETWORKS = {
  31337: {
    name: "Hardhat",
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 31337,
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18
    }
  },
  11155111: {
    name: "Sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    chainId: 11155111,
    nativeCurrency: {
      name: "SepoliaETH",
      symbol: "ETH",
      decimals: 18
    }
  }
};

export const getContract = async (
  address: string,
  abi: any[],
  provider: ethers.BrowserProvider
) => {
  const signer = await provider.getSigner();
  return new ethers.Contract(address, abi, signer);
};