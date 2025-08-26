import React from 'react';
import { useWalletContext } from '../../providers/WalletProvider';
import './WalletConnectionCard.css';

const WalletConnectionCard: React.FC = () => {
  const { connectWallet, isConnecting } = useWalletContext();

  return (
    <div className="card wallet-connection-card">
      <div className="wallet-icon">
        🔗
      </div>
      
      <div className="card-header">
        <h3 className="card-title">Connect Your Wallet</h3>
        <p className="card-subtitle">
          Connect your MetaMask wallet to interact with FHEVM contracts
        </p>
      </div>

      <div className="connection-content">
        <div className="requirements-list">
          <div className="requirement-item">
            <span className="requirement-icon">✅</span>
            <span>MetaMask extension installed</span>
          </div>
          <div className="requirement-item">
            <span className="requirement-icon">🌐</span>
            <span>Sepolia testnet or Hardhat local network</span>
          </div>
          <div className="requirement-item">
            <span className="requirement-icon">⛽</span>
            <span>Sufficient ETH for gas fees</span>
          </div>
        </div>

        <button
          className="btn btn-primary connect-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="loading-spinner"></span>
              Connecting Wallet...
            </>
          ) : (
            <>
              🦊 Connect MetaMask
            </>
          )}
        </button>

        <div className="help-text">
          Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">Download here</a>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectionCard;