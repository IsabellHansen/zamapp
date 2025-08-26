import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { debugWalletEnvironment, forceMetaMaskDetection } from '../utils/walletDebug';

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const getMetaMaskProvider = () => {
    // 直接检查 window.ethereum 是否可用
    if (typeof window.ethereum !== 'undefined') {
      // 如果有多个提供者数组
      if (window.ethereum.providers && Array.isArray(window.ethereum.providers)) {
        // 优先查找 MetaMask
        const metaMask = window.ethereum.providers.find((provider: any) => provider.isMetaMask);
        if (metaMask) return metaMask;
        
        // 如果没有MetaMask，返回第一个可用的
        return window.ethereum.providers[0];
      }
      
      // 单一提供者情况
      return window.ethereum;
    }
    
    return null;
  };

  const detectWalletType = (provider: any) => {
    if (provider?.isMetaMask) return 'MetaMask';
    if (provider?.isOKExWallet || provider?.isOkxWallet) return 'OKX Wallet';
    if (provider?.isCoinbaseWallet) return 'Coinbase Wallet';
    if (provider?.isTrustWallet) return 'Trust Wallet';
    return 'Web3 Wallet';
  };

  const connectWallet = useCallback(async () => {
    try {
      // 调试信息
      debugWalletEnvironment();
      
      // 尝试强制检测 MetaMask
      let provider: any = await forceMetaMaskDetection();
      
      if (!provider) {
        provider = getMetaMaskProvider();
      }
      
      if (!provider || !provider.request) {
        toast.error('请安装 MetaMask 或其他 Web3 钱包!');
        console.log('未找到可用的钱包提供者');
        // 尝试打开 MetaMask 下载页面
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      const walletType = detectWalletType(provider);
      console.log('Connecting to wallet:', walletType, provider);
      
      // 尝试连接钱包
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const browserProvider = new ethers.BrowserProvider(provider);
        setProvider(browserProvider);
        setAccount(accounts[0]);
        setIsConnected(true);
        toast.success(`${walletType} 连接成功!`);
      } else {
        toast.error('未获取到账户信息');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      
      // 更详细的错误处理
      if (error.code === 4001) {
        toast.error('用户拒绝了连接请求');
      } else if (error.code === -32002) {
        toast.error('请在钱包中确认连接请求');
      } else {
        toast.error('连接钱包失败: ' + (error.message || '未知错误'));
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    toast.info('Wallet disconnected');
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const provider = getMetaMaskProvider();
        
        if (provider) {
          const accounts = await provider.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            const browserProvider = new ethers.BrowserProvider(provider);
            setProvider(browserProvider);
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    const provider = getMetaMaskProvider();
    if (provider) {
      provider.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });

      provider.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (provider) {
        provider.removeAllListeners?.('accountsChanged');
        provider.removeAllListeners?.('chainChanged');
      }
    };
  }, [disconnect]);

  return {
    account,
    provider,
    connectWallet,
    disconnect,
    isConnected,
  };
};