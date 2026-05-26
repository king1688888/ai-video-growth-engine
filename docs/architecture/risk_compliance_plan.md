# 风控合规计划

> 权威文档：D21（合规底线）、D13（质检风控）  
> 日期：2026-05-26

---

## 风控链路

```text
输入预检（上传前）→ 授权确认 → 意图风险评估
  → AI 生成后 → 质量评分 → 相似度检测 → 合规检查
  → 风险决策 → 动作执行
```

## 风险等级与动作

| 等级 | 动作 | 说明 |
|------|------|------|
| R0 | PASS | 放行，无风险 |
| R1 | WARN | 放行 + 用户提示 |
| R2 | AUTO_REWRITE | 自动重写高风险部分 |
| R3 | MANUAL_REVIEW | 暂停发布，等待人工复核 |
| R4 | BLOCK | 拦截，不发布，返还积分 |
| R5 | BLOCK + SANCTION | 拦截 + 账号限制 |

## 合规前置（M03）

| 检查项 | 时机 | 失败动作 |
|--------|------|----------|
| 素材授权确认 | 上传前 | 阻止创建任务 |
| AIGC 标识确认 | 上传前 | 阻止创建任务 |
| 禁止能力确认 | 上传前 | 阻止创建任务 |
| 意图预检 | 任务创建时 | PRECHECK_BLOCKED |

## 输出风控（M11）

| 检查 | 队列 | 输出 |
|------|------|------|
| 质量评分 | risk.quality | QualityCheckReport |
| 相似度检测 | risk.similarity | SimilarityCheckReport |
| 合规检查 | risk.compliance | ComplianceCheckReport |
| 综合决策 | risk.decision | RiskDecision |

## AIGC 标识

- 结果页展示 AIGC 标识
- 导出文件包含 AIGC 标识
- 复制内容附带 AIGC 提示
- 记录标识展示日志

## 投诉删除

```text
投诉接收 → 创建 ComplaintCase → 暂停展示（QUARANTINED）
  → 人工审核 → 确认侵权 → 删除派生资产 + 通知用户
  → 确认无侵权 → 恢复展示
```

---

*本文档为 MVP1 架构冻结版本。合规底线以 D21 为权威。*
