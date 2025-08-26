// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title HCU Limits Configuration
 * @dev FHEVM 0.7.0 HCU (同态复杂度单元) 限制配置
 * @notice 提供 HCU 限制常量和验证函数
 */
library HCULimits {
    
    // FHEVM 0.7.0 HCU 限制常量
    
    /// @notice 每笔交易的顺序同态操作深度限制 (HCU)
    /// @dev 控制必须按顺序处理的操作的 HCU 使用量
    uint256 public constant SEQUENTIAL_HCU_LIMIT = 5_000_000;
    
    /// @notice 每笔交易的全局同态操作复杂度限制 (HCU)
    /// @dev 控制可并行处理的操作的 HCU 使用量
    uint256 public constant GLOBAL_HCU_LIMIT = 20_000_000;
    
    // ==================================================
    // 布尔运算 (ebool) HCU 成本
    // ==================================================
    
    /// @notice ebool and/or/xor 操作的 HCU 成本
    uint256 public constant EBOOL_AND_OR_XOR = 26_000;
    
    /// @notice ebool not 操作的 HCU 成本  
    uint256 public constant EBOOL_NOT = 30_000;
    
    // ==================================================
    // 8位加密整数运算 (euint8) HCU 成本
    // ==================================================
    
    /// @notice euint8 add 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_ADD_SCALAR = 84_000;
    /// @notice euint8 add 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_ADD_NON_SCALAR = 87_000;
    
    /// @notice euint8 sub 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_SUB_SCALAR = 83_000;
    /// @notice euint8 sub 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_SUB_NON_SCALAR = 84_000;
    
    /// @notice euint8 mul 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_MUL_SCALAR = 117_000;
    /// @notice euint8 mul 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_MUL_NON_SCALAR = 146_000;
    
    /// @notice euint8 div 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_DIV_SCALAR = 203_000;
    
    /// @notice euint8 rem 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_REM_SCALAR = 387_000;
    
    /// @notice euint8 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_AND_SCALAR = 28_000;
    /// @notice euint8 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_AND_NON_SCALAR = 29_000;
    
    /// @notice euint8 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_OR_SCALAR = 28_000;
    /// @notice euint8 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_OR_NON_SCALAR = 28_000;
    
    /// @notice euint8 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_XOR_SCALAR = 29_000;
    /// @notice euint8 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_XOR_NON_SCALAR = 29_000;
    
    /// @notice euint8 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_SHR_SCALAR = 28_000;
    /// @notice euint8 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_SHR_NON_SCALAR = 88_000;
    
    /// @notice euint8 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_SHL_SCALAR = 29_000;
    /// @notice euint8 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_SHL_NON_SCALAR = 86_000;
    
    /// @notice euint8 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_ROTR_SCALAR = 29_000;
    /// @notice euint8 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_ROTR_NON_SCALAR = 86_000;
    
    /// @notice euint8 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_ROTL_SCALAR = 29_000;
    /// @notice euint8 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_ROTL_NON_SCALAR = 87_000;
    
    /// @notice euint8 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_EQ_SCALAR = 52_000;
    /// @notice euint8 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_EQ_NON_SCALAR = 49_000;
    
    /// @notice euint8 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_NE_SCALAR = 49_000;
    /// @notice euint8 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_NE_NON_SCALAR = 52_000;
    
    /// @notice euint8 ge 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_GE_SCALAR = 60_000;
    /// @notice euint8 ge 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_GE_NON_SCALAR = 55_000;
    
    /// @notice euint8 gt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_GT_SCALAR = 53_000;
    /// @notice euint8 gt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_GT_NON_SCALAR = 56_000;
    
    /// @notice euint8 le 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_LE_SCALAR = 53_000;
    /// @notice euint8 le 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_LE_NON_SCALAR = 54_000;
    
    /// @notice euint8 lt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_LT_SCALAR = 51_000;
    /// @notice euint8 lt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_LT_NON_SCALAR = 56_000;
    
    /// @notice euint8 min 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_MIN_SCALAR = 86_000;
    /// @notice euint8 min 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_MIN_NON_SCALAR = 111_000;
    
    /// @notice euint8 max 操作的 HCU 成本 (标量)
    uint256 public constant EUINT8_MAX_SCALAR = 81_000;
    /// @notice euint8 max 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_MAX_NON_SCALAR = 111_000;
    
    /// @notice euint8 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_NEG_NON_SCALAR = 72_000;
    
    /// @notice euint8 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_NOT_NON_SCALAR = 8_000;
    
    /// @notice euint8 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT8_SELECT_NON_SCALAR = 43_000;
    
    /// @notice randEuint8() 操作的 HCU 成本
    uint256 public constant RAND_EUINT8 = 100_000;
    
    // ==================================================
    // 16位加密整数运算 (euint16) HCU 成本
    // ==================================================
    
    /// @notice euint16 add 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_ADD_SCALAR = 87_000;
    /// @notice euint16 add 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_ADD_NON_SCALAR = 87_000;
    
    /// @notice euint16 sub 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_SUB_SCALAR = 86_000;
    /// @notice euint16 sub 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_SUB_NON_SCALAR = 88_000;
    
    /// @notice euint16 mul 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_MUL_SCALAR = 176_000;
    /// @notice euint16 mul 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_MUL_NON_SCALAR = 207_000;
    
    /// @notice euint16 div 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_DIV_SCALAR = 283_000;
    
    /// @notice euint16 rem 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_REM_SCALAR = 513_000;
    
    /// @notice euint16 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_AND_SCALAR = 29_000;
    /// @notice euint16 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_AND_NON_SCALAR = 29_000;
    
    /// @notice euint16 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_OR_SCALAR = 29_000;
    /// @notice euint16 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_OR_NON_SCALAR = 29_000;
    
    /// @notice euint16 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_XOR_SCALAR = 29_000;
    /// @notice euint16 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_XOR_NON_SCALAR = 29_000;
    
    /// @notice euint16 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_SHR_SCALAR = 29_000;
    /// @notice euint16 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_SHR_NON_SCALAR = 118_000;
    
    /// @notice euint16 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_SHL_SCALAR = 29_000;
    /// @notice euint16 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_SHL_NON_SCALAR = 118_000;
    
    /// @notice euint16 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_ROTR_SCALAR = 30_000;
    /// @notice euint16 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_ROTR_NON_SCALAR = 117_000;
    
    /// @notice euint16 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_ROTL_SCALAR = 29_000;
    /// @notice euint16 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_ROTL_NON_SCALAR = 117_000;
    
    /// @notice euint16 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_EQ_SCALAR = 52_000;
    /// @notice euint16 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_EQ_NON_SCALAR = 78_000;
    
    /// @notice euint16 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_NE_SCALAR = 51_000;
    /// @notice euint16 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_NE_NON_SCALAR = 82_000;
    
    /// @notice euint16 ge 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_GE_SCALAR = 60_000;
    /// @notice euint16 ge 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_GE_NON_SCALAR = 80_000;
    
    /// @notice euint16 gt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_GT_SCALAR = 53_000;
    /// @notice euint16 gt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_GT_NON_SCALAR = 83_000;
    
    /// @notice euint16 le 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_LE_SCALAR = 54_000;
    /// @notice euint16 le 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_LE_NON_SCALAR = 80_000;
    
    /// @notice euint16 lt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_LT_SCALAR = 53_000;
    /// @notice euint16 lt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_LT_NON_SCALAR = 80_000;
    
    /// @notice euint16 min 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_MIN_SCALAR = 86_000;
    /// @notice euint16 min 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_MIN_NON_SCALAR = 141_000;
    
    /// @notice euint16 max 操作的 HCU 成本 (标量)
    uint256 public constant EUINT16_MAX_SCALAR = 83_000;
    /// @notice euint16 max 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_MAX_NON_SCALAR = 140_000;
    
    /// @notice euint16 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_NEG_NON_SCALAR = 89_000;
    
    /// @notice euint16 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_NOT_NON_SCALAR = 15_000;
    
    /// @notice euint16 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT16_SELECT_NON_SCALAR = 44_000;
    
    /// @notice randEuint16() 操作的 HCU 成本
    uint256 public constant RAND_EUINT16 = 100_000;
    
    // ==================================================
    // 32位加密整数运算 (euint32) HCU 成本
    // ==================================================
    
    /// @notice euint32 add 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_ADD_SCALAR = 87_000;
    /// @notice euint32 add 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_ADD_NON_SCALAR = 121_000;
    
    /// @notice euint32 sub 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_SUB_SCALAR = 87_000;
    /// @notice euint32 sub 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_SUB_NON_SCALAR = 120_000;
    
    /// @notice euint32 mul 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_MUL_SCALAR = 244_000;
    /// @notice euint32 mul 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_MUL_NON_SCALAR = 313_000;
    
    /// @notice euint32 div 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_DIV_SCALAR = 397_000;
    
    /// @notice euint32 rem 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_REM_SCALAR = 714_000;
    
    /// @notice euint32 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_AND_SCALAR = 29_000;
    /// @notice euint32 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_AND_NON_SCALAR = 30_000;
    
    /// @notice euint32 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_OR_SCALAR = 30_000;
    /// @notice euint32 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_OR_NON_SCALAR = 31_000;
    
    /// @notice euint32 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_XOR_SCALAR = 30_000;
    /// @notice euint32 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_XOR_NON_SCALAR = 30_000;
    
    /// @notice euint32 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_SHR_SCALAR = 30_000;
    /// @notice euint32 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_SHR_NON_SCALAR = 150_000;
    
    /// @notice euint32 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_SHL_SCALAR = 30_000;
    /// @notice euint32 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_SHL_NON_SCALAR = 150_000;
    
    /// @notice euint32 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_ROTR_SCALAR = 30_000;
    /// @notice euint32 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_ROTR_NON_SCALAR = 149_000;
    
    /// @notice euint32 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_ROTL_SCALAR = 30_000;
    /// @notice euint32 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_ROTL_NON_SCALAR = 150_000;
    
    /// @notice euint32 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_EQ_SCALAR = 81_000;
    /// @notice euint32 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_EQ_NON_SCALAR = 82_000;
    
    /// @notice euint32 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_NE_SCALAR = 80_000;
    /// @notice euint32 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_NE_NON_SCALAR = 84_000;
    
    /// @notice euint32 ge 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_GE_SCALAR = 81_000;
    /// @notice euint32 ge 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_GE_NON_SCALAR = 111_000;
    
    /// @notice euint32 gt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_GT_SCALAR = 82_000;
    /// @notice euint32 gt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_GT_NON_SCALAR = 111_000;
    
    /// @notice euint32 le 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_LE_SCALAR = 80_000;
    /// @notice euint32 le 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_LE_NON_SCALAR = 113_000;
    
    /// @notice euint32 lt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_LT_SCALAR = 80_000;
    /// @notice euint32 lt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_LT_NON_SCALAR = 111_000;
    
    /// @notice euint32 min 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_MIN_SCALAR = 113_000;
    /// @notice euint32 min 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_MIN_NON_SCALAR = 177_000;
    
    /// @notice euint32 max 操作的 HCU 成本 (标量)
    uint256 public constant EUINT32_MAX_SCALAR = 112_000;
    /// @notice euint32 max 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_MAX_NON_SCALAR = 174_000;
    
    /// @notice euint32 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_NEG_NON_SCALAR = 116_000;
    
    /// @notice euint32 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_NOT_NON_SCALAR = 28_000;
    
    /// @notice euint32 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT32_SELECT_NON_SCALAR = 45_000;
    
    /// @notice randEuint32() 操作的 HCU 成本
    uint256 public constant RAND_EUINT32 = 100_000;
    
    // ==================================================
    // 64位加密整数运算 (euint64) HCU 成本
    // ==================================================
    
    /// @notice euint64 add 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_ADD_SCALAR = 128_000;
    /// @notice euint64 add 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_ADD_NON_SCALAR = 156_000;
    
    /// @notice euint64 sub 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_SUB_SCALAR = 129_000;
    /// @notice euint64 sub 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_SUB_NON_SCALAR = 159_000;
    
    /// @notice euint64 mul 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_MUL_SCALAR = 346_000;
    /// @notice euint64 mul 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_MUL_NON_SCALAR = 571_000;
    
    /// @notice euint64 div 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_DIV_SCALAR = 651_000;
    
    /// @notice euint64 rem 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_REM_SCALAR = 1_111_000;
    
    /// @notice euint64 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_AND_SCALAR = 33_000;
    /// @notice euint64 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_AND_NON_SCALAR = 33_000;
    
    /// @notice euint64 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_OR_SCALAR = 32_000;
    /// @notice euint64 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_OR_NON_SCALAR = 33_000;
    
    /// @notice euint64 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_XOR_SCALAR = 33_000;
    /// @notice euint64 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_XOR_NON_SCALAR = 32_000;
    
    /// @notice euint64 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_SHR_SCALAR = 34_000;
    /// @notice euint64 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_SHR_NON_SCALAR = 203_000;
    
    /// @notice euint64 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_SHL_SCALAR = 33_000;
    /// @notice euint64 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_SHL_NON_SCALAR = 203_000;
    
    /// @notice euint64 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_ROTR_SCALAR = 34_000;
    /// @notice euint64 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_ROTR_NON_SCALAR = 206_000;
    
    /// @notice euint64 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_ROTL_SCALAR = 34_000;
    /// @notice euint64 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_ROTL_NON_SCALAR = 203_000;
    
    /// @notice euint64 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_EQ_SCALAR = 83_000;
    /// @notice euint64 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_EQ_NON_SCALAR = 116_000;
    
    /// @notice euint64 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_NE_SCALAR = 84_000;
    /// @notice euint64 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_NE_NON_SCALAR = 111_000;
    
    /// @notice euint64 ge 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_GE_SCALAR = 112_000;
    /// @notice euint64 ge 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_GE_NON_SCALAR = 146_000;
    
    /// @notice euint64 gt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_GT_SCALAR = 113_000;
    /// @notice euint64 gt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_GT_NON_SCALAR = 141_000;
    
    /// @notice euint64 le 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_LE_SCALAR = 113_000;
    /// @notice euint64 le 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_LE_NON_SCALAR = 146_000;
    
    /// @notice euint64 lt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_LT_SCALAR = 113_000;
    /// @notice euint64 lt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_LT_NON_SCALAR = 142_000;
    
    /// @notice euint64 min 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_MIN_SCALAR = 149_000;
    /// @notice euint64 min 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_MIN_NON_SCALAR = 210_000;
    
    /// @notice euint64 max 操作的 HCU 成本 (标量)
    uint256 public constant EUINT64_MAX_SCALAR = 147_000;
    /// @notice euint64 max 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_MAX_NON_SCALAR = 211_000;
    
    /// @notice euint64 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_NEG_NON_SCALAR = 150_000;
    
    /// @notice euint64 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_NOT_NON_SCALAR = 84_000;
    
    /// @notice euint64 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT64_SELECT_NON_SCALAR = 52_000;
    
    /// @notice randEuint64() 操作的 HCU 成本
    uint256 public constant RAND_EUINT64 = 100_000;
    
    // ==================================================
    // 128位加密整数运算 (euint128) HCU 成本
    // ==================================================
    
    /// @notice euint128 add 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_ADD_SCALAR = 159_000;
    /// @notice euint128 add 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_ADD_NON_SCALAR = 249_000;
    
    /// @notice euint128 sub 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_SUB_SCALAR = 159_000;
    /// @notice euint128 sub 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_SUB_NON_SCALAR = 244_000;
    
    /// @notice euint128 mul 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_MUL_SCALAR = 646_000;
    /// @notice euint128 mul 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_MUL_NON_SCALAR = 1_671_000;
    
    /// @notice euint128 div 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_DIV_SCALAR = 1_290_000;
    
    /// @notice euint128 rem 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_REM_SCALAR = 1_900_000;
    
    /// @notice euint128 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_AND_SCALAR = 33_000;
    /// @notice euint128 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_AND_NON_SCALAR = 34_000;
    
    /// @notice euint128 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_OR_SCALAR = 34_000;
    /// @notice euint128 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_OR_NON_SCALAR = 35_000;
    
    /// @notice euint128 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_XOR_SCALAR = 35_000;
    /// @notice euint128 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_XOR_NON_SCALAR = 35_000;
    
    /// @notice euint128 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_SHR_SCALAR = 33_000;
    /// @notice euint128 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_SHR_NON_SCALAR = 254_000;
    
    /// @notice euint128 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_SHL_SCALAR = 33_000;
    /// @notice euint128 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_SHL_NON_SCALAR = 251_000;
    
    /// @notice euint128 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_ROTR_SCALAR = 34_000;
    /// @notice euint128 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_ROTR_NON_SCALAR = 261_000;
    
    /// @notice euint128 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_ROTL_SCALAR = 33_000;
    /// @notice euint128 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_ROTL_NON_SCALAR = 264_000;
    
    /// @notice euint128 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_EQ_SCALAR = 115_000;
    /// @notice euint128 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_EQ_NON_SCALAR = 117_000;
    
    /// @notice euint128 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_NE_SCALAR = 115_000;
    /// @notice euint128 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_NE_NON_SCALAR = 116_000;
    
    /// @notice euint128 ge 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_GE_SCALAR = 144_000;
    /// @notice euint128 ge 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_GE_NON_SCALAR = 206_000;
    
    /// @notice euint128 gt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_GT_SCALAR = 144_000;
    /// @notice euint128 gt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_GT_NON_SCALAR = 206_000;
    
    /// @notice euint128 le 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_LE_SCALAR = 143_000;
    /// @notice euint128 le 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_LE_NON_SCALAR = 204_000;
    
    /// @notice euint128 lt 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_LT_SCALAR = 143_000;
    /// @notice euint128 lt 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_LT_NON_SCALAR = 204_000;
    
    /// @notice euint128 min 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_MIN_SCALAR = 180_000;
    /// @notice euint128 min 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_MIN_NON_SCALAR = 280_000;
    
    /// @notice euint128 max 操作的 HCU 成本 (标量)
    uint256 public constant EUINT128_MAX_SCALAR = 181_000;
    /// @notice euint128 max 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_MAX_NON_SCALAR = 274_000;
    
    /// @notice euint128 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_NEG_NON_SCALAR = 241_000;
    
    /// @notice euint128 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_NOT_NON_SCALAR = 109_000;
    
    /// @notice euint128 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT128_SELECT_NON_SCALAR = 51_000;
    
    /// @notice randEuint128() 操作的 HCU 成本
    uint256 public constant RAND_EUINT128 = 100_000;
    
    // ==================================================
    // 256位加密整数运算 (euint256) HCU 成本
    // ==================================================
    
    /// @notice euint256 and 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_AND_SCALAR = 37_000;
    /// @notice euint256 and 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_AND_NON_SCALAR = 38_000;
    
    /// @notice euint256 or 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_OR_SCALAR = 37_000;
    /// @notice euint256 or 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_OR_NON_SCALAR = 37_000;
    
    /// @notice euint256 xor 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_XOR_SCALAR = 37_000;
    /// @notice euint256 xor 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_XOR_NON_SCALAR = 37_000;
    
    /// @notice euint256 shr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_SHR_SCALAR = 37_000;
    /// @notice euint256 shr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_SHR_NON_SCALAR = 359_000;
    
    /// @notice euint256 shl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_SHL_SCALAR = 37_000;
    /// @notice euint256 shl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_SHL_NON_SCALAR = 359_000;
    
    /// @notice euint256 rotr 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_ROTR_SCALAR = 37_000;
    /// @notice euint256 rotr 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_ROTR_NON_SCALAR = 367_000;
    
    /// @notice euint256 rotl 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_ROTL_SCALAR = 37_000;
    /// @notice euint256 rotl 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_ROTL_NON_SCALAR = 367_000;
    
    /// @notice euint256 eq 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_EQ_SCALAR = 117_000;
    /// @notice euint256 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_EQ_NON_SCALAR = 151_000;
    
    /// @notice euint256 ne 操作的 HCU 成本 (标量)
    uint256 public constant EUINT256_NE_SCALAR = 117_000;
    /// @notice euint256 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_NE_NON_SCALAR = 149_000;
    
    /// @notice euint256 neg 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_NEG_NON_SCALAR = 269_000;
    
    /// @notice euint256 not 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_NOT_NON_SCALAR = 216_000;
    
    /// @notice euint256 select 操作的 HCU 成本 (非标量)
    uint256 public constant EUINT256_SELECT_NON_SCALAR = 71_000;
    
    /// @notice randEuint256() 操作的 HCU 成本
    uint256 public constant RAND_EUINT256 = 100_000;
    
    // ==================================================
    // 加密地址 (euint160/eaddress) HCU 成本
    // ==================================================
    
    /// @notice eaddress/euint160 eq 操作的 HCU 成本 (标量)
    uint256 public constant EADDRESS_EQ_SCALAR = 115_000;
    /// @notice eaddress/euint160 eq 操作的 HCU 成本 (非标量)
    uint256 public constant EADDRESS_EQ_NON_SCALAR = 125_000;
    
    /// @notice eaddress/euint160 ne 操作的 HCU 成本 (标量)
    uint256 public constant EADDRESS_NE_SCALAR = 115_000;
    /// @notice eaddress/euint160 ne 操作的 HCU 成本 (非标量)
    uint256 public constant EADDRESS_NE_NON_SCALAR = 124_000;
    
    // ==================================================
    // 附加操作 HCU 成本
    // ==================================================
    
    /// @notice cast 操作的 HCU 成本
    uint256 public constant CAST_OPERATION = 200;
    
    /// @notice trivialEncrypt 操作的 HCU 成本范围 (100-800)
    uint256 public constant TRIVIAL_ENCRYPT_MIN = 100;
    uint256 public constant TRIVIAL_ENCRYPT_MAX = 800;
    
    /// @notice randBounded 操作的 HCU 成本
    uint256 public constant RAND_BOUNDED = 100_000;
    
    /// @notice rand 操作的 HCU 成本
    uint256 public constant RAND_OPERATION = 100_000;
    
    /// @notice select 操作的 HCU 成本范围 (43,000-71,000)
    uint256 public constant SELECT_MIN = 43_000;
    uint256 public constant SELECT_MAX = 71_000;
    
    /**
     * @dev 验证操作是否在顺序 HCU 限制内
     * @param operationCost 操作的 HCU 成本
     * @return bool 是否在限制内
     */
    function isWithinSequentialLimit(uint256 operationCost) internal pure returns (bool) {
        return operationCost <= SEQUENTIAL_HCU_LIMIT;
    }
    
    /**
     * @dev 验证操作是否在全局 HCU 限制内
     * @param operationCost 操作的 HCU 成本
     * @return bool 是否在限制内
     */
    function isWithinGlobalLimit(uint256 operationCost) internal pure returns (bool) {
        return operationCost <= GLOBAL_HCU_LIMIT;
    }
    
    /**
     * @dev 估算投票操作的 HCU 成本（使用实际HCU成本）
     * @return uint256 投票操作的总 HCU 成本
     */
    function estimateVotingCost() internal pure returns (uint256) {
        // 投票操作包括：FHE加法 + 2次选择操作
        return EUINT64_ADD_NON_SCALAR + (EUINT64_SELECT_NON_SCALAR * 2);
    }
    
    /**
     * @dev 估算计数器操作的 HCU 成本（使用实际HCU成本）
     * @return uint256 计数器操作的总 HCU 成本
     */
    function estimateCounterCost() internal pure returns (uint256) {
        // 计数器操作包括：euint32加法操作
        return EUINT32_ADD_NON_SCALAR;
    }
    
    /**
     * @dev 估算解密请求的 HCU 成本（使用实际HCU成本）
     * @param numValues 要解密的值的数量
     * @return uint256 解密操作的总 HCU 成本
     */
    function estimateDecryptionCost(uint256 numValues) internal pure returns (uint256) {
        // 基础解密成本 + 每个值的处理成本
        return 10_000 + (numValues * 1_000);
    }
    
    /**
     * @dev 获取 HCU 限制信息
     * @return sequential 顺序操作限制
     * @return global 全局操作限制
     */
    function getLimits() internal pure returns (uint256 sequential, uint256 global) {
        return (SEQUENTIAL_HCU_LIMIT, GLOBAL_HCU_LIMIT);
    }
}