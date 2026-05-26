# 数据库 Schema 最终计划

> 权威文档：D16  
> 数据库：PostgreSQL 15+  
> ORM：Prisma  
> 日期：2026-05-26

---

## 技术约定

| 项 | 约定 |
|------|------|
| 主键 | UUID v7（ULID 兼容），DB 类型 `uuid` |
| JSON | `jsonb`，绑定 `schema_version` 字段 |
| 时间 | UTC `timestamptz` |
| 金额 | 整数最小单位（`credits`、`cost_micro_usd`） |
| 软删除 | `deleted_at timestamptz` |
| 审计字段 | `created_at`、`updated_at`、`created_by`、`updated_by`、`trace_id` |
| 幂等 | `idempotency_key` 唯一约束 |
| 多租户 | `organization_id` 预留 |
| Mock 标记 | `is_mock boolean default false` |

## P0 表清单（按数据域）

| 域 | 表 | 说明 |
|----|-----|------|
| 账号 | `users`, `organizations`, `organization_members` | 用户身份与组织 |
| 画像 | `creator_profiles` | 行业/人设/产品/目标用户 |
| 合规 | `user_consents` | 授权确认记录 |
| 资产 | `assets`, `video_input_sources` | 文件资产与视频来源 |
| 任务 | `video_analysis_tasks`, `task_step_logs`, `task_events` | 异步任务主表 |
| 视频处理 | `video_processing_results`, `frame_assets`, `transcript_segments`, `ocr_segments`, `shot_segments`, `multimodal_evidence_packs` | 视频处理证据 |
| AI 资产 | `content_dnas`, `creative_irs`, `deliverable_packs`, `generated_outputs` | AI 生成资产 |
| Prompt | `prompt_templates`, `prompt_versions`, `prompt_runs` | Prompt 管理 |
| 模型 | `model_providers`, `model_catalog`, `model_call_logs`, `cost_ledger_entries` | 模型调用与成本 |
| 风控 | `quality_check_reports`, `similarity_check_reports`, `compliance_check_reports`, `risk_check_reports`, `risk_decisions` | 风控质检 |
| 计费 | `credit_accounts`, `credit_holds`, `credit_transactions`, `orders` | 积分与订单 |
| 导出 | `export_jobs`, `user_feedback` | 导出与反馈 |
| 运营 | `manual_review_tickets`, `complaint_cases` | 人工复核与投诉 |
| 系统 | `audit_logs`, `admin_action_logs`, `feature_flags`, `system_configs` | 审计与配置 |

## 迁移策略

```text
migrations/
├── 0001_init_core.sql          # users, orgs, profiles, consents, assets
├── 0002_task_system.sql        # tasks, steps, events
├── 0003_video_processing.sql   # video results, frames, ASR, OCR, shots
├── 0004_ai_assets.sql          # content_dna, creative_ir, deliverables
├── 0005_prompt_model.sql       # prompts, models, call logs, costs
├── 0006_risk_control.sql       # quality, similarity, compliance, decisions
├── 0007_billing.sql            # credits, holds, transactions, orders
├── 0008_export_feedback.sql    # exports, feedback
├── 0009_admin_ops.sql          # reviews, complaints, audit, flags
└── 0010_indexes_constraints.sql # 索引、唯一约束、外键
```

---

*字段细节以 D16 为最终权威。本文件为实施计划。*
