# 数据流最终方案（Data Flow Final）

> 权威文档：D15/D16/D17  
> 日期：2026-05-26

---

## MVP1 主数据流

```text
[用户] → 注册/登录 → JWT Token
  → 创建 CreatorProfile（行业/人设/产品/目标用户）
  → 上传视频（Signed URL → S3/R2）
  → 授权确认（ConsentRecord）
  → 积分报价 + 冻结（CreditHold）
  → 创建 VideoAnalysisTask

[Orchestrator Worker]
  → 派发 DAG 步骤到各队列

[Python Video Worker]
  → video.metadata: 解析元数据 → VideoProcessingResult
  → video.normalize: 转码/代理文件 → ProxyVideo
  → video.audio: 提取音频 → AudioAsset
  → video.asr: ASR 转写 → TranscriptSegments
  → video.frames: 抽帧 → FrameAssets
  → video.ocr: OCR → OCRSegments
  → video.shots: 镜头切分 → ShotSegments

[Python AI Worker]
  → ai.evidence_pack: 构建证据包 → MultimodalEvidencePack
  → ai.video_understanding: 视频理解 → VideoUnderstandingResult
  → ai.content_dna: 生成 Content DNA → ContentDNA + ShotDNA
  → ai.creative_ir: 生成 Creative IR → CreativeIR
  → ai.deliverables: 生成输出包 → DeliverablePack
      (5 脚本 + 10 标题 + 3 封面建议 + 3 视频 Prompt)

[Risk Worker]
  → risk.quality: 质量评分 → QualityCheckReport
  → risk.similarity: 相似度检测 → SimilarityCheckReport
  → risk.compliance: 合规检查 → ComplianceCheckReport
  → risk.decision: 风险决策 → RiskDecision
      (PASS / WARN / REWRITE / MANUAL_REVIEW / BLOCK)

[Billing Worker]
  → billing.settle: 成功扣费 / 失败返还 / 部分结算

[用户可见结果]
  → 拆解报告 + 原创脚本 + 标题 + 封面建议 + 视频 Prompt
  → 导出 Markdown/HTML
  → 历史记录
```

## 关键数据对象流转

| 阶段 | 输入 | 输出 | 存储 |
|------|------|------|------|
| 上传 | 视频文件 | Asset(S3 URL) | S3 + DB |
| 视频处理 | Asset | 帧/音频/ASR/OCR/镜头 | S3 + DB |
| 证据包 | 处理结果 | EvidencePack(JSONB) | DB |
| AI 理解 | EvidencePack | ContentDNA(JSONB) | DB |
| 原创化 | ContentDNA + Profile | CreativeIR + Deliverables | DB |
| 风控 | 全部输出 | RiskReports + Decision | DB |
| 结算 | 任务状态 + 成本 | CreditTransaction | DB |
| 导出 | Report + Deliverables | ExportFile(S3) | S3 + DB |

## Prompt 调用数据流

```text
AI Worker 需要调用模型时：
  → 查询 Prompt Registry（获取 PromptVersion）
  → 渲染 Prompt（注入变量：Profile、Evidence、Config）
  → 请求 Model Router（获取 Provider + 成本预估）
  → Provider Adapter 调用模型 API
  → 接收响应 → Schema 校验 → JSON 修复（如需）
  → 记录 ModelCallLog + CostLedgerEntry
  → 返回结构化结果
```

---

*本文档为 MVP1 架构冻结版本。*
