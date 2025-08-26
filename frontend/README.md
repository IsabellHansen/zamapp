# FHEVM Counter DApp Frontend

A modern React frontend for interacting with both standard and FHE (Fully Homomorphic Encryption) counter contracts.

## Features

🔐 **Dual Counter Interface**
- Standard Counter: Traditional transparent operations
- FHE Counter: Fully homomorphic encrypted operations

🦊 **Web3 Integration**
- MetaMask wallet connection
- Multi-network support (Hardhat local, Sepolia testnet)
- Real-time transaction feedback

🎨 **Modern UI/UX**
- Responsive design
- Beautiful gradient styling
- Toast notifications
- Loading states and error handling

## Prerequisites

- Node.js (v18.x or v20.x)
- MetaMask browser extension
- Running Hardhat local network (for development)

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Configuration

### 1. Contract Addresses
Update contract addresses in `src/utils/contracts.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  Counter: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // From deployment
  FHECounter: "YOUR_FHE_COUNTER_ADDRESS_HERE" // Deploy to Sepolia
};
```

### 2. Network Configuration
The app supports:
- **Hardhat Local** (ChainID: 31337) - For standard counter testing
- **Sepolia Testnet** (ChainID: 11155111) - For FHE counter operations

## Usage

### Development Mode
```bash
npm start
```
Opens [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```

## How to Use the DApp

### 1. Connect Wallet
- Click "Connect MetaMask Wallet"
- Approve the connection in MetaMask

### 2. Standard Counter
- Enter a number in the input field
- Click "Increment" or "Decrement"
- View real-time count updates

### 3. FHE Counter
- Switch to Sepolia testnet in MetaMask
- Enter a number to encrypt
- Click "Encrypt & Add" or "Encrypt & Sub"
- Operations are performed on encrypted data

## Network Setup

### Local Development (Hardhat)
1. Start the backend:
```bash
cd .. # Go back to project root
npx hardhat node
```

2. Add Hardhat network to MetaMask:
- Network Name: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

### Sepolia Testnet (for FHE)
1. Add Sepolia to MetaMask (usually pre-configured)
2. Get Sepolia ETH from faucets
3. Deploy FHE contracts to Sepolia
4. Update contract address in configuration

## Features Breakdown

### Standard Counter Interface
- ✅ Real-time count display
- ✅ Increment/Decrement operations
- ✅ Input validation
- ✅ Transaction status tracking
- ✅ Error handling

### FHE Counter Interface
- ✅ Encrypted state display
- ✅ Network compatibility checking
- ✅ Encrypted input handling (demo)
- ⚠️ **Note**: Uses simplified encryption for demo purposes
- 🔄 Ready for full FHEVM client integration

### Wallet Integration
- ✅ MetaMask connection
- ✅ Account switching detection
- ✅ Network switching detection
- ✅ Connection status indicator

## Technical Stack

- **React 18** with TypeScript
- **Ethers.js v6** for blockchain interaction
- **Styled Components** for styling
- **React Toastify** for notifications
- **FHEVM Solidity** library integration

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnect.tsx      # Wallet connection UI
│   │   ├── CounterInterface.tsx   # Standard counter UI
│   │   └── FHECounterInterface.tsx # FHE counter UI
│   ├── hooks/
│   │   └── useWallet.ts           # Wallet connection logic
│   ├── utils/
│   │   └── contracts.ts           # Contract ABIs and addresses
│   ├── App.tsx                    # Main application
│   └── index.tsx                  # Entry point
├── public/
│   └── index.html
└── package.json
```

## Troubleshooting

### Common Issues

1. **"Please install MetaMask" error**
   - Install MetaMask browser extension
   - Refresh the page

2. **Network not supported**
   - Switch to Hardhat Local (31337) for standard counter
   - Switch to Sepolia (11155111) for FHE counter

3. **Transaction failures**
   - Check you have sufficient ETH for gas
   - Verify contract is deployed on current network
   - Check console for detailed error messages

4. **FHE Counter not working**
   - FHE operations require Sepolia testnet
   - Ensure FHE contract is deployed
   - Current demo uses simplified encryption

### Development Tips

1. **Testing with Local Hardhat**
   - Use account #0 from Hardhat accounts
   - Standard counter works immediately
   - FHE counter will show network warning

2. **Testing with Sepolia**
   - Get Sepolia ETH from faucets
   - Deploy FHE contract first
   - Update contract address in config

## Future Enhancements

- 🔄 Full FHEVM client library integration
- 🔄 Real encrypted input generation
- 🔄 Decryption result display
- 🔄 Multiple FHE data types support
- 🔄 Transaction history
- 🔄 Mobile responsiveness improvements

## License

MIT License

---

**Ready to explore the future of private smart contracts!** 🚀