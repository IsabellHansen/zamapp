import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletProvider } from './providers/WalletProvider';
import { FHEVMProvider } from './providers/FHEVMProvider';
import MainLayout from './layouts/MainLayout';
import AppHeader from './components/layout/AppHeader';
import DashboardContainer from './containers/DashboardContainer';
import './styles/global.css';

/**
 * Enhanced FHEVM DApp - Rewritten Architecture
 * Features: Modern React patterns, Context API, Custom hooks
 */
const App: React.FC = () => {
  return (
    <div className="app-container">
      <WalletProvider>
        <FHEVMProvider>
          <MainLayout>
            <AppHeader />
            <main className="app-main">
              <DashboardContainer />
            </main>
          </MainLayout>
        </FHEVMProvider>
      </WalletProvider>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="custom-toast"
      />
    </div>
  );
};

export default App;