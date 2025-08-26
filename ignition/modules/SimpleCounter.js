import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SimpleCounterModule", (m) => {
  const simpleCounter = m.contract("SimpleCounter", [], {
    // 可以添加部署参数
  });

  return { simpleCounter };
});