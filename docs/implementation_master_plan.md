# 执行总计划（Implementation Master Plan）

> 版本：V1.0  
> 更新时间：2026-05-26  
> 维护人：Manus Agent（AIcoding 总控）  
> 目标：从当前仓库状态（文档已就绪）推进到 MVP1 商业级上线  
> 当前主线：MVP1 — 视频拆解 + 原创脚本生成

---

## 1. 总体路线概览

```text
Phase 0: 文档理解与规划（当前阶段）
    ↓
Phase 1: 基础工程框架（M00）
    ↓
Phase 2: 用户认证 + 画像（M01 + M02）
    ↓
Phase 3: 合规授权 + 积分基础（M03 + M05）
    ↓
Phase 4: 视频上传与资产管理（M04）
    ↓
Phase 5: 异步任务编排（M06）
    ↓
Phase 6: Prompt/模型调用封装（M10）
    ↓
Phase 7: 视频处理管线（M07）
    ↓
Phase 8: 多模态理解与 Content DNA（M08）
    ↓
Phase 9: Creative IR 与原创化输出（M09）
    ↓
Phase 10: 风控质检（M11）
    ↓
Phase 11: 报告导出与历史（M12）
    ↓
Phase 12: 运营后台与人工复核（M13）
    ↓
Phase 13: 测试、监控、部署（M14）
    ↓
Phase 14: 端到端验收与 D24 交接
```

---

## 2. 分阶段详细计划

### Phase 0：文档理解与执行规划

| 项目 | 内容 |
|------|------|
| 目标 | 读取全部文档、建立索引、确认执行模式、识别风险和开放问题 |
| 输入文档 | D00-D24、原始方案文档 |
| 输出物 | document_index.md、implementation_master_plan.md、contract_authority_map.md、risk_register.md、open_questions.md、agent_work_log.md |
| PR 名称 | `Phase 0 - Documentation Index Master Plan Risk Register` |
| 测试要求 | 文档完整性检查通过 |
| 验收门槛 | 所有文档已读取、编号冲突已记录、执行路线已确认 |
| 状态 | **进行中** |

---

### Phase 1：基础工程框架（M00）

| 项目 | 内容 |
|------|------|
| 目标 | 建立项目骨架、配置体系、错误码、日志、Feature Flag、测试框架、健康检查 |
| 输入文档 | D00、D05（M00）、D15、D16、D17、D20、D23 |
| 输出物 | 项目目录结构、FastAPI 应用骨架、配置管理、数据库连接、Redis 连接、日志框架、错误码体系、Feature Flag、健康检查 API、pytest 框架、Docker 开发环境 |
| PR 名称 | `Phase 1 - M00 Base Engineering Framework` |
| 测试要求 | 应用可启动、健康检查通过、测试框架可运行、数据库可连接 |
| 验收门槛 | `make dev` 可启动、`make test` 通过、`/health` 返回 200、环境变量无硬编码密钥 |

---

### Phase 2：用户认证 + 画像（M01 + M02）

| 项目 | 内容 |
|------|------|
| 目标 | 注册、登录、Session、用户状态、CreatorProfile CRUD |
| 输入文档 | D02、D04、D05（M01/M02）、D06、D16、D18 |
| 输出物 | User 表、CreatorProfile 表、Auth API、Profile API、前端登录/画像页面 |
| PR 名称 | `Phase 2 - M01 Auth + M02 Creator Profile` |
| 测试要求 | 注册/登录/退出流程测试、画像 CRUD 测试、权限隔离测试 |
| 验收门槛 | 用户可注册登录、画像可保存并被后续模块调用、密码加密存储 |

---

### Phase 3：合规授权 + 积分基础（M03 + M05）

| 项目 | 内容 |
|------|------|
| 目标 | 素材授权确认、意图预检、AIGC 标识提示、积分账户、免费额度、冻结/扣费/返还 |
| 输入文档 | D05（M03/M05）、D19、D21、D16、D17 |
| 输出物 | ConsentRecord 表、CreditAccount 表、CreditTransaction 表、授权 API、积分 API |
| PR 名称 | `Phase 3 - M03 Compliance Consent + M05 Credit System` |
| 测试要求 | 授权流程测试、积分冻结/扣费/返还幂等测试、并发安全测试 |
| 验收门槛 | 无授权不可创建任务、积分在重试和并发下幂等、免费额度可发放 |

---

### Phase 4：视频上传与资产管理（M04）

| 项目 | 内容 |
|------|------|
| 目标 | 本地视频上传、格式/大小/时长校验、安全扫描、对象存储、资产生命周期 |
| 输入文档 | D05（M04）、D08、D16、D17、D18、D21 |
| 输出物 | UploadedAsset 表、Upload API、对象存储集成、文件校验逻辑 |
| PR 名称 | `Phase 4 - M04 Video Upload and Asset Management` |
| 测试要求 | 上传成功/失败测试、格式校验测试、大小限制测试、存储可达测试 |
| 验收门槛 | 视频可上传到对象存储、非法文件被拒绝、asset_id 可被后续模块引用 |

