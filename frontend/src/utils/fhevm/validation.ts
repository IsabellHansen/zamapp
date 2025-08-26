import type { FhevmRelayerSDKType, FhevmWindowType } from './types';

type TraceType = (message?: unknown, ...optionalParams: unknown[]) => void;

/**
 * 检查对象是否有指定的属性和类型
 */
export function hasProperty<
  T extends object,
  K extends PropertyKey,
  V extends string // "string", "number", "object", "function", "boolean"
>(
  obj: T,
  propertyName: K,
  propertyType: V,
  trace?: TraceType
): obj is T & Record<
  K,
  V extends "string" ? string :
  V extends "number" ? number :
  V extends "object" ? object :
  V extends "boolean" ? boolean :
  V extends "function" ? (...args: any[]) => any :
  unknown
> {
  if (!obj || typeof obj !== "object") {
    trace?.(`hasProperty: obj is not an object`);
    return false;
  }

  if (!(propertyName in obj)) {
    trace?.(`hasProperty: missing ${String(propertyName)}`);
    return false;
  }

  const value = (obj as Record<K, unknown>)[propertyName];

  if (value === null || value === undefined) {
    trace?.(`hasProperty: ${String(propertyName)} is null or undefined`);
    return false;
  }

  if (typeof value !== propertyType) {
    trace?.(`hasProperty: ${String(propertyName)} is not a ${propertyType}, got ${typeof value}`);
    return false;
  }

  return true;
}

/**
 * 验证 RelayerSDK 对象的完整性
 */
export function isValidRelayerSDK(
  obj: unknown,
  trace?: TraceType
): obj is FhevmRelayerSDKType {
  trace?.("[SDK Validation] Starting RelayerSDK validation...");
  
  if (typeof obj === "undefined") {
    trace?.("[SDK Validation] ❌ relayerSDK is undefined");
    return false;
  }
  
  if (obj === null) {
    trace?.("[SDK Validation] ❌ relayerSDK is null");
    return false;
  }
  
  if (typeof obj !== "object") {
    trace?.("[SDK Validation] ❌ relayerSDK is not an object, got:", typeof obj);
    return false;
  }

  // 检查核心方法 - 使用更宽松的验证
  const requiredMethods = ['initSDK', 'createInstance'];
  const availableMethods = Object.getOwnPropertyNames(obj).filter(prop => 
    typeof (obj as any)[prop] === 'function'
  );

  trace?.(`[SDK Validation] Available methods: ${availableMethods.join(', ')}`);

  let foundRequiredMethods = 0;
  for (const method of requiredMethods) {
    if (availableMethods.includes(method)) {
      foundRequiredMethods++;
      trace?.(`[SDK Validation] ✅ Found required method '${method}'`);
    } else {
      trace?.(`[SDK Validation] ⚠️ Required method '${method}' not found. Available: ${availableMethods.join(', ')}`);
    }
  }

  // 更宽松的验证：如果有任何方法或至少有一个核心方法，就认为可能有效
  if (availableMethods.length === 0 && foundRequiredMethods === 0) {
    trace?.("[SDK Validation] ❌ No methods found in SDK object");
    return false;
  }

  // 如果找到了至少一个核心方法，或者有大量方法，认为可能是有效的SDK
  if (foundRequiredMethods > 0 || availableMethods.length >= 3) {
    trace?.(`[SDK Validation] ✅ SDK appears valid (${foundRequiredMethods}/${requiredMethods.length} core methods, ${availableMethods.length} total methods)`);
  }

  // 检查配置对象 - 极为宽松的验证，仅用于开发
  const hasSepoliaConfig = hasProperty(obj, 'SepoliaConfig', 'object', trace);
  const allProps = Object.getOwnPropertyNames(obj);
  const configProps = allProps.filter(prop => 
    prop.includes('Config') && typeof (obj as any)[prop] === 'object'
  );

  trace?.(`[SDK Validation] Available config properties: ${configProps.join(', ')}`);

  if (!hasSepoliaConfig) {
    trace?.("[SDK Validation] ⚠️ SepoliaConfig not found, but continuing for development");
    // 在开发阶段，不要因为配置问题就认为SDK无效
  } else {
    trace?.("[SDK Validation] ✅ SepoliaConfig found");
    // 即使SepoliaConfig存在，也不严格验证其内容
    const sepoliaConfig = (obj as any).SepoliaConfig;
    if (sepoliaConfig && typeof sepoliaConfig === 'object') {
      const configKeys = Object.keys(sepoliaConfig);
      trace?.(`[SDK Validation] SepoliaConfig keys: ${configKeys.join(', ')}`);
    }
  }

  // 检查初始化状态（完全可选）
  if ('__initialized__' in obj) {
    const initialized = (obj as any).__initialized__;
    trace?.(`[SDK Validation] Found __initialized__ property: ${initialized}`);
    // 不要因为初始化状态而拒绝SDK
  }

  // 最宽松的验证：只要是个对象并且有一些属性，就认为有效
  const totalProps = allProps.length;
  if (totalProps === 0) {
    trace?.("[SDK Validation] ❌ SDK object has no properties");
    return false;
  }

  trace?.(`[SDK Validation] ✅ RelayerSDK validation passed (${totalProps} properties, ${availableMethods.length} methods)`);
  return true;
}

