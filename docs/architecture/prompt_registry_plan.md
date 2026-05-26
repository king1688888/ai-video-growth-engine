# Prompt Registry 计划

> 权威文档：D10  
> 日期：2026-05-26

---

## 核心原则

业务代码不直接拼接 Prompt 文本。所有 Prompt 通过 Registry 管理，支持版本化、变量注入、Schema 校验、A/B 测试和回滚。

## 数据模型

| 表 | 说明 |
|----|------|
| `prompt_templates` | Prompt 模板定义（ID、名称、类型、输入变量规格、输出 Schema） |
| `prompt_versions` | 版本化 Prompt 内容（version、template_text、status: draft/active/deprecated） |
| `prompt_runs` | 每次 Prompt 执行记录（输入、输出、模型、耗时、成本、质量评分） |

## MVP1 P0 Prompt 族谱

| ID | 名称 | 用途 | 输出 Schema |
|----|------|------|-------------|
| P01 | video_understanding | 视频结构化理解 | VideoUnderstandingResult |
| P02 | content_dna_generation | Content DNA 生成 | ContentDNA |
| P03 | analysis_report | 拆解报告生成 | AnalysisReport |
| P04 | creative_ir_generation | Creative IR 生成 | CreativeIR |
| P05 | script_generation | 原创脚本生成（5条） | ScriptOutput[] |
| P06 | title_generation | 标题生成（10条） | TitleOutput[] |
| P07 | cover_suggestion | 封面建议生成（3条） | CoverSuggestion[] |
| P08 | video_prompt_generation | 视频 Prompt 生成（3条） | VideoPromptOutput[] |
| P09 | quality_check | 质量评分 | QualityCheckResult |
| P10 | risk_assessment | 风险评估 | RiskAssessmentResult |

## 变量注入

每个 Prompt 模板声明所需变量：
- `{{creator_profile}}` — 用户画像
- `{{evidence_pack}}` — 多模态证据包
- `{{content_dna}}` — Content DNA（下游 Prompt）
- `{{creative_ir}}` — Creative IR（下游 Prompt）
- `{{industry_config}}` — 行业配置
- `{{risk_constraints}}` — 风控约束

## 版本管理

```text
draft → active → deprecated
         ↑
    new version
```

- 同一模板同时只有一个 `active` 版本
- 发布新版本前必须通过 Benchmark 测试
- 可回滚到上一个 `active` 版本

---

*本文档为 MVP1 架构冻结版本。Prompt 内容细节以 D10 为权威。*
