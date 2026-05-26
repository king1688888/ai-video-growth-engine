# 模块边界最终方案（Module Boundary Final）

> 权威文档：D05（模块拆分）  
> 日期：2026-05-26

---

## 模块总表

| 模块 | 包名 | 服务 | 职责 | 通信方式 |
|------|------|------|------|----------|
| M00 | `@app/core` | NestJS | 项目骨架、配置、错误码、日志、Feature Flag、健康检查 | 内部导入 |
| M01 | `@app/auth` | NestJS | 注册、登录、JWT、Session、RBAC | API |
| M02 | `@app/profile` | NestJS | CreatorProfile CRUD、行业配置 | API |
| M03 | `@app/consent` | NestJS | 授权确认、意图预检、AIGC 标识提示 | API + 队列事件 |
| M04 | `@app/asset` | NestJS | 视频上传、Signed URL、格式校验、资产生命周期 | API + S3 |
| M05 | `@app/billing` | NestJS | 积分账户、冻结、扣费、返还、订单、成本统计 | API + 队列 |
| M06 | `@app/task` | NestJS + Worker | 任务编排、DAG、状态机、步骤派发、重试、补偿 | 队列 + DB |
| M07 | `@worker/video` | Python Worker | FFmpeg、元数据、抽帧、音频、ASR、OCR、镜头切分 | 队列 + S3 + HTTP 回调 |
| M08 | `@worker/ai` | Python Worker | 多模态理解、Content DNA、报告生成 | 队列 + Prompt Registry |
| M09 | `@worker/ai` | Python Worker | Creative IR、原创脚本、标题、封面、视频 Prompt | 队列 + Prompt Registry |
| M10 | `@app/prompt` | NestJS + Python | Prompt Registry、Model Router、Provider Adapter、ModelCallLog | API + 队列 |
| M11 | `@app/risk` | NestJS + Worker | 质检评分、相似度、合规风控、风险决策 | 队列 |
| M12 | `@app/report` | NestJS | 报告聚合、导出、历史、反馈 | API |
| M13 | `@app/admin` | NestJS | 运营后台、人工复核、补偿、投诉 | API |
| M14 | `@app/infra` | DevOps | 测试、监控、CI/CD、部署、告警 | 基础设施 |

## 模块间通信规则

| 允许 | 禁止 |
|------|------|
| 同步 API 调用（通过 NestJS 模块注入） | 直接写其他模块私有表 |
| 异步队列事件 | 前端持有永久对象存储凭证 |
| 数据库引用 ID（外键） | Prompt 模块直接扣费 |
| 对象存储引用（asset_id → signed URL） | 视频处理模块生成脚本 |
| 日志和审计事件 | 风控模块被前端绕过 |
| Feature Flag 查询 | 后台无审计改积分 |

## 模块依赖图

```text
M00 (Core)
 ├── M01 (Auth) ← M02, M03, M04, M05, M06, M12, M13
 ├── M02 (Profile) ← M08, M09
 ├── M03 (Consent) ← M06
 ├── M04 (Asset) ← M06, M07
 ├── M05 (Billing) ← M06, M10
 ├── M06 (Task) ← M07, M08, M09, M10, M11, M12
 ├── M07 (Video Worker) ← M08
 ├── M08 (Content DNA) ← M09
 ├── M09 (Creative IR) ← M11
 ├── M10 (Prompt/Model) ← M08, M09, M11
 ├── M11 (Risk) ← M06
 ├── M12 (Report) ← M06
 └── M13 (Admin) ← M05, M06, M11
```

---

*本文档为 MVP1 架构冻结版本。*
