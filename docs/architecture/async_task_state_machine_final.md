# 异步任务状态机最终方案

> 权威文档：D17  
> 队列：BullMQ + Redis  
> 日期：2026-05-26

---

## 四层任务模型

| 层级 | 对象 | 面向 | 用户可见 |
|------|------|------|----------|
| L1 | `VideoAnalysisTask` | 用户/后台 | 是 |
| L2 | `TaskStepLog` | 前端进度/后台 | 部分 |
| L3 | `AsyncJob` | Worker/队列 | 后台 |
| L4 | `JobAttempt` | 运维/调试 | 后台 |

## VideoAnalysisTask 状态机

```text
DRAFT → CREATED → AWAITING_UPLOAD → UPLOADED → CONSENT_CONFIRMED
  → QUOTED → CREDIT_HELD → QUEUED → RUNNING
  → SUCCEEDED / PARTIAL_SUCCEEDED / FAILED / BLOCKED_RISK / CANCELED
  → REFUND_PENDING → REFUNDED
  → EXPIRED / DELETED
```

**终态**：`PRECHECK_BLOCKED`, `BLOCKED_RISK`, `PARTIAL_SUCCEEDED`, `SUCCEEDED`, `FAILED`, `CANCELED`, `REFUNDED`, `EXPIRED`, `DELETED`

## DAG 步骤（按执行顺序）

| # | Step | 队列 | 可并行 |
|---|------|------|--------|
| 1 | CONSENT_CHECK | API/risk.precheck | 否 |
| 2 | CREDIT_HOLD | billing.settle | 否 |
| 3 | UPLOAD_VALIDATE | video.metadata | 否 |
| 4 | NORMALIZE_VIDEO | video.normalize | 否 |
| 5a | EXTRACT_AUDIO → RUN_ASR | video.audio → video.asr | 是（与5b/5c并行） |
| 5b | EXTRACT_FRAMES → RUN_OCR | video.frames → video.ocr | 是 |
| 5c | DETECT_SHOTS | video.shots | 是 |
| 6 | BUILD_EVIDENCE_PACK | ai.evidence_pack | 否 |
| 7 | VIDEO_UNDERSTANDING | ai.video_understanding | 否 |
| 8 | CONTENT_DNA | ai.content_dna | 否 |
| 9 | CREATIVE_IR | ai.creative_ir | 否 |
| 10 | DELIVERABLES | ai.deliverables | 否 |
| 11 | QUALITY_CHECK + SIMILARITY_CHECK + COMPLIANCE_CHECK | risk.* | 是 |
| 12 | RISK_DECISION | risk.decision | 否 |
| 13 | SETTLEMENT | billing.settle | 否 |
| 14 | PUBLISH_RESULT | task.orchestrate | 否 |

## 队列配置

| 队列 | 并发 | 重试 | 超时 | 死信 |
|------|------|------|------|------|
| task.orchestrate | 10 | 3 | 5min | 是 |
| video.metadata | 5 | 2 | 30s | 是 |
| video.normalize | 3 | 2 | 5min | 是 |
| video.audio | 5 | 2 | 2min | 是 |
| video.asr | 5 | 3 | 3min | 是 |
| video.frames | 5 | 2 | 3min | 是 |
| video.ocr | 5 | 3 | 2min | 是 |
| video.shots | 5 | 2 | 3min | 是 |
| ai.* | 3 | 2 | 5min | 是 |
| risk.* | 5 | 2 | 2min | 是 |
| billing.settle | 5 | 3 | 30s | 是 |
| export.generate | 3 | 2 | 2min | 是 |
| dead_letter | 1 | 0 | — | 否 |

## 关键规则

1. 主状态只由 Orchestrator 修改，Worker 只提交步骤结果
2. 风控未完成前不发布用户可见结果
3. 结算必须幂等（`idempotency_key`）
4. 任何步骤失败 3 次进入死信队列
5. 死信队列触发告警 + 后台工单

---

*本文档为 MVP1 架构冻结版本。状态枚举以 D17 为最终权威。*
