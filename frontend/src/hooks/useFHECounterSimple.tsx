import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { useFHEVMContext } from '../providers/FHEVMProvider';
import { useWalletContext } from '../providers/WalletProvider';

// 合约信息 (将来应该从部署文件中获取)
const FHE_COUNTER_ABI = [
  "function increment(bytes32 inputEuint32, bytes calldata inputProof) external",
  "function decrement(bytes32 inputEuint32, bytes calldata inputProof) external", 
  "function getCount() external view returns (uint256)"
];

const FHE_COUNTER_ADDRESSES: { [chainId: number]: string } = {
  8009: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1", // Zama Devnet - 示例地址
  1337: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1", // Local - 示例地址
  11155111: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1" // Sepolia - 示例地址
};

interface UseFHECounterParams {
  chainId?: number | null;
}

export const useFHECounterSimple = ({ chainId }: UseFHECounterParams) => {
  const { fhevmInstance } = useFHEVMContext();
  const { provider } = useWalletContext();
  
  // 状态管理
  const [countHandle, setCountHandle] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isIncOrDec, setIsIncOrDec] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready");

  // 获取合约信息
  const contractInfo = useMemo(() => {
    if (!chainId || chainId === null) return { abi: FHE_COUNTER_ABI };
    
    const address = FHE_COUNTER_ADDRESSES[chainId];
    return {
      abi: FHE_COUNTER_ABI,
      address,
      chainId
    };
  }, [chainId]);

  const isDeployed = useMemo(() => {
    return Boolean(contractInfo.address) && contractInfo.address !== ethers.ZeroAddress;
  }, [contractInfo.address]);

  // 检查是否可以获取count
  const canGetCount = useMemo(() => {
    return contractInfo.address && provider && !isRefreshing;
  }, [contractInfo.address, provider, isRefreshing]);

  // 检查是否可以增减
  const canIncOrDec = useMemo(() => {
    return (
      contractInfo.address &&
      fhevmInstance &&
      provider &&
      !isRefreshing &&
      !isIncOrDec
    );
  }, [contractInfo.address, fhevmInstance, provider, isRefreshing, isIncOrDec]);

  // 刷新count handle
  const refreshCountHandle = useCallback(async () => {
    if (!canGetCount) return;

    setIsRefreshing(true);
    try {
      const contract = new ethers.Contract(contractInfo.address!, contractInfo.abi, provider);
      const value = await contract.getCount();
      setCountHandle(value.toString());
      setMessage("Count handle refreshed successfully");
    } catch (error: any) {
      setMessage(`Failed to get count: ${error.message}`);
      setCountHandle('');
    } finally {
      setIsRefreshing(false);
    }
  }, [canGetCount, contractInfo.address, contractInfo.abi, provider]);

  // 增减操作
  const incOrDec = useCallback(async (value: number) => {
    if (!canIncOrDec || value === 0) return;

    setIsIncOrDec(true);
    const op = value > 0 ? "increment" : "decrement";
    const valueAbs = Math.abs(value);
    setMessage(`Starting ${op} by ${valueAbs}...`);

    try {
      const signer = await provider!.getSigner();
      const signerAddress = await signer.getAddress();
      
      // 创建加密输入
      const input = fhevmInstance!.createEncryptedInput(contractInfo.address!, signerAddress);
      input.add32(valueAbs);
      const encryptedInput = await input.encrypt();

      // 调用合约
      const contract = new ethers.Contract(contractInfo.address!, contractInfo.abi, signer);
      const tx = op === "increment" 
        ? await contract.increment(encryptedInput.handles[0], encryptedInput.inputProof)
        : await contract.decrement(encryptedInput.handles[0], encryptedInput.inputProof);

      setMessage(`Transaction sent: ${tx.hash}`);
      
      const receipt = await tx.wait();
      setMessage(`${op} completed! Status: ${receipt?.status}`);
      
      // 刷新count handle
      await refreshCountHandle();
    } catch (error: any) {
      setMessage(`${op} failed: ${error.message}`);
    } finally {
      setIsIncOrDec(false);
    }
  }, [canIncOrDec, contractInfo.address, contractInfo.abi, fhevmInstance, provider, refreshCountHandle]);

  // 自动刷新count handle
  useEffect(() => {
    refreshCountHandle();
  }, [refreshCountHandle]);

  return {
    contractAddress: contractInfo.address,
    canGetCount,
    canIncOrDec,
    incOrDec,
    refreshCountHandle,
    message,
    handle: countHandle,
    isRefreshing,
    isIncOrDec,
    isDeployed
  };
};