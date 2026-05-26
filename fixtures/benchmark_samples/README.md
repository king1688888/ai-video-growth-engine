# Benchmark 样本集

> Authority: D12 (AI Benchmark), D14 (Regression Testing)

## 目录结构

```
fixtures/benchmark_samples/
├── README.md
├── golden_constraints.json    # 黄金约束（输出必须满足）
├── smoke_test_input.json      # Smoke 测试输入
├── redteam_samples.json       # 风控红队样本
└── schema_validation/         # Schema 校验测试数据
```

## 用途

1. **Prompt 回归测试**：每次 Prompt 变更后，用 smoke 样本验证输出仍符合 Schema
2. **风控红队**：验证高风险输入被正确拦截
3. **质量门禁**：验证输出质量不低于基线

## 使用方式

```bash
cd workers/ai-engine
python -m pytest tests/ -v
```
