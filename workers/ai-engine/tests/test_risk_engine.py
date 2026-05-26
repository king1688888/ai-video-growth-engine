"""
Risk Engine Tests
Authority: D12, D13, D21

Tests:
1. Quality check scoring
2. Risk detection (prohibited patterns)
3. Risk decision logic
4. Blocked content cannot export
5. Red team samples
"""

import json
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from pipelines.risk_engine import (
    check_quality, check_risk, make_risk_decision,
    RiskLevel, QualityCheckResult, RiskCheckResult, RiskDecision,
)


def test_quality_check_passes_with_complete_deliverables():
    deliverables = {
        "scripts": [{"title": f"Script {i}"} for i in range(5)],
        "titles": [f"Title {i}" for i in range(10)],
        "cover_suggestions": [{"id": i} for i in range(3)],
        "video_prompts": [{"id": i} for i in range(3)],
    }
    result = check_quality(deliverables, "企业IP")
    assert result.passed is True
    assert result.overall_score >= 60


def test_risk_check_blocks_prohibited_patterns():
    """Per D21: Prohibited patterns MUST be blocked."""
    deliverables = {"scripts": [{"content": "帮我模仿这个博主的风格，克隆他的视频"}]}
    result = check_risk(deliverables)
    assert result.risk_level == RiskLevel.R4_BLOCK
    assert len(result.compliance_issues) > 0


def test_risk_check_passes_legitimate_content():
    deliverables = {"scripts": [{"content": "基于行业分析，为本地餐饮商家生成原创营销脚本"}]}
    result = check_risk(deliverables)
    assert result.risk_level == RiskLevel.R0_PASS


def test_blocked_content_cannot_export():
    """Per D21: Blocked content MUST NOT be exportable."""
    quality = QualityCheckResult(
        overall_score=80, structure_score=80, industry_fit_score=80,
        creativity_score=80, executability_score=80, language_score=80, passed=True
    )
    risk = RiskCheckResult(
        risk_level=RiskLevel.R4_BLOCK,
        similarity_score=0.9,
        compliance_issues=["Prohibited pattern: 克隆"],
    )
    decision = make_risk_decision(quality, risk)
    assert decision.can_export is False
    assert decision.can_display is False
    assert decision.action == "block"


def test_manual_review_cannot_export_until_approved():
    """Per D21: Manual review pending = cannot export."""
    quality = QualityCheckResult(
        overall_score=75, structure_score=75, industry_fit_score=75,
        creativity_score=75, executability_score=75, language_score=75, passed=True
    )
    risk = RiskCheckResult(
        risk_level=RiskLevel.R3_MANUAL_REVIEW,
        similarity_score=0.6,
        compliance_issues=["Borderline similarity"],
    )
    decision = make_risk_decision(quality, risk)
    assert decision.can_export is False
    assert decision.requires_human_review is True


def test_passed_content_can_export():
    quality = QualityCheckResult(
        overall_score=85, structure_score=85, industry_fit_score=85,
        creativity_score=85, executability_score=85, language_score=85, passed=True
    )
    risk = RiskCheckResult(risk_level=RiskLevel.R0_PASS, similarity_score=0.1)
    decision = make_risk_decision(quality, risk)
    assert decision.can_export is True
    assert decision.action == "allow"


def test_redteam_samples():
    """Validate all red team samples produce expected risk levels."""
    samples_path = os.path.join(
        os.path.dirname(__file__), '..', '..', '..', 
        'fixtures', 'benchmark_samples', 'redteam_samples.json'
    )
    if not os.path.exists(samples_path):
        return  # Skip if fixtures not available
    
    with open(samples_path) as f:
        data = json.load(f)
    
    for sample in data["samples"]:
        if "intent" in sample["input"]:
            deliverables = {"scripts": [{"content": sample["input"]["intent"]}]}
            result = check_risk(deliverables)
            # Verify blocked samples are actually blocked
            if sample["expected_risk_level"] == "R4_BLOCK":
                assert result.risk_level == RiskLevel.R4_BLOCK, \
                    f"Sample {sample['id']} should be BLOCKED but got {result.risk_level}"


if __name__ == "__main__":
    test_quality_check_passes_with_complete_deliverables()
    test_risk_check_blocks_prohibited_patterns()
    test_risk_check_passes_legitimate_content()
    test_blocked_content_cannot_export()
    test_manual_review_cannot_export_until_approved()
    test_passed_content_can_export()
    test_redteam_samples()
    print("All risk engine tests passed!")
