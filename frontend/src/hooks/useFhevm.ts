import { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import type { 
  FhevmInstance, 
  FhevmGoState, 
  UseFhevmParams, 
  UseFhevmReturn 
} from "../utils/fhevm/types";
import { createFhevmInstance } from "../utils/fhevm/createFhevmInstance";

function _assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    const m = message ? `Assertion failed: ${message}` : `Assertion failed.`;
    console.error(m);
    throw new Error(m);
  }
}

/**
 * FHEVM Hook - 管理 FHEVM 实例的生命周期
 */
export function useFhevm(parameters: UseFhevmParams): UseFhevmReturn {
  const { provider, chainId, initialMockChains, enabled = true } = parameters;

  const [instance, _setInstance] = useState<FhevmInstance | undefined>(undefined);
  const [status, _setStatus] = useState<FhevmGoState>("idle");
  const [error, _setError] = useState<Error | undefined>(undefined);
  const [_isRunning, _setIsRunning] = useState<boolean>(enabled);
  const [_providerChanged, _setProviderChanged] = useState<number>(0);
  
  const _abortControllerRef = useRef<AbortController | null>(null);
  const _providerRef = useRef<string | ethers.Eip1193Provider | undefined>(provider);
  const _chainIdRef = useRef<number | undefined>(chainId);
  const _mockChainsRef = useRef<Record<number, string> | undefined>(initialMockChains);

  /**
   * 刷新 FHEVM 实例
   */
  const refresh = useCallback(() => {
    console.log("[useFhevm] refresh() called");
    
    // 如果有正在运行的实例创建，先取消
    if (_abortControllerRef.current) {
      console.log("[useFhevm] Aborting previous instance creation");
      _providerRef.current = undefined;
      _chainIdRef.current = undefined;
      _abortControllerRef.current.abort();
      _abortControllerRef.current = null;
    }

    // 更新引用
    _providerRef.current = provider;
    _chainIdRef.current = chainId;

    // 重置状态
    _setInstance(undefined);
    _setError(undefined);
    _setStatus("idle");

    if (provider !== undefined) {
      // 触发主要的 useEffect
      _setProviderChanged((prev) => prev + 1);
    }
  }, [provider, chainId]);

  // Provider 或 chainId 变化时刷新
  useEffect(() => {
    refresh();
  }, [refresh]);

  // enabled 状态变化
  useEffect(() => {
    _setIsRunning(enabled);
  }, [enabled]);

  // 主要的副作用 - 创建 FHEVM 实例
  useEffect(() => {
    console.log("[useFhevm] Main effect triggered", {
      isRunning: _isRunning,
      hasProvider: !!_providerRef.current,
      chainId: _chainIdRef.current,
      providerChanged: _providerChanged
    });

    // 如果禁用，清理状态
    if (_isRunning === false) {
      console.log("[useFhevm] Hook disabled, cleaning up");
      if (_abortControllerRef.current) {
        _abortControllerRef.current.abort();
        _abortControllerRef.current = null;
      }
      _setInstance(undefined);
      _setError(undefined);
      _setStatus("idle");
      return;
    }

    // 如果没有 provider，保持 idle 状态
    if (_isRunning === true) {
      if (_providerRef.current === undefined) {
        console.log("[useFhevm] No provider available");
        _setInstance(undefined);
        _setError(undefined);
        _setStatus("idle");
        return;
      }

      // 创建新的 AbortController
      if (!_abortControllerRef.current) {
        _abortControllerRef.current = new AbortController();
      }

      _assert(
        !_abortControllerRef.current.signal.aborted,
        "AbortController should not be aborted"
      );

      // 开始创建实例
      _setStatus("loading");
      _setError(undefined);

      const thisSignal = _abortControllerRef.current.signal;
      const thisProvider = _providerRef.current;
      const thisRpcUrlsByChainId = _mockChainsRef.current;

      console.log("[useFhevm] Creating FHEVM instance...", {
        provider: typeof thisProvider === 'string' ? thisProvider : 'EIP1193Provider',
        chainId: _chainIdRef.current,
        hasMockChains: !!thisRpcUrlsByChainId
      });

      createFhevmInstance({
        signal: thisSignal,
        provider: thisProvider,
        mockChains: thisRpcUrlsByChainId,
        onStatusChange: (s) => {
          console.log(`[useFhevm] FHEVM instance creation status: ${s}`);
        },
      })
        .then((newInstance) => {
          console.log("[useFhevm] ✅ FHEVM instance created successfully");
          
          if (thisSignal.aborted) {
            console.log("[useFhevm] Instance creation was aborted");
            return;
          }

          // 验证 provider 没有变化
          _assert(
            thisProvider === _providerRef.current,
            "Provider should not have changed during instance creation"
          );

          _setInstance(newInstance);
          _setError(undefined);
          _setStatus("ready");
        })
        .catch((e) => {
          console.error("[useFhevm] ❌ FHEVM instance creation failed:", e);
          
          if (thisSignal.aborted) {
            console.log("[useFhevm] Instance creation was aborted");
            return;
          }

          // 验证 provider 没有变化
          _assert(
            thisProvider === _providerRef.current,
            "Provider should not have changed during instance creation"
          );

          _setInstance(undefined);
          _setError(e);
          _setStatus("error");
        });
    }
  }, [_isRunning, _providerChanged]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (_abortControllerRef.current) {
        console.log("[useFhevm] Cleaning up on unmount");
        _abortControllerRef.current.abort();
      }
    };
  }, []);

  return { instance, refresh, error, status };
}

/**
 * 检查链是否支持 FHEVM
 */
export function isFhevmSupported(chainId: number | undefined): boolean {
  if (!chainId) return false;
  return chainId === 11155111 || chainId === 31337; // Sepolia 或 Hardhat
}

/**
 * 获取链的显示名称
 */
export function getChainName(chainId: number | undefined): string {
  switch (chainId) {
    case 11155111:
      return "Sepolia Testnet";
    case 31337:
      return "Hardhat Local";
    default:
      return `Unknown (${chainId})`;
  }
}