---

### Phase 5：异步任务编排（M06）

| 项目 | 内容 |
|------|------|
| 目标 | VideoAnalysisTask 状态机、TaskStepLog、重试、取消、失败补偿、进度展示 |
| 输入文档 | D05（M06）、D17、D16、D19 |
| 输出物 | GenerationTask 表、TaskStepLog 表、Celery/队列配置、状态机实现、任务 API |
| PR 名称 | `Phase 5 - M06 Async Task Orchestration` |
| 测试要求 | 状态流转测试、重试测试、取消测试、超时测试、并发测试 |
| 验收门槛 | 任务可创建/执行/完成/失败/取消、状态可查询、失败触发积分返还 |

---

### Phase 6：Prompt/模型调用封装（M10）

| 项目 | 内容 |
|------|------|
| 目标 | Prompt 版本管理、模型调用适配器、Schema 校验、JSON 修复、重试降级、ModelCallLog |
| 输入文档 | D05（M10）、D10、D11、D16 |
| 输出物 | PromptAsset 表、ModelCallLog 表、模型适配器、Prompt Registry、调用封装 |
| PR 名称 | `Phase 6 - M10 Prompt Model Call Infrastructure` |
| 测试要求 | Prompt 版本管理测试、模型调用测试、降级测试、成本记录测试 |
| 验收门槛 | Prompt 可注册/版本化、模型可调用/降级、成本可记录、输出可 Schema 校验 |

---

### Phase 7：视频处理管线（M07）

| 项目 | 内容 |
|------|------|
| 目标 | 元数据解析、关键帧抽取、ASR、OCR、镜头切分 |
| 输入文档 | D05（M07）、D08、D16、D17 |
| 输出物 | 视频处理 Worker、FFmpeg 集成、ASR/OCR 适配器、处理结果存储 |
| PR 名称 | `Phase 7 - M07 Video Processing Pipeline` |
| 测试要求 | 常见格式处理测试、ASR 准确率测试、OCR 准确率测试、失败重试测试 |
| 验收门槛 | 80% 常见视频（≤3min, ≤200MB）可成功处理、处理结果可被 M08 消费 |

---

### Phase 8：多模态理解与 Content DNA（M08）

| 项目 | 内容 |
|------|------|
| 目标 | 基于视频处理结果生成结构化 ContentDNA、ShotDNA、爆款因子、风险旗标 |
| 输入文档 | D05（M08）、D07、D10、D14、D16 |
| 输出物 | ContentDNA 表、ShotDNA 表、VideoAnalysisReport 表、理解 Prompt、报告生成逻辑 |
| PR 名称 | `Phase 8 - M08 Multimodal Understanding and Content DNA` |
| 测试要求 | Schema 合法率测试、Benchmark 样本测试、输出稳定性测试 |
| 验收门槛 | JSON Schema 合法率 ≥ 95%、报告字段完整、可被 M09 消费 |

---

### Phase 9：Creative IR 与原创化输出（M09）

| 项目 | 内容 |
|------|------|
| 目标 | ContentDNA → CreativeIR → 5 条原创脚本 + 10 个标题 + 3 个封面建议 + 3 条视频 Prompt |
| 输入文档 | D05（M09）、D09、D10、D12、D13 |
| 输出物 | CreativeIR 表、脚本生成 Prompt、标题/封面/视频 Prompt 生成逻辑 |
| PR 名称 | `Phase 9 - M09 Creative IR and Original Content Generation` |
| 测试要求 | 原创度测试、脚本可用率测试、与原视频相似度测试 |
| 验收门槛 | 脚本主观可用率 ≥ 60%、与原视频明显区别、输出格式稳定 |

---

### Phase 10：风控质检（M11）

| 项目 | 内容 |
|------|------|
| 目标 | 质量评分、原创度/相似度检测、合规风险分级、拦截/重写/人工复核 |
| 输入文档 | D05（M11）、D13、D12、D21、D16 |
| 输出物 | QualityCheckReport 表、RiskCheckReport 表、风控 Worker、拦截逻辑 |
| PR 名称 | `Phase 10 - M11 Quality Check and Risk Control` |
| 测试要求 | 高风险样本拦截测试、质量评分稳定性测试、误拦截率测试 |
| 验收门槛 | 高风险意图拦截准确率 ≥ 90%、低质输出可标记、风险报告可生成 |

---

### Phase 11：报告导出与历史（M12）

| 项目 | 内容 |
|------|------|
| 目标 | 报告聚合展示、Markdown/HTML 导出、生成历史、用户反馈 |
| 输入文档 | D05（M12）、D06、D16、D17 |
| 输出物 | 报告展示页面、导出 API、历史列表、反馈入口 |
| PR 名称 | `Phase 11 - M12 Report Export History Feedback` |
| 测试要求 | 报告完整性测试、导出格式测试、历史查询测试 |
| 验收门槛 | 报告可展示/导出、历史可查询、反馈可提交 |

