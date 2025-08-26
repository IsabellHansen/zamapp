// 钱包调试工具
export const debugWalletEnvironment = () => {
  console.log('=== 钱包环境调试信息 ===');
  console.log('window.ethereum:', window.ethereum);
  console.log('window.ethereum?.isMetaMask:', window.ethereum?.isMetaMask);
  console.log('window.ethereum?.providers:', window.ethereum?.providers);
  
  if (window.ethereum?.providers) {
    window.ethereum.providers.forEach((provider: any, index: number) => {
      console.log(`Provider ${index}:`, {
        isMetaMask: provider.isMetaMask,
        isOKExWallet: provider.isOKExWallet,
        isOkxWallet: provider.isOkxWallet,
        isCoinbaseWallet: provider.isCoinbaseWallet,
        constructor: provider.constructor.name
      });
    });
  }
  
  // 检查其他钱包
  console.log('window.okxwallet:', (window as any).okxwallet);
  console.log('navigator.userAgent:', navigator.userAgent);
  console.log('========================');
};

export const forceMetaMaskDetection = () => {
  // 强制检测 MetaMask
  return new Promise((resolve) => {
    if (window.ethereum?.isMetaMask) {
      resolve(window.ethereum);
      return;
    }
    
    // 等待 MetaMask 初始化
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkForMetaMask = () => {
      attempts++;
      
      if (window.ethereum?.isMetaMask) {
        resolve(window.ethereum);
        return;
      }
      
      if (window.ethereum?.providers) {
        const metaMask = window.ethereum.providers.find((p: any) => p.isMetaMask);
        if (metaMask) {
          resolve(metaMask);
          return;
        }
      }
      
      if (attempts < maxAttempts) {
        setTimeout(checkForMetaMask, 100);
      } else {
        resolve(null);
      }
    };
    
    checkForMetaMask();
  });
};