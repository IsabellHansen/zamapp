const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FHECounterModule", (m) => {
  const fheCounter = m.contract("FHECounter", [], {
    // 可以添加部署参数
  });

  return { fheCounter };
});