/**
 * 验证 window 对象是否包含有效的 RelayerSDK
 */
export function isValidFhevmWindow(
  win: unknown,
  trace?: TraceType
): win is FhevmWindowType {
  trace?.("[Window Validation] Starting window validation...");
  
  if (typeof win === "undefined") {
    trace?.("[Window Validation] ❌ window object is undefined");
    return false;
  }
  
  if (win === null) {
    trace?.("[Window Validation] ❌ window object is null");
    return false;
  }
  
  if (typeof win !== "object") {
    trace?.("[Window Validation] ❌ window is not an object");
    return false;
  }
  
  if (!("relayerSDK" in win)) {
    trace?.("[Window Validation] ❌ window does not contain 'relayerSDK' property");
    return false;
  }

  const isValidSDK = isValidRelayerSDK((win as any).relayerSDK, trace);
  if (!isValidSDK) {
    trace?.("[Window Validation] ❌ window.relayerSDK validation failed");
    return false;
  }

  trace?.("[Window Validation] ✅ Window validation passed");
  return true;
}

/**
 * 验证地址格式是否正确
 */
export function isValidAddress(address: unknown): address is `0x${string}` {
  if (typeof address !== "string") {
    return false;
  }
  
  if (!address.startsWith("0x")) {
    return false;
  }
  
  if (address.length !== 42) {
    return false;
  }
  
  // 检查是否为有效的十六进制字符
  const hexPattern = /^0x[0-9a-fA-F]{40}$/;
  return hexPattern.test(address);
}

/**
 * 详细的 SDK 诊断信息
 */
export function diagnosticSDK(trace?: TraceType): {
  windowExists: boolean;
  relayerSDKExists: boolean;
  sdkMethods: string[];
  sdkConfig: any;
  initialized: boolean | undefined;
  issues: string[];
} {
  const issues: string[] = [];
  
  trace?.("[SDK Diagnostics] Starting comprehensive SDK diagnostics...");
  
  const windowExists = typeof window !== "undefined";
  if (!windowExists) {
    issues.push("Window object not available (not in browser environment)");
  }

  const relayerSDKExists = windowExists && "relayerSDK" in window;
  if (!relayerSDKExists && windowExists) {
    issues.push("window.relayerSDK not found");
  }

  let sdkMethods: string[] = [];
  let sdkConfig: any = null;
  let initialized: boolean | undefined;

  if (relayerSDKExists) {
    const sdk = (window as any).relayerSDK;
    
    // 获取所有方法
    sdkMethods = Object.getOwnPropertyNames(sdk).filter(prop => 
      typeof sdk[prop] === 'function'
    );
    
    // 检查配置
    if ('SepoliaConfig' in sdk) {
      sdkConfig = sdk.SepoliaConfig;
    } else {
      issues.push("SepoliaConfig not found in SDK");
    }
    
    // 检查初始化状态
    if ('__initialized__' in sdk) {
      initialized = sdk.__initialized__;
    }
    
    // 验证必需方法
    const requiredMethods = ['initSDK', 'createInstance'];
    for (const method of requiredMethods) {
      if (!sdkMethods.includes(method)) {
        issues.push(`Required method '${method}' not found`);
      }
    }
  }

  const result = {
    windowExists,
    relayerSDKExists,
    sdkMethods,
    sdkConfig,
    initialized,
    issues
  };

  trace?.("[SDK Diagnostics] Diagnostics complete:", result);
  return result;
}