import React from 'react';
import { useFHEVMContext } from '../../providers/FHEVMProvider';
import { getChainName } from '../../hooks/useFhevm';
import './FHEVMStatusCard.css';

export const FHEVMStatusCard: React.FC = () => {
  const { 
    fhevmStatus, 
    fhevmError, 
    fhevmInstance, 
    networkSupported, 
    isReady,
    sdkDiagnostics 
  } = useFHEVMContext();

  const getStatusBadge = () => {
    switch (fhevmStatus) {
      case 'idle':
        return <span className="status-badge status-idle">Idle</span>;
      case 'loading':
        return <span className="status-badge status-loading">Loading</span>;
      case 'ready':
        return <span className="status-badge status-ready">Ready</span>;
      case 'error':
        return <span className="status-badge status-error">Error</span>;
      default:
        return <span className="status-badge status-unknown">Unknown</span>;
    }
  };

  const getInstanceMethods = () => {
    if (!fhevmInstance) return [];
    
    try {
      return Object.getOwnPropertyNames(fhevmInstance)
        .filter(prop => typeof (fhevmInstance as any)[prop] === 'function')
        .slice(0, 5); // 只显示前5个方法
    } catch {
      return [];
    }
  };

  const chainId = window?.ethereum?.chainId ? parseInt(window.ethereum.chainId, 16) : undefined;

  return (
    <div className="fhevm-status-card">
      <div className="card-header">
        <h3>🔐 FHEVM SDK Status</h3>
        {getStatusBadge()}
      </div>

      <div className="status-grid">
        <div className="status-item">
          <label>Contract Address:</label>
          <span 
            className="status-value contract-address"
            onClick={() => window.open('https://sepolia.etherscan.io/address/0x4D55AAD4bf74E3167D75ACB21aD9343c46779393', '_blank')}
            title="View on Sepolia Etherscan"
          >
            0x4D55AAD4bf74E3167D75ACB21aD9343c46779393
          </span>
        </div>

        <div className="status-item">
          <label>Network Support:</label>
          <span className={`status-value ${networkSupported ? 'supported' : 'unsupported'}`}>
            {networkSupported ? '✅ Supported' : '❌ Unsupported'}
          </span>
        </div>

        <div className="status-item">
          <label>Current Network:</label>
          <span className="status-value">
            {getChainName(chainId)} ({chainId || 'N/A'})
          </span>
        </div>

        <div className="status-item">
          <label>SDK Status:</label>
          <span className="status-value">{fhevmStatus}</span>
        </div>

        <div className="status-item">
          <label>Instance Available:</label>
          <span className={`status-value ${fhevmInstance ? 'available' : 'unavailable'}`}>
            {fhevmInstance ? '✅ Available' : '❌ Unavailable'}
          </span>
        </div>

        <div className="status-item">
          <label>Overall Ready:</label>
          <span className={`status-value ${isReady ? 'ready' : 'not-ready'}`}>
            {isReady ? '✅ Ready' : '❌ Not Ready'}
          </span>
        </div>

        {fhevmError && (
          <div className="status-item error-item">
            <label>Error Message:</label>
            <span className="status-value error-message">
              {fhevmError.message}
            </span>
          </div>
        )}

        {fhevmInstance && (
          <div className="status-item methods-item">
            <label>Available Methods:</label>
            <div className="methods-list">
              {getInstanceMethods().map((method, index) => (
                <span key={index} className="method-badge">
                  {method}
                </span>
              ))}
              {getInstanceMethods().length >= 5 && (
                <span className="method-badge more">...</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <button 
          onClick={sdkDiagnostics}
          className="diagnostic-button"
          title="运行 SDK 诊断并在控制台输出详细信息"
        >
          🔍 运行诊断
        </button>
        
        {chainId && !networkSupported && (
          <div className="warning-message">
            ⚠️ 当前网络不支持 FHEVM。请切换到 Sepolia 测试网 (11155111) 或本地 Hardhat 网络 (31337)。
          </div>
        )}

        {fhevmStatus === 'error' && (
          <div className="error-message">
            ❌ FHEVM SDK 初始化失败。请检查网络连接或尝试刷新页面。
          </div>
        )}
      </div>
    </div>
  );
};