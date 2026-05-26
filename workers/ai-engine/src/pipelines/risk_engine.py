"""
Risk & Quality Engine
Authority: D13, D21

Checks:
1. Quality scoring
2. Originality scoring
3. Similarity risk
4. Compliance risk
5. Final decision: PASS / WARN / REWRITE / MANUAL_REVIEW / BLOCK
"""

from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum


class RiskLevel(Enum):
    R0_PASS = "R0_PASS"
    R1_WARN = "R1_WARN"
    R2_AUTO_REWRITE = "R2_AUTO_REWRITE"
    R3_MANUAL_REVIEW = "R3_MANUAL_REVIEW"
    R4_BLOCK = "R4_BLOCK"
    R5_BLOCK_SANCTION = "R5_BLOCK_SANCTION"


@dataclass
class QualityCheckResult:
    overall_score: float  # 0-100
    structure_score: float
    industry_fit_score: float
    creativity_score: float
    executability_score: float
    language_score: float
    passed: bool
    suggestions: List[str] = field(default_factory=list)


@dataclass
class RiskCheckResult:
    risk_level: RiskLevel
    similarity_score: float  # 0-1, higher = more similar = more risky
    compliance_issues: List[str] = field(default_factory=list)
    brand_risk: bool = False
    portrait_risk: bool = False
    sensitive_content: bool = False
    aigc_labeled: bool = True
    explanation: str = ""


@dataclass
class RiskDecision:
    """Final risk decision per D21."""
    risk_level: RiskLevel
    action: str  # allow, warn, rewrite, manual_review, block
    can_export: bool
    can_display: bool
    reasons: List[str] = field(default_factory=list)
    requires_human_review: bool = False


def check_quality(deliverables: dict, industry: str) -> QualityCheckResult:
    """
    Quality check on generated deliverables.
    TODO: Replace with AI-based quality scoring (P09_QUALITY_CHECK prompt).
    """
    # Basic heuristic checks
    scripts = deliverables.get("scripts", [])
    titles = deliverables.get("titles", [])
    
    has_scripts = len(scripts) >= 5
    has_titles = len(titles) >= 10
    
    # Placeholder scoring
    score = 70.0
    if has_scripts:
        score += 10
    if has_titles:
        score += 10
    
    return QualityCheckResult(
        overall_score=min(score, 100),
        structure_score=75.0,
        industry_fit_score=70.0,
        creativity_score=65.0,
        executability_score=80.0,
        language_score=85.0,
        passed=score >= 60,
        suggestions=["Consider adding more industry-specific examples"] if score < 80 else [],
    )


def check_risk(
    deliverables: dict,
    source_summary: Optional[str] = None,
    similarity_threshold: float = 0.7,
) -> RiskCheckResult:
    """
    Risk check on generated deliverables.
    Per D21: High risk MUST NOT be exported.
    
    TODO: Replace with AI-based risk assessment (P10_RISK_CHECK prompt).
    """
    issues = []
    risk_level = RiskLevel.R0_PASS
    similarity = 0.0
    
    # Check for prohibited content patterns
    all_text = str(deliverables).lower()
    
    # Check for face/voice imitation instructions
    prohibited_patterns = [
        "模仿", "复制", "克隆", "搬运", "仿脸", "仿声",
        "同款", "一模一样", "照搬", "抄袭",
    ]
    for pattern in prohibited_patterns:
        if pattern in all_text:
            issues.append(f"Prohibited pattern detected: {pattern}")
            risk_level = RiskLevel.R4_BLOCK
    
    # Check AIGC labeling
    aigc_labeled = True  # Default: always label
    
    # Determine final risk level
    if issues and risk_level == RiskLevel.R0_PASS:
        risk_level = RiskLevel.R1_WARN
    
    return RiskCheckResult(
        risk_level=risk_level,
        similarity_score=similarity,
        compliance_issues=issues,
        aigc_labeled=aigc_labeled,
        explanation="Automated risk check completed",
    )


def make_risk_decision(
    quality: QualityCheckResult,
    risk: RiskCheckResult,
) -> RiskDecision:
    """
    Final risk decision combining quality and risk checks.
    Per D21: Risk decision determines export eligibility.
    """
    # Quality too low
    if not quality.passed:
        return RiskDecision(
            risk_level=RiskLevel.R1_WARN,
            action="warn",
            can_export=True,  # Low quality can still export with warning
            can_display=True,
            reasons=["Quality below threshold"],
        )
    
    # Risk blocked
    if risk.risk_level in (RiskLevel.R4_BLOCK, RiskLevel.R5_BLOCK_SANCTION):
        return RiskDecision(
            risk_level=risk.risk_level,
            action="block",
            can_export=False,  # BLOCKED: Cannot export
            can_display=False,
            reasons=risk.compliance_issues,
        )
    
    # Manual review needed
    if risk.risk_level == RiskLevel.R3_MANUAL_REVIEW:
        return RiskDecision(
            risk_level=risk.risk_level,
            action="manual_review",
            can_export=False,  # Pending review: Cannot export yet
            can_display=False,
            reasons=risk.compliance_issues,
            requires_human_review=True,
        )
    
    # Warn but allow
    if risk.risk_level == RiskLevel.R1_WARN:
        return RiskDecision(
            risk_level=risk.risk_level,
            action="warn",
            can_export=True,
            can_display=True,
            reasons=risk.compliance_issues,
        )
    
    # Pass
    return RiskDecision(
        risk_level=RiskLevel.R0_PASS,
        action="allow",
        can_export=True,
        can_display=True,
        reasons=[],
    )
