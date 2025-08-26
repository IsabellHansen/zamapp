import React from 'react';
import { useWalletContext } from '../providers/WalletProvider';
import { useFHEVMContext } from '../providers/FHEVMProvider';
import FHECounterCard from '../components/fhevm/FHECounterCard';
import { FHEVMStatusCard } from '../components/fhevm/FHEVMStatusCard';
import WalletConnectionCard from '../components/wallet/WalletConnectionCard';
import NetworkWarningCard from '../components/network/NetworkWarningCard';
import './DashboardContainer.css';

const DashboardContainer: React.FC = () => {
  const { isConnected } = useWalletContext();
  const { networkSupported } = useFHEVMContext();

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <WalletConnectionCard />
        </div>
      </div>
    );
  }

  if (!networkSupported) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <NetworkWarningCard />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">🔒 FHE Privacy Counter</h2>
        <p className="dashboard-subtitle">
          Secure encrypted counter with full homomorphic encryption
        </p>
      </div>
      
      {/* FHEVM SDK 状态卡片 */}
      <FHEVMStatusCard />
      
      <div className="dashboard-grid dashboard-grid-single">
        <div className="fhe-counter-wrapper">
          <FHECounterCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;