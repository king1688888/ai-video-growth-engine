# 积分计费计划

> 权威文档：D19  
> 日期：2026-05-26

---

## 计费模型

MVP1 采用 **积分制**：用户购买或获赠积分，任务消耗积分，失败可返还。

## 核心流程

```text
任务创建 → 积分预估 → 余额检查 → 冻结积分(CreditHold)
  → 任务执行 → 记录模型成本(ModelCallLog)
  → 成功 → 正式扣除(CreditTransaction: CAPTURE)
  → 失败 → 返还冻结(CreditTransaction: REFUND)
  → 部分成功 → 部分扣除 + 部分返还
```

## 数据模型

| 表 | 说明 |
|----|------|
| `credit_accounts` | 用户积分账户（balance、frozen、total_earned、total_spent） |
| `credit_holds` | 冻结记录（task_id、amount、status: held/captured/released） |
| `credit_transactions` | 积分流水（type: GRANT/PURCHASE/CAPTURE/REFUND/COMPENSATE/EXPIRE） |
| `orders` | 购买订单预留（MVP1 可手动发放，P1 接入支付） |
| `cost_ledger_entries` | 模型成本明细（关联 model_call_log） |

## 幂等规则

| 操作 | 幂等键 | 说明 |
|------|--------|------|
| 冻结 | `task_id + HOLD` | 同一任务只冻结一次 |
| 扣除 | `task_id + CAPTURE` | 同一任务只扣除一次 |
| 返还 | `task_id + REFUND` | 同一任务只返还一次 |
| 补偿 | `compensation_id` | 后台补偿唯一键 |

## MVP1 积分规则

| 项目 | 值 | 说明 |
|------|-----|------|
| 注册赠送 | 50 积分 | 约 5 次基础拆解 |
| 单次拆解消耗 | 8-12 积分 | 根据视频时长和模型成本浮动 |
| 失败全额返还 | 是 | 冻结积分原路返还 |
| 部分成功 | 按完成步骤比例扣除 | 已消耗模型成本部分扣除 |

## 毛利统计

```text
毛利 = 用户支付积分价值 - 实际模型成本 - 存储成本 - 基础设施分摊
```

后台可查看：每任务成本、每用户 LTV、整体毛利率。

---

*本文档为 MVP1 架构冻结版本。计费规则以 D19 为权威。*
