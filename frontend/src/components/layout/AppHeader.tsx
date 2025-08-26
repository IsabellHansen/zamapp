import React from 'react';
import { useWalletContext } from '../../providers/WalletProvider';
import { useFHEVMContext } from '../../providers/FHEVMProvider';
import './AppHeader.css';

const AppHeader: React.FC = () => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet, chainId } = useWalletContext();
  const { networkSupported } = useFHEVMContext();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 11155111:
        return 'Sepolia';
      case 31337:
        return 'Hardhat';
      case 1:
        return 'Mainnet';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">🔐 FHE Privacy Counter</h1>
          <div className="app-subtitle">Fully Homomorphic Encryption • Zama FHEVM</div>
        </div>
        
        <div className="header-right">
          <div className="network-info">
            {chainId && (
              <div className={`network-badge ${networkSupported ? 'supported' : 'unsupported'}`}>
                <span className="network-dot"></span>
                {getNetworkName(chainId)}
              </div>
            )}
          </div>
          
          <div className="wallet-section">
            {isConnected ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <div className="wallet-address">{formatAddress(account!)}</div>
                  <div className="wallet-status">Connected</div>
                </div>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;