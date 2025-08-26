import React, { useState } from 'react';
import { useWalletContext } from '../../providers/WalletProvider';
import { useFHEVMContext } from '../../providers/FHEVMProvider';
import { useFHECounter } from '../../hooks/useFHECounter';
import './FHECounterCard.css';

const FHECounterCard: React.FC = () => {
  const { isConnected, chainId } = useWalletContext();
  const { isReady } = useFHEVMContext();
  const [inputValue, setInputValue] = useState<string>('');
  
  const fheCounter = useFHECounter({ chainId });

  const handleAddClick = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      return;
    }
    await fheCounter.incOrDec(value);
  };

  const handleSubClick = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value) || value <= 0) {
      return;
    }
    await fheCounter.incOrDec(-value);
  };

  if (!isConnected) {
    return (
      <div className="card fhe-counter-card">
        <div className="card-header">
          <h3 className="card-title">🔒 FHE Counter</h3>
          <p className="card-subtitle">Connect your wallet to use FHE counter</p>
        </div>
        <div className="fhe-info">
          Please connect your wallet to access the FHE counter functionality.
        </div>
      </div>
    );
  }

  if (fheCounter.isDeployed === false) {
    return (
      <div className="card fhe-counter-card">
        <div className="card-header">
          <h3 className="card-title">🔒 FHE Counter</h3>
          <p className="card-subtitle">Contract not deployed</p>
        </div>
        <div className="fhe-info">
          FHE Counter contract is not deployed on chain ID {chainId}.
        </div>
      </div>
    );
  }

  return (
    <div className="card fhe-counter-card">
      <div className="card-header">
        <h3 className="card-title">🔒 FHE Privacy Counter</h3>
        <p className="card-subtitle">
          Secure encrypted counter using Fully Homomorphic Encryption
        </p>
      </div>

      {/* Contract Info */}
      <div className="contract-info">
        <div className="info-item">
          <span className="info-label">Contract:</span>
          <span className="info-value">{fheCounter.contractAddress || 'Not deployed'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Chain ID:</span>
          <span className="info-value">{chainId}</span>
        </div>
      </div>

      {/* Counter Display */}
      <div className="encrypted-display">
        <div className="encrypted-label">Encrypted Count Handle</div>
        <div className="encrypted-value">
          {fheCounter.handle ? (
            <code className="encrypted-hash">{fheCounter.handle.slice(0, 20)}...</code>
          ) : (
            <span className="encrypted-placeholder">Not initialized</span>
          )}
        </div>
      </div>

      {/* Decrypted Count Display */}
      {fheCounter.decryptedCount !== undefined && (
        <div className="decrypted-display">
          <div className="decrypted-label">🔓 Decrypted Count</div>
          <div className="decrypted-value">
            <span className="count-number">{fheCounter.decryptedCount}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="operation-controls">
        <div className="input-group">
          <label className="input-label">Value to add/subtract:</label>
          <div className="input-with-refresh">
            <input
              type="number"
              className="input-field"
              placeholder="Enter value..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={fheCounter.isIncOrDec || !isReady}
              min="1"
            />
            <button
              className="btn btn-outline refresh-btn"
              onClick={fheCounter.refreshCountHandle}
              disabled={fheCounter.isRefreshing || !fheCounter.canGetCount}
              title="Refresh count handle"
            >
              {fheCounter.isRefreshing ? '⏳' : '🔄'}
            </button>
          </div>
        </div>

        <div className="operation-buttons">
          <button
            className="btn btn-primary operation-btn"
            onClick={handleAddClick}
            disabled={!fheCounter.canIncOrDec || !inputValue || isNaN(parseInt(inputValue)) || parseInt(inputValue) <= 0}
          >
            {fheCounter.isIncOrDec ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              '➕ Increment'
            )}
          </button>

          <button
            className="btn btn-danger operation-btn"
            onClick={handleSubClick}
            disabled={!fheCounter.canIncOrDec || !inputValue || isNaN(parseInt(inputValue)) || parseInt(inputValue) <= 0}
          >
            {fheCounter.isIncOrDec ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : (
              '➖ Decrement'
            )}
          </button>
        </div>

        <div className="decrypt-controls">
          <button
            className="btn btn-secondary decrypt-btn"
            disabled={true}
          >
            🔓 Decrypt Count (Coming Soon)
          </button>
        </div>
      </div>

      {/* Status Message */}
      {fheCounter.message && (
        <div className="status-message">
          <strong>Status:</strong> {fheCounter.message}
        </div>
      )}

      <div className="fhe-info">
        <div className="status-indicator status-info">
          <strong>🔗 FHE Status:</strong> {isReady ? 'Ready' : 'Initializing...'}
        </div>
        <div className="fhe-description">
          🔒 All operations are performed on encrypted data using Fully Homomorphic Encryption. 
          Values remain encrypted throughout the computation process.
        </div>
      </div>
    </div>
  );
};

export default FHECounterCard;