---

### Phase 12：运营后台与人工复核（M13）

| 项目 | 内容 |
|------|------|
| 目标 | 最小运营后台：用户查询、任务查询、成本统计、风险查看、积分补偿、人工复核 |
| 输入文档 | D05（M13）、D22、D19、D21、D16 |
| 输出物 | 后台页面、Admin API、复核工单、补偿逻辑 |
| PR 名称 | `Phase 12 - M13 Operations Admin and Manual Review` |
| 测试要求 | 后台权限测试、补偿幂等测试、复核流程测试 |
| 验收门槛 | 运营可查看核心数据、可补偿积分、可处理复核工单 |

---

### Phase 13：测试、监控、部署（M14）

| 项目 | 内容 |
|------|------|
| 目标 | 集成测试、E2E 测试、监控指标、告警规则、部署流程、健康检查 |
| 输入文档 | D05（M14）、D20、D15、D17 |
| 输出物 | CI/CD 完整流水线、监控 Dashboard、告警规则、部署脚本、E2E 测试套件 |
| PR 名称 | `Phase 13 - M14 Testing Monitoring Deployment` |
| 测试要求 | E2E 主流程测试、监控指标验证、告警触发验证 |
| 验收门槛 | 主流程 100 条测试成功率 ≥ 80%、监控可观测、告警可触发 |

---

### Phase 14：端到端验收与 D24 交接

| 项目 | 内容 |
|------|------|
| 目标 | 按 D24 最终验收门禁完成全部验收、生成证据包、上线决策 |
| 输入文档 | D24、D20、D00 |
| 输出物 | 验收证据包、已知问题清单、上线决策文档、交接资产清单 |
| PR 名称 | `Phase 14 - Final Acceptance and Handoff` |
| 测试要求 | D24 G0-G10 全部门禁通过 |
| 验收门槛 | 所有 P0 功能可用、风控可拦截、计费可结算、后台可运营、监控可观测 |

---

## 3. MVP1 出口条件（来自 D03）

| # | 条件 | 验证方式 |
|---|------|----------|
| 1 | 主流程连续 100 条测试任务成功率 ≥ 80% | E2E 自动化测试 |
| 2 | AI 输出 JSON Schema 合法率 ≥ 95% | Schema 校验测试 |
| 3 | 高风险意图样本拦截准确率 ≥ 90% | 风控 Benchmark |
| 4 | 积分冻结/扣费/返还在重试和并发下幂等 | 并发压力测试 |
| 5 | 后台能追踪每个任务的成本、失败、风险和积分 | 后台功能验证 |
| 6 | 至少 30 个真实样本完成内测反馈 | 内测数据统计 |
| 7 | 脚本主观可用率 ≥ 60% | 人工评估 |
| 8 | 不做事项没有被页面/API/Prompt/后端绕过 | 安全审计 |
| 9 | D04-D17 的 MVP1 工程契约已补齐 | 文档完整性检查 |

---

## 4. 时间估算（参考）

| 阶段 | 预估工作量 | 累计 |
|------|-----------|------|
| Phase 0 | 1 天 | 1 天 |
| Phase 1 | 2-3 天 | 4 天 |
| Phase 2 | 2-3 天 | 7 天 |
| Phase 3 | 2-3 天 | 10 天 |
| Phase 4 | 2 天 | 12 天 |
| Phase 5 | 3-4 天 | 16 天 |
| Phase 6 | 3-4 天 | 20 天 |
| Phase 7 | 3-5 天 | 25 天 |
| Phase 8 | 4-5 天 | 30 天 |
| Phase 9 | 4-5 天 | 35 天 |
| Phase 10 | 3-4 天 | 39 天 |
| Phase 11 | 2-3 天 | 42 天 |
| Phase 12 | 3-4 天 | 46 天 |
| Phase 13 | 3-5 天 | 51 天 |
| Phase 14 | 2-3 天 | 54 天 |

> 以上为 AIcoding Agent 连续执行的乐观估算。实际取决于 Owner 审批 PR 速度、外部依赖（模型 API、对象存储、支付渠道）就绪情况和需求变更。

---

## 5. 关键约束

1. **不得自行扩大 MVP1 范围**：每个 Phase 严格按 D03/D05 定义的 P0 范围执行。
2. **不得跳过风控/日志/成本/测试**：每个 Phase 必须包含对应的风控、日志、成本记录和测试。
3. **不得直接修改 main**：所有变更通过 feature branch → PR → Review → Merge。
4. **不得写死密钥**：所有密钥通过环境变量或 GitHub Secrets 管理。
5. **不得用 mock 冒充真实能力**：必须 mock 时显式标记 `is_mock=true`，生产默认关闭。

---

*本文档由 Manus Agent 自动生成，作为 Phase 0 文档理解阶段的核心输出。*
