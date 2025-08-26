import React from 'react';
import { useWalletContext } from '../../providers/WalletProvider';
import './NetworkWarningCard.css';

const NetworkWarningCard: React.FC = () => {
  const { chainId, switchNetwork } = useWalletContext();

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 31337:
        return 'Hardhat Local';
      default:
        return 'Unknown Network';
    }
  };

  const handleSwitchToSepolia = async () => {
    try {
      await switchNetwork(11155111);
    } catch (error) {
      console.error('Failed to switch to Sepolia:', error);
    }
  };

  return (
    <div className="card network-warning-card">
      <div className="warning-icon">
        ⚠️
      </div>
      
      <div className="card-header">
        <h3 className="card-title">Unsupported Network</h3>
        <p className="card-subtitle">
          FHEVM operations require a supported network
        </p>
      </div>

      <div className="network-info">
        <div className="current-network">
          <span className="network-label">Current Network:</span>
          <span className="network-value">{getNetworkName(chainId)}</span>
        </div>
        
        <div className="supported-networks">
          <div className="section-title">Supported Networks:</div>
          <div className="network-list">
            <div className="network-item supported">
              <span className="network-dot"></span>
              <span>Sepolia Testnet (Recommended)</span>
            </div>
            <div className="network-item supported">
              <span className="network-dot"></span>
              <span>Hardhat Local Network</span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary switch-button"
          onClick={handleSwitchToSepolia}
        >
          🔄 Switch to Sepolia Testnet
        </button>

        <div className="help-section">
          <div className="help-title">Need Sepolia ETH?</div>
          <div className="faucet-links">
            <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="faucet-link">
              Sepolia Faucet #1
            </a>
            <a href="https://faucet.sepolia.dev" target="_blank" rel="noopener noreferrer" className="faucet-link">
              Sepolia Faucet #2
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkWarningCard;