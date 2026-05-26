"""
Prompt Registry - MVP1 P0 Prompts
Authority: D10

All prompts are versioned, schema-bound, and registered here.
Business code MUST NOT contain raw prompt text.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any


@dataclass
class PromptDefinition:
    """A registered prompt template."""
    id: str
    name: str
    version: int
    category: str
    description: str
    template: str
    variables: List[str]
    output_schema_ref: str
    model_requirements: Dict[str, Any] = field(default_factory=dict)


# =============================================================
# MVP1 P0 PROMPT REGISTRY
# =============================================================

PROMPT_REGISTRY: Dict[str, PromptDefinition] = {}


def register(prompt: PromptDefinition):
    PROMPT_REGISTRY[prompt.id] = prompt
    return prompt


# --- P01: Video Understanding ---
register(PromptDefinition(
    id="P01_VIDEO_UNDERSTANDING",
    name="视频结构化理解",
    version=1,
    category="understanding",
    description="基于多模态证据包，输出视频结构化理解结果",
    template="""你是一个专业的短视频内容分析师。请基于以下多模态证据，输出结构化的视频理解结果。

## 输入证据
- 视频元数据: {{metadata}}
- 关键帧描述: {{frame_descriptions}}
- 语音转写: {{transcript}}
- 画面文字(OCR): {{ocr_text}}
- 镜头分段: {{shots}}

## 输出要求
请严格按照 JSON Schema 输出，包含：
1. video_summary: 视频核心内容一句话总结
2. content_type: 内容类型（口播/剧情/教程/展示/混合）
3. target_audience: 目标受众
4. key_topics: 核心话题列表
5. emotional_arc: 情绪曲线
6. hook_analysis: 前3秒钩子分析
7. structure_pattern: 结构模式

## 禁止
- 不得复制原视频台词作为输出
- 不得识别或描述具体人脸特征
- 不得提取品牌商标信息用于复制""",
    variables=["metadata", "frame_descriptions", "transcript", "ocr_text", "shots"],
    output_schema_ref="video_understanding_result.json",
    model_requirements={"multimodal": True, "json_output": True},
))

# --- P02: Content DNA ---
register(PromptDefinition(
    id="P02_CONTENT_DNA",
    name="Content DNA 生成",
    version=1,
    category="analysis",
    description="从视频理解结果生成结构化 Content DNA",
    template="""你是一个短视频爆款结构分析专家。请基于视频理解结果，提取该视频的 Content DNA。

## 输入
- 视频理解结果: {{video_understanding}}
- 用户行业: {{industry}}

## Content DNA 必须包含
1. hook: 开头钩子结构（类型、时长、手法）
2. structure: 内容结构（总分总/递进/对比/故事/清单）
3. emotion_curve: 情绪曲线节点
4. pacing: 节奏模式
5. conversion_design: 转化设计（如有）
6. replicable_elements: 可学习的结构元素
7. non_replicable_elements: 不可复制的表达元素（人设/声音/场景）
8. viral_factors: 爆款因子分析

## 核心原则
- 提取"结构"而非"表达"
- 可学习的是模式，不可复制的是个人特征
- 输出必须严格符合 JSON Schema""",
    variables=["video_understanding", "industry"],
    output_schema_ref="content_dna.json",
    model_requirements={"json_output": True, "long_context": True},
))

# --- P03: Analysis Report ---
register(PromptDefinition(
    id="P03_ANALYSIS_REPORT",
    name="拆解报告生成",
    version=1,
    category="report",
    description="基于 Content DNA 生成用户可读的拆解报告",
    template="""请基于 Content DNA 生成一份用户可读的视频拆解报告。

## 输入
- Content DNA: {{content_dna}}
- 用户行业: {{industry}}
- 用户目标: {{content_goal}}

## 报告结构
1. 一句话总结
2. 爆款原因分析（3-5点）
3. 可学习结构（具体可迁移的模式）
4. 不可复制提醒（需要用户自己创造的部分）
5. 行业迁移建议
6. 风险提示

## AIGC 标识
本报告由 AI 生成，仅供参考。""",
    variables=["content_dna", "industry", "content_goal"],
    output_schema_ref="analysis_report.json",
    model_requirements={"json_output": True},
))

# --- P04: Creative IR ---
register(PromptDefinition(
    id="P04_CREATIVE_IR",
    name="Creative IR 生成",
    version=1,
    category="creative",
    description="将 Content DNA 转化为原创化中间表示",
    template="""你是一个短视频原创内容策划专家。请将 Content DNA 中的可学习结构，转化为适合用户行业、人设和产品的原创化方案。

## 输入
- Content DNA: {{content_dna}}
- 用户画像: {{creator_profile}}
- 原创化强度: {{originality_level}}（默认: high）

## 原创化规则
1. 只迁移"结构"，不迁移"表达"
2. 钩子类型可借鉴，但具体话术必须原创
3. 情绪曲线可参考，但故事必须基于用户自身
4. 转化设计可学习，但产品/服务必须是用户自己的
5. 禁止：复制台词、模仿人设、使用原视频素材

## 输出 Creative IR
包含：creative_goal, hook_strategy, story_arc, originality_constraints, industry_adaptation""",
    variables=["content_dna", "creator_profile", "originality_level"],
    output_schema_ref="creative_ir.json",
    model_requirements={"json_output": True},
))

# --- P05-P08: Deliverables ---
register(PromptDefinition(
    id="P05_ORIGINAL_SCRIPT",
    name="原创脚本生成",
    version=1,
    category="deliverable",
    description="基于 Creative IR 生成 5 条原创脚本",
    template="""请基于 Creative IR 生成 5 条完全原创的短视频脚本。

