# Model Router 计划

> 权威文档：D11  
> 日期：2026-05-26

---

## 核心原则

所有模型调用必须通过 Model Router，不允许业务代码直接调用供应商 API。Router 负责：供应商选择、成本预估、能力匹配、降级回退、调用记录、Schema 校验。

## 架构

```text
AI Worker 请求
  → Model Router
    → 能力匹配（根据 Prompt 要求选择模型）
    → 成本预估（返回积分消耗预估）
    → Provider Adapter（统一接口调用不同供应商）
    → 响应标准化
    → Schema 校验 + JSON 修复
    → ModelCallLog 记录
    → CostLedgerEntry 记录
  → 返回结构化结果
```

## Provider Adapter

| 供应商 | 模型 | 用途 | MVP1 状态 |
|--------|------|------|-----------|
| OpenAI | GPT-4.1-mini | 文本生成、脚本 | 可用 |
| OpenAI | GPT-4.1-nano | 轻量任务 | 可用 |
| Google | Gemini 2.5 Flash | 多模态理解 | 可用 |
| 阿里云 | 通义千问 VL | 多模态理解（国内合规） | 待接入 |
| 阿里云 | Paraformer ASR | 语音转写 | 待接入 |

## 路由策略

| 策略 | 说明 |
|------|------|
| 能力优先 | 根据 Prompt 要求的能力（多模态/长文本/JSON输出）选择 |
| 成本优先 | 在满足能力的前提下选择最低成本模型 |
| 降级回退 | 主模型失败时自动切换到备选模型 |
| 速率限制 | 按供应商 RPM/TPM 限制排队 |

## 降级策略

```text
主模型调用失败
  → 重试 1 次（相同模型）
  → 切换备选模型重试
  → 再失败 → 标记步骤 FAILED_RETRYABLE
  → 超过最大重试 → FAILED_FINAL → 死信队列
```

## 成本记录

每次模型调用必须记录：
- `model_call_logs`: provider、model、input_tokens、output_tokens、latency_ms、cost_micro_usd、status
- `cost_ledger_entries`: task_id、step、model_call_id、amount、currency

---

*本文档为 MVP1 架构冻结版本。模型选择细节以 D11 为权威。*