## 输入
- Creative IR: {{creative_ir}}
- 用户画像: {{creator_profile}}
- 行业: {{industry}}

## 要求
1. 每条脚本必须完全原创，不得复制参考视频的台词
2. 必须适配用户的行业、人设和产品
3. 每条脚本包含：标题、开头钩子、正文、结尾CTA、预估时长
4. 5条脚本应覆盖不同角度/风格
5. 标注 AIGC 生成标识

## 禁止
- 不得包含原视频中的具体人名、品牌名、产品名
- 不得模仿原视频的声音特征或表演风格描述""",
    variables=["creative_ir", "creator_profile", "industry"],
    output_schema_ref="script_output.json",
    model_requirements={"json_output": True, "long_output": True},
))

register(PromptDefinition(
    id="P06_TITLE_GENERATION",
    name="标题生成",
    version=1,
    category="deliverable",
    description="生成 10 个原创标题",
    template="""请基于 Creative IR 和脚本，生成 10 个短视频标题。

## 输入
- Creative IR: {{creative_ir}}
- 脚本摘要: {{script_summary}}
- 用户行业: {{industry}}

## 要求
- 10 个标题，覆盖不同风格（悬念/数字/痛点/好奇/对比）
- 适配用户行业和目标受众
- 不超过 30 字
- 不得复制原视频标题""",
    variables=["creative_ir", "script_summary", "industry"],
    output_schema_ref="title_output.json",
    model_requirements={"json_output": True},
))

register(PromptDefinition(
    id="P07_COVER_SUGGESTION",
    name="封面建议生成",
    version=1,
    category="deliverable",
    description="生成 3 个封面建议",
    template="""请基于脚本和标题，生成 3 个短视频封面建议。

## 输入
- 脚本: {{script_summary}}
- 标题: {{titles}}
- 用户行业: {{industry}}

## 要求
- 3 个封面方案，每个包含：构图建议、文字内容、色彩方向、风格参考
- 不得建议使用原视频的画面或人物形象""",
    variables=["script_summary", "titles", "industry"],
    output_schema_ref="cover_suggestion.json",
    model_requirements={"json_output": True},
))

register(PromptDefinition(
    id="P08_VIDEO_PROMPT_BLUEPRINT",
    name="视频生成 Prompt",
    version=1,
    category="deliverable",
    description="生成 3 个视频生成 Prompt 蓝图",
    template="""请基于脚本和 Creative IR，生成 3 个可用于视频生成工具的 Prompt 蓝图。

## 输入
- Creative IR: {{creative_ir}}
- 脚本: {{script_summary}}

## 要求
- 3 个 Prompt，适配不同视频生成工具（通用/Runway/可灵）
- 包含：场景描述、镜头运动、风格、时长建议
- 不得描述具体真人面孔或模仿特定人物""",
    variables=["creative_ir", "script_summary"],
    output_schema_ref="video_prompt_output.json",
    model_requirements={"json_output": True},
))

# --- P09-P10: Quality & Risk ---
register(PromptDefinition(
    id="P09_QUALITY_CHECK",
    name="质量评分",
    version=1,
    category="quality",
    description="对生成输出进行质量评分",
    template="""请对以下 AI 生成的内容进行质量评分。

## 输入
- 脚本: {{scripts}}
- 标题: {{titles}}
- 行业: {{industry}}

## 评分维度（每项 0-100）
1. 结构完整性
2. 行业适配度
3. 创意新颖度
4. 可执行性
5. 语言流畅度

## 输出
overall_score + 各维度分数 + 改进建议""",
    variables=["scripts", "titles", "industry"],
    output_schema_ref="quality_check_result.json",
    model_requirements={"json_output": True},
))

register(PromptDefinition(
    id="P10_RISK_CHECK",
    name="风险评估",
    version=1,
    category="risk",
    description="对生成输出进行合规风险评估",
    template="""请对以下 AI 生成的内容进行合规风险评估。

## 输入
- 生成内容: {{deliverables}}
- 原视频摘要: {{source_summary}}

## 风险检查项
1. 与原视频的相似度（台词/结构/创意）
2. 是否包含敏感内容（暴力/色情/歧视/虚假宣传）
3. 是否涉及品牌侵权
4. 是否涉及人物肖像模仿
5. 是否符合 AIGC 标识要求

## 风险等级
R0_PASS / R1_WARN / R2_AUTO_REWRITE / R3_MANUAL_REVIEW / R4_BLOCK

## 输出
risk_level + 各项检查结果 + 建议""",
    variables=["deliverables", "source_summary"],
    output_schema_ref="risk_check_result.json",
    model_requirements={"json_output": True},
))


def get_prompt(prompt_id: str) -> Optional[PromptDefinition]:
    """Get a registered prompt by ID."""
    return PROMPT_REGISTRY.get(prompt_id)


def list_prompts() -> List[PromptDefinition]:
    """List all registered prompts."""
    return list(PROMPT_REGISTRY.values())


def render_prompt(prompt_id: str, variables: Dict[str, str]) -> str:
    """Render a prompt template with variables."""
    prompt = get_prompt(prompt_id)
    if not prompt:
        raise ValueError(f"Prompt not found: {prompt_id}")
    
    rendered = prompt.template
    for key, value in variables.items():
        rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
    
    return rendered
